"use client";

import Link from "next/link";

import styles from "./Footer.module.scss";

const PORTFOLIO_URL = "https://seongjae-portfolio.netlify.app/";
const FEEDBACK_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdRTOL98fGuEgfmmCPufO3U7GTrDn60__gyAcUbQoNoGa_LIA/viewform?usp=dialog";

function Footer() {
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
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.companyInfo}>
          <p>
            믿고사 (MITGOSA) | 본 사이트는 상업적 목적이 아닌 학습을 위해
            제작되었습니다.
          </p>
          <p>전화: 010-6207-0840 | 이메일: newsungjae0407@gmail.com</p>
          <p>© 2025 Kim Sungjae. All rights reserved.</p>
        </div>

        <div className={styles.quickLinks}>
          <button
            className={styles.quickLink}
            onClick={handleShareLink}
            type="button"
          >
            링크공유
          </button>
          <Link
            className={styles.quickLink}
            href={PORTFOLIO_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            포트폴리오
          </Link>
          <Link
            className={styles.quickLink}
            href={FEEDBACK_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            피드백
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
