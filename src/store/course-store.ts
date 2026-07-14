import { create } from "zustand";
import type { CoursePreferenceInput } from "@/lib/schemas";

type CourseStore = {
  preferences: CoursePreferenceInput | null;
  setPreferences: (preferences: CoursePreferenceInput) => void;
};

export const useCourseStore = create<CourseStore>((set) => ({
  preferences: null,
  setPreferences: (preferences) => set({ preferences }),
}));
