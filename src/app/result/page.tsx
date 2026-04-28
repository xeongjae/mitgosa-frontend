"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AnalysisResult from "@/components/result/AnalysisResult/AnalysisResult";
import ResultSearchBar from "@/components/result/ResultSearchBar/ResultSearchBar";
import { useAnalysisResultStore } from "@/stores/analysisResultStore";
import styles from "./result.module.scss";

export default function ResultPage() {
  const router = useRouter();
  const result = useAnalysisResultStore((s) => s.result);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const unsub = useAnalysisResultStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
    if (useAnalysisResultStore.persist.hasHydrated()) {
      setHasHydrated(true);
    }
    return unsub;
  }, []);

  useEffect(() => {
    if (hasHydrated && !result) {
      router.replace("/");
    }
  }, [hasHydrated, result, router]);

  if (!hasHydrated || !result) {
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
