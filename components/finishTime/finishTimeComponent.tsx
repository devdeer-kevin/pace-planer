"use client";

import {
  ArrowPathIcon,
  ArrowUturnLeftIcon,
  Bars2Icon,
} from "@heroicons/react/16/solid";
import { ChangeEvent, useState, KeyboardEvent } from "react";
import DistanceButton from "../distanceButton";

// Interface for the response from the API
interface IRacePace {
  distance: string;
  finishTime: string;
  clockTime: string;
}

export default function FinishTimeComponent() {
  // State to keep track of hours
  const [hours, setHours] = useState("");
  // State to keep track of minutes
  const [minutes, setMinutes] = useState("");
  // State to keep track of seconds
  const [seconds, setSeconds] = useState("");
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

  // Method to handle submit via enter key
  const handleSubmit = (event: KeyboardEvent<HTMLInputElement>) => {
    if (Number(hours) >= 24) {
      setMinutes("59");
      setSeconds("59");
      return;
    }
    if (Number(seconds) >= 60) {
      setSeconds("59");
      return;
    }
    if (event.key === "Enter" || event.key === "NumpadEnter") {
      if (endpoint === "Time") {
        fetchTimeAPI();
      }
      if (endpoint === "Pace") {
        fetchPaceAPI();
      }
    }
  };

  // Method to handle mouse down event
  const handleMouseDown = () => {
    if (Number(hours) >= 24) {
      setMinutes("59");
      setSeconds("59");
      return;
    }
    if (Number(seconds) >= 60) {
      setSeconds("59");
      return;
    }
    if (endpoint === "Time") {
      fetchTimeAPI();
    }
    if (endpoint === "Pace") {
      fetchPaceAPI();
    }
  };

  // Method to fetch data from Pace API to calculate the target pace
  const fetchPaceAPI = async () => {
    setLoading(true);

    const response = await fetch("/api/v1/finishPace/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        customDistance: customDistance,
      }),
    });
    const data: IRacePace[] = await response.json();
    setRaceResult(data);
    setDisplayedResult(
      data.find((result: IRacePace) => result.distance === selectedDistance)
        ?.finishTime
    );
    setLoading(false);
  };

  // Method to fetch data from Time API to calculate the target duration
  const fetchTimeAPI = async () => {
    setLoading(true);

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
        minutes: minutes,
        seconds: seconds,
        customDistance: customDistance,
        optionalStartTimeHours: optionalStartTimeHours,
        optionalStartTimeMinutes: optionalStartTimeMinutes,
      }),
    });
    const data: IRacePace[] = await response.json();
    setRaceResult(data);
    setDisplayedResult(
      data.find((result: IRacePace) => result.distance === selectedDistance)
        ?.finishTime
    );
    setDisplayedClockTime(
      data.find((result: IRacePace) => result.distance === selectedDistance)
        ?.clockTime
    );
    console.log(displayedResult, displayedClockTime);
    setLoading(false);
  };

  const displayedDistanceHandler = (selectedDistance: string) => {
    if (!raceResult) {
      return;
    }
    const currentDistance = raceResult.find(
      (result: IRacePace) => result.distance === selectedDistance
    )?.finishTime;
    setDisplayedResult(currentDistance);
  };

  // Method to handle hours input
  const hoursHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(event.target.value))) {
      return;
    }
    setHours(event.target.value);
  };
  // Method to handle minutes input
  const minutesHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(event.target.value))) {
      return;
    }
    setMinutes(event.target.value);
  };

  // Method to handle seconds input
  const secondsHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(event.target.value))) {
      return;
    }
    setSeconds(event.target.value);
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

  // Method to reset the input fields
  const resetPace = () => {
    setOptionalStartTime("00:00");
    setDisplayedClockTime("00:00");
    setHours("");
    setMinutes("");
    setSeconds("");
    setCustomDistance("");
    setRaceResult([]);
  };

  return (
    <>
      <div className="flex flex-col py-8 bg-slate-900 mt-10 items-center rounded-xl gap-4 w-[340px]">
        <div className="flex flex-col bg-slate-950 rounded-lg w-11/12">
          <div className="flex flex-col h-20 items-center py-3">
            {raceResult.length <= 0 ? (
              <div>
                <p className="text-slate-500 text-center text-5xl font-mono">
                  00:00:00
                </p>
                {endpoint === "Time" && (
                  <p className="text-slate-500 text-center text-sm font-mono">
                    Zieleinlauf ist {displayedClockTime} Uhr
                  </p>
                )}
              </div>
            ) : (
              <div>
                <p className="text-yellow-400 text-center text-5xl font-mono">
                  {displayedResult}
                </p>
                {endpoint === "Time" && (
                  <p className="text-yellow-600 text-center text-sm font-mono">
                    Zieleinlauf ist {displayedClockTime} Uhr
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex w-11/12 justify-end -mt-2 pb-2">
          <div className="flex flex-row gap-2">
            <button
              onClick={() => setEndpoint("Time")}
              className={`bg-slate-950 ${
                endpoint === "Time"
                  ? "text-slate-50 font-bold"
                  : "text-slate-700 font-normal"
              } py-1 px-1.5 rounded-md`}
            >
              Zielzeit
            </button>
            <button
              onClick={() => setEndpoint("Pace")}
              className={`bg-slate-950 ${
                endpoint === "Pace"
                  ? "text-slate-50 font-bold"
                  : "text-slate-700 font-normal"
              }py-1 px-1.5 rounded-md`}
            >
              Zielpace
            </button>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <div>
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="flex flex-row gap-2">
                <DistanceButton
                  distance="5k"
                  onDistanceSelected={setSelectedDistance}
                  active={selectedDistance === "5k"}
                  displayedDistanceHandler={displayedDistanceHandler}
                />
                <DistanceButton
                  distance="10k"
                  onDistanceSelected={setSelectedDistance}
                  active={selectedDistance === "10k"}
                  displayedDistanceHandler={displayedDistanceHandler}
                />
                <DistanceButton
                  distance="21k"
                  onDistanceSelected={setSelectedDistance}
                  active={selectedDistance === "21k"}
                  displayedDistanceHandler={displayedDistanceHandler}
                />
                <DistanceButton
                  distance="42k"
                  onDistanceSelected={setSelectedDistance}
                  active={selectedDistance === "42k"}
                  displayedDistanceHandler={displayedDistanceHandler}
                />
                <DistanceButton
                  distance="?k"
                  onDistanceSelected={setSelectedDistance}
                  active={selectedDistance === "?k"}
                  displayedDistanceHandler={displayedDistanceHandler}
                />
              </div>
              <div className="flex flex-row justify-between items-end ">
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
                      className="placeholder:text-xs text-center font-mono text-lg py-1.5 w-28 bg-transparent border border-1 border-slate-50 text-slate-50 disabled:text-slate-500 disabled:border-slate-700 rounded-md placeholder:text-slate-700"
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
                    <input
                      type="time"
                      min="00:00"
                      max="23:59"
                      placeholder="Startzeit"
                      disabled={raceResult.length > 0 || endpoint !== "Time"}
                      aria-label="Startzeit"
                      className="placeholder:text-xs text-center font-mono text-lg py-1.5 w-28 bg-transparent border border-1 border-slate-50 text-slate-50 disabled:text-slate-500 disabled:border-slate-700 rounded-md placeholder:text-slate-700"
                      value={optionalStartTime}
                      onChange={startTimeHandler}
                      onKeyDown={handleSubmit}
                      maxLength={4}
                    />
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
                        className="placeholder:text-xs text-center font-mono text-lg py-1.5 w-16 bg-transparent border border-1 border-slate-50 text-slate-50 disabled:text-slate-500 disabled:border-slate-700 rounded-md placeholder:text-slate-700"
                        value={hours}
                        onChange={hoursHandler}
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
                      } placeholder:text-xs bg-transparent border border-1 border-slate-50 text-slate-50 disabled:text-slate-500 disabled:border-slate-700 rounded-md placeholder:text-slate-700`}
                      value={minutes}
                      onChange={minutesHandler}
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
                      } placeholder:text-xs bg-transparent border border-1 border-slate-50 text-slate-50 disabled:text-slate-500 disabled:border-slate-700 rounded-md placeholder:text-slate-700`}
                      value={seconds}
                      onChange={secondsHandler}
                      onKeyDown={handleSubmit}
                      maxLength={2}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            {raceResult.length <= 0 ? (
              <button
                disabled={minutes === "" && hours === "" && seconds === ""}
                className={`flex flex-col h-full justify-center ${
                  (minutes === "" && hours === "" && seconds === "") || loading
                    ? "bg-slate-800"
                    : "bg-yellow-400"
                }
                 items-center w-12 rounded-lg`}
                onMouseDown={handleMouseDown}
              >
                {loading ? (
                  <>
                    <ArrowPathIcon className="fill-yellow-400 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <Bars2Icon
                    className={`${
                      minutes === "" && hours === "" && seconds === ""
                        ? "fill-slate-700"
                        : "fill-slate-50"
                    } h-4 w-4`}
                  />
                )}
              </button>
            ) : (
              <button
                className="flex flex-col h-full justify-center items-center bg-yellow-400 w-12 rounded-lg"
                onMouseDown={resetPace}
              >
                <ArrowUturnLeftIcon className="fill-slate-50 h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
