"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import crypto from "node:crypto";
import { supabaseAdmin, STORAGE_BUCKET } from "@/lib/supabase";

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  return session;
}

function revalidate() {
  // Regenerate the ISR-cached public pages so edits appear immediately.
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/resume");
  revalidatePath("/shahindevelopernkv");
}

// ─── Profile ────────────────────────────────────────────────────────────────

export async function updateProfile(data: {
  name: string;
  role: string;
  tagline: string;
  intro: string;
  summary: string;
  location: string;
  phone: string;
  email: string;
  linkedin: string;
  photo: string;
}) {
  await requireAuth();
  const profile = await prisma.profile.upsert({
    where: { id: "main" },
    update: data,
    create: { id: "main", ...data },
  });
  revalidate();
  return profile;
}

export async function updateProfilePhoto(photo: string) {
  await requireAuth();
  await prisma.profile.update({ where: { id: "main" }, data: { photo } });
  revalidate();
}

// ─── Stats ──────────────────────────────────────────────────────────────────

export async function getStatsAction() {
  await requireAuth();
  return prisma.stat.findMany({ orderBy: { order: "asc" } });
}

export async function updateStat(id: string, data: { value: string; label: string }) {
  await requireAuth();
  const stat = await prisma.stat.update({ where: { id }, data });
  revalidate();
  return stat;
}

export async function createStat(data: { value: string; label: string }) {
  await requireAuth();
  const maxOrder = await prisma.stat.aggregate({ _max: { order: true } });
  const nextOrder = (maxOrder._max.order ?? -1) + 1;
  const stat = await prisma.stat.create({ data: { ...data, order: nextOrder } });
  revalidate();
  return stat;
}

export async function deleteStat(id: string) {
  await requireAuth();
  await prisma.stat.delete({ where: { id } });
  revalidate();
}

// ─── Services ───────────────────────────────────────────────────────────────

export async function getServicesAction() {
  await requireAuth();
  return prisma.service.findMany({ orderBy: { order: "asc" } });
}

export async function updateService(id: string, data: { name: string }) {
  await requireAuth();
  const service = await prisma.service.update({ where: { id }, data });
  revalidate();
  return service;
}

export async function createService(data: { name: string }) {
  await requireAuth();
  const maxOrder = await prisma.service.aggregate({ _max: { order: true } });
  const nextOrder = (maxOrder._max.order ?? -1) + 1;
  const service = await prisma.service.create({ data: { ...data, order: nextOrder } });
  revalidate();
  return service;
}

export async function deleteService(id: string) {
  await requireAuth();
  await prisma.service.delete({ where: { id } });
  revalidate();
}

// ─── Projects ───────────────────────────────────────────────────────────────

export async function getProjectsAction() {
  await requireAuth();
  return prisma.project.findMany({
    include: { tags: { orderBy: { order: "asc" } } },
    orderBy: { order: "asc" },
  });
}

export async function updateProject(
  id: string,
  data: {
    title: string;
    category: string;
    accent: string;
    description: string;
    link: string;
    tags: string[];
  }
) {
  await requireAuth();
  const { tags, ...projectData } = data;

  await prisma.projectTag.deleteMany({ where: { projectId: id } });

  const project = await prisma.project.update({
    where: { id },
    data: {
      ...projectData,
      tags: {
        create: tags.map((name, i) => ({ name, order: i })),
      },
    },
    include: { tags: true },
  });

  revalidate();
  return project;
}

export async function createProject(data: {
  title: string;
  category: string;
  accent: string;
  description: string;
  link: string;
  tags: string[];
}) {
  await requireAuth();
  const { tags, ...projectData } = data;
  const maxOrder = await prisma.project.aggregate({ _max: { order: true } });
  const nextOrder = (maxOrder._max.order ?? -1) + 1;

  const project = await prisma.project.create({
    data: {
      ...projectData,
      order: nextOrder,
      tags: {
        create: tags.map((name, i) => ({ name, order: i })),
      },
    },
    include: { tags: true },
  });

  revalidate();
  return project;
}

export async function deleteProject(id: string) {
  await requireAuth();
  await prisma.project.delete({ where: { id } });
  revalidate();
}

// ─── Competencies ───────────────────────────────────────────────────────────

export async function getCompetenciesAction() {
  await requireAuth();
  return prisma.competency.findMany({
    include: { skills: { orderBy: { order: "asc" } } },
    orderBy: { order: "asc" },
  });
}

type SkillInput = { name: string; description: string };

export async function updateCompetency(
  id: string,
  data: { title: string; accent: string; skills: SkillInput[] }
) {
  await requireAuth();
  const { skills, ...competencyData } = data;

  await prisma.skill.deleteMany({ where: { competencyId: id } });

  const competency = await prisma.competency.update({
    where: { id },
    data: {
      ...competencyData,
      skills: {
        create: skills.map((s, i) => ({ name: s.name, description: s.description, order: i })),
      },
    },
    include: { skills: true },
  });

  revalidate();
  return competency;
}

export async function createCompetency(data: {
  title: string;
  accent: string;
  skills: SkillInput[];
}) {
  await requireAuth();
  const { skills, ...competencyData } = data;
  const maxOrder = await prisma.competency.aggregate({ _max: { order: true } });
  const nextOrder = (maxOrder._max.order ?? -1) + 1;

  const competency = await prisma.competency.create({
    data: {
      ...competencyData,
      order: nextOrder,
      skills: {
        create: skills.map((s, i) => ({ name: s.name, description: s.description, order: i })),
      },
    },
    include: { skills: true },
  });

  revalidate();
  return competency;
}

export async function deleteCompetency(id: string) {
  await requireAuth();
  await prisma.competency.delete({ where: { id } });
  revalidate();
}

// ─── Certifications ─────────────────────────────────────────────────────────

export async function getCertificationsAction() {
  await requireAuth();
  return prisma.certification.findMany({ orderBy: { order: "asc" } });
}

export async function updateCertification(
  id: string,
  data: { title: string; issuer: string; code: string }
) {
  await requireAuth();
  const cert = await prisma.certification.update({ where: { id }, data });
  revalidate();
  return cert;
}

export async function createCertification(data: {
  title: string;
  issuer: string;
  code: string;
}) {
  await requireAuth();
  const maxOrder = await prisma.certification.aggregate({ _max: { order: true } });
  const nextOrder = (maxOrder._max.order ?? -1) + 1;
  const cert = await prisma.certification.create({ data: { ...data, order: nextOrder } });
  revalidate();
  return cert;
}

export async function deleteCertification(id: string) {
  await requireAuth();
  await prisma.certification.delete({ where: { id } });
  revalidate();
}

// ─── Experience ─────────────────────────────────────────────────────────────

export async function getExperienceAction() {
  await requireAuth();
  return prisma.experience.findMany({
    include: { bullets: { orderBy: { order: "asc" } } },
    orderBy: { order: "asc" },
  });
}

export async function updateExperience(
  id: string,
  data: {
    title: string;
    period: string;
    company: string;
    location: string;
    bullets: string[];
  }
) {
  await requireAuth();
  const { bullets, ...experienceData } = data;

  await prisma.experienceBullet.deleteMany({ where: { experienceId: id } });

  const experience = await prisma.experience.update({
    where: { id },
    data: {
      ...experienceData,
      bullets: {
        create: bullets.map((text, i) => ({ text, order: i })),
      },
    },
    include: { bullets: true },
  });

  revalidate();
  return experience;
}

export async function createExperience(data: {
  title: string;
  period: string;
  company: string;
  location: string;
  bullets: string[];
}) {
  await requireAuth();
  const { bullets, ...experienceData } = data;
  const maxOrder = await prisma.experience.aggregate({ _max: { order: true } });
  const nextOrder = (maxOrder._max.order ?? -1) + 1;

  const experience = await prisma.experience.create({
    data: {
      ...experienceData,
      order: nextOrder,
      bullets: {
        create: bullets.map((text, i) => ({ text, order: i })),
      },
    },
    include: { bullets: true },
  });

  revalidate();
  return experience;
}

export async function deleteExperience(id: string) {
  await requireAuth();
  await prisma.experience.delete({ where: { id } });
  revalidate();
}

// ─── Education ──────────────────────────────────────────────────────────────

export async function getEducationAction() {
  await requireAuth();
  return prisma.education.findMany({ orderBy: { order: "asc" } });
}

export async function updateEducationItem(
  id: string,
  data: { degree: string; school: string; period: string; detail: string }
) {
  await requireAuth();
  const edu = await prisma.education.update({ where: { id }, data });
  revalidate();
  return edu;
}

export async function createEducationItem(data: {
  degree: string;
  school: string;
  period: string;
  detail: string;
}) {
  await requireAuth();
  const maxOrder = await prisma.education.aggregate({ _max: { order: true } });
  const nextOrder = (maxOrder._max.order ?? -1) + 1;
  const edu = await prisma.education.create({ data: { ...data, order: nextOrder } });
  revalidate();
  return edu;
}

export async function deleteEducationItem(id: string) {
  await requireAuth();
  await prisma.education.delete({ where: { id } });
  revalidate();
}

// ─── Marquee Skills ─────────────────────────────────────────────────────────

export async function getMarqueeAction() {
  await requireAuth();
  return prisma.marqueeSkill.findMany({ orderBy: { order: "asc" } });
}

export async function updateMarqueeSkills(skills: string[]) {
  await requireAuth();
  await prisma.marqueeSkill.deleteMany();
  await prisma.marqueeSkill.createMany({
    data: skills.map((name, i) => ({ name, order: i })),
  });
  revalidate();
}

// ─── Resume Summary ─────────────────────────────────────────────────────────

export async function getResumeSummaryAction() {
  await requireAuth();
  const summary = await prisma.resumeSummary.findUnique({ where: { id: "main" } });
  return summary?.text ?? "";
}

export async function updateResumeSummary(text: string) {
  await requireAuth();
  await prisma.resumeSummary.upsert({
    where: { id: "main" },
    update: { text },
    create: { id: "main", text },
  });
  revalidate();
}

// ─── Site Content (section copy) ─────────────────────────────────────────────

export async function getSiteContentAction() {
  await requireAuth();
  const rows = await prisma.siteContent.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, string>;
}

export async function updateSiteContent(content: Record<string, string>) {
  await requireAuth();
  for (const [key, value] of Object.entries(content)) {
    await prisma.siteContent.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
  revalidate();
}

// ─── Photo Upload ───────────────────────────────────────────────────────────

export async function uploadPhoto(formData: FormData) {
  await requireAuth();

  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file provided");

  if (!supabaseAdmin) {
    throw new Error(
      "Supabase Storage is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filename = `${crypto.randomUUID()}.${ext}`;
  const bytes = await file.arrayBuffer();

  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(filename, bytes, {
      contentType: file.type || "image/jpeg",
      upsert: true,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filename);

  revalidate();
  return data.publicUrl;
}
