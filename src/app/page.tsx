import HeroSection from "@/components/home/HeroSection/HeroSection";
import HowToUse from "@/components/home/HowToUse/HowToUse";
import Showcase from "@/components/home/Showcase/Showcase";

import styles from "./page.module.scss";

export const metadata = {
  title: "믿고사 — AI 리뷰 분석",
  description: "상품 URL을 넣으면 AI가 리뷰를 분석해드립니다.",
};

export default function Home() {
  return (
    <main className={styles.main}>
      <HeroSection />
      <HowToUse />
      <Showcase />
    </main>
  );
}