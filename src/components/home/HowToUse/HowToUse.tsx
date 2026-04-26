import Image, { type StaticImageData } from "next/image";

import styles from "./HowToUse.module.scss";

import step1 from "@/images/static/step1.png";
import step2 from "@/images/static/step2.png";
import step3 from "@/images/static/step3.png";
import step4 from "@/images/static/step4.png";

interface Step {
  number: number;
  image: StaticImageData;
  alt: string;
  description: string;
}

const HOW_TO_USE_STEPS: Step[] = [
  {
    number: 1,
    image: step1,
    alt: "플랫폼 선택",
    description: "MITGOSA 지원 플랫폼 중에서\n현재 이용중인 플랫폼을 선택합니다.",
  },
  {
    number: 2,
    image: step2,
    alt: "URL 입력",
    description: "상품 상세 페이지 URL을 복사하여\nMITGOSA 검색창에 붙여넣습니다.",
  },
  {
    number: 3,
    image: step3,
    alt: "AI 분석",
    description: "GO 버튼을 클릭하면 분석을 시작합니다.\n개수에 따라 시간이 달라질 수 있습니다.",
  },
  {
    number: 4,
    image: step4,
    alt: "결과 확인",
    description: "전체 리뷰에 기반한 AI 분석 결과를\n한눈에 정리하여 제공합니다.",
  },
];

export default function HowToUse() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>사용법</h2>
      <div className={styles.steps}>
        {HOW_TO_USE_STEPS.map((step) => (
          <div key={step.number} className={styles.step}>
            <span className={styles.number}>{step.number}</span>
            <div className={styles.content}>
              <Image
                src={step.image}
                alt={step.alt}
                className={styles.image}
              />
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
