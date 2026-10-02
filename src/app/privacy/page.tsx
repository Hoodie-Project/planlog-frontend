import Link from "next/link";
import { MainShell } from "@/components/layout/MainShell";

const policySections = [
  {
    title: "1. 수집하는 개인정보",
    content: "PLANLOG는 로그인과 서비스 제공을 위해 카카오 로그인으로 제공되는 이용자 식별 정보와 닉네임을 처리합니다. 코스 생성·저장·여행 기록·스탬프 기능을 이용하는 경우에는 이용자가 직접 입력하거나 서비스 이용 과정에서 생성한 여행 선호, 코스 및 리뷰 정보가 함께 처리될 수 있습니다.",
  },
  {
    title: "2. 개인정보의 이용 목적",
    content: "수집한 정보는 이용자 인증, 개인화된 여행 코스 추천, 저장 코스와 여행 기록 관리, 스탬프 기능 제공 및 서비스 문의 대응을 위해 사용합니다.",
  },
  {
    title: "3. 위치정보 이용",
    content: "스탬프 기능은 이용자의 현재 위치 권한을 허용한 경우에만 위치 확인을 요청합니다. 위치 정보는 스탬프 수령 가능 여부를 확인하기 위한 용도로만 사용합니다.",
  },
  {
    title: "4. 보유 및 파기",
    content: "개인정보는 회원 탈퇴 또는 처리 목적 달성 시 지체 없이 파기합니다. 다만 관련 법령에 따라 보관이 필요한 정보는 해당 법령에서 정한 기간 동안 보관할 수 있습니다.",
  },
  {
    title: "5. 외부 서비스 이용",
    content: "PLANLOG는 카카오 로그인과 지도 기능 등 서비스 제공에 필요한 외부 서비스를 이용할 수 있습니다. 이용자의 개인정보를 판매하거나 서비스 제공 목적 외의 용도로 제3자에게 제공하지 않습니다.",
  },
  {
    title: "6. 이용자의 권리와 문의",
    content: "이용자는 자신의 개인정보에 대해 열람·정정·삭제·처리 정지를 요청할 수 있습니다. 개인정보 관련 문의와 회원 탈퇴 요청은 아래 이메일로 보내 주세요.",
  },
];

export default function PrivacyPage() {
  return (
    <MainShell>
      <section className="mx-auto w-full max-w-[820px] px-[34px] pb-28 pt-12 md:px-4 md:py-16 lg:px-0">
        <p className="text-[14px] font-semibold leading-[1.4] tracking-[-0.35px] text-[#ff1f4c]">PLANLOG</p>
        <h1 className="mt-3 text-[28px] font-bold leading-[1.4] tracking-[-0.7px] text-[#111111] md:text-[32px]">개인정보처리방침</h1>
        <p className="mt-2 text-[14px] leading-[1.6] tracking-[-0.35px] text-[#777777]">시행일: 2026년 10월 2일</p>

        <div className="mt-8 rounded-2xl border border-[#f1f1f5] bg-white p-6 shadow-[0px_2px_6px_-1px_rgba(17,17,17,0.08)] md:p-8">
          <p className="text-[15px] leading-[1.7] tracking-[-0.35px] text-[#505050]">PLANLOG(이하 “서비스”)는 이용자의 개인정보를 소중히 여기며, 관련 법령을 준수합니다. 이 방침은 서비스가 처리하는 개인정보와 그 목적을 안내합니다.</p>

          <div className="mt-8 space-y-8">
            {policySections.map((section) => (
              <section key={section.title}>
                <h2 className="text-[18px] font-semibold leading-[1.4] tracking-[-0.45px] text-[#111111]">{section.title}</h2>
                <p className="mt-3 text-[15px] leading-[1.7] tracking-[-0.35px] text-[#505050]">{section.content}</p>
              </section>
            ))}
          </div>

          <div className="mt-8 rounded-xl bg-[#fff4f6] p-5 text-[15px] leading-[1.6] tracking-[-0.35px] text-[#505050]">
            개인정보 보호책임자: PLANLOG 운영팀<br />
            이메일: <a className="font-semibold text-[#f30031] underline underline-offset-2" href="mailto:Hoodiev@gmail.com">Hoodiev@gmail.com</a>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4 text-[14px] text-[#888888]">
          <Link className="underline underline-offset-4" href="/records">나의 기록</Link>
          <span aria-hidden="true">|</span>
          <Link className="underline underline-offset-4" href="/withdraw">회원탈퇴 안내</Link>
        </div>
      </section>
    </MainShell>
  );
}
