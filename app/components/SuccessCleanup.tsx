"use client";

import { useEffect } from "react";

// Маха session_id от адреса, за да не остава в историята на браузъра и да
// не се споделя заедно с линка на страницата.
export default function SuccessCleanup() {
  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has("session_id")) return;
    url.searchParams.delete("session_id");
    window.history.replaceState(window.history.state, "", url.pathname + url.search);
  }, []);
  return null;
}
