"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SessionProvider, signOut } from "next-auth/react";
import AdminPWA from "@/components/admin/AdminPWA";

const navLinks = [
  { label: "Dashboard", href: "/shahindevelopernkv" },
  { label: "Profile", href: "/shahindevelopernkv/profile" },
  { label: "Site Content", href: "/shahindevelopernkv/content" },
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
    <div className="flex min-h-screen bg-[#f5f5f4]">
      <AdminSidebar />
      <main className="min-h-screen flex-1 md:ml-[240px]">
        <div className="p-4 pt-16 sm:p-6 md:p-10 md:pt-10">{children}</div>
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
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-3 border-b border-gray-200 bg-white/90 px-4 backdrop-blur md:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-md p-1.5 text-gray-700 hover:bg-gray-100"
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
        <span className="font-[family-name:var(--font-display)] text-base font-bold tracking-tight text-gray-900">
          Shahin<span className="text-[#16a34a]">.</span>{" "}
          <span className="text-gray-400">Admin</span>
        </span>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-[240px] flex-col border-r border-gray-200 bg-white transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo / Title */}
        <div className="border-b border-gray-200 px-5 py-6">
          <h1 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-gray-900">
            Shahin<span className="text-[#16a34a]">.</span>
          </h1>
          <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-gray-400">
            Admin Panel
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-0.5 px-3">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-[#16a34a] text-white shadow-sm shadow-[#16a34a]/20"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom actions */}
        <div className="space-y-2 border-t border-gray-200 px-4 py-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-900"
          >
            View Site ↗
          </a>
          <button
            onClick={() => signOut({ callbackUrl: "/shahindevelopernkv/login" })}
            className="w-full rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
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
      <AdminPWA />
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </SessionProvider>
  );
}
