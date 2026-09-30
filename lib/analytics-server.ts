// Сървърни събития към PostHog – без cookies и без лични данни, за да
// виждаме продажбите и при посетители, отказали аналитичните cookies.
// Ключът е публичният project key от public/assets/analytics-consent3.js.
const POSTHOG_HOST = "https://eu.i.posthog.com";
const POSTHOG_PROJECT_KEY = "phc_wXbSUBpPG7ehdUTP8UQ3CbmLv259p77YuDorjr7pbqUW";

export async function captureServerEvent(
  event: string,
  distinctId: string,
  properties: Record<string, unknown>
): Promise<void> {
  try {
    await fetch(`${POSTHOG_HOST}/i/v0/e/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: POSTHOG_PROJECT_KEY,
        event,
        distinct_id: distinctId,
        properties: { ...properties, $process_person_profile: false },
      }),
      signal: AbortSignal.timeout(3000),
    });
  } catch (err) {
    console.error("PostHog server event failed:", err);
  }
}
