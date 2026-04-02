import { NextResponse, NextRequest } from "next/server";
import { ITimeRequestBody } from "../../../../../components/Types/IPaceRequest";
import {
  DISTANCES,
  paceToDecimalMinutes,
  calcFinishTime,
  calcClockTime,
  convertToTime,
} from "../../../../../lib/calculations";

export async function POST(req: NextRequest) {
  const body: ITimeRequestBody = await req.json();

  const pace = paceToDecimalMinutes(body.minutes, body.seconds);

  const customDistance = { name: "?k", length: Number(body.customDistance) };
  const distances = [...DISTANCES, customDistance];

  const raceResults = distances.map((race) => {
    const finishTime = calcFinishTime(pace, race.length);
    return {
      distance: race.name,
      finishTime: convertToTime(finishTime),
      clockTime: calcClockTime(
        finishTime,
        body.optionalStartTimeHours,
        body.optionalStartTimeMinutes,
      ),
    };
  });

  return NextResponse.json(raceResults);
}
