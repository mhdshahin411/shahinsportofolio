import { profile } from "@/lib/data";
import { LinkedInIcon } from "./icons";

export default function Footer() {
  return (
    <footer className="border-t border-white/30 bg-white/20 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-12 sm:flex-row sm:justify-between sm:px-6">
        {/* Brand mark */}
        <span className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-foreground">
          Shahin<span className="text-accent">.</span>
        </span>

        {/* Social */}
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="mono inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/30 px-4 py-2 text-xs uppercase tracking-wider text-muted backdrop-blur-sm transition-all hover:border-accent hover:text-accent"
        >
          <LinkedInIcon width={14} height={14} /> LinkedIn
        </a>

        {/* Copyright */}
        <p className="mono text-xs uppercase tracking-wider text-faint">
          © 2020 Shahin. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
