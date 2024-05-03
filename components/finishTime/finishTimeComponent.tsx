"use client";

import { ArrowPathIcon } from "@heroicons/react/16/solid";
import { ChangeEvent, useState, KeyboardEvent } from "react";

export default function finishTimeComponent() {
  const [inputTime, setInputTime] = useState("06:14");
  const [loading, setLoading] = useState(false);
  const [finishTimeMarathon, setFinishTimeMarathon] = useState("");
  const [finishTimeHalfMarathon, setFinishTimeHalfMarathon] = useState("");
  const [finishTime10K, setFinishTime10K] = useState("");
  const [finishTime5K, setFinishTime5K] = useState("");
  const [finishTime1Mile, setFinishTime1Mile] = useState("");

  const handleSubmit = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "NumpadEnter") {
      fetchAPI();
    }
  };

  const fetchAPI = async () => {
    setLoading(true);
    const [m, s] = inputTime.split(":");

    const response = await fetch("/api/v1/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ minutes: m, seconds: s }),
    });
    const data = await response.json();
    setFinishTimeMarathon(data.finishTimeMarathon);
    setFinishTimeHalfMarathon(data.finishTimeHalfMarathon);
    setFinishTime10K(data.finishTime10K);
    setFinishTime5K(data.finishTime5K);
    setFinishTime1Mile(data.finishTime1Mile);
    setLoading(false);
  };

  const timeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setInputTime(event.target.value);
  };

  const resetPace = () => {
    setInputTime("06:14");
    setFinishTimeMarathon("");
    setFinishTimeHalfMarathon("");
    setFinishTime10K("");
    setFinishTime5K("");
    setFinishTime1Mile("");
  };

  return (
    <>
      <div className="flex flex-col items-start gap-4">
        <div className="flex flex-col gap-4 bg-slate-900/60 rounded-lg sm:p-12 p-6 sm:min-h-[194px] min-w-[307px]">
          <div>
            {finishTimeMarathon ? (
              <p className="text-slate-50 font-bold text-center">Deine Pace</p>
            ) : (
              <p className="text-slate-50 font-bold text-center">
                Berechne deine Zielzeiten
              </p>
            )}
          </div>
          {finishTimeMarathon ? (
            <p className="text-6xl text-center text-yellow-400 font-mono">
              {inputTime}
            </p>
          ) : (
            <div className="flex flex-row justify-center gap-4 items-end">
              <div className="flex flex-col gap-2 text-left">
                <label className="text-slate-500 text-xs h-4 font-light">
                  Pace in m/km
                </label>
                <input
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
                  Abschicken
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col items-start w-full bg-slate-900 rounded-lg sm:p-12 p-6">
          <div className="text-left">
            <div className="text-left">
              <label className="text-slate-600 font-bold text-sm h-4">
                1 Meile
              </label>
              {loading ? (
                <ArrowPathIcon className="fill-slate-700 h-4 w-4 animate-spin" />
              ) : (
                <p className="text-xl text-yellow-400 h-8 font-mono">
                  {finishTime1Mile ? <>{finishTime1Mile}</> : "00:00:00"}
                </p>
              )}
            </div>
            <div className="text-left">
              <label className="text-slate-600 font-bold text-sm h-4">5K</label>
              {loading ? (
                <ArrowPathIcon className="fill-slate-700 h-4 w-4 animate-spin" />
              ) : (
                <p className="text-xl text-yellow-400 h-8 font-mono">
                  {finishTime5K ? <>{finishTime5K}</> : "00:00:00"}
                </p>
              )}
            </div>
            <div className="text-left">
              <label className="text-slate-600 font-bold text-sm h-4">
                10K
              </label>
              {loading ? (
                <ArrowPathIcon className="fill-slate-700 h-4 w-4 animate-spin" />
              ) : (
                <p className="text-xl text-yellow-400 h-8 font-mono">
                  {finishTime10K ? <>{finishTime10K}</> : "00:00:00"}
                </p>
              )}
            </div>
            <div className="text-left">
              <label className="text-slate-600 font-bold text-sm h-4">
                Halbmarathon
              </label>
              {loading ? (
                <ArrowPathIcon className="fill-slate-700 h-4 w-4 animate-spin" />
              ) : (
                <p className="text-xl text-yellow-400 h-8 font-mono">
                  {finishTimeHalfMarathon ? (
                    <>{finishTimeHalfMarathon}</>
                  ) : (
                    "00:00:00"
                  )}
                </p>
              )}
            </div>
            <label className="text-slate-600 font-bold text-sm h-4">
              Marathon
            </label>
            {loading ? (
              <ArrowPathIcon className="fill-slate-700 h-4 w-4 animate-spin" />
            ) : (
              <p className="text-xl text-yellow-400 h-8 font-mono">
                {finishTimeMarathon ? <>{finishTimeMarathon}</> : "00:00:00"}
              </p>
            )}
          </div>
        </div>
        <div className="h-8 w-full">
          {finishTimeMarathon && (
            <div className="flex flex-col gap-4 text-center h-8 w-full">
              <button
                onClick={resetPace}
                className="p-2 border border-1 border-yellow-400 text-yellow-400 rounded-md"
              >
                Erneut berechnen
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
