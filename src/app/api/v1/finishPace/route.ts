import { NextResponse, NextRequest } from "next/server";
import { ITimeRequestBody } from "../../../../../components/Types/IPaceRequest";

export async function POST(req: NextRequest) {
  // Get minutes and seconds from request body
  const body: ITimeRequestBody = await req.json();
  const hours = body.hours;
  const minutes = body.minutes;
  const seconds = body.seconds;
  const customDistance = body.customDistance;

  // Function to pad numbers
  const pad = (num: number) => (num < 10 ? `0${num}` : num);

  /**
   * Calculates the time a run will take with a given pace in minutes and seconds
   */
  const calculateTargetTime = (
    hours: string,
    minutes: string,
    seconds: string,
  ) => {
    const convertedHoursInMinutes = Math.round(Number(hours) * 60);
    const allMinutes = Number(convertedHoursInMinutes) + Number(minutes);
    const decimalSeconds = pad(Math.round((Number(seconds) / 60) * 100));
    const rawTargetTime = `${allMinutes}.${decimalSeconds}`;
    const targetTime = Number(rawTargetTime);

    return targetTime;
  };

  const targetTime = calculateTargetTime(hours, minutes, seconds);

  // Define distances
  const distances = [
    { name: "5k", length: 5 },
    { name: "10k", length: 10 },
    { name: "21k", length: 21.0975 },
    { name: "42k", length: 42.195 },
    { name: `?k`, length: Number(customDistance) },
  ];

  const convertToTime = (time: number) => {
    // Function to convert decimal time to hh:mm:ss format

    let hours = Math.floor(time);
    let remainder = time - hours;
    let minutes = Math.floor(remainder * 60);
    remainder = remainder * 60 - minutes;
    let seconds = Math.floor(remainder * 60);

    //  Return formatted time
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const racePace = distances.map((race) => {
    const finishPace = targetTime / race.length / 60;
    return {
      distance: race.name,
      finishTime: convertToTime(finishPace),
    };
  });

  // Return finish times for various distances
  return NextResponse.json(racePace);
}
