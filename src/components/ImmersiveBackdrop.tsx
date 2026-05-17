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
        className="absolute -top-32 -left-20 h-[18rem] w-[18rem] rounded-full bg-sky-200/40 blur-[72px] animate-pulse md:-top-40 md:-left-28 md:h-[30rem] md:w-[30rem] md:blur-[96px]"
        style={{ animationDuration: "6s" }}
      />
      <div
        className="absolute top-[16%] right-[6%] h-[14rem] w-[14rem] rounded-full bg-blue-200/28 blur-[56px] animate-pulse md:h-[22rem] md:w-[22rem] md:blur-[80px]"
        style={{ animationDuration: "7.5s" }}
      />
      <div
        className="absolute bottom-[-5rem] left-[18%] h-[14rem] w-[14rem] rounded-full bg-cyan-100/50 blur-[60px] animate-pulse md:bottom-[-8rem] md:h-[24rem] md:w-[24rem] md:blur-[84px]"
        style={{ animationDuration: "9s" }}
      />

      <div className="immersive-grid absolute inset-0 hidden opacity-50 md:block" />
      <div className="immersive-grain absolute inset-0 hidden opacity-40 md:block" />
    </div>
  );
}
