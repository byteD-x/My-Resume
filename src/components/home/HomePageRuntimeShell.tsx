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

interface HomePageRuntimeShellProps {
  resumeOwnerName: string;
  resumeOwnerTitle: string;
}

export function HomePageRuntimeShell({
  resumeOwnerName,
  resumeOwnerTitle,
}: HomePageRuntimeShellProps) {
  return (
    <HomePageRuntime
      resumeOwnerName={resumeOwnerName}
      resumeOwnerTitle={resumeOwnerTitle}
    />
  );
}
