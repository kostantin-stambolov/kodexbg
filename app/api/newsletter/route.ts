import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { newsletterSubscribers } from "../../../lib/db/schema";
import { sendNewsletterWelcomeEmail } from "../../../lib/email";
import { getResource } from "../../../lib/resources";
import { getBaseUrl } from "../../../lib/url";

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

  const resource = getResource("tobi", "coloring-page");
  if (!resource) {
    return NextResponse.json(
      { ok: false, message: "Материалът временно не е наличен." },
      { status: 503 }
    );
  }

  try {
    const db = getDb();
    const existing = await db
      .select({ id: newsletterSubscribers.id })
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email))
      .limit(1);

    const isNew = existing.length === 0;

    if (isNew) {
      await db.insert(newsletterSubscribers).values({
        name,
        email,
        source: source || "home_newsletter",
      });
    } else {
      await db
        .update(newsletterSubscribers)
        .set({
          name,
          source: source || "home_newsletter",
        })
        .where(eq(newsletterSubscribers.email, email));
    }

    // Welcome + линк за оцветяване само при първи запис.
    if (isNew) {
      const emailResult = await sendNewsletterWelcomeEmail({
        name,
        email,
        baseUrl: getBaseUrl(request),
        resource,
      });

      if (!emailResult.ok) {
        console.error("Newsletter welcome email failed", emailResult.error);
        // Записът вече е в базата – не връщаме грешка на потребителя.
      }
    }
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
