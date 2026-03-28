"use client";

import dynamic from "next/dynamic";

const HomePageRuntime = dynamic(
  () =>
    import("@/components/home/HomePageRuntime").then((mod) => ({
      default: mod.HomePageRuntime,
    })),
  {
    ssr: false,
    loading: () => null,
  },
);

export function HomePageRuntimeShell() {
  return <HomePageRuntime />;
}
