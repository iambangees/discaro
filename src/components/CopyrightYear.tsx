"use client";

import { useEffect, useRef } from "react";

/*
  Next 16 treats new Date() during prerendering as an unstable value, so the
  year renders as a stable constant and is corrected in place, once, after
  hydration — no state, no re-render.
*/
export default function CopyrightYear() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = String(new Date().getFullYear());
    }
  }, []);
  return <span ref={ref}>2026</span>;
}
