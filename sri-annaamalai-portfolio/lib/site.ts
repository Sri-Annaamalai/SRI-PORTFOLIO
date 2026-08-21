// Single source of truth for the portfolio. Every value here is drawn from the
// resume (SRI_AN~1.DOC, updated Jun 2026); nothing is invented. Copy carries
// zero em-dashes and zero en-dashes by rule.

export type Accent = "coral" | "violet";

export const site = {
  name: "Sri Annaamalai M",
  initial: "S",
  // Job title and positioning are different things: the title is what the
  // contract says, the discipline is what the work actually is.
  role: "Software Associate",
  discipline: "GenAI & Agentic AI Engineer",
  company: "SNS Square",
  location: "Bengaluru, India",
  email: "sriannaamalaim@gmail.com",
  linkedin: "https://www.linkedin.com/in/sri-annaamalai-m",
  github: "https://github.com/Sri-Anna",
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
    [{ t: "GenAI" }, { t: " &", c: "faint" as const }],
    [{ t: "Agentic " }, { t: "AI", c: "coral" as const }],
    [{ t: "Engineer" }],
  ],
  blurb:
    "I design multi-agent systems and RAG pipelines, and ship them as production full-stack products.",
} as const;

export const marquee = [
  "LangChain",
  "LangGraph",
  "RAG",
  "Multi-Agent Systems",
  "Python",
  "Next.js",
  "Databricks",
  "PostgreSQL",
] as const;

export const about = {
  statement: [
    [{ t: "I design multi-agent" }],
    [{ t: "systems and " }, { t: "RAG pipelines,", c: "violet" as const }],
    [{ t: "then ship them as" }],
    [{ t: "production products.", c: "coral" as const }],
  ],
  paragraph:
    "Two years in, my work runs from LangChain and LangGraph orchestration to RAG pipelines over vector databases, and out through the React and Node front of the product. I have built AI recruitment tooling end to end, run the deployment pipeline, and served as PMO on delivery. I like owning the whole path from architecture to the thing a user actually clicks.",
  tags: ["Agentic AI", "RAG Pipelines", "Multi-Agent Systems", "Full-Stack Engineering"],
  stats: [
    { value: 2, suffix: "+", label: "Years experience", accent: "coral" as Accent },
    { value: 17, suffix: "", label: "Certifications", accent: "violet" as Accent },
  ],
} as const;

export const skills = [
  {
    title: "Languages",
    accent: "coral" as Accent,
    items: ["Python", "JavaScript", "TypeScript", "Java", "C", "SQL"],
  },
  {
    title: "AI & Agents",
    accent: "violet" as Accent,
    items: [
      "LangChain",
      "LangGraph",
      "RAG",
      "Agentic AI",
      "Multi-Agent Systems",
      "Prompt Engineering",
    ],
  },
  {
    title: "Models & ML",
    accent: "violet" as Accent,
    items: [
      "OpenAI API",
      "Google Gemini",
      "Local LLM Deployment",
      "LM Studio",
      "llama.cpp",
      "TensorFlow",
      "PyTorch",
    ],
  },
  {
    title: "Frontend",
    accent: "coral" as Accent,
    items: ["React.js (Vite)", "Next.js", "Tailwind CSS", "HTML / CSS"],
  },
  {
    title: "Backend & Data",
    accent: "coral" as Accent,
    items: ["Node.js", "Express.js", "REST APIs", "PostgreSQL", "MongoDB", "Razorpay API"],
  },
  {
    title: "Cloud & Tooling",
    accent: "coral" as Accent,
    items: ["Databricks", "Delta Lake", "Apache Spark", "Docker", "Git", "Jira", "Postman"],
  },
] as const;

export type StackTag = { label: string; accent?: Accent };

/**
 * `layout` picks the composition so the section never repeats one rhythm five
 * times: the flagship runs full-bleed, the two projects that actually have
 * screenshots run as splits, and the two without media run as text-only index
 * rows rather than leaving a hole where an image should be.
 */
export type ProjectLayout = "feature" | "split" | "index";

export type Project = {
  domain: string;
  status?: string;
  accent: Accent;
  title: string;
  description: string;
  stack: StackTag[];
  layout: ProjectLayout;
  image?: { src: string; alt: string };
};

export const projects: Project[] = [
  {
    domain: "Enterprise",
    status: "Current",
    accent: "coral",
    title: "Talent Ecosystem Platform",
    description:
      "A unified ecosystem combining recruitment, a learning platform and a job marketplace into one product, with end-to-end user tracking, personalized recommendations and an agentic AI layer powering an enterprise dashboard.",
    stack: [
      { label: "Next.js" },
      { label: "Node.js" },
      { label: "PostgreSQL" },
      { label: "Agentic AI", accent: "violet" },
    ],
    layout: "feature",
  },
  {
    domain: "Recruitment",
    status: "Flagship",
    accent: "coral",
    title: "HyrDragon: Dragon Suite",
    description:
      "A full technical assessment and recruitment platform spanning candidate management, hiring pipelines, resume processing and interview management. Built on React and Node with Python AI microservices behind it, and Razorpay wired through backend, frontend and API layers for end-to-end transactions.",
    stack: [
      { label: "React.js (Vite)" },
      { label: "Node.js" },
      { label: "MongoDB" },
      { label: "Razorpay API" },
    ],
    layout: "split",
    image: { src: "/assets/dragon.png", alt: "Dragon Suite recruitment dashboard" },
  },
  {
    domain: "Recruitment AI",
    accent: "violet",
    title: "AI Video Interview Assessment",
    description:
      "AI features across the hiring loop: a resume analyzer, a candidate matchmaker, a job description generator, automated evaluation and AI feedback reports, plus a proctoring system, all served by Python microservices on OpenAI and Google Gemini.",
    stack: [
      { label: "Python" },
      { label: "OpenAI API", accent: "violet" },
      { label: "Google Gemini", accent: "violet" },
      { label: "React.js" },
    ],
    layout: "split",
    image: { src: "/assets/hyre.png", alt: "AI video interview assessment dashboard" },
  },
  {
    domain: "EdTech AI",
    accent: "violet",
    title: "MilAi",
    description:
      "An AI-powered learning platform that teaches and trains users toward their desired goals, covering course delivery, learning management and progress tracking inside an AI-assisted learning experience.",
    stack: [{ label: "Next.js" }, { label: "LLMs", accent: "violet" }, { label: "LMS" }],
    layout: "index",
  },
  {
    domain: "Internal",
    status: "Agentic AI",
    accent: "violet",
    title: "Agentic Automation Systems",
    description:
      "Multi-agent orchestration for enterprise automation, built with LangChain and LangGraph on Agent Builder, an in-house visual flow platform. Each workflow runs as a self-contained automation other teams reuse once it is published to the platform marketplace.",
    stack: [
      { label: "LangChain", accent: "violet" },
      { label: "LangGraph", accent: "violet" },
      { label: "Agent Builder" },
      { label: "Workflow Automation" },
    ],
    layout: "index",
  },
];

/** Pre-SNS Square engineering projects, kept separate from shipped products. */
export const labs = [
  {
    year: "2024",
    title: "Realtime Hand Gesture Recognition",
    body: "Skin tone detection and fingertip tracking with OpenCV, classifying hand gestures live from a camera feed.",
    stack: ["OpenCV", "Python"],
    accent: "coral" as Accent,
  },
  {
    year: "2022",
    title: "Diabetic Retinopathy Detection",
    body: "A CNN trained on retinal images to detect diabetic retinopathy, tuned for high sensitivity in clinical image classification.",
    stack: ["TensorFlow", "CNN", "Python"],
    accent: "violet" as Accent,
  },
  {
    year: "2021",
    title: "IoT Home Automation",
    body: "Remote control of home appliances over a web interface, running on a NodeMCU ESP8266 with IoT messaging protocols.",
    stack: ["NodeMCU ESP8266", "IoT"],
    accent: "coral" as Accent,
  },
] as const;

export type RolePoint = { label: string; accent: Accent };
export type Role = {
  title: string;
  company: string;
  location: string;
  period: string;
  current?: boolean;
  points: RolePoint[];
};

export const experience: { roles: Role[] } = {
  roles: [
    {
      title: "Software Associate",
      company: "SNS Square",
      location: "Bengaluru, Karnataka",
      period: "Sep 2025 to present",
      current: true,
      points: [
        {
          label:
            "Design and deploy Agentic AI systems with LangChain and LangGraph, running multi-agent orchestration for enterprise automation workflows.",
          accent: "violet" as Accent,
        },
        {
          label:
            "Build and optimize RAG pipelines pairing vector databases with OpenAI and Google Gemini for document retrieval and Q&A.",
          accent: "violet" as Accent,
        },
        {
          label:
            "Lead architecture design for scalable GenAI solutions, holding the line on production reliability, performance and cost.",
          accent: "coral" as Accent,
        },
        {
          label:
            "Mentor junior associates on Agentic AI practice and write up LLM integration patterns for internal use.",
          accent: "coral" as Accent,
        },
      ],
    },
    {
      title: "Junior Software Associate",
      company: "SNS Square",
      location: "Coimbatore, Tamil Nadu",
      period: "Jul 2024 to Sep 2025",
      points: [
        {
          label:
            "Developed a full-stack technical assessment and recruitment platform on React (Vite), Node.js and Python AI microservices.",
          accent: "coral" as Accent,
        },
        {
          label:
            "Built the AI feature set: resume analyzer, candidate matchmaker, job description generator, feedback reports, evaluation and proctoring.",
          accent: "violet" as Accent,
        },
        {
          label:
            "Integrated the Razorpay payment gateway across backend, frontend and API layers for end-to-end transaction handling.",
          accent: "coral" as Accent,
        },
        {
          label:
            "Served as PMO, coordinating cross-functional teams, sprint planning, resource allocation and on-time delivery.",
          accent: "coral" as Accent,
        },
        {
          label:
            "Designed and deployed ML models with TensorFlow and PyTorch, covering preprocessing, evaluation and performance tuning.",
          accent: "violet" as Accent,
        },
      ],
    },
  ],
};

/** 17 certifications, grouped by issuer so the section is six blocks, not a
 *  seventeen-row list. */
export type Certification = { name: string; date: string };
export type CertGroup = { issuer: string; accent: Accent; items: Certification[] };

export const certifications: CertGroup[] = [
  {
    issuer: "Databricks",
    accent: "violet" as Accent,
    items: [
      { name: "Certified Generative AI Engineer Associate", date: "Jan 2026" },
      { name: "Certified Data Engineer Associate", date: "May 2026" },
    ],
  },
  {
    issuer: "IBM",
    accent: "violet" as Accent,
    items: [
      { name: "RAG and Agentic AI", date: "Dec 2025" },
      { name: "Enterprise Design Thinking Practitioner", date: "Feb 2022" },
      { name: "Enterprise Design Thinking Co-Creator", date: "Feb 2022" },
    ],
  },
  {
    issuer: "Microsoft Azure AI",
    accent: "violet" as Accent,
    items: [
      { name: "Build an Azure AI Vision Solution", date: "Feb 2024" },
      { name: "Intelligent Document Processing with Azure AI Document Intelligence", date: "Feb 2024" },
      { name: "Natural Language Processing with Azure AI Language", date: "Feb 2024" },
    ],
  },
  {
    issuer: "Oracle Cloud",
    accent: "coral" as Accent,
    items: [
      { name: "OCI Certified Architect Associate", date: "Jan 2022" },
      { name: "OCI Architect Professional", date: "Feb 2021" },
    ],
  },
  {
    issuer: "NPTEL",
    accent: "coral" as Accent,
    items: [
      { name: "Introduction to Industry 4.0 and IIoT", date: "Nov 2023" },
      { name: "Software Conceptual Design", date: "Mar 2022" },
    ],
  },
  {
    issuer: "Programs",
    accent: "coral" as Accent,
    items: [
      { name: "Wipro TalentNext Java Full Stack", date: "Oct 2023" },
      { name: "PrepInsta DSA in Java", date: "Jan 2023" },
      { name: "PrepInsta Java Nano Degree", date: "Jan 2023" },
      { name: "Simplilearn Introduction to Android Studio", date: "2023" },
      { name: "TCS iON Career Edge Young Professional", date: "Oct 2021" },
    ],
  },
];

export const services = [
  {
    title: "Agentic AI Systems",
    body: "Multi-agent orchestration with LangChain and LangGraph, designed around the work a team actually repeats.",
    accent: "violet" as Accent,
  },
  {
    title: "RAG Pipelines",
    body: "Retrieval over vector databases wired to OpenAI or Gemini, tuned for answer quality rather than demo quality.",
    accent: "violet" as Accent,
  },
  {
    title: "LLM Integration",
    body: "Getting models into production, including local hosting, prompt design and cost control at real volume.",
    accent: "violet" as Accent,
  },
  {
    title: "Full-Stack Web Development",
    body: "End-to-end web apps with React, Next.js and Node, from polished UI to scalable backend.",
    accent: "coral" as Accent,
  },
  {
    title: "Backend Architecture",
    body: "Designing scalable APIs, data models and services that hold up under real load.",
    accent: "coral" as Accent,
  },
  {
    title: "Delivery & PMO",
    body: "Sprint planning, resource allocation and deployment pipelines, carried through to an on-time release.",
    accent: "coral" as Accent,
  },
] as const;

export const contact = {
  headline: [
    [{ t: "Let’s build" }],
    [{ t: "something " }, { t: "intelligent", c: "coral" as const }],
  ],
  blurb: "Open to opportunities and collaborations in applied AI and full-stack engineering.",
  channels: [
    { label: "Email", value: site.email, href: `mailto:${site.email}` },
    { label: "LinkedIn", value: "sri-annaamalai-m", href: site.linkedin },
    { label: "GitHub", value: "Sri-Anna", href: site.github },
  ],
  footerNote: "Built by Sri Annaamalai M, 2026",
} as const;
