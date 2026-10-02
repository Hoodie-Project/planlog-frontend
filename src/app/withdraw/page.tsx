import Link from "next/link";
import { MainShell } from "@/components/layout/MainShell";

export default function WithdrawPage() {
  return (
    <MainShell>
      <section className="mx-auto w-full max-w-[820px] px-[34px] pb-28 pt-12 md:px-4 md:py-16 lg:px-0">
        <p className="text-[14px] font-semibold leading-[1.4] tracking-[-0.35px] text-[#ff1f4c]">PLANLOG</p>
        <h1 className="mt-3 text-[28px] font-bold leading-[1.4] tracking-[-0.7px] text-[#111111] md:text-[32px]">회원탈퇴 안내</h1>
        <p className="mt-3 text-[15px] leading-[1.7] tracking-[-0.35px] text-[#505050]">회원탈퇴 요청은 본인 확인 후 처리됩니다.</p>

        <div className="mt-8 rounded-2xl border border-[#f1f1f5] bg-white p-6 shadow-[0px_2px_6px_-1px_rgba(17,17,17,0.08)] md:p-8">
          <h2 className="text-[20px] font-semibold leading-[1.4] tracking-[-0.5px] text-[#111111]">탈퇴를 요청하려면</h2>
          <ol className="mt-5 list-decimal space-y-3 pl-5 text-[15px] leading-[1.7] tracking-[-0.35px] text-[#505050]">
            <li>아래 이메일로 회원탈퇴 요청을 보내 주세요.</li>
            <li>본인 확인을 위해 가입에 사용한 계정의 닉네임 또는 이메일을 함께 적어 주세요.</li>
            <li>요청 확인 후 계정과 서비스 이용 기록의 삭제 절차를 안내해 드립니다.</li>
          </ol>

          <a className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#ff1f4c] px-5 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 md:w-auto" href="mailto:Hoodiev@gmail.com?subject=PLANLOG%20%ED%9A%8C%EC%9B%90%ED%83%88%ED%87%B4%20%EC%9A%94%EC%B2%AD">
            이메일로 회원탈퇴 요청하기
          </a>
        </div>

        <p className="mt-6 text-[14px] leading-[1.6] tracking-[-0.35px] text-[#777777]">법령에 따라 보관이 필요한 정보는 해당 법령에서 정한 기간 동안 보관될 수 있습니다.</p>
        <div className="mt-8 flex justify-center gap-4 text-[14px] text-[#888888]">
          <Link className="underline underline-offset-4" href="/records">나의 기록</Link>
          <span aria-hidden="true">|</span>
          <Link className="underline underline-offset-4" href="/privacy">개인정보처리방침</Link>
        </div>
      </section>
    </MainShell>
  );
}
