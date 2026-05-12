import { NextResponse } from "next/server";
import { generateRoutine, type UserProfile } from "@/lib/routine-generator";

export async function POST(request: Request) {
  const profile = (await request.json()) as UserProfile;
  const routine = await generateRoutine(profile);
  return NextResponse.json(routine);
}
