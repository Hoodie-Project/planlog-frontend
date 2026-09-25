import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CoursePreferenceDraft } from "@/lib/schemas";
import type { CourseDto } from "@/types/course";

export type SavedCourseStatus = "WAITING" | "IN_PROGRESS" | "COMPLETED";

export type SavedCourse = {
  id: string;
  title: string;
  date: string;
  spotCount: number;
  status: SavedCourseStatus;
  zone: CourseDto["zone"];
  review?: string;
};

type CourseStore = {
  preferences: CoursePreferenceDraft;
  generatedCourse: CourseDto | null;
  activeSavedCourseId: string | null;
  savedCourses: SavedCourse[];
  updatePreferences: (payload: Partial<CoursePreferenceDraft>) => void;
  setGeneratedCourse: (course: CourseDto | null) => void;
  setActiveSavedCourseId: (id: string | null) => void;
  saveGeneratedCourse: () => string | null;
  startCourse: (courseId: string) => void;
  completeCourse: (courseId: string, review: string) => void;
  resetPreferences: () => void;
};

const defaultPreferences: CoursePreferenceDraft = {
  mood: "",
  tripStyle: "",
  arrivalDate: "",
  arrivalTime: "",
  nights: 0,
  transportMode: "",
  originLabel: "",
};

const initialSavedCourses: SavedCourse[] = [
  { id: "waiting-retro-wonju", title: "레트로 원주 코스", date: "2026.09.04", spotCount: 6, status: "WAITING", zone: "RETRO" },
  { id: "active-valley-chuncheon", title: "자연 춘천 코스", date: "2026.10.20", spotCount: 4, status: "IN_PROGRESS", zone: "VALLEY" },
  { id: "completed-snow-pyeongchang", title: "설원 평창 코스", date: "2026.11.29", spotCount: 5, status: "COMPLETED", zone: "SNOW", review: "설경과 동선이 잘 어우러진 여행이었어요." },
];

export const useCourseStore = create<CourseStore>()(
  persist(
    (set, get) => ({
      preferences: defaultPreferences,
      generatedCourse: null,
      activeSavedCourseId: null,
      savedCourses: initialSavedCourses,
      updatePreferences: (payload) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            nights: state.preferences.nights ?? 0,
            ...payload,
          },
        })),
      setGeneratedCourse: (generatedCourse) => set({ generatedCourse, activeSavedCourseId: null }),
      setActiveSavedCourseId: (activeSavedCourseId) => set({ activeSavedCourseId }),
      saveGeneratedCourse: () => {
        const { generatedCourse, preferences, savedCourses } = get();

        if (!generatedCourse) {
          return null;
        }

        const id = `generated-${generatedCourse.zone}-${generatedCourse.summary}`;
        const existing = savedCourses.find((course) => course.id === id);

        if (existing) {
          return existing.id;
        }

        set({
          savedCourses: [
            {
              id,
              title: `${generatedCourse.zoneLabel} 하루 코스`,
              date: preferences.arrivalDate || "여행 날짜 미정",
              spotCount: generatedCourse.days[0]?.items.length ?? 0,
              status: "WAITING",
              zone: generatedCourse.zone,
            },
            ...savedCourses,
          ],
        });

        return id;
      },
      startCourse: (courseId) =>
        set((state) => ({
          savedCourses: state.savedCourses.map((course) => (course.id === courseId && course.status === "WAITING" ? { ...course, status: "IN_PROGRESS" } : course)),
        })),
      completeCourse: (courseId, review) =>
        set((state) => ({
          savedCourses: state.savedCourses.map((course) => (course.id === courseId && course.status === "IN_PROGRESS" ? { ...course, status: "COMPLETED", review } : course)),
        })),
      resetPreferences: () => set({ preferences: defaultPreferences }),
    }),
    {
      name: "planlog-course-create",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        preferences: state.preferences,
        generatedCourse: state.generatedCourse,
        activeSavedCourseId: state.activeSavedCourseId,
        savedCourses: state.savedCourses,
      }),
    }
  )
);
