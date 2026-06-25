import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { newsletterSubscribers } from "../../../lib/db/schema";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim().toLowerCase();
  const source = String(body?.source ?? "home_newsletter").trim();

  if (name.length < 2 || !emailPattern.test(email)) {
    return NextResponse.json(
      { ok: false, message: "Моля, въведете име и валиден имейл." },
      { status: 400 }
    );
  }

  try {
    await getDb()
      .insert(newsletterSubscribers)
      .values({
        name,
        email,
        source: source || "home_newsletter",
      })
      .onConflictDoUpdate({
        target: newsletterSubscribers.email,
        set: {
          name,
          source: source || "home_newsletter",
        },
      });
  } catch (error) {
    console.error("Newsletter signup failed", error);
    return NextResponse.json(
      {
        ok: false,
        message:
          "Записването временно не е активно. Моля, опитайте отново по-късно.",
      },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true });
}
