import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import ProjectCardThumb from "@/components/ProjectCardThumb";
import Footer from "@/components/Footer";
import { ArrowIcon } from "@/components/icons";
import { getProjects } from "@/lib/db-data";

export const metadata: Metadata = {
  title: "Work — Mohamed Shahin M",
  description:
    "Selected projects by Mohamed Shahin M — Dynamics 365, Power Platform, and full-stack web & mobile.",
};

export const revalidate = 3600;

export default async function WorkPage() {
  const rawProjects = await getProjects();
  const projects = rawProjects.map((p) => ({ ...p, tags: p.tags.map((t) => t.name) }));
  return (
    <>
      <Navbar />
      <main className="section-gradient-2 pt-28 pb-14">
        <section className="mx-auto max-w-6xl px-5 sm:px-6">
          <Reveal>
            <a
              href="/"
              className="mono mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-wider text-muted transition-colors hover:text-accent"
            >
              <ArrowIcon width={14} height={14} className="rotate-180" />
              Back to home
            </a>
            <div className="flex items-center gap-4">
              <span className="mono text-sm text-accent">02</span>
              <span className="kicker">All Projects</span>
            </div>
            <h1 className="mt-5 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
              Things I&apos;ve designed &amp; built.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              A mix of Dynamics 365 / Power Platform solutions and full-stack web
              &amp; mobile apps.
            </p>
          </Reveal>

          {/* Bento grid — alternating large/small rows */}
          {Array.from({ length: Math.ceil(projects.length / 2) }, (_, row) => {
            const left = projects[row * 2];
            const right = projects[row * 2 + 1];
            const isEven = row % 2 === 0;
            return (
              <div key={row} className={`mt-8 first:mt-12 grid gap-8 ${isEven ? "lg:grid-cols-[1fr_1.2fr]" : "lg:grid-cols-[1.2fr_1fr]"}`}>
                {left && (
                  <Reveal variant="slide-left" delay={0}>
                    <article className="project-card group relative flex h-full flex-col overflow-hidden rounded-3xl bg-[#0f1219] text-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/40">
                      <div className="relative z-10 p-7 pb-4 sm:p-9 sm:pb-5">
                        <div className="flex flex-wrap gap-2">
                          {left.tags.slice(0, 3).map((t) => (
                            <span key={t} className="mono rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[0.65rem] uppercase tracking-wider text-white/70 backdrop-blur-sm transition-colors group-hover:border-accent/40 group-hover:text-accent/90">
                              {t}
                            </span>
                          ))}
                        </div>
                        <p className="mono mt-5 flex items-center gap-2 text-[0.65rem] uppercase tracking-wider text-white/40">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                          {left.category}
                        </p>
                        <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                          {left.title}
                        </h3>
                        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/50">
                          {left.description}
                        </p>
                      </div>
                      <div className="relative mt-auto overflow-hidden">
                        <ProjectCardThumb index={row * 2} />
                      </div>
                      <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-accent/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                    </article>
                  </Reveal>
                )}
                {right && (
                  <Reveal variant="slide-right" delay={100}>
                    <article className="project-card group relative flex h-full flex-col overflow-hidden rounded-3xl bg-[#0f1219] text-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/40">
                      <div className="relative z-10 p-7 pb-4 sm:p-9 sm:pb-5">
                        <div className="flex flex-wrap gap-2">
                          {right.tags.slice(0, 3).map((t) => (
                            <span key={t} className="mono rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[0.65rem] uppercase tracking-wider text-white/70 backdrop-blur-sm transition-colors group-hover:border-accent/40 group-hover:text-accent/90">
                              {t}
                            </span>
                          ))}
                        </div>
                        <p className="mono mt-5 flex items-center gap-2 text-[0.65rem] uppercase tracking-wider text-white/40">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                          {right.category}
                        </p>
                        <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                          {right.title}
                        </h3>
                        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/50">
                          {right.description}
                        </p>
                      </div>
                      <div className="relative mt-auto overflow-hidden">
                        <ProjectCardThumb index={row * 2 + 1} />
                      </div>
                      <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-accent/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                    </article>
                  </Reveal>
                )}
              </div>
            );
          })}
        </section>
      </main>

      <Footer />
    </>
  );
}
