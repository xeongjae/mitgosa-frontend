"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import styles from "./HeroSection.module.scss";

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
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const modalRef = useRef<HTMLDivElement>(null);
  const platformButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const loadingCleanupRef = useRef<(() => void) | null>(null);

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
  //////////////////////////////////////////////////////////////

  // 제출 관련 로직
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      setError("URL을 입력해주세요.");
      return;
    }

    setLoading(true);
    setLoadingProgress(0);
    setError(null);

    let hasError = false;

    if (formRef.current) {
      formRef.current.style.setProperty("--loading-progress", "0%");
      formRef.current.classList.add(styles.loading);

      setTimeout(() => {
        const cleanup = createLoadingBar(15000);
        loadingCleanupRef.current = cleanup;
      }, 50);
    }

    try {
      const endpoint = "/api/analyze";

      const response = await fetch(
        endpoint,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        }
      );

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      if (response.ok) {
        loadingCleanupRef.current?.();
        loadingCleanupRef.current = null;

        if (formRef.current) {
          formRef.current.style.setProperty("--loading-progress", "100%");
          setLoadingProgress(100);

          setTimeout(() => {
            formRef.current?.classList.remove(styles.loading);
            formRef.current?.style.removeProperty("--loading-progress");
            sessionStorage.setItem("analysisData", JSON.stringify(data));
            router.push("/result");
          }, 600);
        } else {
          sessionStorage.setItem("analysisData", JSON.stringify(data));
          router.push("/result");
        }
      } else {
        hasError = true;
        if (typeof data === "string") {
          setError("분석 중 오류가 발생했습니다.");
        } else {
          setError(data.error || "분석 중 오류가 발생했습니다.");
        }
      }
    } catch (err) {
      console.error("분석 요청 에러:", err);
      hasError = true;
      setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      if (loadingCleanupRef.current) {
        loadingCleanupRef.current();
        loadingCleanupRef.current = null;
      }

      if (hasError) {
        formRef.current?.classList.remove(styles.loading);
        formRef.current?.style.removeProperty("--loading-progress");
        setLoading(false);
        setLoadingProgress(0);
      }
    }
  };
  //////////////////////////////////////////////////////////////

  // 로딩 바 관련 로직
  const createLoadingBar = (duration = 10000) => {
    const startTime = Date.now();
    let animationId: number;

    function updateLoadingBar() {
      const timePassed = Date.now() - startTime;
      const progress = Math.min((timePassed / duration) * 100, 100);

      formRef.current?.style.setProperty("--loading-progress", `${progress}%`);
      setLoadingProgress(Math.round(progress));

      if (progress < 100) {
        animationId = requestAnimationFrame(updateLoadingBar);
      }
    }

    animationId = requestAnimationFrame(updateLoadingBar);
    return () => cancelAnimationFrame(animationId);
  };

  useEffect(() => {
    return () => {
      loadingCleanupRef.current?.();
    };
  }, []);
  //////////////////////////////////////////////////////////////

  // 에러 3초 후 제거
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
        {loading && (
          <div className={styles.pending}>
            {loadingProgress < 100 ? (
              <>
                전체 리뷰 분석 중입니다
                <span className={styles.pct}>{loadingProgress}%</span>
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
