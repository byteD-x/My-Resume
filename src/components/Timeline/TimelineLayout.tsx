import React from "react";

interface TimelineLayoutProps {
  children: React.ReactNode;
}

export function TimelineContainer({ children }: TimelineLayoutProps) {
  return <ol className="relative flex flex-col gap-8 md:gap-10">{children}</ol>;
}
