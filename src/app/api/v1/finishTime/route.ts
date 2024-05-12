import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // Get minutes and seconds from request body
  const body = await req.json();
  const minutes: number = body.minutes;
  const seconds: number = body.seconds;
  const customDistance: number = body.distance;

  //
  const pad = (num: number) => (num < 10 ? `0${num}` : num);

  // Format pace
  const decimalSeconds = pad(Math.round((seconds / 60) * 100));
  const rawPace = `${minutes}.${decimalSeconds}`;
  const pace = Number(rawPace);

  // Define distances
  const distances = [
    { name: "5 Kilometer", length: 5 },
    { name: "10 Kilometer", length: 10 },
    { name: "Halbmarathon", length: 21.0975 },
    { name: "Marathon", length: 42.195 },
    { name: `${customDistance} Kilometer`, length: customDistance },
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

  const raceResults = distances.map((race) => {
    const finishTime = (race.length * pace) / 60;
    return {
      distance: race.name,
      finishTime: convertToTime(finishTime),
    };
  });

  // Return finish times for various distances
  return NextResponse.json(raceResults);
}
