"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import styles from "./Header.module.scss";

const PORTFOLIO_URL = "https://seongjae-portfolio.netlify.app/";
const FEEDBACK_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdRTOL98fGuEgfmmCPufO3U7GTrDn60__gyAcUbQoNoGa_LIA/viewform?usp=dialog";

type HeaderProps = {
  centerContent?: ReactNode | null;
};

export default function Header({ centerContent = null }: HeaderProps) {
  const handleShareLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        alert("링크가 복사되었습니다.");
      })
      .catch(() => {
        alert("링크 복사에 실패했습니다. 다시 시도해주세요.");
      });
  };

  return (
    <header className={styles.headerLayout}>
      <div
        className={`${styles.headerContainer}${centerContent ? ` ${styles.headerContainerWithCenter}` : ""}`}
      >
        <Link className={styles.logo} href="/">
          MITGOSA
        </Link>
        {centerContent ? (
          <div className={styles.headerCenter}>{centerContent}</div>
        ) : null}
        <div className={styles.headerRight}>
          <button
            className={styles.headerRightItem}
            onClick={handleShareLink}
            type="button"
          >
            링크복사
          </button>
          <Link
            className={styles.headerRightItem}
            href={PORTFOLIO_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            포트폴리오
          </Link>
          <Link
            className={styles.headerRightItem}
            href={FEEDBACK_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            피드백
          </Link>
        </div>
      </div>
    </header>
  );
}
