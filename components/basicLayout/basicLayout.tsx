"use client";

import {
  ChangeEvent,
  useState,
  KeyboardEvent,
  useCallback,
  useMemo,
} from "react";
import dynamic from "next/dynamic";
import DistanceButton from "../distanceButton";
import { pad } from "../../utils/pad";
import { availableDistances } from "../../utils/availableDistances";
import { Clock, CornerUpLeft, Equal, Loader } from "lucide-react";
import type { ChartDataPoint } from "../paceSplitChart/paceSplitChartInner";

const PaceSplitChart = dynamic(
  () => import("../paceSplitChart/paceSplitChartInner"),
  { ssr: false },
);

// Interface for the response from the API
interface IRacePace {
  distance: string;
  finishTime: string;
  clockTime: string;
}

export default function BasicLayoutComponent() {
  const [time, setTime] = useState({
    hours: "",
    minutes: "",
    seconds: "",
  });
  // State to keep track of custom distance
  const [customDistance, setCustomDistance] = useState("");
  // State to keep track of the custom start time
  const [optionalStartTime, setOptionalStartTime] = useState<string>("00:00");
  // State to keep track of loading state
  const [loading, setLoading] = useState(false);
  // State to keep track of the API response
  const [raceResult, setRaceResult] = useState<IRacePace[]>([]);
  // State to keep track of selected distance
  const [selectedDistance, setSelectedDistance] = useState("?k");
  // State to keep track of the chosen endpoint
  const [endpoint, setEndpoint] = useState("Time");
  // State to keep track of displayed result
  const [displayedResult, setDisplayedResult] = useState<string>();
  // State to keep track of the displayed clock time when a runner done
  const [displayedClockTime, setDisplayedClockTime] = useState<
    string | undefined
  >("00:00");
  // State to toggle between number and chart display
  const [displayMode, setDisplayMode] = useState<"NUM" | "CHART">("NUM");
  // State to toggle the split table panel open/closed
  const [tableOpen, setTableOpen] = useState(false);
  // State to track split strategy for the chart
  const [splitStrategy, setSplitStrategy] = useState<
    "LINEAR" | "NEGATIVE" | "POSITIVE"
  >("LINEAR");
  // State to control the easing curve applied to the split gradient
  const [curveType, setCurveType] = useState<"lin" | "exp" | "sin">("lin");
  // State to toggle chart Y-axis between cumulative duration and per-km pace
  const [yMode, setYMode] = useState<"duration" | "pace">("duration");
  // The current Date object
  const now = new Date();

  // Common validation logic
  const validateTime = () => {
    if (Number(time.hours) >= 24) {
      setTime({
        ...time,
        hours: "",
        minutes: "59",
        seconds: "59",
      });
      return false;
    }
    if (Number(time.seconds) >= 60) {
      setTime({
        ...time,
        seconds: "59",
      });
      return false;
    }
    return true;
  };

  // Common handler for API calls
  const handleCalculation = () => {
    if (!validateTime()) return;
    endpoint === "Time" ? fetchTimeAPI() : fetchPaceAPI();
  };

  // Method to handle submit via enter key
  const handleSubmit = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "NumpadEnter") {
      handleCalculation();
    }
  };

  // Method to handle mouse down event
  const handleMouseDown = () => {
    handleCalculation();
  };

  // Method to fetch data from Pace API to calculate the target pace
  const fetchPaceAPI = useCallback(
    async (timeOverride?: typeof time) => {
      setLoading(true);
      const t = timeOverride ?? time;

      const response = await fetch("/api/v1/finishPace/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hours: t.hours,
          minutes: t.minutes,
          seconds: t.seconds,
          customDistance: customDistance,
        }),
      });
      const data: IRacePace[] = await response.json();
      setRaceResult(data);
      setDisplayedResult(
        data.find((result: IRacePace) => result.distance === selectedDistance)
          ?.finishTime,
      );
      setLoading(false);
    },
    [time, customDistance, selectedDistance],
  );

  // Method to fetch data from Time API to calculate the target duration
  const fetchTimeAPI = useCallback(
    async (timeOverride?: typeof time) => {
      setLoading(true);
      const t = timeOverride ?? time;

      // Splitting the start time into hours and minutes
      const startTimeStringArray = optionalStartTime.split(":");
      const optionalStartTimeHours = startTimeStringArray[0];
      const optionalStartTimeMinutes = startTimeStringArray[1];

      const response = await fetch("/api/v1/finishTime/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          minutes: t.minutes,
          seconds: t.seconds,
          customDistance: customDistance,
          optionalStartTimeHours: optionalStartTimeHours,
          optionalStartTimeMinutes: optionalStartTimeMinutes,
        }),
      });
      const data: IRacePace[] = await response.json();
      setRaceResult(data);
      setDisplayedResult(
        data.find((result: IRacePace) => result.distance === selectedDistance)
          ?.finishTime,
      );
      setDisplayedClockTime(
        data.find((result: IRacePace) => result.distance === selectedDistance)
          ?.clockTime,
      );
      setLoading(false);
    },
    [time, customDistance, optionalStartTime, selectedDistance],
  );

  // Switch endpoint and, if results exist, transfer the current result into the
  // opposing mode's input fields so the user sees the cross-calculation immediately.
  const handleEndpointSwitch = useCallback(
    async (newEndpoint: string) => {
      if (newEndpoint === endpoint) return;

      if (raceResult.length > 0 && displayedResult) {
        const parts = displayedResult.split(":");
        if (parts.length !== 3) {
          setEndpoint(newEndpoint);
          return;
        }
        const [h, m, s] = parts.map((p) => parseInt(p));

        if (newEndpoint === "Pace") {
          // displayedResult is finish time (hh:mm:ss) → use as target time for Zielpace
          const newTime = {
            hours: String(h),
            minutes: String(m),
            seconds: String(s),
          };
          setTime(newTime);
          setEndpoint(newEndpoint);
          await fetchPaceAPI(newTime);
        } else {
          // displayedResult is pace per km (hh:mm:ss, e.g. 00:04:30) → use mm:ss for Zielzeit
          const newTime = {
            hours: "",
            minutes: String(m),
            seconds: String(s),
          };
          setTime(newTime);
          setEndpoint(newEndpoint);
          await fetchTimeAPI(newTime);
        }
      } else {
        setEndpoint(newEndpoint);
      }
    },
    [endpoint, raceResult, displayedResult, fetchPaceAPI, fetchTimeAPI],
  );

  const displayedDistanceHandler = useCallback(
    (selectedDistance: string) => {
      if (!raceResult) {
        return;
      }
      const currentDistance = raceResult.find(
        (result: IRacePace) => result.distance === selectedDistance,
      )?.finishTime;
      setDisplayedResult(currentDistance);
      const currentClockTime = raceResult.find(
        (result: IRacePace) => result.distance === selectedDistance,
      )?.clockTime;
      setDisplayedClockTime(currentClockTime || "00:00");
    },
    [raceResult],
  );

  // Unified method to handle time input
  const timeHandler = (
    event: ChangeEvent<HTMLInputElement>,
    type: "hours" | "minutes" | "seconds",
  ) => {
    if (isNaN(Number(event.target.value))) {
      return;
    }
    setTime((prevTime) => ({
      ...prevTime,
      [type]: event.target.value,
    }));
  };

  // Method to handle distance input
  const distanceHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(event.target.value))) {
      return;
    }
    setCustomDistance(event.target.value);
  };

  const startTimeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setOptionalStartTime(event.target.value);
  };

  const clockTimeNowHandler = () => {
    const nowHours = pad(now.getHours());
    const nowMinutes = pad(now.getMinutes());
    setOptionalStartTime(`${nowHours}:${nowMinutes}`);
  };

  // Compute per-km split data for the chart
  const chartData = useMemo<ChartDataPoint[]>(() => {
    let paceSeconds = 0;

    if (endpoint === "Time") {
      // Pace is entered directly as MM:SS
      const mins = parseInt(time.minutes) || 0;
      const secs = parseInt(time.seconds) || 0;
      paceSeconds = mins * 60 + secs;
    } else {
      // Pace is the API result (hh:mm:ss per km)
      if (!displayedResult) return [];
      const parts = displayedResult.split(":");
      if (parts.length === 3) {
        paceSeconds =
          parseInt(parts[0]) * 3600 +
          parseInt(parts[1]) * 60 +
          parseInt(parts[2]);
      } else if (parts.length === 2) {
        paceSeconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
      }
    }

    if (paceSeconds === 0) return [];

    let distanceKm = 0;
    if (selectedDistance === "5k") distanceKm = 5;
    else if (selectedDistance === "10k") distanceKm = 10;
    else if (selectedDistance === "21k") distanceKm = 21.0975;
    else if (selectedDistance === "42k") distanceKm = 42.195;
    else distanceKm = parseFloat(customDistance) || 0;

    if (distanceKm <= 0) return [];

    const FACTOR = 0.05;
    const N = Math.ceil(distanceKm);

    // Compute raw pace per segment (segment i covers km i to min(i+1, distanceKm))
    const segLengths = Array.from({ length: N }, (_, i) =>
      Math.min(1, distanceKm - i),
    );
    const easedProgress = (p: number) => {
      if (curveType === "exp") return p * p;
      if (curveType === "sin") return 1 - Math.cos((p * Math.PI) / 2);
      return p;
    };

    const rawPaces = Array.from({ length: N }, (_, i) => {
      const progress = easedProgress(N > 1 ? i / (N - 1) : 0);
      if (splitStrategy === "NEGATIVE") {
        return paceSeconds * (1 + FACTOR - 2 * FACTOR * progress);
      } else if (splitStrategy === "POSITIVE") {
        return paceSeconds * (1 - FACTOR + 2 * FACTOR * progress);
      }
      return paceSeconds;
    });

    // Normalize so total time stays exactly avgPace × distanceKm
    const totalRaw = rawPaces.reduce(
      (sum, rp, i) => sum + rp * segLengths[i],
      0,
    );
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
  }, [
    endpoint,
    time.minutes,
    time.seconds,
    displayedResult,
    selectedDistance,
    customDistance,
    splitStrategy,
    curveType,
  ]);

  // Method to reset the input fields
  const resetPace = () => {
    setOptionalStartTime("00:00");
    setDisplayedClockTime("00:00");
    setTime({
      hours: "",
      minutes: "",
      seconds: "",
    });
    setCustomDistance("");
    setRaceResult([]);
  };

  return (
    <>
      <div className="flex flex-col py-8 bg-slate-900 mt-10 items-center rounded-xl gap-4 w-85">
        {/* Displayed result section */}
        <div className="flex flex-col bg-slate-950 rounded-lg w-11/12">
          {/* Mode toggle — NUM / CHART, styled like DEG/RAD on a Casio */}
          <div className="flex justify-end items-center px-2 pt-1.5">
            <div className="flex gap-2 font-mono text-xs">
              <button
                onClick={() => setDisplayMode("NUM")}
                className={`cursor-pointer ${displayMode === "NUM" ? "text-yellow-400" : "text-slate-600"}`}
              >
                NUM
              </button>
              <button
                onClick={() => setDisplayMode("CHART")}
                className={`cursor-pointer ${displayMode === "CHART" ? "text-yellow-400" : "text-slate-600"}`}
              >
                CHART
              </button>
              <button
                onClick={() => setTableOpen((o) => !o)}
                className={`cursor-pointer ${tableOpen ? "text-yellow-400" : "text-slate-600"}`}
              >
                TABLE
              </button>
            </div>
          </div>
          {displayMode === "NUM" ? (
            <div className="flex flex-col h-44 items-center justify-center py-3">
              {raceResult.length <= 0 ? (
                <div>
                  <p className="text-slate-500 text-center text-5xl font-mono">
                    00:00:00
                  </p>
                  <p className="text-slate-500 text-center text-sm font-mono">
                    Zieleinlauf um {displayedClockTime} Uhr
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-yellow-400 text-center text-5xl font-mono">
                    {displayedResult}
                  </p>
                  <p className="text-yellow-600 text-center text-sm font-mono">
                    Zieleinlauf um {displayedClockTime} Uhr
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-44 p-2 flex flex-col">
              {/* Chart or empty state */}
              <div className="flex-1 min-h-0">
                {chartData.length > 0 ? (
                  <PaceSplitChart
                    data={chartData}
                    lineColor={
                      splitStrategy === "LINEAR"
                        ? "#fbbf24"
                        : splitStrategy === "NEGATIVE"
                          ? "#4ade80"
                          : "#f87171"
                    }
                    yMode={yMode}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="font-mono text-xs text-slate-600">
                      keine Eingabe
                    </p>
                  </div>
                )}
              </div>
              {/* Bottom bar: Y-axis mode toggle (left) + split strategy selector (right) */}
              <div className="flex items-center justify-between pt-0.5">
                <div className="flex gap-2 font-mono text-[9px]">
                  <button
                    onClick={() => setYMode("duration")}
                    className={`cursor-pointer ${yMode === "duration" ? "text-slate-400" : "text-slate-700"}`}
                  >
                    TIME
                  </button>
                  <button
                    onClick={() => setYMode("pace")}
                    className={`cursor-pointer ${yMode === "pace" ? "text-slate-400" : "text-slate-700"}`}
                  >
                    PACE
                  </button>
                  {yMode === "pace" && (
                    <>
                      <span className="text-slate-800">|</span>
                      {(["lin", "exp", "sin"] as const).map((c) => (
                        <button
                          key={c}
                          onClick={() => setCurveType(c)}
                          disabled={splitStrategy === "LINEAR"}
                          className={`uppercase ${splitStrategy === "LINEAR" ? "text-slate-800" : curveType === c ? "text-slate-400 cursor-pointer" : "text-slate-700 cursor-pointer"}`}
                        >
                          {c}
                        </button>
                      ))}
                    </>
                  )}
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setSplitStrategy("LINEAR")}
                    className="cursor-pointer"
                    style={{ opacity: splitStrategy === "LINEAR" ? 1 : 0.35 }}
                    title="Linear — gleichmäßiges Tempo"
                  >
                    <div className="w-3.5 h-3.5 rounded-full border border-yellow-400 flex items-center justify-center">
                      <svg viewBox="0 0 16 16" width="6" height="6" fill="none">
                        <line
                          x1="2"
                          y1="14"
                          x2="14"
                          y2="2"
                          stroke="#fbbf24"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </button>
                  <button
                    onClick={() => setSplitStrategy("NEGATIVE")}
                    className="cursor-pointer"
                    style={{ opacity: splitStrategy === "NEGATIVE" ? 1 : 0.35 }}
                    title="Negative Split — zweite Hälfte schneller"
                  >
                    <div className="w-3.5 h-3.5 rounded-full border border-green-400 flex items-center justify-center">
                      <svg viewBox="0 0 16 16" width="6" height="6" fill="none">
                        <path
                          d="M2,2 Q14,2 14,14"
                          stroke="#4ade80"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </button>
                  <button
                    onClick={() => setSplitStrategy("POSITIVE")}
                    className="cursor-pointer"
                    style={{ opacity: splitStrategy === "POSITIVE" ? 1 : 0.35 }}
                    title="Positive Split — zweite Hälfte langsamer"
                  >
                    <div className="w-3.5 h-3.5 rounded-full border border-red-400 flex items-center justify-center">
                      <svg viewBox="0 0 16 16" width="6" height="6" fill="none">
                        <path
                          d="M2,14 Q14,14 14,2"
                          stroke="#f87171"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* TABLE panel — folds open below the display like the inside of a calculator cover */}
        <div className="w-11/12">
          {/* Hinge strip — always visible */}
          <div
            className="mb-2"
            style={{
              height: "5px",
              background:
                "repeating-linear-gradient(90deg, transparent, transparent 4px, #1a2a3a 4px, #1a2a3a 8px)",
            }}
          />
          {/* Sliding content */}
          <div
            style={{
              maxHeight: tableOpen ? "300px" : "0px",
              opacity: tableOpen ? 1 : 0,
              overflow: "hidden",
              transition: "max-height 0.35s ease, opacity 0.25s ease",
            }}
          >
            <div
              style={{
                background: "#0f172a",
                borderRadius: "0 0 8px 8px",
              }}
            >
              <div className="px-3 pb-3 pt-1.5">
                {/* Printed header label */}
                <p
                  className="font-mono uppercase tracking-widest pb-1 text-slate-700"
                  style={{ fontSize: "8px" }}
                >
                  KM-SPLITS · {splitStrategy} · {selectedDistance}
                </p>
                {/* Scrollable table */}
                <div style={{ maxHeight: "220px", overflowY: "auto" }}>
                  {chartData.length > 0 ? (
                    <table
                      className="w-full font-mono"
                      style={{ fontSize: "10px" }}
                    >
                      <thead>
                        <tr className="text-slate-700 uppercase">
                          <th className="text-left pb-1 font-normal">KM</th>
                          <th className="text-right pb-1 font-normal">PACE</th>
                          <th className="text-right pb-1 font-normal">SPLIT</th>
                          <th className="text-right pb-1 font-normal">
                            GESAMT
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {chartData.map((point, i) => {
                          const isLast = i === chartData.length - 1;
                          const rawSplit =
                            i === 0
                              ? point.elapsed
                              : point.elapsed - chartData[i - 1].elapsed;
                          const splitTotalSec = Math.round(rawSplit);
                          const splitMin = Math.floor(splitTotalSec / 60);
                          const splitSecRem = splitTotalSec % 60;
                          const paceTotalSec = Math.round(point.pace);
                          const paceMin = Math.floor(paceTotalSec / 60);
                          const paceSec = paceTotalSec % 60;
                          const kmLabel = Number.isInteger(point.km)
                            ? `${point.km}km`
                            : `${point.km.toFixed(1)}km`;
                          return (
                            <tr
                              key={i}
                              className={
                                isLast ? "text-yellow-400" : "text-slate-500"
                              }
                            >
                              <td className="py-0.5 text-left">{kmLabel}</td>
                              <td className="py-0.5 text-right">
                                {paceMin}:{String(paceSec).padStart(2, "0")}
                              </td>
                              <td className="py-0.5 text-right">
                                {splitMin}:
                                {String(splitSecRem).padStart(2, "0")}
                              </td>
                              <td className="py-0.5 text-right">
                                {point.tooltip}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <p
                      className="font-mono text-center py-3 text-slate-700"
                      style={{ fontSize: "10px" }}
                    >
                      keine Eingabe
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Endpoint selection buttons */}
        <div className="flex w-11/12 justify-end -mt-2 pb-2">
          <div className="flex flex-row gap-2">
            <button
              onClick={() => handleEndpointSwitch("Time")}
              className={`bg-slate-950 ${
                endpoint === "Time"
                  ? "text-slate-50 font-bold"
                  : "text-slate-700 font-normal"
              } py-1 px-1.5 rounded-md cursor-pointer`}
            >
              Zielzeit
            </button>
            <button
              onClick={() => handleEndpointSwitch("Pace")}
              className={`bg-slate-950 ${
                endpoint === "Pace"
                  ? "text-slate-50 font-bold"
                  : "text-slate-700 font-normal"
              } py-1 px-1.5 rounded-md cursor-pointer`}
            >
              Zielpace
            </button>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <div>
            {/* Distance selection buttons and input fields */}
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="flex flex-row gap-2">
                {availableDistances.map((distance, index) => (
                  <div key={index}>
                    <DistanceButton
                      distance={String(distance)}
                      onDistanceSelected={setSelectedDistance}
                      active={selectedDistance === String(distance)}
                      displayedDistanceHandler={displayedDistanceHandler}
                      disabled={
                        String(distance) === "?k" &&
                        raceResult.length > 0 &&
                        !customDistance
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-row justify-between items-end">
                <div className="flex flex-row gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-xs text-slate-700">
                      Distanz in km
                    </label>
                    <input
                      placeholder="KM"
                      disabled={
                        selectedDistance !== "?k" || raceResult.length > 0
                      }
                      aria-label="Individuelle Distanz in km"
                      className="placeholder:text-xs text-center font-mono text-lg py-1.5 w-28 bg-transparent border border-slate-50 text-slate-50 disabled:text-slate-500 disabled:border-slate-700 rounded-md placeholder:text-slate-700"
                      value={customDistance}
                      onChange={distanceHandler}
                      onKeyDown={handleSubmit}
                      maxLength={4}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-xs text-slate-700">
                      Startzeit
                    </label>
                    <div className=" flex flex-row">
                      <input
                        type="time"
                        min="00:00"
                        max="23:59"
                        placeholder="Startzeit"
                        disabled={raceResult.length > 0 || endpoint !== "Time"}
                        aria-label="Startzeit"
                        className="placeholder:text-xs text-center font-mono text-lg py-1.5 w-20 bg-transparent border border-slate-50 text-slate-50 disabled:text-slate-500 disabled:border-slate-700 rounded-l-md placeholder:text-slate-700"
                        value={optionalStartTime}
                        onChange={startTimeHandler}
                        onKeyDown={handleSubmit}
                        maxLength={4}
                      />
                      <button
                        disabled={raceResult.length > 0 || endpoint !== "Time"}
                        title="Aktuelle Uhrzeit hinzufügen"
                        onMouseDown={() => clockTimeNowHandler()}
                        className={`flex border border-slate-50 disabled:border-slate-700 border-l-0 rounded-r-md p-2 justify-center items-center`}
                      >
                        <Clock className="w-4 h-4 text-slate-50" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-center items-end ">
                <div
                  className={`flex flex-row ${
                    endpoint === "Time" ? "gap-6" : "gap-7"
                  } w-full text-left`}
                >
                  {endpoint === "Pace" && (
                    <div className="flex flex-col gap-2">
                      <input
                        placeholder="HH"
                        disabled={raceResult.length > 0}
                        aria-label="Stunden eingeben"
                        className="placeholder:text-xs text-center font-mono text-lg py-1.5 w-16 bg-transparent border border-slate-50 text-slate-50 disabled:text-slate-500 disabled:border-slate-700 rounded-md placeholder:text-slate-700"
                        value={time.hours}
                        onChange={(e) => timeHandler(e, "hours")}
                        onKeyDown={handleSubmit}
                        maxLength={2}
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <input
                      placeholder="MM"
                      disabled={raceResult.length > 0}
                      aria-label="Minuten eingeben"
                      className={`text-center font-mono text-lg py-1.5 ${
                        endpoint === "Time" ? "w-28" : "w-16"
                      } placeholder:text-xs bg-transparent border border-slate-50 text-slate-50 disabled:text-slate-500 disabled:border-slate-700 rounded-md placeholder:text-slate-700`}
                      value={time.minutes}
                      onChange={(e) => timeHandler(e, "minutes")}
                      onKeyDown={handleSubmit}
                      maxLength={2}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <input
                      placeholder="SS"
                      disabled={raceResult.length > 0}
                      aria-label="Sekunden eingeben"
                      className={`text-center font-mono text-lg py-1.5 ${
                        endpoint === "Time" ? "w-28" : "w-16"
                      } placeholder:text-xs bg-transparent border border-slate-50 text-slate-50 disabled:text-slate-500 disabled:border-slate-700 rounded-md placeholder:text-slate-700`}
                      value={time.seconds}
                      onChange={(e) => timeHandler(e, "seconds")}
                      onKeyDown={handleSubmit}
                      maxLength={2}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*Submit Button*/}
          <div>
            {raceResult.length <= 0 ? (
              <button
                disabled={
                  time.minutes === "" &&
                  time.hours === "" &&
                  time.seconds === ""
                }
                className={`flex flex-col h-full justify-center ${
                  (time.minutes === "" &&
                    time.hours === "" &&
                    time.seconds === "") ||
                  loading
                    ? "bg-slate-800"
                    : "bg-yellow-400 cursor-pointer"
                }
                 items-center w-12 rounded-lg`}
                onMouseDown={handleMouseDown}
              >
                {loading ? (
                  <>
                    <Loader className="text-yellow-400 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <Equal
                    className={`${
                      time.minutes === "" &&
                      time.hours === "" &&
                      time.seconds === ""
                        ? "text-slate-700"
                        : "text-slate-50"
                    } h-4 w-4`}
                  />
                )}
              </button>
            ) : (
              <button
                className="flex flex-col h-full justify-center items-center bg-yellow-400 w-12 rounded-lg cursor-pointer"
                onMouseDown={resetPace}
              >
                <CornerUpLeft className="text-slate-50 h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
