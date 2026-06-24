"use client";

import { useEffect } from "react";

interface StepperInitProps {
  // Налични за продажба бройки от печатното издание (от сървъра).
  printAvailable?: number;
  // Базов път за checkout на печатното издание, напр.
  // "/api/checkout/chudovishtoto-bez-ushi/print"
  printCheckoutBase?: string;
  // Таван за брой в една поръчка.
  maxPerOrder?: number;
}

// Attaches +/- behaviour to any [data-stepper] control rendered in the page,
// и синхронизира избрания брой с бутона за поръчка на печатното издание.
export default function StepperInit({
  printAvailable,
  printCheckoutBase,
  maxPerOrder = 10,
}: StepperInitProps = {}) {
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    const printBtn = printCheckoutBase
      ? document.querySelector<HTMLAnchorElement>('[data-checkout="print"]')
      : null;
    // Подаръчният пакет тегли от същия физически тираж като печатното
    // издание – ако пулът е изчерпан, и двата бутона трябва да го показват.
    const bundleBtn = document.querySelector<HTMLAnchorElement>(
      '[data-checkout="bundle"]'
    );
    const qtyInput =
      document.querySelector<HTMLInputElement>("#print-qty");

    // Прилагаме наличността към печатната карта.
    const effectiveMax =
      typeof printAvailable === "number"
        ? Math.min(maxPerOrder, printAvailable)
        : maxPerOrder;

    if (qtyInput) {
      qtyInput.max = String(Math.max(1, effectiveMax));
      if ((parseInt(qtyInput.value, 10) || 1) > effectiveMax) {
        qtyInput.value = String(Math.max(1, effectiveMax));
      }
    }

    const soldOut =
      typeof printAvailable === "number" && printAvailable < 1;

    const syncPrintHref = () => {
      if (!printBtn || !printCheckoutBase) return;
      const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
      printBtn.href = `${printCheckoutBase}?qty=${qty}`;
    };

    if (printBtn && soldOut) {
      printBtn.textContent = "Изчерпано";
      printBtn.setAttribute("aria-disabled", "true");
      printBtn.style.pointerEvents = "none";
      printBtn.style.opacity = "0.55";
    } else {
      syncPrintHref();
    }

    if (bundleBtn && soldOut) {
      bundleBtn.textContent = "Изчерпано";
      bundleBtn.setAttribute("aria-disabled", "true");
      bundleBtn.style.pointerEvents = "none";
      bundleBtn.style.opacity = "0.55";
    }

    const steppers =
      document.querySelectorAll<HTMLElement>("[data-stepper]");

    steppers.forEach((stepper) => {
      const input = stepper.querySelector("input");
      if (!input) return;
      const buttons = stepper.querySelectorAll<HTMLButtonElement>("button");
      buttons.forEach((btn) => {
        const handler = () => {
          const step = parseInt(btn.dataset.step || "0", 10);
          const min = parseInt(input.min, 10) || 1;
          const max = parseInt(input.max, 10) || maxPerOrder;
          const value = (parseInt(input.value, 10) || min) + step;
          input.value = String(Math.min(max, Math.max(min, value)));
          if (input.id === "print-qty" && !soldOut) syncPrintHref();
        };
        btn.addEventListener("click", handler);
        cleanups.push(() => btn.removeEventListener("click", handler));
      });

      // Ръчно въвеждане в полето също обновява бутона.
      if (input.id === "print-qty") {
        const onInput = () => {
          if (!soldOut) syncPrintHref();
        };
        input.addEventListener("input", onInput);
        cleanups.push(() => input.removeEventListener("input", onInput));
      }
    });

    return () => cleanups.forEach((fn) => fn());
  }, [printAvailable, printCheckoutBase, maxPerOrder]);

  return null;
}
