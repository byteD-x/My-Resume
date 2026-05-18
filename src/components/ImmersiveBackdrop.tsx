import React from "react";

const useLiteBackdrop =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_DEV_VISUAL_MODE === "lite";

export default function ImmersiveBackdrop() {
  if (useLiteBackdrop) {
    return (
      <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        <div className="absolute -top-24 -left-16 h-[14rem] w-[14rem] rounded-full bg-sky-200/22 blur-[40px] md:h-[20rem] md:w-[20rem] md:blur-[56px]" />
        <div className="absolute right-[8%] top-[18%] h-[12rem] w-[12rem] rounded-full bg-blue-200/18 blur-[36px] md:h-[18rem] md:w-[18rem] md:blur-[48px]" />
        <div className="immersive-grid absolute inset-0 hidden opacity-30 md:block" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
      <div
        className="absolute -top-28 -left-20 h-[16rem] w-[16rem] rounded-full bg-sky-200/26 blur-[60px] md:-top-36 md:-left-24 md:h-[26rem] md:w-[26rem] md:blur-[82px]"
      />
      <div
        className="absolute top-[18%] right-[8%] h-[12rem] w-[12rem] rounded-full bg-blue-200/18 blur-[46px] md:h-[18rem] md:w-[18rem] md:blur-[68px]"
      />
      <div
        className="absolute bottom-[-4rem] left-[22%] h-[12rem] w-[12rem] rounded-full bg-cyan-100/28 blur-[52px] md:bottom-[-7rem] md:h-[18rem] md:w-[18rem] md:blur-[72px]"
      />

      <div className="immersive-grid absolute inset-0 hidden opacity-32 md:block" />
      <div className="immersive-grain absolute inset-0 hidden opacity-24 md:block" />
    </div>
  );
}
