"use client";

import { useEffect } from "react";

// Attaches +/- behaviour to any [data-stepper] control rendered in the page.
// Mirrors the original inline script from the static offer page.
export default function StepperInit() {
  useEffect(() => {
    const steppers =
      document.querySelectorAll<HTMLElement>("[data-stepper]");
    const cleanups: Array<() => void> = [];

    steppers.forEach((stepper) => {
      const input = stepper.querySelector("input");
      if (!input) return;
      const buttons = stepper.querySelectorAll<HTMLButtonElement>("button");
      buttons.forEach((btn) => {
        const handler = () => {
          const step = parseInt(btn.dataset.step || "0", 10);
          const min = parseInt(input.min, 10) || 1;
          const max = parseInt(input.max, 10) || 10;
          const value = (parseInt(input.value, 10) || min) + step;
          input.value = String(Math.min(max, Math.max(min, value)));
        };
        btn.addEventListener("click", handler);
        cleanups.push(() => btn.removeEventListener("click", handler));
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
