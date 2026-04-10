"use client";

import { useState, useEffect } from "react";
import styles from "./AnalysisResult.module.scss";

interface Product {
  image: string;
  name: string;
  brand: string;
  price: string;
  url?: string;
}

interface AnalysisData {
  total_reviews: number;
  ratio: string;
  summary: string;
  pros: string[];
  cons: string[];
  size: string;
  recommendation: string;
}

interface AnalysisResultData {
  success: boolean;
  error?: string;
  message?: string;
  data: AnalysisData;
  product: Product;
}

interface Props {
  result: AnalysisResultData | null;
}

const createDonutPath = (
  percentage: number,
  startAngle: number,
  radius = 44,
  strokeWidth = 12
) => {
  const angle = (percentage / 100) * 360;
  const endAngle = startAngle + angle;
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  const inner = radius - strokeWidth;

  const x1 = 45 + radius * Math.cos(startRad);
  const y1 = 45 + radius * Math.sin(startRad);
  const x2 = 45 + radius * Math.cos(endRad);
  const y2 = 45 + radius * Math.sin(endRad);
  const x3 = 45 + inner * Math.cos(endRad);
  const y3 = 45 + inner * Math.sin(endRad);
  const x4 = 45 + inner * Math.cos(startRad);
  const y4 = 45 + inner * Math.sin(startRad);

  const largeArc = angle > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${inner} ${inner} 0 ${largeArc} 0 ${x4} ${y4} Z`;
};

export default function AnalysisResult({ result }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, [result]);

  if (!result || !result.success) {
    return (
      <div className={styles.errorSection}>
        <h2>분석 결과를 불러올 수 없습니다</h2>
        <p>{result?.error || result?.message || "분석 실패"}</p>
      </div>
    );
  }

  const { data: analysisData, product } = result;

  const ratios = analysisData.ratio.split(":").map(Number);
  const total = ratios.reduce((s, r) => s + r, 0);
  const [prosPercent, neutralPercent, consPercent] = ratios.map(
    (r) => (r / total) * 100
  );

  const animClass = visible ? styles.fadeInUp : styles.fadeOut;

  return (
    <div className={styles.analysisResultLayout}>
      <div className={`${styles.analysisResult} ${visible ? styles.scaleIn : styles.scaleOut}`}>
        <div className={styles.resultHeader}>
          <h1>{analysisData.total_reviews}개의 리뷰 AI 분석 결과입니다.</h1>
        </div>
        <div className={styles.analysisInfo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className={styles.productImage}
          />
          <div className={styles.productInfo}>
            <h3>{product.brand}</h3>
            <h2>{product.name}</h2>
            <p>{product.price}</p>
            <button
              className={styles.buyBtn}
              onClick={() => {
                if (product.url) window.open(product.url, "_blank");
                else alert("상품 구매 링크가 없습니다.");
              }}
            >
              <span className={styles.btnText}>구매하기</span>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.analysisResultContainer}>
        <div className={`${styles.analysisTop} ${animClass}`}>
          <h2>어떤 점이 좋았고, 아쉬웠을까요?</h2>
          <div className={styles.chartContainer}>
            <div className={styles.chart}>
              <svg width="90" height="90" viewBox="0 0 90 90">
                <g>
                  <path d={createDonutPath(prosPercent, -90)} fill="#5383e8" />
                  <path
                    d={createDonutPath(neutralPercent, -90 + prosPercent * 3.6)}
                    fill="#00bba3"
                  />
                  <path
                    d={createDonutPath(
                      consPercent,
                      -90 + prosPercent * 3.6 + neutralPercent * 3.6
                    )}
                    fill="#f44336"
                  />
                </g>
                <text x="45" y="45" textAnchor="middle" className={styles.chartTotalText}>
                  총 {analysisData.total_reviews}개
                </text>
                <text x="45" y="58" textAnchor="middle" className={styles.chartReviewText}>
                  리뷰
                </text>
              </svg>
              <div className={styles.chartLegend}>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendColor} ${styles.prosColor}`} />
                  <span>긍정적 리뷰 {Math.round(prosPercent)}%</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendColor} ${styles.neutralColor}`} />
                  <span>중립적 리뷰 {Math.round(neutralPercent)}%</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={`${styles.legendColor} ${styles.consColor}`} />
                  <span>부정적 리뷰 {Math.round(consPercent)}%</span>
                </div>
              </div>
            </div>
            <div className={styles.summaryContent}>
              <h3>[ 전반적인 평가 ]</h3>
              <p>{analysisData.summary}</p>
            </div>
          </div>
        </div>

        <div className={`${styles.analysisMid} ${animClass}`}>
          <div className={styles.prosConsSection}>
            <div className={styles.prosSection}>
              <ul>
                {analysisData.pros.map((pro, i) => (
                  <li
                    key={`pro-${i}`}
                    className={styles.contentBox}
                    style={{ backgroundColor: `rgba(40, 52, 78, ${1 - i * 0.15})` }}
                  >
                    {i + 1}. {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.consSection}>
              <ul>
                {analysisData.cons.length > 0 ? (
                  analysisData.cons.map((con, i) => (
                    <li
                      key={`con-${i}`}
                      className={styles.contentBox}
                      style={{ backgroundColor: `rgba(89, 52, 59, ${1 - i * 0.15})` }}
                    >
                      {i + 1}. {con}
                    </li>
                  ))
                ) : (
                  <li>특별한 단점이 언급되지 않았습니다.</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className={`${styles.analysisBottom} ${animClass}`}>
          <h2>구매자들이 느낀 사이즈 체감입니다.</h2>
          <div className={styles.recommendationContent}>
            <p>{analysisData.size}</p>
          </div>
        </div>

        <div className={`${styles.analysisBottom} ${animClass}`}>
          <h2>이런 분이라면 만족하실 거예요!</h2>
          <div className={styles.recommendationContent}>
            <p>{analysisData.recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
