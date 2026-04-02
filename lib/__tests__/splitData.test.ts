import { describe, it, expect } from "vitest";
import {
  easedProgress,
  getDistanceKm,
  parsePaceSeconds,
  calculateSplitData,
  formatTableRows,
  type ChartDataPoint,
} from "../splitData";

describe("easedProgress", () => {
  it("linear: returns p unchanged", () => {
    expect(easedProgress(0, "lin")).toBe(0);
    expect(easedProgress(0.5, "lin")).toBe(0.5);
    expect(easedProgress(1, "lin")).toBe(1);
  });

  it("exp: returns p²", () => {
    expect(easedProgress(0.5, "exp")).toBe(0.25);
    expect(easedProgress(1, "exp")).toBe(1);
    expect(easedProgress(0, "exp")).toBe(0);
  });

  it("sin: returns 1 - cos(p × π/2)", () => {
    expect(easedProgress(0, "sin")).toBeCloseTo(0);
    expect(easedProgress(1, "sin")).toBeCloseTo(1);
    expect(easedProgress(0.5, "sin")).toBeCloseTo(1 - Math.cos(Math.PI / 4));
  });
});

describe("getDistanceKm", () => {
  it.each([
    ["5k", "", 5],
    ["10k", "", 10],
    ["21k", "", 21.0975],
    ["42k", "", 42.195],
  ])("returns %s distance correctly", (selected, custom, expected) => {
    expect(getDistanceKm(selected, custom)).toBe(expected);
  });

  it("falls back to custom distance for ?k", () => {
    expect(getDistanceKm("?k", "15")).toBe(15);
  });

  it("returns 0 for unknown distance with no custom", () => {
    expect(getDistanceKm("?k", "")).toBe(0);
  });
});

describe("parsePaceSeconds", () => {
  it("parses HH:MM:SS", () => {
    expect(parsePaceSeconds("00:04:30")).toBe(270);
    expect(parsePaceSeconds("01:00:00")).toBe(3600);
  });

  it("parses MM:SS", () => {
    expect(parsePaceSeconds("4:30")).toBe(270);
    expect(parsePaceSeconds("0:45")).toBe(45);
  });

  it("returns 0 for unrecognised format", () => {
    expect(parsePaceSeconds("invalid")).toBe(0);
  });
});

describe("calculateSplitData", () => {
  it("returns empty array for zero pace", () => {
    expect(calculateSplitData(0, 5, "LINEAR", "lin")).toEqual([]);
  });

  it("returns empty array for zero distance", () => {
    expect(calculateSplitData(300, 0, "LINEAR", "lin")).toEqual([]);
  });

  it("returns one point per km (ceiling) for a round distance", () => {
    const data = calculateSplitData(300, 5, "LINEAR", "lin");
    expect(data).toHaveLength(5);
  });

  it("returns ceil(distance) points for a fractional distance", () => {
    const data = calculateSplitData(300, 21.0975, "LINEAR", "lin");
    expect(data).toHaveLength(22); // ceil(21.0975) = 22
  });

  it("LINEAR: all paces equal the input pace", () => {
    const paceSeconds = 300;
    const data = calculateSplitData(paceSeconds, 5, "LINEAR", "lin");
    data.forEach((point) => {
      expect(point.pace).toBeCloseTo(paceSeconds, 5);
    });
  });

  it("LINEAR: total elapsed time equals paceSeconds × distance", () => {
    const paceSeconds = 300;
    const distance = 10;
    const data = calculateSplitData(paceSeconds, distance, "LINEAR", "lin");
    const totalExpected = paceSeconds * distance;
    expect(data[data.length - 1].elapsed).toBeCloseTo(totalExpected, 0);
  });

  it("NEGATIVE: first km is slower than last km", () => {
    const data = calculateSplitData(300, 5, "NEGATIVE", "lin");
    expect(data[0].pace).toBeGreaterThan(data[data.length - 1].pace);
  });

  it("POSITIVE: first km is faster than last km", () => {
    const data = calculateSplitData(300, 5, "POSITIVE", "lin");
    expect(data[0].pace).toBeLessThan(data[data.length - 1].pace);
  });

  it("NEGATIVE: total time still equals paceSeconds × distance (normalised)", () => {
    const paceSeconds = 270;
    const distance = 10;
    const data = calculateSplitData(paceSeconds, distance, "NEGATIVE", "lin");
    expect(data[data.length - 1].elapsed).toBeCloseTo(
      paceSeconds * distance,
      0,
    );
  });

  it("POSITIVE: total time still equals paceSeconds × distance (normalised)", () => {
    const paceSeconds = 270;
    const distance = 10;
    const data = calculateSplitData(paceSeconds, distance, "POSITIVE", "lin");
    expect(data[data.length - 1].elapsed).toBeCloseTo(
      paceSeconds * distance,
      0,
    );
  });

  it("last data point km equals distanceKm for a fractional distance", () => {
    const distance = 21.0975;
    const data = calculateSplitData(300, distance, "LINEAR", "lin");
    expect(data[data.length - 1].km).toBe(distance);
  });

  it("intermediate km labels are whole numbers", () => {
    const data = calculateSplitData(300, 5, "LINEAR", "lin");
    // All but the last point should be whole km numbers
    for (let i = 0; i < data.length - 1; i++) {
      expect(Number.isInteger(data[i].km)).toBe(true);
    }
  });

  it("tooltip is formatted as HH:MM:SS", () => {
    const data = calculateSplitData(300, 1, "LINEAR", "lin");
    expect(data[0].tooltip).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });

  it("elapsed values are monotonically increasing", () => {
    const data = calculateSplitData(270, 21.0975, "NEGATIVE", "sin");
    for (let i = 1; i < data.length; i++) {
      expect(data[i].elapsed).toBeGreaterThan(data[i - 1].elapsed);
    }
  });
});

describe("formatTableRows", () => {
  const makePoint = (
    km: number,
    elapsed: number,
    pace: number,
  ): ChartDataPoint => ({
    km,
    elapsed,
    pace,
    tooltip: `${String(Math.floor(elapsed / 3600)).padStart(2, "0")}:${String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`,
  });

  it("returns empty array for empty input", () => {
    expect(formatTableRows([])).toEqual([]);
  });

  it("marks only the last row as isLast", () => {
    const data = [makePoint(1, 300, 300), makePoint(2, 600, 300)];
    const rows = formatTableRows(data);
    expect(rows[0].isLast).toBe(false);
    expect(rows[1].isLast).toBe(true);
  });

  it("formats pace as MM:SS", () => {
    const data = [makePoint(1, 270, 270)]; // pace = 4:30
    const rows = formatTableRows(data);
    expect(rows[0].pace).toBe("4:30");
  });

  it("first row split equals elapsed", () => {
    const data = [makePoint(1, 300, 300), makePoint(2, 570, 270)];
    const rows = formatTableRows(data);
    expect(rows[0].split).toBe("5:00"); // 300s = 5:00
  });

  it("subsequent row split is the diff from previous elapsed", () => {
    const data = [makePoint(1, 300, 300), makePoint(2, 570, 270)];
    const rows = formatTableRows(data);
    expect(rows[1].split).toBe("4:30"); // 570 - 300 = 270s = 4:30
  });

  it("formats whole km as e.g. 1km", () => {
    const data = [makePoint(1, 300, 300)];
    expect(formatTableRows(data)[0].km).toBe("1km");
  });

  it("formats fractional km with one decimal", () => {
    const data = [makePoint(21.0975, 6329, 300)];
    expect(formatTableRows(data)[0].km).toBe("21.1km");
  });

  it("total equals the tooltip from the data point", () => {
    const data = [makePoint(1, 300, 300)];
    expect(formatTableRows(data)[0].total).toBe(data[0].tooltip);
  });
});
