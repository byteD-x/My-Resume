import { defaultPortfolioData } from "@/data";
import type {
  AudienceCard,
  BilingualText,
  ContactData,
  ExperienceDetail,
  HeroData,
  ImpactItem,
  PortfolioData,
  ProjectItem,
  ServiceItem,
  SkillCategory,
  TimelineItem,
} from "@/types";
import type { Locale } from "@/lib/locale";

type ExperienceCopy = Partial<
  Pick<TimelineItem, "role" | "company" | "location" | "summary" | "keyOutcomes">
> &
  Partial<Pick<ProjectItem, "name" | "impact">> & {
    expandedDetails?: ExperienceDetail;
  };

type ImpactCopy = Partial<
  Pick<ImpactItem, "title" | "label" | "description" | "details">
>;

const selectedText = (value: BilingualText | undefined, locale: Locale) => {
  if (!value) return undefined;
  const text = value[locale] || value.zh;
  return { zh: text, en: text };
};

const enHero: HeroData = {
  name: "Xujia Du",
  title: "AI Agent / FDE Engineer",
  subtitle:
    "I work close to the business to design and ship useful AI agents, from small-team pilots to enterprise system integration. I connect AI to existing knowledge, workflows, and systems, including traditional-industry operations. I track adoption, cost, and reliability after launch.",
  location: "Remote-first · Available for Shenzhen / Nanjing / Hangzhou / Chengdu",
  bullets: [
    {
      id: "bullet-1",
      title: "Agent productization",
      description:
        "From knowledge QA and workflow automation to tool calling, with traceable, recoverable, and evaluable agent workflows.",
    },
    {
      id: "bullet-2",
      title: "Forward-deployed delivery",
      description:
        "Work close to teams and frontline workflows. Connect models to existing systems, permissions, and data through production.",
    },
    {
      id: "bullet-3",
      title: "AI adoption across industries",
      description:
        "Choose entry points for each company's size and digital foundation, starting with high-volume workflows and tracking risk as they scale.",
    },
  ],
  quickFacts: {
    role: "AI Agent / FDE Engineer",
    availability: "Remote-first · Shenzhen / Nanjing / Hangzhou / Chengdu",
    techStack: defaultPortfolioData.hero.quickFacts?.techStack ?? [],
  },
  roleSnapshot: {
    primaryRole: "AI Agent / FDE Engineer",
    secondaryRole: "Enterprise AI delivery | Backend / Full-stack",
    availability: "Remote-first",
    location: "Remote-first · Shenzhen / Nanjing / Hangzhou / Chengdu",
    updatedAt: defaultPortfolioData.hero.roleSnapshot?.updatedAt ?? "2026-03-13",
  },
};

const enImpactCopy: Record<string, ImpactCopy> = {
  "impact-rag": {
    title: "GitHub open source",
    label: "total stars",
    description:
      "Public byteD-x profile snapshot: 14 public repositories with 51 total stars and 7 forks, measured on 2026-10-12.",
    details:
      "The snapshot covers public GitHub feedback only, with a clear date and repository scope.",
  },
  "impact-wechat": {
    title: "WeChat assistant",
    label: "stars / forks",
    description:
      "The public repository has 37 stars and 5 forks as of 2026-10-12; local runtime evidence also includes a 2-second reply deadline and offline evaluations.",
    details:
      "Uses a BaseTransport boundary plus direct OpenAI-compatible chat/embedding calls to keep the reply path and runtime governance controllable.",
  },
  "impact-customer-ai": {
    title: "Customer-service runtime",
    label: "stars / forks",
    description:
      "The public repository has 4 stars and 1 fork as of 2026-10-12; 20/20 local e-commerce support cases also passed.",
    details:
      "Extends QA into a business-mountable runtime with human handoff, diagnostics, and tenant-aware plugins.",
  },
  "impact-2": {
    title: "Performance improvement",
    label: "API speedup",
    description:
      "Reduced an analytics/reporting API from about 20s to 4s through ClickHouse adoption and SQL rewriting.",
    details:
      "Manual resume evidence, not inferred from repository code.",
  },
  "impact-3": {
    title: "IPA speech prototype",
    label: "recognition runs",
    description:
      "The IPA Demo logs record 2,380 recognitions and 60 batch jobs, with up to 500 files in one batch; 50-file batches averaged 25.36s (n=23).",
    details:
      "Customer-acceptance evidence: 2,380 recognitions, 60 batches, and up to 500 files in one batch; the timing is a local prototype measurement.",
  },
  "impact-4": {
    title: "RentBox",
    label: "customer requirements shipped",
    description:
      "Delivered 27 customer requirements across mini-program, merchant, admin, device, and payment flows.",
    details:
      "Resume and delivery evidence for a multi-client rental system, including payment, device, return, settlement, and audit paths.",
  },
  "impact-5": {
    title: "Large-scale data",
    label: "million-row tables synced",
    description:
      "Synced 300+ million-row tables, migrated tens of millions of records, and used xxl-job for daily summary updates.",
    details:
      "Manual resume evidence for large-scale data synchronization and ClickHouse-backed reporting.",
  },
};

const enExperienceCopy: Record<string, ExperienceCopy> = {
  "exp-independent-developer": {
    role: "Independent Developer",
    company: "AI Applications | Full-stack Products",
    location: "Independent delivery stage",
    summary:
      "Led five representative projects across rental workflow delivery, task-platform integration, dialect ASR prototyping, customer-service runtime design, and a long-running desktop assistant, covering design, implementation, integration, testing, and runtime governance.",
    keyOutcomes: [
      "Grouped RentBox, the Paper Retrieval Task Platform, the IPA dialect speech prototype, AI Customer Service Runtime, and the WeChat Intelligent Assistant under one independent-developer work entry.",
      "Kept each child project on its own slug, evidence notes, and detail page.",
      "Aligned the public portfolio structure with the latest Chinese resume and English PDF; the public GitHub profile snapshot shows 51 stars and 7 forks across 14 repositories as of 2026-10-12.",
    ],
    expandedDetails: {
      background:
        "This is the independent-developer stage described in the latest resume, spanning multiple AI application and full-stack projects in parallel.",
      solution:
        "- Consolidated RentBox, the Paper Retrieval Task Platform, the IPA dialect speech prototype, AI Customer Service Runtime, and the WeChat Intelligent Assistant under one parent work item.\n- Kept design, implementation, integration, testing, and runtime governance visible from the parent view.\n- Preserved each child project's independent slug and detail route for drill-down.",
      result:
        "The portfolio now reflects the latest resume structure without losing access to project-level evidence.",
      role: "Independent developer",
      techStack: [
        "Java 21",
        "Spring Boot 3.5",
        "Python",
        "FastAPI",
        "Flask",
        "Quart",
        "React 19",
        "SSE",
        "MQTT",
      ],
    },
  },
  "exp-rentbox": {
    role: "Independent Developer · Full-stack Project",
    company: "Jianzhu Technology Mini Program (RentBox)",
    location: "Local project / multi-client delivery",
    summary:
      "Independently delivered a multi-client rental system covering mini program, admin console, channel portal, and Spring Boot backend across payment, deposit-free rental, device commands, returns, settlement, and audit paths.",
    keyOutcomes: [
      "Organized server, admin, channel, miniapp, shared, and deploy modules in one delivery path.",
      "Built server-side state machines for orders, payments, devices, returns, compensation, and audit logs.",
      "Integrated WeChat Pay v3, WeChat Pay Score, and device-vendor Web APIs behind gateway boundaries.",
    ],
    expandedDetails: {
      background:
        "The project targets a shared rental scenario that needs user ordering, backend operations, channel settlement, payment guarantees, and device-vendor coordination.",
      problem:
        "Payments, deposit-free authorization, device unlocks, return review, and settlement all depend on external callbacks and manual correction paths.",
      solution:
        "- Organized a multi-client monorepo around server / admin / channel / miniapp / shared modules.\n- Converged order, payment, device command, return review, and compensation into backend state machines.\n- Isolated external integrations behind DeviceGateway and DepositFreeGateway boundaries.\n- Added Flyway, tests, build checks, and host release scripts for repeatable delivery.",
      result:
        "Covered scan-to-rent, reservation, payment/deposit-free flows, device opening, return review, channel settlement, operations, and release management in a testable rental build.",
      role: "Independent developer covering product convergence, backend core, multi-client integration, and deployment.",
      techStack: [
        "Java 21",
        "Spring Boot 3.5",
        "MySQL",
        "Redis",
        "Flyway",
        "React 19",
        "TypeScript",
        "uni-app",
        "WeChat Pay",
      ],
    },
  },
  "exp-paper-retrieval-platform": {
    role: "Independent Developer · Full-stack Project",
    company: "Shuge Technology (Shenzhen) · Paper Retrieval Task Platform",
    location: "Local project / acceptance build",
    summary:
      "Built a user-facing task platform around phone verification, task creation, shared worker-table integration, SSE status updates, quota ledger, Alipay upgrade, and admin operations.",
    keyOutcomes: [
      "Built user, admin, task, payment, quota, and health-check modules with FastAPI and React.",
      "Integrated with the customer worker through a shared database contract instead of direct coupling.",
      "Used PostgreSQL triggers, LISTEN/NOTIFY, and SSE to keep task status visible.",
    ],
    expandedDetails: {
      background:
        "The customer already had a worker process for paper retrieval, while the user-facing platform needed to manage account, quota, progress, and payment workflows.",
      problem:
        "The worker should remain isolated, but users still needed clear task creation, progress tracking, and result download paths.",
      solution:
        "- Defined a shared tasks-table contract for worker integration.\n- Built FastAPI layers for auth, tasks, quota, payment callbacks, and admin operations.\n- Used PostgreSQL LISTEN/NOTIFY and SSE for realtime progress.\n- Added pytest, Vitest, and Playwright regression coverage.",
      result:
        "Created an acceptance-ready platform with a separate worker boundary and a clear production path.",
      role: "Independent full-stack developer.",
      techStack: [
        "Python",
        "FastAPI",
        "AsyncIO",
        "SQLAlchemy",
        "PostgreSQL",
        "Redis",
        "React",
        "TypeScript",
        "Playwright",
      ],
    },
  },
  "exp-sustech": {
    role: "Technical Consultant · Outsourced Project",
    company: "Shuge Technology (Shenzhen) · IPA Dialect Speech Transcription Prototype",
    location: "Shenzhen · end client: SUSTech",
    summary:
      "Delivered a locally runnable dialect-to-IPA transcription prototype with audio normalization, batch review, SSE progress, and Excel export under a short acceptance window.",
    keyOutcomes: [
      "Clarified ambiguous requirements and narrowed the scope to an acceptance-ready MVP covering local transcription, batch review, and Excel export.",
      "Normalized sample rate and channels before local ASR, then made IPA initials, finals, and tones table-driven with template validation and export.",
      "Connected batch processing, SSE progress, and Excel export; acceptance logs trace 2,380 recognitions, 60 batch jobs, and a largest batch of 500 files.",
    ],
    expandedDetails: {
      background:
        "The client needed a short-cycle proof of dialect speech transcription for research use, with enough structure for on-site review and acceptance.",
      problem:
        "The prototype had to package local ASR, normalize varied audio inputs, support batch review, and make IPA rules editable without extending the delivery window.",
      solution:
        "- Clarified the scope around local transcription, batch review, and Excel export.\n- Normalized audio with FFmpeg/Torchaudio and drove initials, finals, and tone mapping from validated Excel templates.\n- Added batch processing, SSE progress, structured export, and traceable logs for acceptance.",
      result:
        "Delivered the IPA prototype for on-site acceptance with real audio samples and a reproducible review/export path.",
      role: "Technical consultant covering scope clarification, local inference packaging, and client delivery.",
      techStack: [
        "Python",
        "Flask",
        "PyTorch",
        "Transformers",
        "Torchaudio",
        "FFmpeg",
        "SSE",
        "Excel",
      ],
    },
  },
  "exp-wechat-bot": {
    role: "Independent Developer · AI Runtime",
    company: "WeChat Intelligent Assistant",
    location: "Open-source project / long-running desktop assistant",
    summary:
      "The former script-like WeChat auto-reply tool now runs as a long-running AI assistant with access governance, layered memory, runtime diagnostics, and cost analysis.",
    keyOutcomes: [
      "Abstracted the Windows WeChat boundary with BaseTransport and moved model calls to direct OpenAI-compatible chat/embedding endpoints, separating first response from background fact, vector, profile, and corpus jobs.",
      "Built SQLite short-term memory and vector storage for runtime/exported-corpus RAG, with optional hybrid search and keyword or lightweight semantic fallback when ranking is unavailable.",
      "Added model auth, config hot reload, readiness/status/metrics APIs, sanitized diagnostics, backup/restore, controlled tools, release gates, and 27 offline smoke evaluations.",
    ],
    expandedDetails: {
      background:
        "A WeChat assistant needs stable message access, memory, diagnostics, and cost controls for long-running desktop use.",
      problem:
        "A simple reply script is difficult to maintain, observe, and control when message volume and model cost increase.",
      solution:
        "- Isolated Windows WeChat access behind BaseTransport and direct OpenAI-compatible chat/embedding endpoints.\n- Separated the first-response path from background fact extraction, vector writes, profile updates, and corpus sync; used SQLite memory plus RAG fallback.\n- Added model auth, hot reload, readiness/metrics, controlled tools, backup/restore, sanitized diagnostics, release gates, and offline smoke evaluations.",
      result:
        "The assistant has a maintainable long-running baseline with clearer runtime governance.",
      role: "Independent AI application engineer.",
      techStack: [
        "Python",
        "Quart",
        "Electron",
        "SQLite",
        "OpenAI-compatible API",
        "RAG",
        "SSE",
      ],
    },
  },
  "exp-customer-ai-runtime": {
    role: "Independent Developer · AI Runtime",
    company: "AI Customer Service Runtime",
    location: "Open-source project / business-mountable runtime",
    summary:
      "Built an AI customer-service runtime that can be mounted into host systems, connect to business tools, support human handoff, and govern knowledge/version boundaries.",
    keyOutcomes: [
      "Designed a layered runtime for channels, host bridge, core engine, business tools, plugins, and provider adaptation.",
      "Unified text, voice, and RTC access paths with intent_stack, page_context, and business_objects-aware routing.",
      "Added seven plugin extension points plus diagnostics export, rate limits, prompt redaction, and multi-tenant plugin boundaries.",
    ],
    expandedDetails: {
      background:
        "Customer service needs more than knowledge QA: it must connect to host systems, call tools, and hand off to humans.",
      problem:
        "Without explicit runtime boundaries, AI support is hard to mount, audit, extend, and operate safely.",
      solution:
        "- Designed a six-layer runtime architecture.\n- Added route confidence, intent_stack, page_context, and business_objects-aware routing.\n- Exposed seven plugin extension categories covering route, tool, auth, industry, handoff, context, and response processing.\n- Connected text, voice, RTC, diagnostics, rate limiting, and redaction paths.",
      result:
        "The customer-service QA flow now runs as a business-mountable runtime with explicit controls.",
      role: "Independent AI runtime developer.",
      techStack: ["Python", "FastAPI", "OpenAI", "RAG", "WebSocket", "RTC", "Redis"],
    },
  },
  "exp-chinasoft": {
    role: "AI Application Engineer",
    company: "Chinasoft International · RAG-QA System",
    location: "Enterprise AI QA platform",
    summary:
      "Built an enterprise AI QA platform with multi-source ingestion, hybrid retrieval, LangGraph recovery, agent autonomy, inference governance, and SDK access.",
    keyOutcomes: [
      "Combined structured, full-text, and vector retrieval.",
      "Used weighted RRF and reranking to balance hit rate and traceability, then exposed retrieve/debug evidence paths.",
      "Extended the LangGraph runtime with tool registration, DAG decomposition, reflection, layered memory, semantic caching, model-health routing, hallucination checks, and Python SDK access.",
      "GitHub feedback snapshot: 2 stars as of 2026-10-12, with 400+ regression checks in the repository evidence.",
    ],
  },
  "exp-noc": {
    role: "Backend Developer",
    company: "Medical Literature Mini Program",
    location: "Medical search and subscription backend",
    summary:
      "Built backend capabilities for medical paper retrieval, filtering, subscription, deep reading, payment points, and mini-program APIs.",
    keyOutcomes: [
      "Connected paper crawling, search APIs, and AI-assisted analysis.",
      "Supported subscription tasks and recommendation flows.",
      "Integrated WeChat Pay, points, VIP, and invitation-code operations.",
    ],
  },
  "exp-unicom": {
    role: "Backend Developer",
    company: "Operator Data and Reporting Platform",
    location: "Enterprise backend / analytics",
    summary:
      "Supported API security, reporting performance, and summary-database maintenance through auth/encryption, ClickHouse, large-table sync, and scheduled updates.",
    keyOutcomes: [
      "Improved reporting APIs from about 20s to 4s.",
      "Used ClickHouse to carry large-scale analytics queries.",
      "Synced 300+ million-row tables and scheduled daily summary updates.",
    ],
  },
  "exp-cloudpan": {
    role: "Full-stack Developer",
    company: "EasyCloudPan",
    location: "Private file-platform project",
    summary:
      "Built a privately deployable file platform covering auth, upload/download, sharing, preview, multi-tenancy, secure communication, and observability.",
    keyOutcomes: [
      "Built chunked upload, instant upload, resumable upload, and SSE progress.",
      "Added security baselines including signature replay protection and tenant isolation.",
      "Supported local one-click startup and Docker Compose deployment.",
      "GitHub feedback snapshot: 5 stars as of 2026-10-12.",
    ],
  },
  "exp-jzt-shuttle-path": {
    role: "Algorithm Developer",
    company: "JZT Four-way Shuttle Path Planning System",
    location: "Warehouse automation prototype",
    summary:
      "Led a warehouse shuttle path-planning prototype using A*, conflict detection, priority waiting, and PyQt visualization.",
    keyOutcomes: [
      "Implemented A* path search for warehouse maps.",
      "Handled multi-vehicle node and timing conflicts.",
      "Built a PyQt5 visualization and debugging tool.",
    ],
  },
  "exp-education": {
    role: "Computer Science Education",
    company: "Academic foundation",
    location: "Software engineering foundation",
    summary:
      "Built a solid computer-science foundation and converted coursework into practical full-stack and algorithm projects.",
    keyOutcomes: [
      "Graduated with a 3.8/4.5 GPA in the top 5%.",
      "Received university-level merit and student-leadership awards plus a college scholarship.",
      "Completed a bachelor's program in Data Science and Big Data Technology, building a foundation in computing and data engineering.",
    ],
  },
  "proj-independent-developer": {
    name: "Independent Developer | AI Applications and Full-stack Products",
    summary:
      "A grouped portfolio view of five representative independent projects, keeping the latest resume structure while preserving project-level detail pages.",
    impact: "Design + full-stack delivery + integration + testing + runtime governance",
    keyOutcomes: [
      "Delivered rental, paper-retrieval, dialect-ASR, customer-service-runtime, and WeChat-assistant work under one independent-developer stage.",
      "Owned scope convergence, full-stack implementation, integration, acceptance testing, and release governance across the five projects.",
      "Kept each project traceable through its own slug, technology stack, and repository or acceptance evidence.",
    ],
    expandedDetails: {
      background:
        "This grouped project entry mirrors the latest resume's independent-developer section.",
      solution:
        "- Group RentBox, the Paper Retrieval Task Platform, the IPA dialect speech prototype, AI Customer Service Runtime, and the WeChat Intelligent Assistant under one project area.\n- Keep each child project on its own detail route.\n- Reuse the current portfolio structure instead of duplicating a second detail model.",
      result:
        "The projects section now shows one parent grouping for independent work while keeping project-level drill-down intact.",
      role: "Independent developer",
      techStack: [
        "Java 21",
        "Spring Boot 3.5",
        "Python",
        "FastAPI",
        "Flask",
        "Quart",
        "React 19",
        "SSE",
        "MQTT",
      ],
    },
  },
  "proj-rentbox": {
    name: "Jianzhu Technology Mini Program (RentBox)",
    summary:
      "A shared rental mini-program system covering user flows, payment guarantees, cabinet state, channel settlement, and operations.",
    impact: "Rental workflow + payment guarantee + device integration",
    keyOutcomes: [
      "Built order state machines for rental, payment, deposit-free authorization, pickup, return, and settlement, with idempotency and replay handling for late callbacks.",
      "Validated cabinet online and closed-door state from fresh device snapshots, then routed TCP, MQTT, and HTTP commands by board and protocol code.",
      "Added retry, status-query, and scheduled compensation paths for unlock timeouts while completing 27 customer requirements across client and operations surfaces.",
    ],
  },
  "proj-paper-retrieval-platform": {
    name: "Shuge Technology (Shenzhen) · Paper Retrieval Task Platform",
    summary:
      "A user-facing task platform that isolates a customer worker through a database contract while providing task, quota, payment, and admin workflows.",
    impact: "Task platform + worker contract + payment/quota loop",
    keyOutcomes: [
      "Isolated the user-facing platform from a customer worker that only writes the shared tasks table.",
      "Used PostgreSQL LISTEN/NOTIFY, snapshot-first SSE, keep-alive, reconciliation, and polling fallback to keep asynchronous progress visible.",
      "Enforced terminal-state and result-file boundaries in the database and handled successful-task quota debit with row locks, unique ledger events, and payment verification.",
    ],
  },
  "proj-ipa-demo": {
    name: "Shuge Technology (Shenzhen) · IPA Dialect Speech Prototype",
    summary:
      "A short-cycle dialect speech transcription demo delivered for SUSTech, with local ASR, audio normalization, batch progress, IPA decomposition, and Excel export.",
    impact: "Dialect ASR prototype + structured export",
    keyOutcomes: [
      "Narrowed an ambiguous request to an acceptance-ready MVP for local transcription, batch review, and Excel export.",
      "Normalized audio before local ASR and made IPA initials, finals, and tones table-driven for repeatable review.",
      "Connected batch processing, SSE progress, and export; acceptance logs trace 2,380 recognitions, 60 batch jobs, and up to 500 files in one batch.",
    ],
  },
  "proj-customer-ai-runtime": {
    name: "AI Customer Service Runtime",
    summary:
      "An AI customer-service runtime with host mounting, tools, human handoff, knowledge controls, and multi-channel access.",
    impact: "AI runtime + intent-aware routing + 7-plugin governance",
    keyOutcomes: [
      "Unified text, voice, RTC, and host-page entry points with intent, page-context, and business-object-aware routing.",
      "Controlled side-effecting tools with allowlists, parameter validation, step limits, fail-stop, checkpoint/resume, and approval gates.",
      "Governed tenant-scoped knowledge versions, handoff queues, usage billing, readiness audits, rate limits, and prompt redaction with offline RAG evaluation.",
      "GitHub feedback snapshot: 4 stars and 1 fork as of 2026-10-12.",
    ],
  },
  "proj-wechat-bot": {
    name: "WeChat Intelligent Assistant",
    summary:
      "A long-running WeChat assistant with transport abstraction, layered memory, RAG fallback, runtime observability, and cost analytics.",
    impact: "WeChat bot + memory + runtime governance",
    keyOutcomes: [
      "Abstracted Windows WeChat access behind BaseTransport and separated first response from background fact, profile, vector, and corpus jobs.",
      "Built SQLite-backed short-term and vector memory for runtime/exported-corpus RAG, with keyword or lightweight semantic fallback when ranking is unavailable.",
      "Added model auth, hot reload, readiness/status/metrics APIs, sanitized diagnostics, backup/restore, release gates, and 27 offline smoke evaluations.",
      "GitHub feedback snapshot: 37 stars and 5 forks as of 2026-10-12.",
    ],
  },
  "proj-rag-qa-system": {
    name: "RAG-QA System",
    summary:
      "An enterprise AI QA platform with multi-source ingestion, hybrid retrieval, LangGraph recovery, agent autonomy, inference governance, retrieve/debug inspection, and Python SDK access.",
    impact: "Hybrid retrieval + agent autonomy + inference governance",
    keyOutcomes: [
      "GitHub feedback snapshot: 2 stars as of 2026-10-12.",
      "Maintained 400+ regression checks across retrieval, Agent runtime, and platform governance.",
    ],
  },
  "proj-submed": {
    name: "SubMed Mini Program",
    summary:
      "A medical paper mini-program backend covering crawl ingestion, search APIs, AI analysis, subscription tasks, and payment points.",
    impact: "Medical search + subscription + payment operations",
  },
  "proj-lexue": {
    name: "Lexue Platform",
    summary:
      "A campus education platform integrating courses, payment, exam, and realtime interaction capabilities.",
    impact: "Education platform + payment loop + realtime interaction",
  },
  "proj-cloudpan": {
    name: "EasyCloudPan",
    summary:
      "A privately deployable enterprise file platform with high-concurrency upload, security governance, identity extension, and observability.",
    impact: "Private file platform + security baseline + observability",
    keyOutcomes: [
      "GitHub feedback snapshot: 5 stars as of 2026-10-12.",
    ],
  },
  "proj-jzt-shuttle-path": {
    name: "JZT Shuttle Path Planning",
    summary:
      "A warehouse automation path-planning prototype using A*, multi-vehicle conflict handling, and PyQt visualization.",
    impact: "Warehouse automation algorithm prototype",
  },
};

const enSkillCopy: Record<string, Pick<SkillCategory, "category" | "description" | "items">> = {
  "skill-primary": {
    category: "Primary Stack",
    description: "Technologies I can use as the primary owner for delivery.",
    items: [
      "Java / Spring Boot (performance, architecture, CI/CD)",
      "Python / FastAPI / AsyncIO (AI runtime orchestration and multi-channel access)",
      "LangGraph / RAG / Qdrant (knowledge retrieval and workflow orchestration)",
      "OpenAI / Tool Calling (business-system integration)",
      "PostgreSQL / Redis / ClickHouse (storage selection and query optimization)",
      "Next.js / Vue 3 / TypeScript (front-end engineering and full-stack delivery)",
    ],
  },
  "skill-proficient": {
    category: "Delivery Stack",
    description: "Supporting capabilities used in stable project delivery.",
    items: [
      "Docker / Linux Shell / Nginx",
      "Jenkins / GitLab CI (pipelines and automated deployment)",
      "pytest / Playwright (regression and UI automation)",
      "WebSocket / SSE / RTC / ASR / TTS",
      "Multi-tenant isolation / Auth Bridge / plugin extension design",
      "Monitoring / Prometheus / Grafana dashboards",
    ],
  },
  "skill-familiar": {
    category: "Collaboration Stack",
    description: "Adjacent technologies I can pick up quickly in collaborative work.",
    items: [
      "Go (microservice development)",
      "Kubernetes (container orchestration basics)",
      "Kafka / RabbitMQ (async decoupling)",
      "Elasticsearch / MinIO (unstructured storage)",
      "AWS / Aliyun (cloud infrastructure basics)",
    ],
  },
};

const enServiceCopy: Record<string, Pick<ServiceItem, "title" | "description" | "techStack" | "milestones">> = {
  "svc-fullstack": {
    title: "Full-stack Application Development",
    description:
      "Turn business requirements into deployable systems: accounts, permissions, payments, admin workflows, and monitoring in one delivery loop.",
    techStack: ["React/Next.js", "Spring Boot", "MySQL/Redis"],
    milestones: ["Scope needs", "Design approach", "Ship milestones", "Validate together"],
  },
  "svc-ai-integration": {
    title: "AI Agent and FDE Delivery",
    description:
      "Work from business context to production: connect agents to existing systems, knowledge, permissions, and workflows with cost and safety controls.",
    techStack: ["LangChain", "OpenAI API", "RAG", "Qdrant"],
    milestones: ["Map scenarios", "Prototype", "Estimate cost", "Release gradually"],
  },
  "svc-performance": {
    title: "Performance Optimization and Refactoring",
    description:
      "Use data to locate bottlenecks and verify gains across SQL, indexes, cache, concurrency, JVM, and load testing.",
    techStack: ["MySQL", "Redis", "JVM", "Load testing"],
    milestones: ["Baseline", "Find bottleneck", "Implement fix", "Retest"],
  },
  "svc-automation": {
    title: "Automation and Data Processing",
    description:
      "Script and schedule repetitive workflows across data collection, cleaning, reporting, and process handling.",
    techStack: ["Python", "Pandas", "ETL", "Scheduled jobs"],
    milestones: ["Assess flow", "Design automation", "Pilot", "Operate"],
  },
};

const enAudienceCopy: Record<string, Pick<AudienceCard, "title" | "focus" | "primaryCTA" | "secondaryCTA" | "highlightMetrics">> = {
  hr: {
    title: "HR",
    focus: "Quickly judge role fit and candidate stability.",
    primaryCTA: "View resume evidence",
    secondaryCTA: "Download resume PDF",
    highlightMetrics: ["Remote-first", "Traceable metrics", "Resume and project loop"],
  },
  jobSeeker: {
    title: "Job seeker",
    focus: "Understand the technical growth path and reusable engineering method.",
    primaryCTA: "View project breakdown",
    secondaryCTA: "View technical map",
    highlightMetrics: ["STAR narrative", "Performance/cost signals", "Engineering practice"],
  },
  partner: {
    title: "Partner",
    focus: "Clarify collaboration model, boundaries, and delivery rhythm.",
    primaryCTA: "View delivery capability",
    secondaryCTA: "View milestones",
    highlightMetrics: ["From validation to delivery", "Clear scoping", "Verifiable milestones"],
  },
  client: {
    title: "Client",
    focus: "Go straight to business value, risk control, and communication entry points.",
    primaryCTA: "Open contact channel",
    secondaryCTA: "View preparation checklist",
    highlightMetrics: ["Performance and cost value", "Controlled release risk", "Clear response SLA"],
  },
};

const enContact: ContactData = {
  ...defaultPortfolioData.contact,
  websiteLinks: [
    {
      label: "International site (Vercel)",
      url: "https://my-resume-gray-five.vercel.app/",
    },
    {
      label: "China site (self-hosted)",
      url: "https://blog.byted.online/",
    },
  ],
  resumeButtonText: "Download resume PDF",
  ctaText: "Start a conversation",
  responseSlaText: "Usually replies within 24 hours, faster on workdays.",
  consultationChecklist: [
    "Business goal and expected launch window",
    "Current system or technical stack",
    "Budget range and collaboration model",
  ],
};

function localizeExperienceItem<T extends TimelineItem | ProjectItem>(
  item: T,
  locale: Locale,
): T {
  if (locale === "zh") return item;

  const copy = enExperienceCopy[item.id];
  return {
    ...item,
    ...copy,
    businessValue: selectedText(item.businessValue, locale),
    engineeringDepth: selectedText(item.engineeringDepth, locale),
    expandedDetails: copy?.expandedDetails ?? item.expandedDetails,
  } as T;
}

function localizeImpactItem(item: ImpactItem, locale: Locale): ImpactItem {
  if (locale === "zh") return item;
  return {
    ...item,
    ...enImpactCopy[item.id],
  };
}

function localizePortfolioData(locale: Locale): PortfolioData {
  if (locale === "zh") return defaultPortfolioData;

  return {
    ...defaultPortfolioData,
    hero: enHero,
    about: {
      zh: defaultPortfolioData.about.en,
      en: defaultPortfolioData.about.en,
    },
    aboutLenses: {
      business:
        "**Business focus**\n- Traceable answers with citations, grounding_score, and trace_id.\n- Runtime capability with checkpoints, interrupt/resume, human clarification, and regression gates.\n- Forward-deployed integration across text, voice, RTC, Auth Bridge, and business tools.\n\n**Evidence rules**\n- Key metrics are managed with metric name, baseline, target, time window, and source.\n- Incomplete data stays qualitative instead of being overstated.",
      engineering:
        "**Technical scope**\n- Python / FastAPI / AsyncIO / LangGraph / RAG / Qdrant\n- OpenAI / Tool Calling / ASR / TTS / RTC / WebSocket / SSE\n- PostgreSQL / Redis / ClickHouse / Docker / CI/CD\n- Next.js / Vue 3 / TypeScript\n\n**Delivery method**\n- Query rewrite -> hybrid retrieval -> rerank -> grounded answer -> evidence review\n- Checkpoint -> interrupt/resume -> eval/regression -> release guardrails",
    },
    impact: defaultPortfolioData.impact.map((item) =>
      localizeImpactItem(item, locale),
    ),
    timeline: defaultPortfolioData.timeline.map((item) =>
      localizeExperienceItem(item, locale),
    ),
    projects: defaultPortfolioData.projects.map((item) =>
      localizeExperienceItem(item, locale),
    ),
    skills: defaultPortfolioData.skills.map((item) => ({
      ...item,
      ...(enSkillCopy[item.id] ?? {}),
    })),
    services: defaultPortfolioData.services.map((item) => ({
      ...item,
      ...(enServiceCopy[item.id] ?? {}),
    })),
    harnessEngineering: {
      title: "Engineering Principles",
      description:
        "Automation can improve velocity, but results must be verified through build, tests, export, and link checks. For performance or cost changes, establish a baseline first and confirm gains with data.",
    },
    contact: enContact,
    audienceCards: defaultPortfolioData.audienceCards.map((item) => ({
      ...item,
      ...(enAudienceCopy[item.id] ?? {}),
    })),
  };
}

export function getPortfolioData(locale: Locale): PortfolioData {
  return localizePortfolioData(locale);
}
