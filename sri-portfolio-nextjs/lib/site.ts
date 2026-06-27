// Single source of truth for identity, navigation, stats, stack and writing.
// Copy voice: direct, concrete verbs. No filler words. No em-dashes anywhere.

export const site = {
  name: "Sri Annaamalai M",
  initials: "SA",
  role: "Software Associate",
  roleLong: "Full Stack Developer + AI / GenAI Engineer",
  company: "SNS Square",
  location: "Coimbatore, India",
  email: "sriannaamalaicsec@gmail.com",
  linkedin: "https://www.linkedin.com/in/sri-annaamalai-m",
  github: "https://github.com/Sri-Anna",
  certification: "Databricks Generative AI Engineer Associate",
  // Hero one-liner and the line that carries the whole point of view.
  thesis: "AI is not a tool anymore. It is the OS.",
} as const;

export const nav = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Stack", href: "#stack" },
  { label: "Contact", href: "#contact" },
] as const;

// Marquee strip under the hero. Kept short, repeated by the component.
export const marquee = [
  "Full Stack",
  "AI Engineer",
  "Agentic Systems",
  "GenAI",
  "Builder",
] as const;

// Stats are honest counts pulled from the real work below. No invented precision.
export const stats = [
  { value: 5, suffix: "", label: "Products shipped" },
  { value: 5, suffix: "", label: "Domains spanned" },
  { value: 6, suffix: "", label: "Core technologies" },
] as const;

export const stackGroups = [
  {
    title: "Frontend",
    items: ["React", "Next.js", "TypeScript"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Python"],
  },
  {
    title: "Databases",
    items: ["PostgreSQL", "MongoDB"],
  },
  {
    title: "AI / ML",
    items: [
      "Agentic AI systems",
      "RAG pipelines",
      "AI report generation",
      "Local LLM hosting",
    ],
  },
  {
    title: "Local LLM",
    items: ["LM Studio", "llama.cpp", "Gemma 4B / 26B"],
  },
  {
    title: "Cloud",
    items: ["AWS"],
  },
] as const;

// The build tools the work actually gets made with.
export const vibeTools = [
  "Claude Code",
  "Cursor",
  "Windsurf",
  "Antigravity",
  "Trae",
  "VS Code",
] as const;

// Writing topics. These link out to LinkedIn until individual posts get URLs.
export const writing = [
  {
    title: "AI is the OS, not the tool",
    blurb:
      "Why the next layer of software is agentic by default, and what that changes for how teams build.",
    tag: "Agentic AI",
    href: site.linkedin,
  },
  {
    title: "GenAI as career acceleration",
    blurb:
      "Using generative systems to compress the distance between an idea and a shipped product.",
    tag: "GenAI",
    href: site.linkedin,
  },
  {
    title: "Running models on your own metal",
    blurb:
      "Local LLM hosting with LM Studio and llama.cpp, and where it beats calling an API.",
    tag: "Local LLM",
    href: site.linkedin,
  },
] as const;

export const socials = [
  { label: "LinkedIn", href: site.linkedin },
  { label: "GitHub", href: site.github },
  { label: "Email", href: `mailto:${site.email}` },
] as const;
