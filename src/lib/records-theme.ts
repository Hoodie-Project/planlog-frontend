export const RECORD_TAG_THEME = {
  바다: {
    chipBackgroundClassName: "bg-[#E8ECFF]",
    chipTextClassName: "text-[#454545]",
  },
  산악: {
    chipBackgroundClassName: "bg-[#EFDFF7]",
    chipTextClassName: "text-[#454545]",
  },
  자연: {
    chipBackgroundClassName: "bg-[#D6F3D2]",
    chipTextClassName: "text-[#454545]",
  },
  문화: {
    chipBackgroundClassName: "bg-[#FFEBD7]",
    chipTextClassName: "text-[#454545]",
  },
  포토: {
    chipBackgroundClassName: "bg-[#FFD9D9]",
    chipTextClassName: "text-[#454545]",
  },
} as const;

export const TRAVEL_PROFILE_THEME = {
  "동해 바다": {
    progressClassName: "bg-[#5874FF]",
    textClassName: "text-[#5874FF]",
    iconFilter: "invert(46%) sepia(72%) saturate(2594%) hue-rotate(211deg) brightness(103%) contrast(101%)",
  },
  "설원·산악": {
    progressClassName: "bg-[#C548FF]",
    textClassName: "text-[#C548FF]",
    iconFilter: "invert(42%) sepia(95%) saturate(2128%) hue-rotate(250deg) brightness(103%) contrast(102%)",
  },
  "계곡·자연": {
    progressClassName: "bg-[#58CF48]",
    textClassName: "text-[#58CF48]",
    iconFilter: "invert(61%) sepia(64%) saturate(960%) hue-rotate(64deg) brightness(95%) contrast(94%)",
  },
  "레트로·문화": {
    progressClassName: "bg-[#FFA448]",
    textClassName: "text-[#FFA448]",
    iconFilter: "invert(72%) sepia(90%) saturate(1366%) hue-rotate(326deg) brightness(104%) contrast(101%)",
  },
  "절경·포토": {
    progressClassName: "bg-[#FF5858]",
    textClassName: "text-[#FF5858]",
    iconFilter: "invert(57%) sepia(78%) saturate(3373%) hue-rotate(328deg) brightness(102%) contrast(104%)",
  },
} as const;

export type RecordTagKey = keyof typeof RECORD_TAG_THEME;
export type TravelProfileKey = keyof typeof TRAVEL_PROFILE_THEME;

export type TravelProfileMetric = {
  label: TravelProfileKey;
  percent: number;
};

export function getRecordTagTheme(key: RecordTagKey) {
  return RECORD_TAG_THEME[key];
}

export function getTravelProfileTheme(key: TravelProfileKey) {
  return TRAVEL_PROFILE_THEME[key];
}

export function getDominantTravelProfile(metrics: TravelProfileMetric[]) {
  return metrics.reduce((highest, current) => {
    if (!highest || current.percent > highest.percent) {
      return current;
    }

    return highest;
  }, null as TravelProfileMetric | null);
}
