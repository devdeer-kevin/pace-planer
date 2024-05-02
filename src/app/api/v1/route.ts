import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const minutes = body.minutes;
  const seconds = body.seconds;

  const formattedSeconds = Number(seconds);
  const rawPace = `${minutes}.${formattedSeconds}`;
  const pace = Number(rawPace);

  const convertToTime = (time: number) => {
    const hours = Math.floor(time);
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const minutes = Math.floor((time - hours) * 60);
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const seconds = Math.round(((time - hours) * 60 - minutes) * 60);
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const marathonLength = 42.195;
  const halfMarathonLength = 21.0975;
  const tenKLength = 10;
  const fiveKLength = 5;
  const oneMileLength = 1.6;

  const finishTimeMarathon = (marathonLength * pace) / 60;
  const finishTimeHalfMarathon = (halfMarathonLength * pace) / 60;
  const finishTime10K = (tenKLength * pace) / 60;
  const finishTime5K = (fiveKLength * pace) / 60;
  const finishTime1Mile = (oneMileLength * pace) / 60;

  return NextResponse.json({
    finishTimeMarathon: convertToTime(finishTimeMarathon),
    finishTimeHalfMarathon: convertToTime(finishTimeHalfMarathon),
    finishTime10K: convertToTime(finishTime10K),
    finishTime5K: convertToTime(finishTime5K),
    finishTime1Mile: convertToTime(finishTime1Mile),
  });
}
