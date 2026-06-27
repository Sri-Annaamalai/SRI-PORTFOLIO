// Single source of truth for the portfolio. Content is a faithful port of the
// "Sri Annaamalai - Portfolio" Claude Design draft; identity/contact values are
// the real ones from the prior build.

export type Accent = "coral" | "violet";

export const site = {
  name: "Sri Annaamalai M",
  initial: "S",
  role: "Software Associate",
  company: "SNS Square",
  location: "Coimbatore, India",
  email: "sriannaamalaim@gmail.com",
  linkedin: "https://www.linkedin.com/in/sri-annaamalai-m",
  github: "https://github.com/Sri-Anna",
  twitter: "https://x.com",
  resume: "/Sri-Annaamalai-Resume.pdf",
} as const;

export const nav = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Stack", href: "#skills" },
  { label: "Experience", href: "#experience" },
] as const;

export const hero = {
  eyebrowLead: "Software Associate",
  eyebrowAccent: "@ SNS Square",
  // Each line is a clip-revealed row; `parts` carry inline accent colors.
  titleLines: [
    [{ t: "Full-Stack" }],
    [{ t: "Developer " }, { t: "&", c: "faint" as const }],
    [{ t: "AI", c: "coral" as const }, { t: " Engineer" }],
  ],
  blurb:
    "I build production-grade web applications and AI-powered products — from enterprise platforms and recruitment systems to agentic AI workflows.",
} as const;

export const marquee = [
  "React.js",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "PostgreSQL",
  "Agentic AI",
  "LLM Integration",
] as const;

export const about = {
  statement: [
    [{ t: "I combine modern frontend" }],
    [{ t: "engineering with " }, { t: "scalable", c: "violet" as const }],
    [{ t: "backends", c: "violet" as const }, { t: " and practical" }],
    [{ t: "AI integrations.", c: "coral" as const }],
  ],
  paragraph:
    "My work spans enterprise platforms, recruitment systems, learning ecosystems, workflow automation and Agentic AI applications. I enjoy taking products from idea to production — owning the frontend, the backend architecture, and the AI layer in between.",
  tags: [
    "Full-Stack Engineering",
    "AI / LLM Integration",
    "Agentic Workflows",
    "Backend Architecture",
  ],
  stats: [
    { value: 5, suffix: "+", label: "Products shipped", accent: "coral" as Accent },
    { value: 6, suffix: "", label: "Tech domains", accent: "violet" as Accent },
  ],
} as const;

export const skills = [
  {
    title: "Frontend",
    accent: "coral" as Accent,
    items: ["React.js", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "HTML / CSS"],
  },
  {
    title: "Backend",
    accent: "coral" as Accent,
    items: ["Node.js", "Express.js", "Python", "REST APIs"],
  },
  {
    title: "Databases",
    accent: "coral" as Accent,
    items: ["PostgreSQL", "MongoDB"],
  },
  {
    title: "AI & LLM",
    accent: "violet" as Accent,
    items: [
      "Agentic AI",
      "LLM Integration",
      "Prompt Engineering",
      "Local LLM Deployment",
      "LM Studio",
      "llama.cpp",
      "Gemma 27B",
    ],
  },
  {
    title: "Cloud & DevOps",
    accent: "coral" as Accent,
    items: ["AWS", "Git"],
  },
  {
    title: "Tools",
    accent: "coral" as Accent,
    items: ["VS Code", "Cursor", "Claude Code", "Windsurf", "Trae", "Antigravity"],
  },
] as const;

export type ProjectMedia =
  | { kind: "image"; src: string; alt: string }
  | { kind: "placeholder"; label: string };

export type StackTag = { label: string; accent?: Accent };

export type Project = {
  badge: string;
  badgeAccent: Accent;
  overlay: Accent;
  title: string;
  description: string;
  stack: StackTag[];
  media: ProjectMedia;
};

export const projects: Project[] = [
  {
    badge: "Enterprise · Current",
    badgeAccent: "coral" as Accent,
    overlay: "coral" as Accent,
    title: "Talent Ecosystem Platform",
    description:
      "A unified ecosystem combining recruitment, a learning platform and a job marketplace into one product — with end-to-end user tracking, personalized recommendations and an agentic AI layer powering an enterprise dashboard.",
    stack: [
      { label: "Next.js" },
      { label: "Node.js" },
      { label: "PostgreSQL" },
      { label: "Agentic AI", accent: "violet" as Accent },
    ],
    media: { kind: "placeholder", label: "Talent Ecosystem — screenshot" } as ProjectMedia,
  },
  {
    badge: "Recruitment · Flagship",
    badgeAccent: "coral" as Accent,
    overlay: "coral" as Accent,
    title: "HyrDragon — Dragon Suite",
    description:
      "A full recruitment platform spanning candidate management, hiring pipelines, resume processing and interview management — packaged as a modular super-app spotting the right talent in every candidate.",
    stack: [{ label: "React.js" }, { label: "Node.js" }, { label: "MongoDB" }],
    media: { kind: "image", src: "/assets/dragon.png", alt: "Dragon Suite — HyrDragon" } as ProjectMedia,
  },
  {
    badge: "Recruitment AI",
    badgeAccent: "violet" as Accent,
    overlay: "violet" as Accent,
    title: "AI Video Interview Assessment",
    description:
      "An AI-powered platform that lets companies run video interviews with automated evaluation — candidate scoring, AI-generated feedback reports, interview analytics and hiring insights, all under an admin control panel.",
    stack: [
      { label: "React.js" },
      { label: "Python" },
      { label: "LLMs", accent: "violet" as Accent },
      { label: "Analytics" },
    ],
    media: { kind: "image", src: "/assets/hyre.png", alt: "AI Video Interview Assessment" } as ProjectMedia,
  },
  {
    badge: "EdTech AI",
    badgeAccent: "violet" as Accent,
    overlay: "violet" as Accent,
    title: "MilAi",
    description:
      "An AI-powered learning platform that teaches and trains users toward their desired goals — course delivery, learning management and user progress tracking wrapped in an AI-assisted learning experience.",
    stack: [
      { label: "Next.js" },
      { label: "LLMs", accent: "violet" as Accent },
      { label: "LMS" },
    ],
    media: { kind: "placeholder", label: "Drop MilAi screenshot" } as ProjectMedia,
  },
  {
    badge: "Internal · Agentic AI",
    badgeAccent: "violet" as Accent,
    overlay: "violet" as Accent,
    title: "Agentic Automation Systems",
    description:
      "Built agentic automation workflows on Agent Builder, an in-house visual flow platform, shaped around each product's real use cases. Every workflow runs as a self-contained automation that other teams can reuse once it is published to the platform marketplace.",
    stack: [
      { label: "Agent Builder", accent: "violet" as Accent },
      { label: "Agentic AI", accent: "violet" as Accent },
      { label: "Workflow Automation" },
    ],
    media: { kind: "placeholder", label: "Agentic Automation Systems" } as ProjectMedia,
  },
];

export const experience = {
  company: "SNS Square",
  role: "Software Associate",
  summary:
    "Working as a Full-Stack Developer and AI Engineer across multiple enterprise products — owning frontend, backend architecture and the AI layer.",
  responsibilities: [
    { label: "Building scalable web applications", accent: "coral" as Accent },
    { label: "Developing AI-powered enterprise solutions", accent: "coral" as Accent },
    { label: "Designing backend architecture", accent: "coral" as Accent },
    { label: "Implementing Agentic AI workflows", accent: "violet" as Accent },
    { label: "Integrating LLMs into production apps", accent: "violet" as Accent },
    { label: "Building internal automation platforms", accent: "coral" as Accent },
  ],
} as const;

export const services = [
  {
    title: "Full-Stack Web Development",
    body: "End-to-end web apps with React, Next.js and Node — from polished UI to scalable backend.",
    accent: "coral" as Accent,
  },
  {
    title: "AI & LLM Engineering",
    body: "Integrating and deploying LLMs into production, including local model hosting and tuning.",
    accent: "violet" as Accent,
  },
  {
    title: "Agentic AI Workflows",
    body: "Designing autonomous, multi-step AI agents that automate real, repetitive work.",
    accent: "violet" as Accent,
  },
  {
    title: "Backend Architecture",
    body: "Designing scalable APIs, data models and services that hold up under real load.",
    accent: "coral" as Accent,
  },
  {
    title: "Workflow Automation",
    body: "Building agentic workflows on automation platforms like Agent Builder, shaped to each product's needs and reusable across teams.",
    accent: "violet" as Accent,
  },
  {
    title: "AI Product Integration",
    body: "Embedding AI into existing products with practical, reliable, well-designed UX.",
    accent: "violet" as Accent,
  },
] as const;

export const contact = {
  headline: [
    [{ t: "Let's build" }],
    [{ t: "something " }, { t: "intelligent", c: "coral" as const }],
  ],
  blurb:
    "Open to opportunities and collaborations in full-stack engineering and applied AI. Let's talk.",
  socials: [
    { label: "GitHub", href: site.github },
    { label: "LinkedIn", href: site.linkedin },
    { label: "X / Twitter", href: site.twitter },
  ],
  footerNote: "© 2026 — Built By Sri Annaamalai M",
} as const;
