"use client";

import { ArrowPathIcon } from "@heroicons/react/16/solid";
import { ChangeEvent, useState, KeyboardEvent, use, useEffect } from "react";
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
      <div className="flex flex-col sm:pt-0 pt-10 items-center gap-4 w-[330px]">
        <div className="flex flex-col gap-4 bg-slate-900 rounded-lg px-6 w-full">
          <div className="flex flex-col items-center">
            {raceResult.length <= 0 ? (
              <p className="text-slate-50 text-center break-words w-72 py-6 text-xs font-light">
                Wähle Distanz und Pace, um deine Zielzeiten zu berechnen.
              </p>
            ) : (
              <div className="flex flex-col gap-5 pt-3 pb-3">
                <p className="text-yellow-400 text-center text-2xl h-4 font-mono">
                  {selectedDistance === "5k" && <>{raceResult[0].finishTime}</>}
                  {selectedDistance === "10k" && (
                    <>{raceResult[1].finishTime}</>
                  )}
                  {selectedDistance === "21k" && (
                    <>{raceResult[2].finishTime}</>
                  )}
                  {selectedDistance === "42k" && (
                    <>{raceResult[3].finishTime}</>
                  )}
                  {selectedDistance === "?k" && <>{raceResult[4].finishTime}</>}
                </p>
                <p className="text-yellow-400 font-mono text-xs text-center">
                  Deine Zielzeit
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 bg-slate-900 rounded-lg p-6 w-full ">
          <label className="text-slate-500 text-xs h-4 font-light">
            Distanz
          </label>
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
        </div>
        <div className="flex flex-col gap-4 bg-slate-900 rounded-lg py-6 w-full ">
          <div className="flex flex-row justify-center">
            <div className="flex flex-col items-center gap-2 w-full px-6">
              <label className="text-slate-500 text-xs h-4 font-light text-center">
                Individuelle Distanz in km
              </label>
              <input
                disabled={selectedDistance !== "?k" || raceResult.length > 0}
                aria-label="Individuelle Distanz in km"
                className="text-center font-mono text-lg py-2 w-full bg-transparent border border-1 border-slate-50 text-slate-50 disabled:text-slate-500 disabled:border-slate-700 rounded-md placeholder:text-slate-700"
                value={customDistance}
                onChange={distanceHandler}
                onKeyDown={handleSubmit}
                maxLength={4}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 bg-slate-900 rounded-lg p-6 w-full ">
          <div className="flex flex-row justify-center gap-4 items-end">
            <div className="flex flex-row gap-4 text-left">
              <div className="flex flex-col gap-2">
                <label className="text-slate-500 text-xs h-4 font-light">
                  Minuten
                </label>
                <input
                  disabled={raceResult.length > 0}
                  aria-label="Minuten"
                  className="text-center font-mono text-lg py-2 w-32 bg-transparent border border-1 border-slate-50 text-slate-50 disabled:text-slate-500 disabled:border-slate-700 rounded-md placeholder:text-slate-700"
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
                  className="text-center font-mono  text-lg py-2 w-32 bg-transparent border border-1 border-slate-50 text-slate-50 disabled:text-slate-500 disabled:border-slate-700 rounded-md placeholder:text-slate-700"
                  value={seconds}
                  onChange={secondsHandler}
                  onKeyDown={handleSubmit}
                  maxLength={2}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="h-8 w-full">
          <div className="flex flex-col gap-4 text-center h-8 w-full">
            {raceResult.length <= 0 ? (
              <button
                onMouseDown={fetchAPI}
                className="flex flex-row items-center justify-center p-4 bg-yellow-400 text-slate-800 rounded-md"
              >
                {loading ? (
                  <>
                    <ArrowPathIcon className="fill-slate-800 h-4 w-4 animate-spin mr-3" />
                    <>Berechnung läuft</>
                  </>
                ) : (
                  <>Berechnen</>
                )}
              </button>
            ) : (
              <button
                onMouseDown={resetPace}
                className="flex flex-row items-center justify-center p-4 bg-yellow-400 text-slate-800 rounded-md"
              >
                Erneut Berechnen
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
