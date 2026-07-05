import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin user — password comes from an env var, never hardcoded.
  // Set ADMIN_EMAIL and ADMIN_PASSWORD before running the seed, e.g.:
  //   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=yourStrongPassword npx tsx prisma/seed.ts
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const hash = await bcrypt.hash(adminPassword, 10);
    await prisma.admin.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        email: adminEmail,
        password: hash,
        name: "Mohamed Shahin M",
      },
    });
  } else {
    console.log("Skipping admin seed — set ADMIN_EMAIL and ADMIN_PASSWORD to create the admin user.");
  }

  // Profile
  await prisma.profile.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      name: "Mohamed Shahin M",
      role: "Freelance Full-Stack Developer",
      tagline: "Dynamics 365 CRM & full-stack development",
      intro: "I work across Dynamics 365 CRM and full-stack web & mobile development.",
      summary:
        "Freelance developer specializing in Microsoft Dynamics 365 CRM and full-stack web & mobile development. I build custom CRM solutions on the Power Platform — Power Pages portals, Power Automate flows, and Azure integrations — and ship end-to-end web and mobile apps with React, Node.js, and Flutter. I enjoy turning complex requirements into clean, maintainable products.",
      location: "India",
      phone: "+91 8113003220",
      email: "shahinmohamed411@gmail.com",
      linkedin: "https://www.linkedin.com/in/mohamedshahinm",
      photo: "/portrait.png",
    },
  });

  // Resume summary
  await prisma.resumeSummary.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      text: 'Results-driven Associate CRM Consultant with hands-on experience delivering end-to-end Microsoft Dynamics 365 CRM solutions across the UAE/GCC market. Proven ability to translate complex business requirements into scalable CRM customizations, Power Platform solutions, and cloud integrations. Skilled across the full Microsoft stack — including Power Pages, Power Automate, Power BI, and Azure Functions — with additional expertise in Flutter mobile development and third-party API integrations. Adept at collaborating with cross-functional teams to drive digital transformation for enterprise clients in Marina Management, Real Estate, and Financial Services sectors.',
    },
  });

  // Stats
  const stats = [
    { value: "3+", label: "Years building software", order: 0 },
    { value: "6", label: "Projects showcased", order: 1 },
    { value: "3", label: "Microsoft certifications", order: 2 },
    { value: "10+", label: "Technologies", order: 3 },
  ];
  for (const s of stats) {
    await prisma.stat.create({ data: s });
  }

  // Services
  const services = [
    "Dynamics 365 & Power Platform",
    "Full-Stack Web (React / Node)",
    "Mobile Apps (Flutter)",
    "Cloud & API Integrations",
  ];
  for (let i = 0; i < services.length; i++) {
    await prisma.service.create({ data: { name: services[i], order: i } });
  }

  // Marquee skills
  const marquee = [
    "Dynamics 365", "Power Platform", "Power Pages", "Power Automate",
    "Power BI", "Azure Functions", "Dataverse", "Flutter",
    "React", "Node.js", "C#", "DocuSign", "OAuth2 / SSO", "MongoDB",
  ];
  for (let i = 0; i < marquee.length; i++) {
    await prisma.marqueeSkill.create({ data: { name: marquee[i], order: i } });
  }

  // Competencies with skills
  const competencies = [
    {
      title: "CRM & Platform", accent: "blue", order: 0,
      skills: ["Microsoft Dynamics 365 CRM", "Dataverse", "Power Pages", "Power Automate", "Power BI", "Power Platform", "Ribbon Workbench", "XrmToolBox"],
    },
    {
      title: "Cloud & Integration", accent: "green", order: 1,
      skills: ["Azure Functions (C#)", "Azure Key Vault", "REST APIs", "DocuSign Integration", "eSignature (Emsign)", "OAuth2 / SSO"],
    },
    {
      title: "Development", accent: "blue", order: 2,
      skills: ["Flutter (iOS & Android)", "JavaScript", "Liquid Templates", "C#", "ReactJS", "Node.js", "SQL", "MongoDB", "Git"],
    },
    {
      title: "Methodology", accent: "green", order: 3,
      skills: ["Requirements Analysis", "UAT", "System Integration", "DEV-to-UAT Migration", "Functional Consulting"],
    },
  ];
  for (const c of competencies) {
    const comp = await prisma.competency.create({
      data: { title: c.title, accent: c.accent, order: c.order },
    });
    for (let i = 0; i < c.skills.length; i++) {
      await prisma.skill.create({
        data: { name: c.skills[i], order: i, competencyId: comp.id },
      });
    }
  }

  // Projects with tags
  const projects = [
    {
      title: "Marina Management Portal", category: "Dynamics 365 · Power Pages", accent: "blue", order: 0,
      description: "Customer portal on Power Pages with dynamic Liquid/JavaScript data binding, interactive SVG marina maps that color berths from real-time CRM status, and multi-contract popup support.",
      tags: ["Power Pages", "Liquid", "JavaScript", "Dataverse", "Dynamics 365"],
    },
    {
      title: "DocuSign Contract Automation", category: "Cloud Integration", accent: "green", order: 1,
      description: "Azure Functions middleware (C#) integrating Dynamics 365 with DocuSign for end-to-end contract-signing automation, with secure secret management via Azure Key Vault.",
      tags: ["C#", "Azure Functions", "Key Vault", "REST API", "DocuSign"],
    },
    {
      title: "Power BI Operations Dashboard", category: "Analytics", accent: "blue", order: 2,
      description: "Operational dashboards using DirectQuery against Dataverse with OAuth2/SSO and Row-Level Security, embedded directly inside Dynamics 365 for management reporting.",
      tags: ["Power BI", "Dataverse", "OAuth2 / SSO", "DAX"],
    },
    {
      title: "Marina Mobile App", category: "Mobile · Flutter", accent: "green", order: 3,
      description: "Cross-platform Flutter app (iOS & Android) integrated with Dataverse REST APIs for customer onboarding, berth booking, and day-to-day operational workflows.",
      tags: ["Flutter", "Dart", "Dataverse", "REST API"],
    },
    {
      title: "HYZ-Business Platform", category: "Full-Stack Web", accent: "blue", order: 4,
      description: "Full-stack features for a business platform — responsive ReactJS front-end, scalable Node.js services and RESTful APIs, and optimized MongoDB schemas.",
      tags: ["React", "Node.js", "MongoDB", "REST API"],
    },
    {
      title: "BookStore E-Commerce", category: "Full-Stack Web · MERN", accent: "green", order: 5,
      description: "Full-featured MERN e-commerce app for book sales with complete CRUD operations, a RESTful API architecture, and a production-ready UI.",
      tags: ["MongoDB", "Express", "React", "Node.js"],
    },
  ];
  for (const p of projects) {
    const proj = await prisma.project.create({
      data: {
        title: p.title, category: p.category, accent: p.accent,
        description: p.description, order: p.order,
      },
    });
    for (let i = 0; i < p.tags.length; i++) {
      await prisma.projectTag.create({
        data: { name: p.tags[i], order: i, projectId: proj.id },
      });
    }
  }

  // Certifications
  const certs = [
    { title: "Power BI Data Analyst Associate", issuer: "Microsoft Certified", code: "PL-300", order: 0 },
    { title: "Power Platform Developer Associate", issuer: "Microsoft Certified", code: "PL-400", order: 1 },
    { title: "Power Platform Fundamentals", issuer: "Microsoft Certified", code: "PL-900", order: 2 },
  ];
  for (const c of certs) {
    await prisma.certification.create({ data: c });
  }

  // Experience with bullets
  const experiences = [
    {
      title: "Associate CRM Consultant", period: "2024 — Present",
      company: "Maxcient Technologies", location: "Bengaluru, India (HQ: Dubai, UAE)", order: 0,
      bullets: [
        "Delivered end-to-end Dynamics 365 CRM implementations for enterprise clients in Marina Management and Financial Services, covering full project lifecycle from requirements gathering to UAT and go-live support",
        "Architected and deployed Power Pages customer portals with dynamic Liquid/JavaScript-driven data binding, SVG marina maps with real-time CRM berth color logic, and multi-contract popup support",
        "Engineered Azure Functions middleware (C#) integrating Dynamics 365 with DocuSign for end-to-end contract signing automation, with secure secret management via Azure Key Vault",
        "Designed NationalBonds eSignature integration using Emsign (on-premise) across a VPN/PAM network architecture, producing C# Azure Functions skeletons and detailed effort estimations",
        "Built Power BI operational dashboards using DirectQuery against Dataverse with OAuth2/SSO and Row-Level Security embedded within Dynamics 365 CRM for management reporting",
        "Configured Ribbon Workbench in XrmToolBox to manage CRM button visibility on contract entities using OrRule/ValueRule logic aligned to status-driven business workflows",
        "Managed full DEV-to-UAT migration of DocuSign/Dynamics 365/Azure Functions integration, including Azure IAM configuration, Key Vault setup, and Power Automate Connection Reference management",
        "Developed a Flutter mobile application (iOS & Android) integrated with Dataverse REST APIs, enabling customer onboarding, berth booking, and operational workflows across platforms",
        "Collaborated closely with business stakeholders to perform requirements analysis, system design, UAT support, and post-deployment optimization",
      ],
    },
    {
      title: "Assistant Software Engineer", period: "2023 — 2024",
      company: "Hyz Ventures Pvt. Ltd.", location: "", order: 1,
      bullets: [
        "Contributed as a core developer on the HYZ-Business platform, delivering features across the full stack within a collaborative team environment",
        "Built responsive, high-performance front-end interfaces using ReactJS, improving user experience and application usability",
        "Developed scalable Node.js backend services and RESTful APIs, enabling seamless data exchange across platform modules",
        "Designed and optimized MongoDB database schemas to support efficient data storage, retrieval, and application scalability",
        "Actively participated in sprint planning, code reviews, and cross-functional collaboration to ensure consistent on-time delivery",
      ],
    },
    {
      title: "MERN Full Stack Intern", period: "2023",
      company: "Futura Labs", location: "", order: 2,
      bullets: [
        "Designed and developed a full-featured e-commerce web application for book sales using the MERN stack (MongoDB, Express, ReactJS, Node.js)",
        "Implemented complete CRUD operations, RESTful API architecture, and front-end UI, delivering a production-ready application",
        "Applied performance optimization techniques to ensure scalability and maintainability",
      ],
    },
  ];
  for (const exp of experiences) {
    const e = await prisma.experience.create({
      data: {
        title: exp.title, period: exp.period, company: exp.company,
        location: exp.location, order: exp.order,
      },
    });
    for (let i = 0; i < exp.bullets.length; i++) {
      await prisma.experienceBullet.create({
        data: { text: exp.bullets[i], order: i, experienceId: e.id },
      });
    }
  }

  // Education
  const edus = [
    {
      degree: "B.Tech — Electrical & Electronics Engineering",
      school: "Ponnaiyah Ramajayam Institute of Science and Technology, Thanjavur",
      period: "June 2022", detail: "CGPA: 7.5 / 10.00", order: 0,
    },
    {
      degree: "Higher Secondary, Class XII",
      school: "Kerala Higher Secondary Education Board",
      period: "April 2018", detail: "", order: 1,
    },
    {
      degree: "SSLC, Class X",
      school: "Kerala Board of Public Examinations",
      period: "March 2015", detail: "", order: 2,
    },
  ];
  for (const edu of edus) {
    await prisma.education.create({ data: edu });
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
