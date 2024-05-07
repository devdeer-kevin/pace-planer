"use client";

import { ArrowPathIcon } from "@heroicons/react/16/solid";
import { ChangeEvent, useState, KeyboardEvent, use, useEffect } from "react";

interface IRacePace {
  distance: string;
  finishTime: number;
}

export default function FinishTimeComponent() {
  const [inputTime, setInputTime] = useState("06:14");
  const [loading, setLoading] = useState(false);
  const [raceResult, setRaceResult] = useState<IRacePace[]>([]);

  const handleSubmit = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "NumpadEnter") {
      fetchAPI();
    }
  };

  // Method to fetch data from API
  const fetchAPI = async () => {
    setLoading(true);
    const [m, s] = inputTime.split(":");

    const response = await fetch("/api/v1/finishTime/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ minutes: m, seconds: s }),
    });
    const data = await response.json();
    setRaceResult(data);
    setLoading(false);
  };

  // Method to handle time input
  const timeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setInputTime(event.target.value);
  };

  // Method to reset pace
  const resetPace = () => {
    setInputTime("06:14");
    setRaceResult([]);
  };

  return (
    <>
      <div className="flex flex-col items-start gap-4">
        <div className="flex flex-col gap-4 bg-slate-900/60 rounded-lg sm:p-12 p-6 min-w-[307px]">
          <div>
            {raceResult.length > 0 ? (
              <p className="text-slate-50 font-bold text-center">Deine Pace</p>
            ) : (
              <p className="text-slate-50 font-bold text-center">
                Plane deine Zielzeiten
              </p>
            )}
          </div>
          {raceResult.length > 0 ? (
            <p className="text-6xl text-center text-yellow-400 font-mono">
              {inputTime}
            </p>
          ) : (
            <div className="flex flex-row justify-center gap-4 items-end">
              <div className="flex flex-col gap-2 text-left">
                <label className="text-slate-500 text-xs h-4 font-light">
                  Pace in min/km
                </label>
                <input
                  aria-label="Pace in min/km"
                  className="px-4 py-2 bg-transparent border border-1 border-slate-50 text-slate-50 rounded-md placeholder:text-slate-700"
                  value={inputTime}
                  onChange={timeHandler}
                  onKeyDown={handleSubmit}
                  type="time"
                />
              </div>
              <div>
                <button
                  onClick={fetchAPI}
                  className="p-2 border border-1 border-yellow-400 text-yellow-400 rounded-md"
                >
                  {loading ? (
                    <ArrowPathIcon className="fill-yellow-400 h-4 w-4 animate-spin" />
                  ) : (
                    "Berechnen"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="min-h-[308px] w-full items-center">
          {raceResult.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-start w-full bg-slate-900 rounded-lg sm:p-12 p-6">
                <div className="text-left">
                  {raceResult.map((result, index) => (
                    <div className="text-left" key={index}>
                      <label className="text-slate-600 font-bold text-sm h-4">
                        {result.distance}
                      </label>
                      <p className="text-xl text-yellow-400 h-8 font-mono">
                        {result.finishTime}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-8 w-full">
                <div className="flex flex-col gap-4 text-center h-8 w-full">
                  <button
                    onClick={resetPace}
                    className="p-2 border border-1 border-yellow-400 text-yellow-400 rounded-md"
                  >
                    Erneut berechnen
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
