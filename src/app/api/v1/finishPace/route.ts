import { NextResponse, NextRequest } from "next/server";
import { ITimeRequestBody } from "../../../../../components/Types/IPaceRequest";
import {
  DISTANCES,
  timeToDecimalMinutes,
  calcFinishPace,
  convertToTime,
} from "../../../../../lib/calculations";

export async function POST(req: NextRequest) {
  const body: ITimeRequestBody = await req.json();

  const targetTime = timeToDecimalMinutes(
    body.hours,
    body.minutes,
    body.seconds,
  );

  const customDistance = { name: "?k", length: Number(body.customDistance) };
  const distances = [...DISTANCES, customDistance];

  const racePace = distances.map((race) => ({
    distance: race.name,
    finishTime: convertToTime(calcFinishPace(targetTime, race.length)),
  }));

  return NextResponse.json(racePace);
}
