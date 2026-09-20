/**
 * 오늘부터 대상 날짜까지 남은 일수를 날짜 단위로 반환합니다.
 */
export const getDaysUntil = (targetDate: string | Date): number => {
  const today = new Date();
  const target = new Date(targetDate);

  // 시간 제거 → 날짜 단위로 비교
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diff = target.getTime() - today.getTime();

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
