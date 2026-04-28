import HeroSection from "@/components/home/HeroSection/HeroSection";
import HowToUse from "@/components/home/HowToUse/HowToUse";
import RecentAnalyses from "@/components/home/RecentAnalyses/RecentAnalyses";
import Showcase from "@/components/home/Showcase/Showcase";

import styles from "./page.module.scss";

export const metadata = {
  title: "믿고사 - AI 리뷰 분석 서비스",
};

export default function Home() {
  return (
    <main className={styles.layout}>
      <HeroSection />
      <RecentAnalyses />
      <HowToUse />
      <Showcase />
    </main>
  );
}