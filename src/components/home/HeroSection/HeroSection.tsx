"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import styles from "./HeroSection.module.scss";
import { useFormLoading } from "@/hooks/useFormLoading";

import desktopLogo from "@/images/static/mainlogo.png";
import mobileLogo from "@/images/static/mobilemain.png";

const PLATFORMS = [
  { value: "musinsa", label: "무신사", supported: true },
  { value: "29cm", label: "29CM", supported: false },
  { value: "ably", label: "에이블리", supported: false },
  { value: "zigzag", label: "지그재그", supported: false },
  { value: "wconcept", label: "W컨셉", supported: false },
];

export default function HeroSection() {
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState("musinsa");
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const platformButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // 로딩 막대 (useFormLoading)
  const formLoading = useFormLoading(formRef, styles.loading);

  const router = useRouter();

  // 플랫폼 버튼 관련 로직
  const selectedPlatform = PLATFORMS.find((p) => p.value === platform);

  const handlePlatformButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPlatformModal(!showPlatformModal);
  };

  const handlePlatformSelect = (platformValue: string, isSupported: boolean) => {
    if (!isSupported) return;
    setPlatform(platformValue);
    setShowPlatformModal(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node)
      ) {
        const trigger = platformButtonRef.current;
        if (trigger && !trigger.contains(e.target as Node)) {
          setShowPlatformModal(false);
        }
      }
    };

    if (showPlatformModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPlatformModal]);

  // 제출 관련 로직
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!url.trim()) {
      setError("URL을 입력해주세요.");
      return;
    }

    setError(null);
    formLoading.start();

    let hasError = false;

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem("analysisData", JSON.stringify(data));
        formLoading.finishSuccess(() => router.push("/result"));
      } else {
        hasError = true;
        setError(
          (data as { error?: string }).error ?? "분석 중 오류가 발생했습니다."
        );
      }
    } catch {
      hasError = true;
      setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      if (hasError) {
        formLoading.resetAfterError();
      }
    }
  };

  useEffect(() => {
    if (!error) return;
    const id = window.setTimeout(() => setError(null), 3000);
    return () => window.clearTimeout(id);
  }, [error]);

  return (
    <section className={styles.section}>
      <Image
        src={desktopLogo}
        alt="MITGOSA"
        className={`${styles.logo} ${styles.logoDesktop}`}
        priority
      />
      <Image
        src={mobileLogo}
        alt="MITGOSA"
        className={`${styles.logo} ${styles.logoMobile}`}
        priority
      />
      <div className={styles.shell}>
        <form
          className={styles.form}
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <div className={styles.picker}>
            <div className={styles.row}>
              <div>
                <button
                  ref={platformButtonRef}
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={showPlatformModal}
                  className={`${styles.trigger} ${showPlatformModal ? styles.open : ""}`}
                  onClick={handlePlatformButtonClick}
                >
                  <span>platform</span>
                  <span>{selectedPlatform ? selectedPlatform.label : "선택"}</span>
                </button>
                <input type="hidden" value={platform} name="platform" />
              </div>
            </div>
          </div>

          <div className={styles.field}>
            <span className={styles.tag}>search</span>
            <input
              id="productUrl"
              autoComplete="off"
              className={styles.input}
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="상품 링크를 입력해주세요"
              name="productUrl"
              ref={inputRef}
            />
          </div>

          <button
            type="submit"
            className={styles.submit}
            aria-label="상품 검색"
          >
            <span className={styles.go}>.GO</span>
          </button>
        </form>

        {showPlatformModal && (
          <div className={styles.modal} ref={modalRef}>
            <div className={styles.modalIn}>
              <div className={styles.options}>
                {PLATFORMS.map((p) => (
                  <div
                    key={p.value}
                    className={`${styles.option} ${!p.supported ? styles.notSupported : ""}`}
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

      <div className={styles.messages}>
        {formLoading.loading && (
          <div className={styles.pending}>
            {formLoading.progress < 100 ? (
              <>
                전체 리뷰 분석 중입니다
                <span className={styles.pct}>{formLoading.progress}%</span>
              </>
            ) : (
              "잠시만 기다려주세요"
            )}
          </div>
        )}
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </section>
  );
}
