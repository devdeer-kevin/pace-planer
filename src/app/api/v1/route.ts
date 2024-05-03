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
  const marathonLength = 42.195;
  const halfMarathonLength = 21.0975;
  const tenKLength = 10;
  const fiveKLength = 5;
  const oneMileLength = 1.6;

  // Calculate finish times for various distances
  const finishTimeMarathon = (marathonLength * pace) / 60;
  const finishTimeHalfMarathon = (halfMarathonLength * pace) / 60;
  const finishTime10K = (tenKLength * pace) / 60;
  const finishTime5K = (fiveKLength * pace) / 60;
  const finishTime1Mile = (oneMileLength * pace) / 60;

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

  // Return finish times for various distances
  return NextResponse.json({
    finishTimeMarathon: convertToTime(finishTimeMarathon),
    finishTimeHalfMarathon: convertToTime(finishTimeHalfMarathon),
    finishTime10K: convertToTime(finishTime10K),
    finishTime5K: convertToTime(finishTime5K),
    finishTime1Mile: convertToTime(finishTime1Mile),
  });
}
