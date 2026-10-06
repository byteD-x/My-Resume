import { HeroBullet } from "@/types";

interface HeroBulletsProps {
  bullets: HeroBullet[];
}

export function HeroBullets({ bullets }: HeroBulletsProps) {
  return (
    <div className="w-full max-w-[42rem]">
      <div className="space-y-2 sm:space-y-3">
        {bullets.map((bullet) => (
          <div
            key={bullet.id}
            className="border-l border-[rgba(37,99,235,0.24)] pl-3 sm:pl-4"
          >
            <p className="theme-title text-[13px] font-semibold tracking-wide sm:text-sm">
              {bullet.title}
            </p>
            <p className="theme-copy mt-0.5 line-clamp-2 text-[0.9rem] leading-[1.62] sm:mt-1 sm:text-[0.94rem] sm:leading-[1.75]">
              {bullet.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
