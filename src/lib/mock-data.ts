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

export const recommendedCourseTags = ["바다 감성", "강릉역 출발", "혼자 여행", "도보 2.8km"];

export const recommendedCourseStops = [
  { name: "강릉역", category: "출발", time: "10:30", note: "KTX 도착 후 바로 이동" },
  { name: "오죽헌", category: "레트로", time: "11:00", note: "고즈넉한 산책과 사진 포인트" },
  { name: "중앙시장", category: "맛집", time: "12:30", note: "점심과 로컬 간식 추천" },
  { name: "안목해변 커피거리", category: "디저트", time: "14:00", note: "바다 감성 카페 거리" },
  { name: "주문진 등대", category: "포토", time: "16:00", note: "해 질 녘 사진 추천 포인트" },
];

export const recommendedCourseInsights = [
  {
    title: "이동 피로도 낮음",
    value: "도보 2.8km",
    description: "역 기준 이동 동선을 짧게 묶어서 혼자 여행해도 부담이 적어요.",
  },
  {
    title: "가장 잘 맞는 감성",
    value: "바다 · 레트로",
    description: "오전은 정적인 문화 공간, 오후는 해변 중심으로 감성을 분배했어요.",
  },
  {
    title: "혼잡도 예측",
    value: "보통",
    description: "점심 시간대만 붐비고 나머지는 여유롭게 둘러볼 수 있는 코스예요.",
  },
];

export const relatedCourseCards = [
  {
    title: "레트로 강릉 골목 코스",
    summary: "중앙시장, 명주동, 커피거리 중심",
    chips: ["레트로", "포토", "반나절"],
  },
  {
    title: "초록 감성 평창 코스",
    summary: "허브나라, 숲 산책, 조용한 카페",
    chips: ["자연", "휴식", "자동차"],
  },
  {
    title: "속초 바다 산책 코스",
    summary: "등대해변, 외옹치, 청초호 야경",
    chips: ["바다", "산책", "노을"],
  },
];

export const recommendedAccommodations = [
  {
    id: "annk-stay",
    badge: "감성힐링",
    title: "안목 스테이",
    area: "바다뷰",
    price: "89,000원~",
    tone: "text-[#49a6c7]",
  },
  {
    id: "gangneung-guesthouse",
    badge: "가성비",
    title: "강릉 게스트하우스",
    area: "역 5분",
    price: "35,000원~",
    tone: "text-[#243d6b]",
  },
  {
    id: "gyeongpo-camping",
    badge: "캠핑",
    title: "경포 오토캠핑",
    area: "해변",
    price: "45,000원~",
    tone: "text-[#4b965d]",
  },
];

export const recommendedCourseReasons = [
  "선택한 감성 '바다'와 일치하는 장소 4곳 포함",
  "강릉역 기준 이동시간 30분 이내",
  "오후 혼잡 피크 시간대 회피",
  "이번 주 진행 중인 강릉 단오제와 가까움",
];

export const courseFeedbackOptions = ["더 여유로운 코스로", "걷는 시간 줄이기", "사진 명소 더 넣기", "축제 포함하기"];

export const companionEmotionNotes = [
  { rank: 1, mood: "평온함", quote: "혼자였지만 충분했던 하루", tone: "bg-[#f1ede2] text-[#8b7f57]" },
  { rank: 2, mood: "설렘", quote: "바람이 기억나는 강릉", tone: "bg-[#e8f6ff] text-[#5c96b1]" },
  { rank: 3, mood: "자유로움", quote: "계획보다 좋았던 우연", tone: "bg-[#eef8f6] text-[#5d9b8b]" },
];

export const recordsSummaryCards = [
  { label: "저장한 코스", value: "12", detail: "이번 달 +3" },
  { label: "완료한 스탬프", value: "18", detail: "바다존 5개" },
  { label: "기록 카드", value: "7", detail: "최근 작성 2건" },
];

export const recordsTraitChips = [
  { label: "바다 감성", value: "42%" },
  { label: "레트로 감성", value: "28%" },
  { label: "자연 감성", value: "18%" },
  { label: "포토 감성", value: "12%" },
];

export const recordsRecentActivities = [
  { title: "강릉 바다 감성 코스 저장", time: "오늘 · 10:24", tone: "text-[#f30031]" },
  { title: "주문진 등대 스탬프 획득", time: "어제 · 18:12", tone: "text-[#ff5c7d]" },
  { title: "원주 레트로 기록 카드 작성", time: "3일 전", tone: "text-slate-700" },
];

export const recordsArchiveCards = [
  {
    id: "gangneung-sea",
    title: "강릉 바다 감성 코스",
    date: "2026.07.28",
    location: "강릉",
    stamps: "스탬프 3/5",
    note: "파도 소리만으로도 충분했던 하루",
    image: festivalCards[1].image,
    tags: ["바다", "혼자", "카페"],
  },
  {
    id: "wonju-retro",
    title: "원주 레트로 골목 산책",
    date: "2026.07.20",
    location: "원주",
    stamps: "스탬프 4/5",
    note: "기억보다 좋았던 오래된 간판들",
    image: festivalCards[0].image,
    tags: ["레트로", "시장", "사진"],
  },
  {
    id: "chuncheon-nature",
    title: "춘천 초록 쉼표 코스",
    date: "2026.07.12",
    location: "춘천",
    stamps: "스탬프 2/5",
    note: "산책로 바람이 가장 오래 남았다",
    image: festivalCards[2].image,
    tags: ["자연", "산책", "휴식"],
  },
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
  { step: "4", title: "코스 완성", description: "코스 만들기가 완성되었어요!", accent: "#f30031" },
];

export const landingStampProgress = [
  {
    badge: "https://www.figma.com/api/mcp/asset/03ed6a2d-047e-40c1-b446-1978e6934519.svg",
    outer: "https://www.figma.com/api/mcp/asset/74ea3d8b-ef73-4f8d-b430-4a8a21359aba.svg",
    inner: "https://www.figma.com/api/mcp/asset/2706a691-49b9-44c6-8e83-0d0c86be90ab.svg",
    done: true,
  },
  {
    badge: "https://www.figma.com/api/mcp/asset/03ed6a2d-047e-40c1-b446-1978e6934519.svg",
    outer: "https://www.figma.com/api/mcp/asset/74ea3d8b-ef73-4f8d-b430-4a8a21359aba.svg",
    inner: "https://www.figma.com/api/mcp/asset/2706a691-49b9-44c6-8e83-0d0c86be90ab.svg",
    done: true,
  },
  {
    badge: "https://www.figma.com/api/mcp/asset/e8e1514b-a2a7-461d-94eb-d0d4de318173.svg",
    outer: "https://www.figma.com/api/mcp/asset/08383550-0a88-4d0c-8d06-e4438c5bbaf9.svg",
    inner: "https://www.figma.com/api/mcp/asset/f62de102-c5e6-4ca2-8edb-fcbd2cf5976c.svg",
    done: false,
  },
  {
    badge: "https://www.figma.com/api/mcp/asset/e8e1514b-a2a7-461d-94eb-d0d4de318173.svg",
    outer: "https://www.figma.com/api/mcp/asset/08383550-0a88-4d0c-8d06-e4438c5bbaf9.svg",
    inner: "https://www.figma.com/api/mcp/asset/f62de102-c5e6-4ca2-8edb-fcbd2cf5976c.svg",
    done: false,
  },
  {
    badge: "https://www.figma.com/api/mcp/asset/e8e1514b-a2a7-461d-94eb-d0d4de318173.svg",
    outer: "https://www.figma.com/api/mcp/asset/08383550-0a88-4d0c-8d06-e4438c5bbaf9.svg",
    inner: "https://www.figma.com/api/mcp/asset/f62de102-c5e6-4ca2-8edb-fcbd2cf5976c.svg",
    done: false,
  },
] as const;
