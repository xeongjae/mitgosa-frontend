"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import styles from "./RecentAnalyses.module.scss";
import {
  useAnalysisResultStore,
  type AnalysisResultPayload,
} from "@/stores/analysisResultStore";

// 카드 1개 너비 .card width와 동기화
const CARD_WIDTH = 147;
// 카드 사이 gap .track gap과 동기화
const CARD_GAP = 1;
// 슬라이드 속도 (px/s)
const SPEED = 15;

type RecentAnalysisItem = {
  id: string;
  sourceUrl: string;
  createdAt: string;
  payload: unknown;
};

type RecentAnalysesResponse = {
  items: RecentAnalysisItem[];
  error?: string;
};

function getProductImage(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const maybe = payload as { product?: unknown };
  if (!maybe.product || typeof maybe.product !== "object") return "";
  const p = maybe.product as { image?: string };
  return p.image ?? "";
}

export default function RecentAnalyses() {
  const router = useRouter();
  const [items, setItems] = useState<RecentAnalysisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const renderedItems = useMemo(() => [...items, ...items], [items]);

  // 아래줄은 순서를 뒤집어서 반대 방향으로 슬라이드
  const reversedItems = useMemo(
    () => [...renderedItems].reverse(),
    [renderedItems],
  );

  // CSS animation duration 계산 (카드 N개 * 한 칸 너비 / 속도)
  const duration = useMemo(() => {
    const halfWidth = items.length * (CARD_WIDTH + CARD_GAP);
    return Math.round(halfWidth / SPEED);
  }, [items.length]);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const response = await fetch("/api/recent-analyses?limit=20");
        const data = (await response.json()) as RecentAnalysesResponse;

        if (!response.ok) {
          throw new Error(data?.error ?? "최근 분석 목록을 불러올 수 없습니다.");
        }

        if (!cancelled) {
          setItems(Array.isArray(data.items) ? data.items : []);
        }
      } catch (e) {
        if (!cancelled) {
          setItems([]);
          setError(e instanceof Error ? e.message : "최근 분석 목록 로딩 실패");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();

    return () => { cancelled = true; };
  }, []);

  // 7개 미만이면 렌더링하지 않음
  if (!loading && items.length < 7) return null;

  // 스켈레톤 UI
  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.viewport}>
          {[0, 1].map((rowIdx) => (
            <div key={rowIdx} className={styles.skeletonTrack}>
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className={styles.skeletonCard} />
              ))}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.viewport}>
        {[renderedItems, reversedItems].map((row, rowIdx) => (
          <ol
            key={rowIdx}
            className={`${styles.track} ${rowIdx === 1 ? styles.reverse : ""}`}
            style={{ "--dur": `${duration}s` } as React.CSSProperties}
          >
            {row.map((item, idx) => (
              <li key={`${rowIdx}-${item.id}-${idx}`} className={styles.card}>
                <button
                  type="button"
                  className={styles.cardButton}
                  onClick={() => {
                    useAnalysisResultStore
                      .getState()
                      .setResult(item.payload as AnalysisResultPayload);
                    router.push("/result");
                  }}
                >
                  <div className={styles.thumbWrapper}>
                    <Image
                      src={getProductImage(item.payload)}
                      alt=""
                      fill
                      className={styles.thumbImg}
                      sizes="147px"
                    />
                  </div>
                </button>
              </li>
            ))}
          </ol>
        ))}
      </div>
    </section>
  );
}
