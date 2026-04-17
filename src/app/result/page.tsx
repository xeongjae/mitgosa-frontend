"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AnalysisResult, { AnalysisResultData } from "@/components/result/AnalysisResult/AnalysisResult";
import ResultSearchBar from "@/components/result/ResultSearchBar/ResultSearchBar";
import styles from "./result.module.scss";

export default function ResultPage() {
  const router = useRouter();

  const [result] = useState<AnalysisResultData | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem("analysisData");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!result) {
      router.replace("/");
    }
  }, [result, router]);

  if (!result) {
    return (
      <div className={styles.summaryContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSection}>
            <h1>AI가 리뷰를 분석 중입니다...</h1>
            <div className={styles.loadingSpinner} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.summaryContainer}>
      <div className={styles.resultMobileSearchBar}>
        <ResultSearchBar />
      </div>
      <AnalysisResult result={result} />
    </div>
  );
}
