"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const sections = [
  {
    label: "Profile",
    href: "/shahindevelopernkv/profile",
    description: "Manage your personal info, bio, and social links.",
  },
  {
    label: "Stats",
    href: "/shahindevelopernkv/stats",
    description: "Edit the About numbers (years, projects, etc.).",
  },
  {
    label: "Services",
    href: "/shahindevelopernkv/services",
    description: "Manage the service list shown in About.",
  },
  {
    label: "Experience",
    href: "/shahindevelopernkv/experience",
    description: "Add or edit your work experience entries.",
  },
  {
    label: "Projects",
    href: "/shahindevelopernkv/projects",
    description: "Showcase your projects with details and images.",
  },
  {
    label: "Skills",
    href: "/shahindevelopernkv/skills",
    description: "Update your technical and professional skills.",
  },
  {
    label: "Certifications",
    href: "/shahindevelopernkv/certifications",
    description: "Manage your certifications and credentials.",
  },
  {
    label: "Education",
    href: "/shahindevelopernkv/education",
    description: "Edit your educational background.",
  },
  {
    label: "Resume",
    href: "/shahindevelopernkv/resume",
    description: "Upload and manage your resume file.",
  },
  {
    label: "Photos",
    href: "/shahindevelopernkv/photos",
    description: "Manage gallery and profile photos.",
  },
];

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/shahindevelopernkv/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-lg" style={{ color: "#6b7280" }}>Loading...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "#111827" }}>
          Welcome back, {session.user?.name || "Admin"}
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#6b7280" }}>
          Manage your portfolio content from the dashboard below.
        </p>
      </div>

      {/* Section cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="block rounded-lg p-5 transition-all duration-200 border-2"
            style={{
              backgroundColor: "#1a1f2e",
              borderColor: "transparent",
              color: "#fff",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#16a34a";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "transparent";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <h3 className="text-lg font-semibold mb-2">{section.label}</h3>
            <p className="text-sm" style={{ color: "#9ca3af" }}>
              {section.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
