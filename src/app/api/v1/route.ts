import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // Get minutes and seconds from request body
  const body = await req.json();
  const minutes = body.minutes;
  const seconds = body.seconds;

  // Format pace
  const formattedSeconds = Number(seconds);
  const decimalSeconds = Math.round((formattedSeconds / 60) * 100);
  const rawPace = `${minutes}.${decimalSeconds}`;
  const pace = Number(rawPace);

  // Define distances
  const distances = [
    { name: "1 Mile", length: 1.6 },
    { name: "5 Kilometer", length: 5 },
    { name: "10 Kilometer", length: 10 },
    { name: "Halbmarathon", length: 21.1 },
    { name: "Marathon", length: 42.2 },
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
