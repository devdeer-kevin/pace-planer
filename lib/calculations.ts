import { pad } from "../utils/pad";

export const DISTANCES = [
  { name: "5k", length: 5 },
  { name: "10k", length: 10 },
  { name: "21k", length: 21.0975 },
  { name: "42k", length: 42.195 },
] as const;

/**
 * Converts a decimal-hours value (e.g. 1.5 = 1 h 30 min) to "HH:MM:SS".
 */
export const convertToTime = (decimalHours: number): string => {
  const hours = Math.floor(decimalHours);
  let remainder = decimalHours - hours;
  const minutes = Math.floor(remainder * 60);
  remainder = remainder * 60 - minutes;
  const seconds = Math.floor(remainder * 60);
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

/**
 * Converts a HH:MM:SS total time to decimal minutes.
 * Used when calculating pace from a target finish time.
 */
export const timeToDecimalMinutes = (
  hours: string,
  minutes: string,
  seconds: string,
): number => {
  const hoursInMinutes = Math.round(Number(hours) * 60);
  const allMinutes = hoursInMinutes + Number(minutes);
  const decimalSeconds = pad(Math.round((Number(seconds) / 60) * 100));
  return Number(`${allMinutes}.${decimalSeconds}`);
};

/**
 * Converts a MM:SS pace to decimal minutes.
 * Used when calculating finish time from a pace input.
 */
export const paceToDecimalMinutes = (
  minutes: string,
  seconds: string,
): number => {
  const decimalSeconds = pad(Math.round((Number(seconds) / 60) * 100));
  return Number(`${minutes}.${decimalSeconds}`);
};

/**
 * Calculates the pace per km in decimal hours given total time (decimal minutes) and distance.
 */
export const calcFinishPace = (
  targetTimeMinutes: number,
  distanceKm: number,
): number => targetTimeMinutes / distanceKm / 60;

/**
 * Calculates the finish time in decimal hours given pace (decimal minutes) and distance.
 */
export const calcFinishTime = (
  paceMinutes: number,
  distanceKm: number,
): number => (distanceKm * paceMinutes) / 60;

/**
 * Calculates the clock time (HH:MM) when a runner crosses the finish line,
 * given the finish time in decimal hours and an optional start time.
 */
export const calcClockTime = (
  finishTimeDecimalHours: number,
  startHours: string,
  startMinutes: string,
): string => {
  const [h, m] = convertToTime(finishTimeDecimalHours).split(":").map(Number);
  const totalMinutes =
    (h * 60 + m + Number(startHours) * 60 + Number(startMinutes)) % 1440;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};
