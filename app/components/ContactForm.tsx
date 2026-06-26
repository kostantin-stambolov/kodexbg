"use client";

import { FormEvent, useState } from "react";

type Status = "idle" | "saving" | "success" | "error";

const topics = [
  "Поръчка и доставка",
  "Поръчка над 10 броя",
  "Наличност на издание",
  "Сътрудничество",
  "Друго",
];

export default function ContactForm() {
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
      topic: String(form.get("topic") ?? ""),
      message: String(form.get("message") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;
      if (!response.ok) {
        throw new Error(data?.message || "Изпращането не успя.");
      }
      setStatus("success");
      setMessage(
        "Благодарим! Получихме съобщението ви и ще отговорим възможно най-скоро."
      );
      event.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Изпращането не успя. Опитайте отново."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="contact-form-success" role="status">
        <span className="contact-success-check" aria-hidden="true">
          ✓
        </span>
        <p>{message}</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="contact-field-row">
        <label className="contact-field">
          <span>Име</span>
          <input name="name" type="text" autoComplete="name" required />
        </label>
        <label className="contact-field">
          <span>Имейл</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
      </div>
      <label className="contact-field">
        <span>Тема</span>
        <select name="topic" defaultValue={topics[0]}>
          {topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>
      <label className="contact-field">
        <span>Съобщение</span>
        <textarea name="message" rows={5} required minLength={10} />
      </label>
      <button
        className="button copper"
        type="submit"
        disabled={status === "saving"}
      >
        {status === "saving" ? "Изпращане..." : "Изпрати запитване"}
      </button>
      {status === "error" && message ? (
        <p className="contact-form-error">{message}</p>
      ) : null}
    </form>
  );
}
