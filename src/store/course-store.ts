import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CoursePreferenceDraft } from "@/lib/schemas";
import type { CourseDto } from "@/types/course";

type CourseStore = {
  preferences: CoursePreferenceDraft;
  generatedCourse: CourseDto | null;
  updatePreferences: (payload: Partial<CoursePreferenceDraft>) => void;
  setGeneratedCourse: (course: CourseDto | null) => void;
  resetPreferences: () => void;
};

const defaultPreferences: CoursePreferenceDraft = {
  mood: "",
  tripStyle: "",
  arrivalDate: "",
  arrivalTime: "",
  transportMode: "",
  originLabel: "",
};

export const useCourseStore = create<CourseStore>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,
      generatedCourse: null,
      updatePreferences: (payload) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...payload,
          },
        })),
      setGeneratedCourse: (generatedCourse) => set({ generatedCourse }),
      resetPreferences: () => set({ preferences: defaultPreferences, generatedCourse: null }),
    }),
    {
      name: "planlog-course-create",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        preferences: state.preferences,
        generatedCourse: state.generatedCourse,
      }),
    }
  )
);
