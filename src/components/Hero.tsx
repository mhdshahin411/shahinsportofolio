import { ArrowIcon } from "./icons";

function Plus({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-white/45 ${className}`}
    >
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M8 1v14M1 8h14" />
      </svg>
    </span>
  );
}

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
    </svg>
  );
}

interface ProfileData {
  name: string;
  photo: string;
  intro: string;
  role: string;
}

export default function Hero({ profile, tagline }: { profile: ProfileData; tagline: string }) {
  const year = 2020;
  const initials = profile.name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <section
      id="top"
      className="hero-green relative min-h-[75dvh] overflow-hidden text-white sm:min-h-dvh"
    >
      {/* Faint registration grid */}
      <div aria-hidden className="hero-grid pointer-events-none absolute inset-0" />
      <Plus className="left-1/4 top-1/3" />
      <Plus className="left-1/2 top-1/3" />
      <Plus className="left-3/4 top-1/3" />
      <Plus className="left-1/4 top-2/3" />
      <Plus className="left-3/4 top-2/3" />

      {/* Ghosted watermark name */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[30%] z-0 flex items-center justify-center sm:top-[13%]"
      >
        <span className="font-[family-name:var(--font-display)] text-[28vw] font-bold uppercase leading-none tracking-tighter text-white/[0.09] sm:text-[24vw]">
          Shahin
        </span>
      </div>

      {/* Portrait (or placeholder) */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center">
        {profile.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.photo}
            alt={`Portrait of ${profile.name}`}
            className="h-[95vh] w-auto object-contain object-bottom sm:h-[90vh]"
          />
        ) : (
          <div
            role="img"
            aria-label={`${profile.name} — portrait placeholder`}
            className="relative flex h-[70vh] w-[min(52vw,430px)] items-center justify-center rounded-t-[2rem]"
            style={{
              background:
                "radial-gradient(90% 70% at 50% 20%, rgba(0,0,0,0.14), transparent 60%)",
            }}
          >
            <span className="font-[family-name:var(--font-display)] text-[9rem] font-bold text-white/15">
              {initials}
            </span>
          </div>
        )}
      </div>

      {/* Foreground content */}
      <div className="relative z-20 mx-auto flex min-h-[75dvh] max-w-7xl flex-col px-5 pt-20 pb-8 sm:min-h-dvh sm:pt-28 sm:pb-10 sm:px-6">
        {/* Top row: statement + project card */}
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <p className="mono flex max-w-[16rem] gap-2 text-[0.7rem] uppercase leading-relaxed tracking-wide text-white/85">
            <span className="mt-0.5 text-white">●</span>
            <span>
              {tagline ||
                "I build Dynamics 365 CRM solutions and full-stack web & mobile apps that are simple, smart and impactful."}
            </span>
          </p>

        </div>

        {/* Bottom: giant name */}
        <div className="mt-auto">
          <p className="mono mb-1 text-sm tracking-wide text-white/85">
            ©{year}
          </p>
          <h1
            aria-label="Shahin"
            className="font-[family-name:var(--font-display)] text-[clamp(3.25rem,16vw,13rem)] font-bold uppercase leading-[0.8] tracking-tighter"
          >
            {"Shahin".split("").map((ch, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="nav-letter"
                style={{ animationDelay: `${300 + i * 90}ms` }}
              >
                {ch}
              </span>
            ))}
          </h1>
        </div>

        {/* Let's Talk card — floats bottom-right on desktop */}
        <a
          href="#contact"
          className="group relative mt-8 hidden w-full max-w-xs items-center gap-3 rounded-xl bg-[#0a0a0b] p-3.5 text-white shadow-2xl transition-transform hover:-translate-y-1 sm:flex sm:w-72 lg:absolute lg:bottom-10 lg:right-6 lg:mt-0"
        >
            <Sparkle className="absolute right-3 top-3 text-white/40" />
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#16a34a] to-[#166534] font-[family-name:var(--font-display)] text-sm font-bold">
              {initials}
            </span>
            <div className="flex-1">
              <p className="mono text-[0.65rem] uppercase tracking-wider text-white/55">
                Let&apos;s Talk
              </p>
              <p className="font-[family-name:var(--font-display)] font-semibold leading-tight">
                Shahin
              </p>
              <p className="text-xs text-white/60">{profile.role || "Freelance Full-Stack Dev"}</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 transition-colors group-hover:border-accent group-hover:text-accent">
              <ArrowIcon width={16} height={16} className="-rotate-45" />
            </span>
          </a>
      </div>
    </section>
  );
}
