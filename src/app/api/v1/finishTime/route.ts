import { NextResponse, NextRequest } from "next/server";
import { ITimeRequestBody } from "../../../../../components/Types/IPaceRequest";

export async function POST(req: NextRequest) {
  // Get minutes and seconds from request body
  const body: ITimeRequestBody = await req.json();
  const minutes = body.minutes;
  const seconds = body.seconds;
  const customDistance = body.customDistance;
  const optionalStartTimeHours = body.optionalStartTimeHours;
  const optionalStartTimeMinutes = body.optionalStartTimeMinutes;

  /**
   * Formats the time to 00:00
   */
  const pad = (num: number) => (num < 10 ? `0${num}` : num);

  /**
   * Calculates the pace
   */
  const calculatePace = (seconds: string, minutes: string) => {
    const decimalSeconds = pad(Math.round((Number(seconds) / 60) * 100));
    const rawPace = `${minutes}.${decimalSeconds}`;
    const pace = Number(rawPace);

    return pace;
  };

  const pace = calculatePace(seconds, minutes);

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

  /**
   * Calculates the actual time when a runner arrives at the finish line
   */
  const calculateFinishTimeOnTheClock = (
    finishTime: number,
    startTimeHours: string,
    startTimeMinutes: string,
  ) => {
    // First, get the time from convertToTime
    let convertedTime = convertToTime(finishTime);

    let optionalStartTimeHours = Number(startTimeHours);
    let optionalStartTimeMinutes = Number(startTimeMinutes);

    // Parse the converted time
    let [hours, mins] = convertedTime.split(":").map(Number);

    // Calculate total minutes
    let totalMinutes =
      (hours * 60 +
        mins +
        optionalStartTimeHours * 60 +
        optionalStartTimeMinutes) %
      1440;

    // Recalculate hours and minutes
    hours = Math.floor(totalMinutes / 60);
    mins = totalMinutes % 60;

    // Format the result
    let formattedHours = hours.toString().padStart(2, "0");
    let formattedMinutes = mins.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}`;
  };

  const raceResults = distances.map((race) => {
    const finishTime = (race.length * pace) / 60;
    const clockTime = calculateFinishTimeOnTheClock(
      finishTime,
      optionalStartTimeHours,
      optionalStartTimeMinutes,
    );
    return {
      distance: race.name,
      finishTime: convertToTime(finishTime),
      clockTime: clockTime,
    };
  });

  // Return finish times for various distances
  return NextResponse.json(raceResults);
}
