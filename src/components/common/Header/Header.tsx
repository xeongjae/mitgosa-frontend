"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ResultSearchBar from "@/components/result/ResultSearchBar/ResultSearchBar";
import { useAuthStore } from "@/stores/authStore";

import styles from "./Header.module.scss";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { accessToken, email, clearAuth } = useAuthStore();

  const centerContent = pathname === "/result" ? <ResultSearchBar /> : null;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });
    clearAuth();
    router.push("/");
  };

  return (
    <header className={styles.headerLayout}>
      <div
        className={`${styles.headerContainer}${centerContent ? ` ${styles.headerContainerWithCenter}` : ""}`}
      >
        <Link className={styles.logo} href="/">
          MGS
        </Link>
        {centerContent ? (
          <div className={styles.headerCenter}>{centerContent}</div>
        ) : null}
        <div className={styles.headerRight}>
          {email ? (
            <button
              className={styles.headerRightItem}
              onClick={handleLogout}
              type="button"
            >
              로그아웃
            </button>
          ) : (
            <>
              <Link className={styles.headerRightItem} href="/auth/register">
                회원가입
              </Link>
              <Link className={styles.headerRightItem} href="/auth/login">
                로그인
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
