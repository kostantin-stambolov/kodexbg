"use client";

import { FormEvent, useState } from "react";

type Status = "idle" | "saving" | "success" | "error";

export default function NewsletterSignup() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      source: "home_final_cta",
    };

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        throw new Error(data?.message || "Записването не успя.");
      }

      setStatus("success");
      setMessage("Записани сте успешно.");
      event.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Записването не успя. Опитайте отново."
      );
    }
  }

  return (
    <div className="newsletter-inline">
      {status === "success" ? null : (
        <form className="newsletter-form" onSubmit={submit}>
          <label>
            <span>Име</span>
            <input name="name" type="text" autoComplete="name" required />
          </label>
          <label>
            <span>Имейл</span>
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <button
            className="button copper newsletter-submit"
            type="submit"
            disabled={status === "saving"}
          >
            {status === "saving" ? (
              <>
                <span className="newsletter-spinner" aria-hidden="true" />
                <span>Записване...</span>
              </>
            ) : (
              "Запиши ме"
            )}
          </button>
        </form>
      )}
      {message ? (
        <p className={`newsletter-message is-${status}`}>{message}</p>
      ) : null}
    </div>
  );
}
