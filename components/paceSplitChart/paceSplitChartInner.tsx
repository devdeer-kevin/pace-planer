import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ChartDataPoint } from "../../lib/splitData";

export type { ChartDataPoint };

interface PaceSplitChartProps {
  data: ChartDataPoint[];
  lineColor?: string;
  yMode?: "duration" | "pace";
}

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

const formatDurationAxis = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${pad(h)}:${pad(m)}`;
};

const formatPaceAxis = (seconds: number) => {
  let m = Math.floor(seconds / 60);
  let s = Math.round(seconds % 60);
  if (s === 60) { m += 1; s = 0; }
  return `${pad(m)}:${pad(s)}`;
};

const formatXAxis = (km: number) => {
  if (Number.isInteger(km)) return `${km}km`;
  return `${km.toFixed(1)}km`;
};

const CustomTooltip = ({
  active,
  payload,
  yMode,
}: {
  active?: boolean;
  payload?: { payload: ChartDataPoint }[];
  yMode: "duration" | "pace";
}) => {
  if (active && payload && payload.length) {
    const point = payload[0].payload;
    const valueLabel =
      yMode === "pace"
        ? `${pad(Math.floor(point.pace / 60))}:${pad(Math.round(point.pace % 60))}/km`
        : point.tooltip;
    return (
      <div
        style={{
          background: "#0f172a",
          border: "1px solid #334155",
          borderRadius: 4,
          padding: "4px 8px",
        }}
      >
        <p style={{ fontFamily: "monospace", fontSize: 10, color: "#fbbf24", margin: 0 }}>
          {formatXAxis(point.km)}
        </p>
        <p style={{ fontFamily: "monospace", fontSize: 10, color: "#f8fafc", margin: 0 }}>
          {valueLabel}
        </p>
      </div>
    );
  }
  return null;
};

export default function PaceSplitChartInner({
  data,
  lineColor = "#fbbf24",
  yMode = "duration",
}: PaceSplitChartProps) {
  const isPace = yMode === "pace";
  const yFormatter = isPace ? formatPaceAxis : formatDurationAxis;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 10, left: -12, bottom: 4 }}>
        <XAxis
          dataKey="km"
          type="number"
          domain={["dataMin", "dataMax"]}
          tickFormatter={formatXAxis}
          tick={{ fill: "#64748b", fontFamily: "monospace", fontSize: 9 }}
          axisLine={{ stroke: "#1e293b" }}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          dataKey={isPace ? "pace" : "elapsed"}
          tickFormatter={yFormatter}
          tick={{ fill: "#64748b", fontFamily: "monospace", fontSize: 9 }}
          axisLine={{ stroke: "#1e293b" }}
          tickLine={false}
          width={42}
          domain={isPace ? ["dataMin - 10", "dataMax + 10"] : ["dataMin", "dataMax"]}
        />
        <Tooltip
          content={<CustomTooltip yMode={yMode} />}
          cursor={{ stroke: "#334155", strokeWidth: 1 }}
        />
        <Line
          type="monotone"
          dataKey={isPace ? "pace" : "elapsed"}
          stroke={lineColor}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 3, fill: lineColor, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
