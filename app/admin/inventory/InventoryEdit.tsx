"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

interface InventoryEditDialogProps {
  dialogId: string;
  bookSlug: string;
  poolKey: string;
  stockLimit: number;
  adjustment: number;
  adjustmentNote: string | null;
}

function openEventName(dialogId: string) {
  return `inventory-edit-open:${dialogId}`;
}

export function openInventoryEdit(dialogId: string) {
  window.dispatchEvent(new CustomEvent(openEventName(dialogId)));
}

export function InventoryEditOpenButton({
  dialogId,
  children,
  style,
  title,
}: {
  dialogId: string;
  children: ReactNode;
  style?: CSSProperties;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={() => openInventoryEdit(dialogId)}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        font: "inherit",
        color: "inherit",
        cursor: "pointer",
        textAlign: "inherit",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function InventoryEditDialog({
  dialogId,
  bookSlug,
  poolKey,
  stockLimit,
  adjustment,
  adjustmentNote,
}: InventoryEditDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const handler = () => ref.current?.showModal();
    window.addEventListener(openEventName(dialogId), handler);
    return () => window.removeEventListener(openEventName(dialogId), handler);
  }, [dialogId]);

  const inputStyle: CSSProperties = {
    display: "block",
    width: "100%",
    marginTop: 4,
    padding: "6px 8px",
    borderRadius: 6,
    border: "1px solid #544a40",
    background: "#211c18",
    color: "#fff",
    boxSizing: "border-box",
  };

  return (
    <>
      <style>{`
        .inventory-edit-dialog::backdrop {
          background: rgba(0, 0, 0, 0.55);
        }
      `}</style>
      <dialog
        ref={ref}
        className="inventory-edit-dialog"
      style={{
        border: "1px solid #544a40",
        borderRadius: 10,
        background: "#352f2a",
        color: "#fff",
        padding: 16,
        width: "min(320px, calc(100vw - 32px))",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: "#cbbfae" }}>
          Редакция на наличност
        </span>
        <button
          type="button"
          aria-label="Затвори"
          onClick={() => ref.current?.close()}
          style={{
            background: "none",
            border: "none",
            color: "#cbbfae",
            fontSize: 22,
            lineHeight: 1,
            cursor: "pointer",
            padding: "0 4px",
          }}
        >
          ×
        </button>
      </div>

      <form
        method="POST"
        action="/api/admin/inventory"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <input type="hidden" name="book_slug" value={bookSlug} />
        <input type="hidden" name="edition" value={poolKey} />

        <label style={{ fontSize: 13, color: "#cbbfae" }}>
          Лимит
          <input
            type="number"
            name="stock_limit"
            defaultValue={stockLimit}
            min={0}
            style={inputStyle}
          />
        </label>

        <label style={{ fontSize: 13, color: "#cbbfae" }}>
          Корекция (+ или −)
          <input
            type="number"
            name="adjustment"
            defaultValue={adjustment}
            style={inputStyle}
          />
        </label>

        <label style={{ fontSize: 13, color: "#cbbfae" }}>
          Бележка (защо)
          <input
            type="text"
            name="adjustment_note"
            defaultValue={adjustmentNote ?? ""}
            placeholder="напр. 3 тестови поръчки"
            style={inputStyle}
          />
        </label>

        <button
          type="submit"
          style={{
            padding: "8px 14px",
            borderRadius: 6,
            border: "none",
            background: "#bc4e2b",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
            marginTop: 4,
          }}
        >
          Запази
        </button>
      </form>
    </dialog>
    </>
  );
}
