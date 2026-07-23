import "server-only";
import { prisma } from "./prisma";

/**
 * Plain data accessors. Caching is handled at the page level via ISR
 * (`export const revalidate` in each page) plus on-demand `revalidatePath`
 * from the admin actions, so public pages serve prerendered HTML instead of
 * hitting the database on every request.
 */

export async function getProfile() {
  return prisma.profile.findUniqueOrThrow({ where: { id: "main" } });
}

export async function getStats() {
  return prisma.stat.findMany({ orderBy: { order: "asc" } });
}

export async function getServices() {
  return prisma.service.findMany({ orderBy: { order: "asc" } });
}

export async function getCompetencies() {
  return prisma.competency.findMany({
    orderBy: { order: "asc" },
    include: { skills: { orderBy: { order: "asc" } } },
  });
}

export async function getProjects() {
  return prisma.project.findMany({
    orderBy: { order: "asc" },
    include: { tags: { orderBy: { order: "asc" } } },
  });
}

export async function getCertifications() {
  return prisma.certification.findMany({ orderBy: { order: "asc" } });
}

export async function getExperience() {
  return prisma.experience.findMany({
    orderBy: { order: "asc" },
    include: { bullets: { orderBy: { order: "asc" } } },
  });
}

export async function getEducation() {
  return prisma.education.findMany({ orderBy: { order: "asc" } });
}

export async function getMarqueeSkills() {
  return prisma.marqueeSkill.findMany({ orderBy: { order: "asc" } });
}

export async function getResumeSummary() {
  const record = await prisma.resumeSummary.findUniqueOrThrow({
    where: { id: "main" },
  });
  return record.text;
}

export async function getSiteContent(): Promise<Record<string, string>> {
  const rows = await prisma.siteContent.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}
