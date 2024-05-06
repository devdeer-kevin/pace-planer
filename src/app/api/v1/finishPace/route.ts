import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // Get minutes and seconds from request body
  const body = await req.json();
  const customDistanceName: string = body.distance;
  const customDistance: number = body.customDistance;
  const hours: number = body.hours;
  const minutes: number = body.minutes;

  // Format pace
  const decimalMinutes = Math.round((minutes / 60) * 100);
  const rawTargetTime = `${hours}.${decimalMinutes}`;
  const targetTime = Number(rawTargetTime);

  // Define distances
  const distances = [
    { name: "1 Mile", length: 1.6 },
    { name: "5 Kilometer", length: 5 },
    { name: "10 Kilometer", length: 10 },
    { name: "Halbmarathon", length: 21.0975 },
    { name: "Marathon", length: 42.195 },
    { name: customDistanceName, length: customDistance },
  ];

  const convertToTime = (time: number) => {
    // Function to convert decimal time to hh:mm:ss format
    const pad = (num: number) => (num < 10 ? `0${num}` : num);

    let hours = Math.floor(time);
    let remainder = time - hours;
    let minutes = Math.floor(remainder * 60);
    remainder = remainder * 60 - minutes;
    let seconds = Math.floor(remainder * 60);

    //  Return formatted time
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const racePace = distances.map((race) => {
    const finishPace = (targetTime / race.length) * 60;
    return {
      distance: race.name,
      finishTime: convertToTime(finishPace),
    };
  });

  // Return finish times for various distances
  return NextResponse.json(racePace);
}
