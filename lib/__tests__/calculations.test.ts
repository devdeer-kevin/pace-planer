import { describe, it, expect } from "vitest";
import {
  convertToTime,
  timeToDecimalMinutes,
  paceToDecimalMinutes,
  calcFinishPace,
  calcFinishTime,
  calcClockTime,
  DISTANCES,
} from "../calculations";

describe("convertToTime", () => {
  it("converts a whole hour", () => {
    expect(convertToTime(1)).toBe("01:00:00");
  });

  it("converts 1.5 hours to 01:30:00", () => {
    expect(convertToTime(1.5)).toBe("01:30:00");
  });

  it("converts zero to 00:00:00", () => {
    expect(convertToTime(0)).toBe("00:00:00");
  });

  it("pads single-digit values", () => {
    // 0.25 h = 0 h 15 m 0 s
    expect(convertToTime(0.25)).toBe("00:15:00");
  });

  it("converts a multi-hour value with minutes and seconds", () => {
    // 2 h 30 m 30 s = 2 + 30/60 + 30/3600 = 2.50833...
    const decimalHours = 2 + 30 / 60 + 30 / 3600;
    expect(convertToTime(decimalHours)).toBe("02:30:30");
  });
});

describe("timeToDecimalMinutes", () => {
  it("converts 1:30:00 to 90", () => {
    expect(timeToDecimalMinutes("1", "30", "0")).toBe(90);
  });

  it("converts 0:04:30 to 4.50 (pace-style)", () => {
    expect(timeToDecimalMinutes("0", "4", "30")).toBe(4.5);
  });

  it("converts 0:00:00 to 0", () => {
    expect(timeToDecimalMinutes("0", "0", "0")).toBe(0);
  });

  it("handles seconds that round to a 2-digit decimal", () => {
    // seconds=5: round(5/60*100)=8 → "0.08" for hours=0,minutes=0
    expect(timeToDecimalMinutes("0", "0", "5")).toBe(0.08);
  });
});

describe("paceToDecimalMinutes", () => {
  it("converts 4:30 to 4.50", () => {
    expect(paceToDecimalMinutes("4", "30")).toBe(4.5);
  });

  it("converts 5:00 to 5", () => {
    expect(paceToDecimalMinutes("5", "0")).toBe(5);
  });

  it("converts 3:45 correctly", () => {
    // round(45/60*100) = round(75) = 75 → "3.75"
    expect(paceToDecimalMinutes("3", "45")).toBe(3.75);
  });
});

describe("calcFinishPace", () => {
  it("calculates pace per km from total time and distance", () => {
    // 60 minutes over 10 km = 6 min/km = 0.1 h/km
    expect(calcFinishPace(60, 10)).toBeCloseTo(0.1, 5);
  });

  it("calculates pace for a marathon", () => {
    // 210 minutes over 42.195 km ≈ 4.978 min/km ≈ 0.08296 h/km
    expect(calcFinishPace(210, 42.195)).toBeCloseTo(210 / 42.195 / 60, 5);
  });
});

describe("calcFinishTime", () => {
  it("calculates finish time in decimal hours", () => {
    // 5 min/km pace over 10 km = 50 min = 0.8333 h
    expect(calcFinishTime(5, 10)).toBeCloseTo(50 / 60, 5);
  });

  it("is inverse of calcFinishPace", () => {
    const distanceKm = 21.0975;
    const paceMin = 5.3;
    const finishTime = calcFinishTime(paceMin, distanceKm);
    const recoveredPace = calcFinishPace(finishTime * 60, distanceKm);
    expect(recoveredPace * 60).toBeCloseTo(paceMin, 4);
  });
});

describe("calcClockTime", () => {
  it("adds finish duration to a start time", () => {
    // 30 min race (0.5 h), start 08:00 → 08:30
    expect(calcClockTime(0.5, "8", "0")).toBe("08:30");
  });

  it("wraps around midnight", () => {
    // 2 h race, start 23:00 → 01:00
    expect(calcClockTime(2, "23", "0")).toBe("01:00");
  });

  it("with zero start time returns the finish time HH:MM", () => {
    // 1:30:00 finish time, start 00:00 → 01:30
    expect(calcClockTime(1.5, "0", "0")).toBe("01:30");
  });
});

describe("DISTANCES", () => {
  it("contains the four standard distances", () => {
    const names = DISTANCES.map((d) => d.name);
    expect(names).toEqual(["5k", "10k", "21k", "42k"]);
  });

  it("has correct lengths", () => {
    expect(DISTANCES.find((d) => d.name === "5k")?.length).toBe(5);
    expect(DISTANCES.find((d) => d.name === "10k")?.length).toBe(10);
    expect(DISTANCES.find((d) => d.name === "21k")?.length).toBe(21.0975);
    expect(DISTANCES.find((d) => d.name === "42k")?.length).toBe(42.195);
  });
});
