"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./ResultSearchBar.module.scss";
import {
  useAnalysisResultStore,
  type AnalysisResultPayload,
} from "@/stores/analysisResultStore";

const platforms = [
  { value: "musinsa", label: "무신사", supported: true },
  { value: "29cm", label: "29CM", supported: false },
  { value: "ably", label: "에이블리", supported: false },
  { value: "zigzag", label: "지그재그", supported: false },
  { value: "wconcept", label: "W컨셉", supported: false },
];

export default function ResultSearchBar() {
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState("musinsa");
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const loadingCleanupRef = useRef<(() => void) | null>(null);
  const router = useRouter();

  const selectedPlatform = platforms.find((p) => p.value === platform);

  const createLoadingBar = (duration = 10000) => {
    const form = formRef.current;
    if (!form) return () => { };
    const startTime = Date.now();
    let animationId: number;

    function update() {
      const progress = Math.min(((Date.now() - startTime) / duration) * 100, 100);
      form!.style.setProperty("--loadingProgress", `${progress}%`);
      if (progress < 100) animationId = requestAnimationFrame(update);
    }

    animationId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationId);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setShowPlatformModal(false);
      }
    };

    if (showPlatformModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPlatformModal]);

  useEffect(() => {
    return () => {
      loadingCleanupRef.current?.();
    };
  }, []);

  const handlePlatformSelect = (value: string, supported: boolean) => {
    if (!supported) return;
    setPlatform(value);
    setShowPlatformModal(false);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url.trim()) return;

    const form = formRef.current;
    if (form) {
      form.style.setProperty("--loadingProgress", "0%");
      form.classList.add(styles.loading);
      setTimeout(() => {
        loadingCleanupRef.current = createLoadingBar(5000);
      }, 50);
    }

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      if (response.ok) {
        loadingCleanupRef.current?.();
        loadingCleanupRef.current = null;

        if (typeof data === "object" && data !== null) {
          useAnalysisResultStore
            .getState()
            .setResult(data as AnalysisResultPayload);
        }
        if (form) {
          form.style.setProperty("--loadingProgress", "100%");
          setTimeout(() => {
            form.classList.remove(styles.loading);
            form.style.removeProperty("--loadingProgress");
            router.push("/result");
          }, 600);
        } else {
          router.push("/result");
        }
      }
    } catch (error) {
      console.error("분석 요청 에러:", error);
    } finally {
      loadingCleanupRef.current?.();
      loadingCleanupRef.current = null;
      if (formRef.current) {
        formRef.current.classList.remove(styles.loading);
        formRef.current.style.removeProperty("--loadingProgress");
      }
    }
  };

  return (
    <div className={styles.resultPageSearchFormContainer}>
      <form ref={formRef} className={styles.searchForm} onSubmit={handleSubmit}>
        <div className={styles.regionSelector}>
          <div className={styles.regionInner}>
            <div>
              <button
                ref={buttonRef}
                type="button"
                className={`${styles.platformButton} ${showPlatformModal ? styles.open : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPlatformModal((prev) => !prev);
                }}
              >
                <span>{selectedPlatform?.label ?? "선택"}</span>
              </button>
              <input type="hidden" value={platform} name="platform" />
            </div>
          </div>
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="resultProductUrl" className={styles.srOnly}>
            상품 URL 검색
          </label>
          <input
            id="resultProductUrl"
            autoComplete="off"
            className={styles.urlInput}
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="상품 링크를 입력해주세요"
            name="productUrl"
          />
        </div>

        <button type="submit" className={styles.submitButton} aria-label="상품 검색">
          <span className={styles.goText}>.GO</span>
        </button>
      </form>

      {showPlatformModal && (
        <div className={styles.platformModal} ref={modalRef}>
          <div className={styles.platformModalContent}>
            <div className={styles.platformList}>
              {platforms.map((p) => (
                <div
                  key={p.value}
                  className={`${styles.platformItem} ${p.supported ? "" : styles.unsupported}`}
                  onClick={() => handlePlatformSelect(p.value, p.supported)}
                >
                  <span>{p.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
