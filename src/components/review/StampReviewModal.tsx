"use client";

import { useState } from "react";
import { X } from "lucide-react";

const emotions = ["감사하는", "기분좋은", "설렘", "신나는", "자유로움", "즐거운", "평온함", "뿌듯한"] as const;

type StampReviewModalProps = { mode: "read" | "write"; emotion?: string; review?: string; onClose: () => void; onSave?: (value: { emotion: string; review: string }) => void };

export function StampReviewModal({ mode, emotion: initialEmotion = "", review: initialReview = "", onClose, onSave }: StampReviewModalProps) {
  const [emotion, setEmotion] = useState(initialEmotion);
  const [review, setReview] = useState(initialReview);
  const isReadOnly = mode === "read";
  const canSave = Boolean(emotion && review.trim());

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.2)] px-4 backdrop-blur-[5px]" onClick={onClose}>
    <section aria-modal="true" className="w-full max-w-[430px] rounded-2xl border border-[#d4d4d4] bg-white px-10 pb-12 pt-5" onClick={(event) => event.stopPropagation()} role="dialog">
      <div className="relative flex items-center justify-center"><h2 className="text-[20px] font-bold leading-[1.4] tracking-[-0.5px] text-[#111111]">{isReadOnly ? "리뷰" : "리뷰하기"}</h2>{!isReadOnly ? <button aria-label="리뷰 모달 닫기" className="absolute right-[-21px] top-0 text-[#111111]" onClick={onClose} type="button"><X className="h-6 w-6" strokeWidth={2} /></button> : null}</div>
      <p className="mt-10 text-[18px] leading-[1.4] tracking-[-0.45px] text-[#111111]">여행이 즐거우셨나요?<br />기억에 남는 여행에 대한 기록을 남겨주세요.</p>
      <div className="mt-10"><div className="flex items-baseline gap-2"><h3 className="text-[18px] font-semibold tracking-[-0.45px] text-[#111111]">감정 선택</h3><span className="text-[14px] tracking-[-0.35px] text-[#999999]">(1개 선택)</span></div><div className="mt-4 flex flex-wrap gap-[10px]">{emotions.map((item) => { const selected = emotion === item; return <button key={item} className={`rounded-[20px] border px-[13px] py-[10px] text-[16px] tracking-[-0.4px] shadow-[0px_2px_6px_-1px_rgba(17,17,17,0.08)] ${selected ? "border-[#ff1f4c] text-[#ff1f4c]" : "border-[#e5e5ec] text-[#111111]"}`} disabled={isReadOnly} onClick={() => setEmotion(item)} type="button">{item}</button>; })}</div></div>
      <div className="mt-10"><h3 className="text-[18px] font-semibold tracking-[-0.45px] text-[#111111]">한줄 평가</h3><textarea className={`mt-4 h-[62px] w-full resize-none rounded-2xl border bg-white px-5 py-[18px] text-[16px] tracking-[-0.4px] shadow-[0px_2px_6px_-1px_rgba(17,17,17,0.08)] outline-none ${isReadOnly ? "border-[#ff1f4c] text-[#111111]" : "border-[#e5e5ec] placeholder:text-[#999999] focus:border-[#ff1f4c]"}`} disabled={isReadOnly} maxLength={15} onChange={(event) => setReview(event.target.value)} placeholder="15자 이내로 입력해 주세요." value={review} /></div>
      {!isReadOnly ? <button className="mt-10 h-14 w-full rounded-2xl bg-[#ff1f4c] text-[16px] font-bold tracking-[-0.4px] text-white disabled:border disabled:border-[#ffc5d1] disabled:bg-[#ffeaee] disabled:text-[#999999]" disabled={!canSave} onClick={() => onSave?.({ emotion, review })} type="button">저장하기</button> : null}
    </section>
  </div>;
}
