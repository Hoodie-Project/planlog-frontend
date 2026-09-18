import { create } from "zustand";

type RecordsPreviewState = {
  hasRecords: boolean;
  setHasRecords: (hasRecords: boolean) => void;
};

/** API 연결 전 피그마의 두 화면을 전환하기 위한 임시 상태입니다. */
export const useRecordsPreviewStore = create<RecordsPreviewState>((set) => ({
  hasRecords: false,
  setHasRecords: (hasRecords) => set({ hasRecords }),
}));
