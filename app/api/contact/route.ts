import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { contactMessages } from "../../../lib/db/schema";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim().toLowerCase();
  const topic = String(body?.topic ?? "").trim() || null;
  const message = String(body?.message ?? "").trim();

  if (name.length < 2 || !emailPattern.test(email) || message.length < 10) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Моля, попълнете име, валиден имейл и съобщение (поне 10 символа).",
      },
      { status: 400 }
    );
  }

  try {
    await getDb()
      .insert(contactMessages)
      .values({ name, email, topic, message });
  } catch (error) {
    console.error("Contact message failed", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Изпращането не успя. Опитайте отново или ни пишете на имейл.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, message: "Съобщението е изпратено." });
}
