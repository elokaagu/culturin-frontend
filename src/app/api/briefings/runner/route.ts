import { NextResponse } from "next/server";

import { runDue } from "@/lib/briefings/pipeline";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/** Vercel Cron: advances briefings that are mid-pipeline and not being worked on. */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }
  const advanced = await runDue(270_000);
  if (advanced.length) console.log("[briefings] runner advanced", JSON.stringify(advanced));
  return NextResponse.json({ advanced });
}
