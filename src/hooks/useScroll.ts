import { useEffect, useState } from "react";

export function useScroll() {
  const [scrollY, setScrollY] = useState(() => {
    if (typeof window === "undefined") return 0;
    return window.scrollY;
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return { scrollY };
}
