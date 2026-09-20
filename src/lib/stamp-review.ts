import type { RecordDto } from "@/api/platform";
import type { StampDto } from "@/api/stamps";

export function getStampReview(stamp: StampDto, records: RecordDto[]) {
  const record = records.find((item) => item.stamps.some((recordStamp) => recordStamp.id === stamp.id))
    ?? records.find((item) => item.stamps.some((recordStamp) => recordStamp.contentId === stamp.contentId));

  return {
    emotion: record?.mood ?? stamp.mood ?? "",
    review: record?.note?.trim() || "등록된 리뷰가 없어요.",
  };
}
