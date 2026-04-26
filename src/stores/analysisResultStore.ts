"use client";

// "use client" 컴포넌트에서만 import 해야함.

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AnalysisResultData } from "@/components/result/AnalysisResult/AnalysisResult";

export type AnalysisResultPayload = AnalysisResultData & {
  platform?: string;
  reviews?: unknown;
};

interface AnalysisResultState {
  result: AnalysisResultPayload | null;
  setResult: (data: AnalysisResultPayload) => void;
  clearResult: () => void;
}

export const useAnalysisResultStore = create<AnalysisResultState>()(
  persist(
    (set) => ({
      result: null,
      setResult: (data) => set({ result: data }),
      clearResult: () => set({ result: null }),
    }),
    {
      name: "result-data",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ result: state.result }),
    },
  ),
);
