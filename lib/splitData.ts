export type SplitStrategy = "LINEAR" | "NEGATIVE" | "POSITIVE";
export type CurveType = "lin" | "exp" | "sin";

export interface ChartDataPoint {
  km: number;
  elapsed: number;
  pace: number;
  tooltip: string;
}

const FACTOR = 0.05;

/**
 * Applies an easing curve to a progress value in [0, 1].
 */
export const easedProgress = (p: number, curveType: CurveType): number => {
  if (curveType === "exp") return p * p;
  if (curveType === "sin") return 1 - Math.cos((p * Math.PI) / 2);
  return p;
};

/**
 * Returns the distance in km for a named distance or falls back to the custom value.
 */
export const getDistanceKm = (
  selectedDistance: string,
  customDistance: string,
): number => {
  if (selectedDistance === "5k") return 5;
  if (selectedDistance === "10k") return 10;
  if (selectedDistance === "21k") return 21.0975;
  if (selectedDistance === "42k") return 42.195;
  return parseFloat(customDistance) || 0;
};

/**
 * Parses a "HH:MM:SS" or "MM:SS" string into total seconds.
 */
export const parsePaceSeconds = (value: string): number => {
  const parts = value.split(":");
  if (parts.length === 3) {
    return (
      parseInt(parts[0]) * 3600 +
      parseInt(parts[1]) * 60 +
      parseInt(parts[2])
    );
  }
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }
  return 0;
};

export interface TableRow {
  km: string;
  pace: string;
  split: string;
  total: string;
  isLast: boolean;
}

/**
 * Formats chart data points into display-ready table rows.
 * Keeps all time math out of JSX.
 */
export const formatTableRows = (data: ChartDataPoint[]): TableRow[] =>
  data.map((point, i) => {
    const rawSplit = i === 0 ? point.elapsed : point.elapsed - data[i - 1].elapsed;
    const splitSec = Math.round(rawSplit);
    const paceSec = Math.round(point.pace);
    return {
      km: Number.isInteger(point.km)
        ? `${point.km}km`
        : `${point.km.toFixed(1)}km`,
      pace: `${Math.floor(paceSec / 60)}:${String(paceSec % 60).padStart(2, "0")}`,
      split: `${Math.floor(splitSec / 60)}:${String(splitSec % 60).padStart(2, "0")}`,
      total: point.tooltip,
      isLast: i === data.length - 1,
    };
  });

/**
 * Generates per-km split data for the chart.
 *
 * Normalises all split paces so the total race time equals paceSeconds × distanceKm,
 * regardless of the chosen strategy or easing curve.
 */
export const calculateSplitData = (
  paceSeconds: number,
  distanceKm: number,
  splitStrategy: SplitStrategy,
  curveType: CurveType,
): ChartDataPoint[] => {
  if (paceSeconds === 0 || distanceKm <= 0) return [];

  const N = Math.ceil(distanceKm);
  const segLengths = Array.from({ length: N }, (_, i) =>
    Math.min(1, distanceKm - i),
  );

  const rawPaces = Array.from({ length: N }, (_, i) => {
    const progress = easedProgress(N > 1 ? i / (N - 1) : 0, curveType);
    if (splitStrategy === "NEGATIVE") {
      return paceSeconds * (1 + FACTOR - 2 * FACTOR * progress);
    }
    if (splitStrategy === "POSITIVE") {
      return paceSeconds * (1 - FACTOR + 2 * FACTOR * progress);
    }
    return paceSeconds;
  });

  const totalRaw = rawPaces.reduce((sum, rp, i) => sum + rp * segLengths[i], 0);
  const correctionFactor = (paceSeconds * distanceKm) / totalRaw;

  const data: ChartDataPoint[] = [];
  let cumulative = 0;
  for (let i = 0; i < N; i++) {
    const pace = rawPaces[i] * correctionFactor;
    cumulative += pace * segLengths[i];
    const elapsed = Math.round(cumulative);
    const h = Math.floor(elapsed / 3600);
    const m = Math.floor((elapsed % 3600) / 60);
    const s = elapsed % 60;
    const km = i < N - 1 ? i + 1 : distanceKm;
    data.push({
      km,
      elapsed,
      pace,
      tooltip: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
    });
  }

  return data;
};
