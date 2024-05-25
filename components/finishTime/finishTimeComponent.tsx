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
  const [minutes, setMinutes] = useState("06");
  const [seconds, setSeconds] = useState("14");
  const [customDistance, setCustomDistance] = useState("1.6");
  const [loading, setLoading] = useState(false);
  const [raceResult, setRaceResult] = useState<IRacePace[]>([]);
  const [selectedDistance, setSelectedDistance] = useState("?k");

  const handleSubmit = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "NumpadEnter") {
      fetchAPI();
    }
  };

  // Method to fetch data from API
  const fetchAPI = async () => {
    setLoading(true);

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
    setMinutes("06");
    setSeconds("14");
    setCustomDistance("1.6");
    setRaceResult([]);
  };

  return (
    <>
      <div className="flex flex-col py-8 bg-slate-900 items-center rounded-xl gap-4 w-[330px]">
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
            <button className="bg-slate-950 text-slate-50 font-bold py-1 px-1.5 rounded-md">
              Zielzeit
            </button>
            {/* <button className="bg-slate-950 text-slate-700 px-1 rounded-md">
              Zielpace
            </button> */}
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
                  <label className="text-slate-500 text-left text-xs font-light w-full">
                    Individuelle Distanz in km
                  </label>
                  <input
                    disabled={
                      selectedDistance !== "?k" || raceResult.length > 0
                    }
                    aria-label="Individuelle Distanz in km"
                    className="text-center font-mono text-lg py-2 w-full bg-transparent border border-1 border-slate-50 text-slate-50 disabled:text-slate-500 disabled:border-slate-700 rounded-md placeholder:text-slate-700"
                    value={customDistance}
                    onChange={distanceHandler}
                    onKeyDown={handleSubmit}
                    maxLength={4}
                  />
                </div>
              </div>
              <div className="flex flex-row justify-center items-end ">
                <div className="flex flex-row gap-6 w-full text-left">
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-500 text-xs h-4 font-light">
                      Minuten
                    </label>
                    <input
                      disabled={raceResult.length > 0}
                      aria-label="Minuten"
                      className="text-center font-mono text-lg py-2 w-28 bg-transparent border border-1 border-slate-50 text-slate-50 disabled:text-slate-500 disabled:border-slate-700 rounded-md placeholder:text-slate-700"
                      value={minutes}
                      onChange={minutesHandler}
                      onKeyDown={handleSubmit}
                      maxLength={2}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-500 text-xs h-4 font-light">
                      Sekunden
                    </label>
                    <input
                      disabled={raceResult.length > 0}
                      aria-label="Sekunden"
                      className="text-center font-mono  text-lg py-2 w-28 bg-transparent border border-1 border-slate-50 text-slate-50 disabled:text-slate-500 disabled:border-slate-700 rounded-md placeholder:text-slate-700"
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
                className="flex flex-col h-full justify-center items-center bg-yellow-400 w-10 rounded-lg"
                onMouseDown={fetchAPI}
              >
                {loading ? (
                  <>
                    <ArrowPathIcon className="fill-slate-800 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <Bars2Icon className="fill-slate-50 h-4 w-4" />
                )}
              </button>
            ) : (
              <button
                className="flex flex-col h-full justify-center items-center bg-yellow-400 w-10 rounded-lg"
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
