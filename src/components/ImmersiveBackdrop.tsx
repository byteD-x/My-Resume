import React from "react";

export default function ImmersiveBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden bg-white">
      {/* Pure CSS Tailwind fallback gradient to ensure fast LCP without Framer Motion */}
      <div className="absolute -top-28 -left-24 h-[20rem] w-[20rem] rounded-full bg-sky-200/18 blur-[90px] animate-pulse md:-top-48 md:-left-40 md:h-[36rem] md:w-[36rem] md:bg-sky-300/16 md:blur-[120px]" style={{ animationDuration: "4s" }} />
      <div className="absolute top-[22%] -right-24 h-[18rem] w-[18rem] rounded-full bg-blue-200/16 blur-[80px] animate-pulse md:top-[30%] md:-right-40 md:h-[38rem] md:w-[38rem] md:bg-blue-300/16 md:blur-[140px]" style={{ animationDuration: "5s" }} />
      <div className="absolute bottom-[-6rem] left-[20%] h-[16rem] w-[16rem] rounded-full bg-cyan-200/14 blur-[70px] animate-pulse md:bottom-[-12rem] md:left-[25%] md:h-[36rem] md:w-[36rem] md:bg-cyan-300/16 md:blur-[130px]" style={{ animationDuration: "6s" }} />
      
      <div className="immersive-grid absolute inset-0 hidden opacity-20 md:block" />
      <div className="immersive-grain absolute inset-0 hidden opacity-12 md:block" />
    </div>
  );
}
