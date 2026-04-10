import type { ReactNode } from "react";
import Image, { type StaticImageData } from "next/image";

import step1 from "@/images/static/step1.png";
import step2 from "@/images/static/step2.png";
import step3 from "@/images/static/step3.png";
import step4 from "@/images/static/step4.png";

import styles from "./HowToUse.module.scss";

const STEPS: {
  number: number;
  image: StaticImageData;
  alt: string;
  description: ReactNode;
}[] = [
    {
      number: 1,
      image: step1,
      alt: "플랫폼 선택",
      description: (
        <>
          MITGOSA 지원 플랫폼 중에서
          <br />
          현재 사용중인 플랫폼을 선택합니다.
        </>
      ),
    },
    {
      number: 2,
      image: step2,
      alt: "URL 입력",
      description: (
        <>
          플랫폼 상품 페이지 URL을 복사하여
          <br />
          MITGOSA 검색창에 붙여넣습니다.
        </>
      ),
    },
    {
      number: 3,
      image: step3,
      alt: "AI 분석",
      description: (
        <>
          버튼을 누르면 AI가 리뷰를 분석합니다.
          <br />
          리뷰 수에 따라 시간이 달라질 수 있습니다.
        </>
      ),
    },
    {
      number: 4,
      image: step4,
      alt: "결과 확인",
      description: (
        <>
          구매자의 전반적인 평가와 장단점을
          <br />
          한눈에 정리하여 보여줍니다.
        </>
      ),
    },
  ];

export default function HowToUse() {
  return (
    <section
      className={styles.howToUseSection}
      aria-labelledby="how-to-use-heading"
    >
      <h2 id="how-to-use-heading" className={styles.howToUseTitle}>
        사용법
      </h2>
      <div className={styles.howToUseGrid}>
        {STEPS.map((step) => (
          <div key={step.number} className={styles.howToUseGridItem}>
            <span className={styles.howToUseGridItemNumber}>{step.number}</span>
            <div className={styles.howToUseGridItemContent}>
              <Image
                src={step.image}
                alt={step.alt}
                className={styles.howToUseImage}
                sizes="(max-width: 768px) 50vw, 260px"
              />
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
