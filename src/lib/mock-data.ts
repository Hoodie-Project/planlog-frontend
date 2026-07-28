export const festivalCards = [
  {
    title: "강릉 단오제",
    location: "강릉",
    period: "06.14 - 06.21",
    badge: "전통문화",
    image: "https://www.figma.com/api/mcp/asset/e7cd4169-de8b-401e-a684-db56c477b2bf",
  },
  {
    title: "속초 해양 페스티벌",
    location: "속초",
    period: "06.15 - 06.22",
    badge: "바다",
    image: "https://www.figma.com/api/mcp/asset/74754b94-2733-48b0-b2e1-4568b589540c",
  },
  {
    title: "평창 허브나라 축제",
    location: "평창",
    period: "06.13 - 07.05",
    badge: "자연",
    image: "https://www.figma.com/api/mcp/asset/dffae259-8eac-4cb1-ad92-83c523f762f4",
  },
];

export const moodZones = [
  { name: "동해 바다", description: "파도, 일출, 등대, 해변" },
  { name: "설원·산악", description: "숲, 능선, 트레킹, 겨울" },
  { name: "계곡·자연", description: "강, 호수, 산책, 쉼" },
  { name: "레트로·문화", description: "시장, 골목, 카페, 전시" },
  { name: "절경·포토", description: "전망, 동굴, 고원, 인생샷" },
];

export const moodOptions = moodZones;

export const tripStyleOptions = [
  { name: "혼자 떠나요", description: "나만의 속도로 천천히" },
  { name: "반려동물과 함께", description: "함께 갈 수 있는 장소 중심으로" },
  { name: "가족과 함께", description: "이동 부담이 적은 코스로" },
  { name: "조용히 쉬고 싶어요", description: "덜 붐비고 여유로운 장소로" },
];

export const transportOptions = ["역에서 시작", "터미널에서 시작", "자동차로 이동"] as const;

export const originOptions = {
  "역에서 시작": ["강릉역", "정동진역", "묵호역", "동해역", "평창역", "진부역", "만종역", "원주역"],
  "터미널에서 시작": [
    "강릉 시외버스터미널",
    "속초 시외버스터미널",
    "동해 시외버스터미널",
    "삼척 시외버스터미널",
    "원주 시외버스터미널",
    "춘천 시외버스터미널",
    "평창 시외버스터미널",
  ],
  "자동차로 이동": ["강릉", "속초", "동해", "묵호", "삼척", "평창", "정선", "태백", "춘천", "원주", "인제", "양양"],
};

export const currentCourse = {
  title: "바다 감성 하루 코스가 완성됐어요",
  summary: "바다 감성 · 강릉역 출발 · 혼자 · 조용히 쉬기",
  timeline: [
    { time: "10:30", name: "강릉역 여행 시작", meta: "출발" },
    { time: "11:00", name: "오죽헌", meta: "이동 15분 · 혼잡도 보통" },
    { time: "12:30", name: "중앙시장", meta: "이동 10분 · 점심 추천" },
    { time: "14:00", name: "안목해변 커피거리", meta: "이동 20분 · 바다 감성" },
    { time: "16:00", name: "주문진 등대", meta: "이동 25분 · 포토" },
    { time: "18:00", name: "숙소 체크인", meta: "감성힐링 숙소 권장" },
  ],
  stats: {
    "총 시간": "6h 30m",
    이동: "1h 10m",
    혼잡도: "낮음",
    도보: "2.8km",
  },
  reasons: [
    "1. 선택한 감성 ‘바다’와 일치하는 장소 4곳 포함",
    "2. 강릉역 기준 이동시간 30분 이내",
    "3. 오후 혼잡 피크 시간대 회피",
    "4. 이번 주 진행 중인 강릉 단오제와 가까움",
  ],
};

export const savedCourses = [
  { dday: "D-3", title: "바다 감성 강릉 하루 코스", meta: "2026.07.20 토요일 10:30 · 강릉역 출발 · 혼자" },
  { title: "레트로 원주 코스", meta: "2026.07.28 · 장소 5곳" },
  { title: "자연 춘천 코스", meta: "2026.08.05 · 장소 4곳" },
  { title: "설원 평창 코스", meta: "2026.08.12 · 장소 6곳" },
];

export const zoneProgress = [
  { label: "바다존", value: "3 / 7", percent: "42%" },
  { label: "설원존", value: "1 / 5", percent: "20%" },
  { label: "자연존", value: "2 / 6", percent: "33%" },
  { label: "레트로존", value: "4 / 8", percent: "50%" },
  { label: "포토존", value: "2 / 5", percent: "40%" },
];

export const recordCards = [
  { id: "gangneung-sea", title: "강릉 바다 감성 코스", meta: "방문 장소 4곳 · 스탬프 3개", note: "혼자였지만 충분했던 하루" },
  { id: "wonju-retro", title: "원주 레트로 코스", meta: "방문 장소 5곳 · 스탬프 4개", note: "계획보다 좋았던 우연" },
  { id: "chuncheon-nature", title: "춘천 자연 코스", meta: "방문 장소 3곳 · 스탬프 3개", note: "바람이 기억나는 여행" },
];

type LandingPreviewItem = [time: string, label: string, tags: string[]];

type LandingPreview = {
  title: string;
  congestion: string;
  congestionTone: string;
  items: LandingPreviewItem[];
};

export const landingPreviews: LandingPreview[] = [
  {
    title: "바다 감성 강릉 하루 코스 Preview 🌊",
    congestion: "보통",
    congestionTone: "text-[#ff5c7d]",
    items: [
      ["10:30", "강릉역 도착", ["#출발"]],
      ["11:00", "오죽헌", ["#레트로", "#포토"]],
      ["12:30", "중앙시장 점심", ["#맛집"]],
      ["14:00", "안목해변 커피거리", ["#디저트", "#산책"]],
      ["19:00", "강릉역 도착", ["#종료"]],
    ],
  },
  {
    title: "포토 감성 강릉 하루 코스 Preview 📷",
    congestion: "혼잡",
    congestionTone: "text-[#f30031]",
    items: [
      ["10:30", "강릉역 도착", ["#출발"]],
      ["11:00", "안목해변 커피거리", ["#디저트", "#산책"]],
      ["13:30", "중앙시장 점심", ["#맛집"]],
      ["14:00", "오죽헌", ["#레트로", "#포토"]],
      ["19:00", "강릉역 도착", ["#종료"]],
    ],
  },
  {
    title: "포토 감성 강릉 하루 코스 Preview 📸",
    congestion: "보통",
    congestionTone: "text-[#ff5c7d]",
    items: [
      ["10:30", "강릉역 도착", ["#출발"]],
      ["11:00", "경포해변 카페거리", ["#디저트"]],
      ["13:30", "강문해변 점심", ["#맛집"]],
      ["14:00", "주문진 등대", ["#레트로", "#포토"]],
      ["19:00", "강릉역 도착", ["#종료"]],
    ],
  },
];

export const howToMakeCourse = [
  { step: "1", title: "감성 선택", description: "어떤 감성의 여행을 원하시나요?", accent: "#ffeaee" },
  { step: "2", title: "여행 타입", description: "누구와 여행을 떠나세요?", accent: "#ffc5d1" },
  { step: "3", title: "여행 시작 시간", description: "언제 출발하시나요?", accent: "#ff96ab" },
  { step: "4", title: "여행 시작 장소", description: "어디에서 여행을 시작하세요?", accent: "#ff5c7d" },
  { step: "5", title: "코스 완성", description: "코스 만들기가 완성되었어요!", accent: "#f30031" },
];

export const landingStampIcons = [
  {
    src: "https://www.figma.com/api/mcp/asset/a2195a31-08ac-4627-955b-cab8c560d402",
    alt: "wave stamp",
    className: "left-[140px] top-[118px] h-[120px] w-[120px] -rotate-6",
  },
  {
    src: "https://www.figma.com/api/mcp/asset/02da300e-735a-44e1-a1b5-d1cd5a133473",
    alt: "purple stamp",
    className: "left-[-6px] top-[252px] h-[120px] w-[120px] rotate-[10deg]",
  },
  {
    src: "https://www.figma.com/api/mcp/asset/ca5a919e-8a51-4f3d-8ce9-3f9b2360e0f5",
    alt: "forest stamp",
    className: "left-[108px] top-[340px] h-[136px] w-[136px] -rotate-[21deg]",
  },
  {
    src: "https://www.figma.com/api/mcp/asset/cbd664a0-e908-4c12-acbc-4966284f5c20",
    alt: "photo stamp",
    className: "right-[96px] top-[168px] h-[124px] w-[124px] rotate-[12deg]",
  },
  {
    src: "https://www.figma.com/api/mcp/asset/9b7ab796-547e-433e-a0f7-5caeac06916b",
    alt: "coffee stamp",
    className: "right-[8px] top-[318px] h-[128px] w-[128px] -rotate-[8deg]",
  },
];

export const landingStampCurve = "https://www.figma.com/api/mcp/asset/659b787d-c870-4dbd-b5f1-34d140d73e39";
