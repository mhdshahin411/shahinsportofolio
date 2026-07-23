import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import SkillScroller from "@/components/SkillScroller";
import ProjectCardThumb from "@/components/ProjectCardThumb";
import Footer from "@/components/Footer";
import CountUp from "@/components/CountUp";
import { MailIcon, PhoneIcon, ArrowIcon } from "@/components/icons";
import {
  getProfile,
  getMarqueeSkills,
  getCertifications,
  getProjects,
  getServices,
  getStats,
  getCompetencies,
  getSiteContent,
} from "@/lib/db-data";

function SectionHead({
  num,
  kicker,
  title,
  desc,
}: {
  num: string;
  kicker: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="mb-8">
      <Reveal variant="blur">
        <div className="flex items-center gap-4">
          <span className="mono text-sm text-accent">{num}</span>
          <span className="kicker">{kicker}</span>
        </div>
        <h2 className="mt-5 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h2>
        {desc && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            {desc}
          </p>
        )}
      </Reveal>
    </div>
  );
}

// ISR: serve prerendered HTML, refresh hourly + on-demand when admin edits.
export const revalidate = 3600;

export default async function Home() {
  const [profile, marqueeSkillsRaw, certifications, projects, servicesRaw, stats, competenciesRaw, content] =
    await Promise.all([
      getProfile(),
      getMarqueeSkills(),
      getCertifications(),
      getProjects(),
      getServices(),
      getStats(),
      getCompetencies(),
      getSiteContent(),
    ]);

  const marqueeSkills = marqueeSkillsRaw.map((m) => m.name);
  const services = servicesRaw.map((s) => s.name);
  const competencies = competenciesRaw.map((c) => ({
    ...c,
    skills: c.skills.map((s) => ({ name: s.name, description: s.description })),
  }));
  const featuredProjects = projects.slice(0, 2).map((p) => ({
    ...p,
    tags: p.tags.map((t) => t.name),
  }));
  return (
    <>
      <Navbar />
      <main>
        <Hero profile={profile} tagline={content.heroTagline ?? ""} />

        {/* Marquee */}
        <div className="relative overflow-hidden border-y border-white/30 bg-white/30 py-5 backdrop-blur-md">
          <div className="flex w-max marquee-scroll gap-10">
            {[...marqueeSkills, ...marqueeSkills].map((s, i) => (
              <span
                key={i}
                className="mono flex items-center gap-10 whitespace-nowrap text-sm uppercase tracking-wider text-faint"
              >
                {s}
                <span className="text-accent/40">●</span>
              </span>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent" />
        </div>

        {/* About */}
        <section
          id="about"
          className="section-gradient-1 px-5 pt-10 pb-10 sm:px-6 sm:pt-14 sm:pb-12"
        >
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
              <Reveal variant="slide-left">
                <div className="flex items-center gap-4">
                  <span className="mono text-sm text-accent">01</span>
                  <span className="kicker">About</span>
                </div>
                {/* Stats in glass cards */}
                <div className="stagger-children mt-10 grid grid-cols-2 gap-4">
                  {stats.map((s) => (
                    <div key={s.label} className="glass relative overflow-hidden rounded-xl p-5">
                      <p className="font-[family-name:var(--font-display)] text-3xl font-bold text-accent">
                        <CountUp value={s.value} />
                      </p>
                      <p className="mt-1 text-xs text-muted">{s.label}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal variant="slide-right" delay={100}>
                <p className="font-[family-name:var(--font-display)] text-2xl font-medium leading-snug tracking-tight sm:text-3xl lg:text-4xl">
                  I&apos;m a freelance developer working across{" "}
                  <span className="accent-mark">Dynamics 365 CRM</span>, the
                  Power Platform, and{" "}
                  <span className="accent-mark">
                    full-stack web &amp; mobile
                  </span>
                  .
                </p>
                <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">
                  {profile.summary}
                </p>
                <div className="mt-10 grid gap-x-8 gap-y-0 sm:grid-cols-2">
                  {services.map((d) => (
                    <div
                      key={d}
                      className="flex items-center gap-3 border-t border-black/6 py-4 text-sm font-medium"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-accent">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </span>
                      {d}
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Featured Work — bento grid */}
        <section id="work" className="section-gradient-2 px-5 pt-10 pb-10 sm:px-6 sm:pt-14 sm:pb-12">
          <div className="mx-auto max-w-6xl">
            {/* Bento row 1: heading left + first project right */}
            <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
              <Reveal variant="slide-left">
                <div className="flex h-full flex-col justify-center">
                  <div className="flex items-center gap-4">
                    <span className="mono text-sm text-accent">02</span>
                    <span className="kicker">Selected Work</span>
                  </div>
                  <h2 className="mt-5 max-w-md font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl">
                    {content.workHeading || "Take a look at the latest projects I've done"}
                  </h2>
                  <a
                    href="/work"
                    className="group/link mt-8 inline-flex items-center gap-2 text-sm font-semibold text-foreground"
                  >
                    <span className="border-b-2 border-accent pb-0.5 transition-colors group-hover/link:text-accent">
                      Browse all projects
                    </span>
                    <ArrowIcon width={16} height={16} className="transition-transform group-hover/link:translate-x-1" />
                  </a>
                </div>
              </Reveal>

              {/* First project — tall card */}
              <Reveal variant="slide-right" delay={100}>
                <article className="project-card group relative flex h-full flex-col overflow-hidden rounded-3xl bg-[#0f1219] text-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/40">
                  <div className="relative z-10 p-7 pb-4 sm:p-9 sm:pb-5">
                    <div className="flex flex-wrap gap-2">
                      {featuredProjects[0].tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="mono rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[0.65rem] uppercase tracking-wider text-white/70 backdrop-blur-sm transition-colors group-hover:border-accent/40 group-hover:text-accent/90"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <p className="mono mt-5 flex items-center gap-2 text-[0.65rem] uppercase tracking-wider text-white/40">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                      {featuredProjects[0].category}
                    </p>
                    <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                      {featuredProjects[0].title}
                    </h3>
                  </div>
                  <div className="relative mt-auto overflow-hidden">
                    <ProjectCardThumb index={0} />
                  </div>
                  <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-accent/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                </article>
              </Reveal>
            </div>

            {/* Bento row 2: second project + more */}
            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <Reveal variant="slide-left" delay={50}>
                <article className="project-card group relative flex h-full flex-col overflow-hidden rounded-3xl bg-[#0f1219] text-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/40">
                  <div className="relative z-10 p-7 pb-4 sm:p-9 sm:pb-5">
                    <div className="flex flex-wrap gap-2">
                      {featuredProjects[1].tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="mono rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[0.65rem] uppercase tracking-wider text-white/70 backdrop-blur-sm transition-colors group-hover:border-accent/40 group-hover:text-accent/90"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <p className="mono mt-5 flex items-center gap-2 text-[0.65rem] uppercase tracking-wider text-white/40">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                      {featuredProjects[1].category}
                    </p>
                    <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                      {featuredProjects[1].title}
                    </h3>
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/50">
                      {featuredProjects[1].description}
                    </p>
                  </div>
                  <div className="relative mt-auto overflow-hidden">
                    <ProjectCardThumb index={1} />
                  </div>
                  <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-accent/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                </article>
              </Reveal>

              {/* CTA card */}
              <Reveal variant="slide-right" delay={150}>
                <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-white/30 bg-white/20 p-12 text-center backdrop-blur-md transition-all duration-500 hover:bg-white/30">
                  <p className="mono text-xs uppercase tracking-wider text-faint">
                    {projects.length} projects total
                  </p>
                  <p className="mt-4 max-w-xs font-[family-name:var(--font-display)] text-2xl font-bold leading-snug tracking-tight">
                    Want to see more?
                  </p>
                  <p className="mt-3 max-w-xs text-sm text-muted">
                    Browse the full collection of Dynamics 365, Power Platform, and full-stack projects.
                  </p>
                  <a
                    href="/work"
                    className="btn-accent mt-8 inline-flex items-center gap-2.5 px-8 py-3.5 text-sm"
                  >
                    View all projects
                    <ArrowIcon width={16} height={16} />
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Skills — horizontal scrolling glass cards */}
        <section id="skills" className="section-gradient-3 pt-10 pb-10 sm:pt-14 sm:pb-12">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <SectionHead
              num="03"
              kicker="Capabilities"
              title="A full-stack Microsoft toolkit."
            />
            <SkillScroller competencies={competencies} />
          </div>
        </section>

        {/* Certifications */}
        <section
          id="certifications"
          className="section-gradient-1 px-5 pt-10 pb-10 sm:px-6 sm:pt-14 sm:pb-12"
        >
          <div className="mx-auto max-w-6xl">
            <SectionHead
              num="04"
              kicker="Credentials"
              title="Microsoft Certified."
            />
            <Reveal variant="fade-up">
              <div className="mt-2 flex flex-col gap-4">
                {certifications.map((cert) => (
                  <div
                    key={cert.code}
                    className="group flex items-center gap-5 rounded-2xl border border-white/40 bg-white/30 px-6 py-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/50 hover:shadow-lg"
                  >
                    {/* Microsoft logo icon */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 23 23" fill="none">
                        <rect x="0" y="0" width="11" height="11" fill="#f25022" />
                        <rect x="12" y="0" width="11" height="11" fill="#7fba00" />
                        <rect x="0" y="12" width="11" height="11" fill="#00a4ef" />
                        <rect x="12" y="12" width="11" height="11" fill="#ffb900" />
                      </svg>
                    </div>

                    {/* Cert details */}
                    <div className="flex-1">
                      <p className="font-[family-name:var(--font-display)] text-base font-semibold leading-snug text-foreground">
                        {cert.title}
                      </p>
                      <p className="mt-0.5 text-sm text-muted">
                        {cert.issuer}
                      </p>
                    </div>

                    {/* Exam code badge */}
                    <span className="mono shrink-0 rounded-full border border-white/50 bg-white/40 px-4 py-1.5 text-xs font-medium tracking-wider text-muted backdrop-blur-sm">
                      {cert.code}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Contact */}
        <section
          id="contact"
          className="section-gradient-2 px-5 pt-10 pb-12 sm:px-6 sm:pt-14 sm:pb-14"
        >
          <div className="mx-auto max-w-6xl">
            <Reveal variant="blur">
              <div className="flex items-center gap-4">
                <span className="mono text-sm text-accent">05</span>
                <span className="kicker">Contact</span>
              </div>
              <h2 className="mt-8 font-[family-name:var(--font-display)] text-[clamp(2.5rem,8vw,7rem)] font-bold leading-[0.9] tracking-tight">
                {(content.contactHeading || "Let's build\nsomething")
                  .split("\n")
                  .map((line, i, arr) => (
                    <span key={i}>
                      {line}
                      {i < arr.length - 1 ? <br /> : <span className="text-accent">.</span>}
                    </span>
                  ))}
              </h2>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-muted">
                {content.contactText ||
                  "Open to freelance full-stack and Dynamics 365 / Power Platform work. I usually reply within a day."}
              </p>

              <div className="mt-12 flex flex-wrap items-center gap-4">
                <a
                  href={`mailto:${profile.email}`}
                  className="btn-accent inline-flex items-center gap-2.5 px-7 py-4 text-sm"
                >
                  <MailIcon width={18} height={18} />
                  Send an Email
                  <ArrowIcon width={16} height={16} />
                </a>
                <a
                  href={`tel:${profile.phone.replace(/\s/g, "")}`}
                  className="btn-ghost inline-flex items-center gap-2.5 px-7 py-4 text-sm"
                >
                  <PhoneIcon width={18} height={18} />
                  Call Me
                </a>
              </div>

              <div className="mono mt-14 flex flex-wrap items-center gap-x-10 gap-y-3 text-xs uppercase tracking-wider text-faint">
                <span>{profile.location}</span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
