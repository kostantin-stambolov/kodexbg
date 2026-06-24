import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin вход",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#211c18",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <form
        method="POST"
        action="/api/admin/login"
        style={{
          background: "#2b2521",
          padding: 32,
          borderRadius: 12,
          width: 320,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <h1 style={{ color: "#fff", fontSize: 20, margin: 0 }}>Admin вход</h1>
        {error && (
          <p style={{ color: "#e08585", fontSize: 14, margin: 0 }}>
            Грешна парола.
          </p>
        )}
        <input
          type="password"
          name="password"
          placeholder="Парола"
          autoFocus
          required
          style={{
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #544a40",
            background: "#211c18",
            color: "#fff",
            fontSize: 15,
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 12px",
            borderRadius: 8,
            border: "none",
            background: "#bc4e2b",
            color: "#fff",
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Вход
        </button>
      </form>
    </div>
  );
}
