"use client";

import {
  ArrowPathIcon,
  ArrowUturnLeftIcon,
  Bars2Icon,
} from "@heroicons/react/16/solid";
import { ChangeEvent, useState, KeyboardEvent } from "react";
import DistanceButton from "../distanceButton";

interface IRacePace {
  distance: string;
  finishTime: number;
}

export default function FinishTimeComponent() {
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [customDistance, setCustomDistance] = useState("");
  const [loading, setLoading] = useState(false);
  const [raceResult, setRaceResult] = useState<IRacePace[]>([]);
  const [selectedDistance, setSelectedDistance] = useState("?k");
  const [endpoint, setEndpoint] = useState("Time");

  const handleSubmit = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "NumpadEnter") {
      if (endpoint === "Time") {
        fetchTimeAPI();
      }
      if (endpoint === "Pace") {
        fetchPaceAPI();
      }
    }
  };

  // Method to fetch data from Pace API
  const fetchPaceAPI = async () => {
    setLoading(true);

    if (hours === "" && minutes === "" && seconds === "") {
      setRaceResult([]);
      setLoading(false);
      resetPace();
      return;
    }

    const response = await fetch("/api/v1/finishPace/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        distance: customDistance,
      }),
    });
    const data = await response.json();
    setRaceResult(data);
    setLoading(false);
  };

  // Method to fetch data from Time API
  const fetchTimeAPI = async () => {
    setLoading(true);

    if (hours === "" && minutes === "" && seconds === "") {
      setRaceResult([]);
      setLoading(false);
      resetPace();
      return;
    }

    const response = await fetch("/api/v1/finishTime/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        minutes: minutes,
        seconds: seconds,
        distance: customDistance,
      }),
    });
    const data = await response.json();
    setRaceResult(data);
    setLoading(false);
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

  // Method to reset pace
  const resetPace = () => {
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
          <div className="flex flex-col items-center py-3">
            {raceResult.length <= 0 ? (
              <p className="text-slate-500 text-center text-5xl font-mono">
                00:00:00
              </p>
            ) : (
              <p className="text-yellow-400 text-center text-5xl font-mono">
                {selectedDistance === "5k" && <>{raceResult[0].finishTime}</>}
                {selectedDistance === "10k" && <>{raceResult[1].finishTime}</>}
                {selectedDistance === "21k" && <>{raceResult[2].finishTime}</>}
                {selectedDistance === "42k" && <>{raceResult[3].finishTime}</>}
                {selectedDistance === "?k" && <>{raceResult[4].finishTime}</>}
              </p>
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
                />
                <DistanceButton
                  distance="10k"
                  onDistanceSelected={setSelectedDistance}
                  active={selectedDistance === "10k"}
                />
                <DistanceButton
                  distance="21k"
                  onDistanceSelected={setSelectedDistance}
                  active={selectedDistance === "21k"}
                />
                <DistanceButton
                  distance="42k"
                  onDistanceSelected={setSelectedDistance}
                  active={selectedDistance === "42k"}
                />
                <DistanceButton
                  distance="?k"
                  onDistanceSelected={setSelectedDistance}
                  active={selectedDistance === "?k"}
                />
              </div>
              <div className="flex flex-row justify-center w-full">
                <div className="flex flex-col items-center gap-2 w-full">
                  <input
                    placeholder="Individuelle Distanz in km"
                    disabled={
                      selectedDistance !== "?k" || raceResult.length > 0
                    }
                    aria-label="Individuelle Distanz in km"
                    className="text-center font-mono text-lg py-1.5 w-full bg-transparent border border-1 border-slate-50 text-slate-50 disabled:text-slate-500 disabled:border-slate-700 rounded-md placeholder:text-slate-700 placeholder:text-xs"
                    value={customDistance}
                    onChange={distanceHandler}
                    onKeyDown={handleSubmit}
                    maxLength={4}
                  />
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
                className={`flex flex-col h-full justify-center ${
                  loading ? "bg-slate-950" : "bg-yellow-400"
                } items-center w-12 rounded-lg`}
                onMouseDown={endpoint === "Time" ? fetchTimeAPI : fetchPaceAPI}
              >
                {loading ? (
                  <>
                    <ArrowPathIcon className="fill-yellow-400 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <Bars2Icon className="fill-slate-50 h-4 w-4" />
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
