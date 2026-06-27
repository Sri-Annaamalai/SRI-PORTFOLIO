// Project data drives both the Work section and /work/[slug] detail pages.
// Images use seeded picsum placeholders until real shots are dropped in.

export type Project = {
  slug: string;
  index: string;
  title: string;
  role: string;
  year: string;
  status: "Current" | "Shipped";
  domain: string;
  summary: string;
  description: string;
  highlights: string[];
  stack: string[];
  image: string;
};

const shot = (seed: string) =>
  `https://picsum.photos/seed/${seed}/1280/860`;

export const projects: Project[] = [
  {
    slug: "talent-ecosystem",
    index: "01",
    title: "Talent Ecosystem Platform",
    role: "Full Stack + AI Engineer",
    year: "2026",
    status: "Current",
    domain: "HR-tech",
    summary:
      "One platform connecting hiring, learning and a job marketplace with end-to-end journey tracking.",
    description:
      "A single unified ecosystem that follows a user from first touch through learning and into the job marketplace. The whole journey is tracked as one continuous flow rather than three disconnected products, with Agentic AI wired through every stage.",
    highlights: [
      "Unified hiring, learning and marketplace in one product",
      "End-to-end user journey tracking",
      "Agentic AI implementations across the flow",
    ],
    stack: ["Next.js", "Node.js", "PostgreSQL", "Python"],
    image: shot("talent-ecosystem-platform"),
  },
  {
    slug: "ai-video-interview",
    index: "02",
    title: "AI Video Interview Assessment",
    role: "Full Stack + AI/ML",
    year: "2025",
    status: "Shipped",
    domain: "AI assessment",
    summary:
      "AI-driven video interviews with automated feedback reports and an admin control panel.",
    description:
      "Candidates record video interviews that an AI/ML layer assesses in real time. The system generates a structured feedback report per candidate and gives admins a control panel to configure assessments and review results.",
    highlights: [
      "Real-time video assessment",
      "Automated AI feedback report generation",
      "Admin control panel",
    ],
    stack: ["React", "Node.js", "Python", "PostgreSQL"],
    image: shot("ai-video-interview-assessment"),
  },
  {
    slug: "agent-builder",
    index: "03",
    title: "Agent-Builder",
    role: "Full Stack Engineer",
    year: "2025",
    status: "Shipped",
    domain: "Automation",
    summary:
      "An in-house automation platform in the spirit of n8n, built for SNS Square workflows.",
    description:
      "A node-based internal automation platform similar to n8n, built to wire up SNS Square's own workflows. Teams compose automations visually instead of hand-coding each integration.",
    highlights: [
      "Visual node-based workflow builder",
      "Built for internal SNS Square operations",
      "Composable automation steps",
    ],
    stack: ["Node.js", "React", "PostgreSQL"],
    image: shot("agent-builder-automation"),
  },
  {
    slug: "hyrdragon",
    index: "04",
    title: "HyrDragon",
    role: "Full Stack Engineer",
    year: "2024",
    status: "Shipped",
    domain: "Recruitment",
    summary:
      "A full-stack recruitment platform that connects recruiters and candidates intelligently.",
    description:
      "A recruitment platform that matches recruiters with candidates and manages the pipeline end to end, from sourcing through to placement.",
    highlights: [
      "Recruiter and candidate matching",
      "Full pipeline management",
      "Built on a MongoDB document model",
    ],
    stack: ["React", "Node.js", "MongoDB"],
    image: shot("hyrdragon-recruitment"),
  },
  {
    slug: "milai",
    index: "05",
    title: "MilAi",
    role: "Full Stack Engineer",
    year: "2024",
    status: "Shipped",
    domain: "EdTech",
    summary:
      "An AI-powered learning platform with personalisation at its core.",
    description:
      "An EdTech product that uses AI to personalise the learning path for each user, adapting content and pace to the individual.",
    highlights: [
      "AI-driven personalisation",
      "Adaptive learning paths",
      "Typed end to end with TypeScript",
    ],
    stack: ["React", "Node.js", "TypeScript"],
    image: shot("milai-learning-platform"),
  },
];

export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);
