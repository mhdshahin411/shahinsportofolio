"use client";

import { useRef, useState, useEffect } from "react";
import { skillIconMap } from "@/components/SkillIcons";

const groupColors: Record<string, { dot: string; iconBg: string; line: string }> = {
  "CRM & Platform": {
    dot: "bg-blue-500",
    iconBg: "bg-blue-500/15 ring-blue-500/20",
    line: "bg-blue-500",
  },
  "Cloud & Integration": {
    dot: "bg-emerald-500",
    iconBg: "bg-emerald-500/15 ring-emerald-500/20",
    line: "bg-emerald-500",
  },
  Development: {
    dot: "bg-amber-500",
    iconBg: "bg-amber-500/15 ring-amber-500/20",
    line: "bg-amber-500",
  },
  Methodology: {
    dot: "bg-violet-500",
    iconBg: "bg-violet-500/15 ring-violet-500/20",
    line: "bg-violet-500",
  },
};

interface CompetencyProp {
  title: string;
  skills: { name: string; description: string }[];
}

export default function SkillScroller({ competencies }: { competencies: CompetencyProp[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!ref.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = ref.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!ref.current) return;
    const amount = ref.current.clientWidth * 0.6;
    ref.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const allCards = competencies.flatMap((c) => {
    const colors = groupColors[c.title] ?? {
      dot: "bg-gray-400",
      iconBg: "bg-gray-400/15 ring-gray-400/20",
      line: "bg-gray-400",
    };
    return c.skills.map((s) => ({
      skill: s.name,
      description: s.description,
      groupTitle: c.title,
      colors,
    }));
  });

  return (
    <div className="relative">
      {/* Header row with scroll buttons */}
      <div className="mb-8 flex items-end justify-between">
        <div />
        <div className="flex items-center gap-3">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className={`flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-white/30 backdrop-blur-md transition-all hover:bg-white/50 ${canScrollLeft ? "opacity-100" : "opacity-30"}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className={`flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/25 transition-all hover:shadow-xl hover:shadow-accent/30 ${canScrollRight ? "opacity-100" : "opacity-30"}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable cards */}
      <div
        ref={ref}
        className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {allCards.map((card) => {
          const Icon = skillIconMap[card.skill];
          const desc = card.description || card.groupTitle;
          return (
            <div
              key={card.skill}
              className="group relative flex min-w-[260px] shrink-0 flex-col overflow-hidden rounded-2xl border border-white/40 p-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl"
              style={{
                scrollSnapAlign: "start",
                background: "rgba(255,255,255,0.35)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              {/* Icon */}
              {Icon && (
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ring-1 ${card.colors.iconBg} transition-transform duration-500 group-hover:scale-110`}>
                  <Icon
                    width={26}
                    height={26}
                    className={`${card.colors.dot.replace("bg-", "text-")}`}
                  />
                </div>
              )}

              {/* Skill name */}
              <h4 className="mt-5 font-[family-name:var(--font-display)] text-lg font-bold leading-snug text-foreground">
                {card.skill}
              </h4>

              {/* Description */}
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {desc}
              </p>

              {/* Accent line */}
              <div className={`mt-auto pt-5`}>
                <div className={`h-[3px] w-10 rounded-full ${card.colors.line} opacity-60 transition-all duration-500 group-hover:w-14 group-hover:opacity-100`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Fade edges */}
      <div className="pointer-events-none absolute bottom-4 left-0 top-[76px] w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute bottom-4 right-0 top-[76px] w-16 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
