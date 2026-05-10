"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    fetch("/api/auth/refresh", { method: "POST", credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.accessToken && data?.email) {
          setAuth(data.accessToken, data.email);
        }
      })
      .catch(() => { });
  }, [setAuth]);

  return <>{children}</>;
}
