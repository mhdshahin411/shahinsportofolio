"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Spinner } from "@/components/admin/ui";

const sections = [
  { label: "Profile", href: "/shahindevelopernkv/profile", description: "Personal info, bio, and social links.", icon: "👤" },
  { label: "Site Content", href: "/shahindevelopernkv/content", description: "Hero, work & contact section copy.", icon: "✍️" },
  { label: "Stats", href: "/shahindevelopernkv/stats", description: "The About numbers (years, projects…).", icon: "📊" },
  { label: "Services", href: "/shahindevelopernkv/services", description: "The service list shown in About.", icon: "🧩" },
  { label: "Experience", href: "/shahindevelopernkv/experience", description: "Work experience entries.", icon: "💼" },
  { label: "Projects", href: "/shahindevelopernkv/projects", description: "Projects with details and tags.", icon: "🚀" },
  { label: "Skills", href: "/shahindevelopernkv/skills", description: "Competencies and the marquee.", icon: "⚡" },
  { label: "Certifications", href: "/shahindevelopernkv/certifications", description: "Certifications and credentials.", icon: "🎓" },
  { label: "Education", href: "/shahindevelopernkv/education", description: "Educational background.", icon: "📚" },
  { label: "Resume", href: "/shahindevelopernkv/resume", description: "Professional summary text.", icon: "📄" },
  { label: "Photos", href: "/shahindevelopernkv/photos", description: "Portrait photo.", icon: "🖼️" },
];

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/shahindevelopernkv/login");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-gray-400">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
          Welcome back, {session.user?.name || "Admin"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage every part of your portfolio below — changes go live instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#16a34a]/40 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-lg">
                {section.icon}
              </span>
              <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#16a34a]">
                {section.label}
              </h3>
            </div>
            <p className="mt-3 text-sm text-gray-500">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
