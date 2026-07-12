"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SessionProvider, signOut } from "next-auth/react";

const navLinks = [
  { label: "Dashboard", href: "/shahindevelopernkv" },
  { label: "Profile", href: "/shahindevelopernkv/profile" },
  { label: "Stats", href: "/shahindevelopernkv/stats" },
  { label: "Services", href: "/shahindevelopernkv/services" },
  { label: "Experience", href: "/shahindevelopernkv/experience" },
  { label: "Projects", href: "/shahindevelopernkv/projects" },
  { label: "Skills", href: "/shahindevelopernkv/skills" },
  { label: "Certifications", href: "/shahindevelopernkv/certifications" },
  { label: "Education", href: "/shahindevelopernkv/education" },
  { label: "Resume", href: "/shahindevelopernkv/resume" },
  { label: "Photos", href: "/shahindevelopernkv/photos" },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't show sidebar on the login page
  if (pathname === "/shahindevelopernkv/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <main
        className="flex-1 min-h-screen md:ml-[240px]"
        style={{ backgroundColor: "#f0eeeb" }}
      >
        <div className="p-6 md:p-10">{children}</div>
      </main>
    </div>
  );
}

function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/shahindevelopernkv") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-md"
        style={{ backgroundColor: "#0f1219", color: "#fff" }}
        aria-label="Toggle menu"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full flex flex-col transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          width: 240,
          backgroundColor: "#0f1219",
          color: "#fff",
        }}
      >
        {/* Logo / Title */}
        <div className="px-5 py-6 border-b border-white/10">
          <h1 className="text-xl font-bold tracking-tight">
            <span style={{ color: "#16a34a" }}>●</span>{" "}
            Admin Panel
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-md text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: isActive(link.href) ? "#16a34a" : "transparent",
                    color: isActive(link.href) ? "#fff" : "#9ca3af",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(link.href)) {
                      e.currentTarget.style.backgroundColor = "#1a1f2e";
                      e.currentTarget.style.color = "#fff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(link.href)) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#9ca3af";
                    }
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom actions */}
        <div className="px-5 py-4 border-t border-white/10 space-y-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-sm px-3 py-2 rounded-md border border-white/20 transition-colors"
            style={{ color: "#9ca3af" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#9ca3af";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            }}
          >
            View Site ↗
          </a>
          <button
            onClick={() => signOut({ callbackUrl: "/shahindevelopernkv/login" })}
            className="w-full text-sm px-3 py-2 rounded-md transition-colors cursor-pointer"
            style={{ backgroundColor: "#dc2626", color: "#fff" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#b91c1c";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#dc2626";
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </SessionProvider>
  );
}
