"use client";

import { ArrowPathIcon } from "@heroicons/react/16/solid";
import { ChangeEvent, useState, KeyboardEvent, use, useEffect } from "react";

interface IRacePace {
  distance: string;
  finishTime: number;
}

export default function FinishTimeComponent() {
  const [minutes, setMinutes] = useState("06");
  const [seconds, setSeconds] = useState("14");
  const [inputDistance, setInputDistance] = useState("5");
  const [loading, setLoading] = useState(false);
  const [raceResult, setRaceResult] = useState<IRacePace[]>([]);
  const [isActive, setIsActive] = useState("?k");

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
      body: JSON.stringify({ minutes: minutes, seconds: seconds }),
    });
    const data = await response.json();
    setRaceResult(data);
    setLoading(false);
  };

  // Method to handle minutes input
  const minutesHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setMinutes(event.target.value);
  };

  // Method to handle seconds input
  const secondsHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setSeconds(event.target.value);
  };

  // Method to handle distance input
  const distanceHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setInputDistance(event.target.value);
  };

  // Method to reset pace
  const resetPace = () => {
    setMinutes("06");
    setSeconds("14");
    setRaceResult([]);
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-4 bg-slate-900 rounded-lg p-6 w-full sm:min-w-[400px]">
          <div>
            <p className="text-slate-50 font-bold text-center">
              Plane deine Zielzeiten
            </p>
          </div>
          <div className="flex flex-row gap-2">
            <div>
              <button
                onClick={() => setIsActive("1.6k")}
                className={`${
                  isActive === "1.6k" ? "bg-yellow-400" : "bg-slate-700"
                } h-12 w-12 rounded-lg transition-all duration-150 ease-in-out`}
              >
                1.6k
              </button>
            </div>
            <div>
              <button
                onClick={() => setIsActive("5k")}
                className={`${
                  isActive === "5k" ? "bg-yellow-400" : "bg-slate-700"
                } h-12 w-12 rounded-lg transition-all duration-150 ease-in-out`}
              >
                5k
              </button>
            </div>
            <div>
              <button
                onClick={() => setIsActive("10k")}
                className={`${
                  isActive === "10k" ? "bg-yellow-400" : "bg-slate-700"
                } h-12 w-12 rounded-lg transition-all duration-150 ease-in-out`}
              >
                10k
              </button>
            </div>
            <div>
              <button
                onClick={() => setIsActive("21k")}
                className={`${
                  isActive === "21k" ? "bg-yellow-400" : "bg-slate-700"
                } h-12 w-12 rounded-lg transition-all duration-150 ease-in-out`}
              >
                21k
              </button>
            </div>
            <div>
              <button
                onClick={() => setIsActive("42k")}
                className={`${
                  isActive === "42k" ? "bg-yellow-400" : "bg-slate-700"
                } h-12 w-12 rounded-lg transition-all duration-150 ease-in-out`}
              >
                42k
              </button>
            </div>
            <div>
              <button
                onClick={() => setIsActive("?k")}
                className={`${
                  isActive === "?k" ? "bg-yellow-400" : "bg-slate-700"
                } h-12 w-12 rounded-lg transition-all duration-150 ease-in-out`}
              >
                ?k
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 bg-slate-900 rounded-lg p-6 w-full sm:min-w-[400px]">
          <div className="flex flex-row justify-center gap-4 items-end">
            <div className="flex flex-col items-center gap-2 text-left">
              <label className="text-slate-500 text-xs h-4 font-light text-center">
                Individuelle Distanz in km
              </label>
              <input
                aria-label="Individuelle Distanz in km"
                className="w-full accent-yellow-400 h-12 p-2 text-center bg-transparent rounded-md"
                value={inputDistance}
                onChange={distanceHandler}
                onKeyDown={handleSubmit}
                type="range"
                min="0"
                max="160"
              />
              <div className="text-yellow-400">{inputDistance} km</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 bg-slate-900 rounded-lg p-6 w-full sm:min-w-[400px]">
          <div className="flex flex-row justify-center gap-4 items-end">
            <div className="flex flex-row gap-2 text-left">
              <div className="flex flex-col gap-2">
                <label className="text-slate-500 text-xs h-4 font-light">
                  Minuten
                </label>
                <input
                  aria-label="Minuten"
                  className="text-center py-2 bg-transparent border border-1 border-slate-50 text-slate-50 rounded-md placeholder:text-slate-700"
                  value={minutes}
                  onChange={minutesHandler}
                  onKeyDown={handleSubmit}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-slate-500 text-xs h-4 font-light">
                  Minuten
                </label>
                <input
                  aria-label="Sekunden"
                  className="text-center py-2 bg-transparent border border-1 border-slate-50 text-slate-50 rounded-md placeholder:text-slate-700"
                  value={seconds}
                  onChange={secondsHandler}
                  onKeyDown={handleSubmit}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 bg-slate-900 rounded-lg p-6 w-full sm:min-w-[400px]">
          <div className="flex flex-row justify-center gap-4 items-end">
            <div className="flex flex-col gap-2 items-center">
              <p className="text-slate-500 text-center break-words w-4/6 text-xs h-4 font-light">
                Gib Distanz und Pace ein, um deine Zielzeit zu berechnen.
              </p>
            </div>
          </div>
        </div>
        <div className="h-8 w-full">
          <div className="flex flex-col gap-4 text-center h-8 w-full">
            <button
              onClick={resetPace}
              className="flex flex-row items-center justify-center p-4 bg-yellow-400 text-slate-800 rounded-md"
            >
              {loading && (
                <ArrowPathIcon className="fill-slate-800 h-4 w-4 animate-spin mr-3" />
              )}
              Berechnen
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
