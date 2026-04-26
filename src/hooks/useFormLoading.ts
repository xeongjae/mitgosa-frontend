// This file was written with AI assistance.

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

const FILL_MS = 15_000;

function runFillRaf(
  formRef: RefObject<HTMLFormElement | null>,
  setPct: (n: number) => void,
  durationMs: number
) {
  const t0 = Date.now();
  let raf = 0;

  function tick() {
    const p = Math.min(100, ((Date.now() - t0) / durationMs) * 100);
    formRef.current?.style.setProperty("--loadingProgress", `${p}%`);
    setPct(Math.round(p));
    if (p < 100) raf = requestAnimationFrame(tick);
  }

  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

export function useFormLoading(
  formRef: RefObject<HTMLFormElement | null>,
  loadingClassName: string
) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const cleanupRef = useRef<(() => void) | null>(null);

  const stopFill = useCallback(() => {
    cleanupRef.current?.();
    cleanupRef.current = null;
  }, []);

  const start = useCallback(() => {
    stopFill();
    setLoading(true);
    setProgress(0);
    const el = formRef.current;
    if (!el) return;
    el.style.setProperty("--loadingProgress", "0%");
    el.classList.add(loadingClassName);
    window.setTimeout(() => {
      cleanupRef.current = runFillRaf(formRef, setProgress, FILL_MS);
    }, 50);
  }, [formRef, loadingClassName, stopFill]);

  const finishSuccess = useCallback(
    (then: () => void) => {
      stopFill();
      const el = formRef.current;
      if (el) {
        el.style.setProperty("--loadingProgress", "100%");
        setProgress(100);
        window.setTimeout(() => {
          el.classList.remove(loadingClassName);
          el.style.removeProperty("--loadingProgress");
          then();
        }, 600);
      } else {
        then();
      }
    },
    [formRef, loadingClassName, stopFill]
  );

  const resetAfterError = useCallback(() => {
    stopFill();
    formRef.current?.classList.remove(loadingClassName);
    formRef.current?.style.removeProperty("--loadingProgress");
    setProgress(0);
    setLoading(false);
  }, [formRef, loadingClassName, stopFill]);

  useEffect(() => () => stopFill(), [stopFill]);

  return {
    loading,
    progress,
    start,
    stopFill,
    finishSuccess,
    resetAfterError,
  };
}
