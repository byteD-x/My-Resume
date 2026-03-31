import { PortfolioData } from "./types";

// ==========================================
// 默认内容 JSON（用于 reset）
// ==========================================
export const defaultPortfolioData: PortfolioData = {
  hero: {
    name: "杜旭嘉",
    title: "AI 应用工程师（RAG / Agent）",
    subtitle:
      "聚焦检索增强、智能体运行时与业务系统集成，持续将原型方案推进为可验证、可维护、可接入真实业务的工程系统。",
    location: "远程优先 ｜ 可到岗：深圳 / 南京 / 杭州 / 成都",
    bullets: [
      {
        id: "bullet-1",
        title: "检索与编排",
        description:
          "混合检索 + LangGraph 运行时，覆盖 citations / grounding_score / interrupt-resume / step_events",
      },
      {
        id: "bullet-2",
        title: "业务集成",
        description:
          "文本 / 语音 / RTC 三通道接入，支持 Auth Bridge、业务工具、转人工与租户级插件扩展",
      },
      {
        id: "bullet-3",
        title: "成本与交付",
        description:
          "做过 5x 提速与 40% 成本下降，并通过自动化校验与回归门禁控制交付质量",
      },
    ],
    quickFacts: {
      role: "AI 应用工程师（RAG / Agent）",
      availability: "远程优先｜可到岗：深圳 / 南京 / 杭州 / 成都",
      techStack: [
        "Java/Spring Boot",
        "Python/FastAPI/AsyncIO",
        "Quart/OpenAI",
        "LangGraph/RAG/Qdrant",
        "OpenAI/ASR/TTS/RTC",
        "PostgreSQL/Redis/ClickHouse",
        "Next.js/Vue 3/TypeScript",
        "Docker/CI/CD",
      ],
    },
    roleSnapshot: {
      primaryRole: "AI 应用工程师（RAG / Agent）",
      secondaryRole: "后端 / 全栈工程交付",
      availability: "远程优先",
      location: "远程优先｜可到岗：深圳 / 南京 / 杭州 / 成都",
      updatedAt: "2026-03-13",
    },
  },

  about: {
    zh: "AI 应用工程师，主攻检索增强、运行时编排与业务系统集成；注重把原型能力沉淀为可验证、可维护、可接入真实业务的系统，并坚持用仓库、测试与指标证明结果。",
    en: "AI application engineer focused on RAG, workflow orchestration, and business-system integration, with a bias toward recoverable, testable, and evidence-backed delivery.",
  },

  aboutLenses: {
    business: [
      "**业务要点**",
      "- 问答可信：支持 citations、grounding_score、trace_id，回答可追溯",
      "- 运行时能力：支持 checkpoint、interrupt/resume、人工澄清与回归门禁",
      "- 业务接入：覆盖文本 / 语音 / RTC、Auth Bridge 与 Business Tool",
      "- 成本与性能：做过 40% 推理降本，也做过 20s+ → 4s 的后端性能治理",
      "",
      "**数据约束**",
      "- 关键数字统一按“指标名-起点-终点-时间窗-来源”管理",
      "- 无法给出完整口径的数据仅作定性描述",
    ].join("\n"),
    engineering: [
      "**技术范围**",
      "- Python / FastAPI / AsyncIO / LangGraph / RAG / Qdrant",
      "- OpenAI / Tool Calling / ASR / TTS / RTC / WebSocket / SSE",
      "- PostgreSQL / Redis / ClickHouse / Docker / CI/CD",
      "- Next.js / Vue 3 / TypeScript",
      "",
      "**交付方法**",
      "- Query rewrite -> hybrid retrieval -> rerank -> grounded answer -> evidence review",
      "- Checkpoint -> interrupt/resume -> eval/regression -> release guardrails",
    ].join("\n"),
  },

  impact: [
    {
      id: "impact-rag",
      title: "知识问答",
      value: "3路",
      label: "检索召回",
      description:
        "RAG-QA System：结构 / 全文 / 向量三路召回 + 加权 RRF + rerank，兼顾命中率与答案可追溯性",
      details: [
        "将分散资料整理为可持续同步、可引用出处的企业知识问答系统，减少检索与答复成本。",
        "采用结构、全文、向量三路召回，结合加权 RRF 与 rerank，兼顾命中率和可追溯性。",
        "问答与检索链路统一接入 LangGraph 运行时，并补齐多知识库、多源连接器、chunk 治理、调试与评测回归。",
      ].join("\n"),
      linkedExperienceId: "exp-chinasoft",
      icon: "TrendingUp",
      colSpan: "md:col-span-1",
      bg: "bg-sky-50",
      verification: {
        sourceType: "repo",
        sourceLabel: "GitHub 仓库 README / docs / tests",
        sourceUrl: "https://github.com/byteD-x/rag-qa-system",
        verifiedAt: "2026-03-13",
        confidence: "high",
        level: "strict",
      },
    },
    {
      id: "impact-wechat",
      title: "开源新作",
      value: "5+",
      label: "开源关注 (Stars)",
      description:
        "微信智能助手：面向微信场景的长期运行机器人，补齐分层记忆、成本治理与运行观测能力",
      details: [
        "交付可长期运行的微信智能助手，兼顾接入稳定性、排障效率与成本治理。",
        "以 `BaseTransport` 抽象微信接入边界，并用 `LangChain + LangGraph` 重构回复主链与后台任务。",
        "构建三层记忆、可降级 RAG、运行状态接口、配置审计与成本分析能力，补齐长期运行所需的治理链路。",
      ].join("\n"),
      linkedExperienceId: "exp-wechat-bot",
      icon: "Star",
      colSpan: "md:col-span-1",
      bg: "bg-indigo-50",
      githubRepo: "byteD-x/wechat-bot",
      verification: {
        sourceType: "repo",
        sourceLabel: "README / docs / tests / GitHub Stars",
        sourceUrl: "https://github.com/byteD-x/wechat-bot",
        verifiedAt: "2026-03-19",
        confidence: "high",
        level: "strict",
      },
    },
    {
      id: "impact-customer-ai",
      title: "客服运行时",
      value: "7+",
      label: "插件扩展点",
      description:
        "智能客服运行时：统一文本/语音/RTC、宿主挂载、插件扩展与知识治理，将问答能力扩展为可接业务的运行时",
      details: [
        "将客服能力扩展为可接业务、可转人工、可嵌入宿主系统的服务运行时。",
        "通过渠道接入、宿主桥接、核心引擎、业务增强、插件平台和提供商适配六层解耦，统一文本、语音、RTC 与挂载接入。",
        "补齐路由治理、知识版本管理、诊断导出、限流与提示词脱敏，便于持续运营与审计。",
      ].join("\n"),
      linkedExperienceId: "exp-customer-ai-runtime",
      icon: "Bot",
      colSpan: "md:col-span-1",
      bg: "bg-teal-50",
      verification: {
        sourceType: "repo",
        sourceLabel: "README / docs / tests / recent commits",
        sourceUrl: "https://github.com/byteD-x/customer-ai-runtime",
        verifiedAt: "2026-03-19",
        confidence: "high",
        level: "strict",
      },
    },
    {
      id: "impact-2",
      title: "性能极致",
      value: "5x",
      label: "API 提速",
      description:
        "活动统计/报表接口 20s → 4s (5x)，把“等半分钟”变成“秒开”（ClickHouse + SQL 改写）",
      details: [
        "将核心报表从约 20 秒压到 4 秒，更适合高频运营决策。",
        "通过 ClickHouse 代替 MySQL 承载海量数据查询，提升统计与报表场景的响应效率。",
        "该结果来自本地 PDF 简历中的联通项目表述，而非仓库代码推断。",
      ].join("\n"),
      linkedExperienceId: "exp-unicom",
      icon: "Zap",
      colSpan: "md:col-span-1",
      bg: "bg-blue-50",
      verification: {
        sourceType: "manual",
        verifiedAt: "2026-03-31",
        confidence: "high",
        level: "strict",
      },
    },
    {
      id: "impact-3",
      title: "成本治理",
      value: "5个",
      label: "成本接口",
      description:
        "定价快照、价格刷新、会话汇总与明细接口齐备，把成本治理从经验优化升级为可观测能力",
      details: [
        "建立模型、会话和价格来源统一可查的成本口径。",
        "补齐定价快照、价格刷新、汇总与明细接口，并在消息 `metadata` 中回写成本字段。",
        "对缺少 token 或定价的信息做估算与标记区分，避免把不完整数据当成精确结果。",
      ].join("\n"),
      linkedExperienceId: "exp-wechat-bot",
      icon: "TrendingDown",
      colSpan: "md:col-span-1",
      bg: "bg-emerald-50",
      verification: {
        sourceType: "repo",
        sourceLabel: "README / RELEASE_UPDATES / cost analytics tests",
        sourceUrl: "https://github.com/byteD-x/wechat-bot",
        verifiedAt: "2026-03-19",
        confidence: "high",
        level: "strict",
      },
    },
    {
      id: "impact-4",
      title: "全栈交付",
      value: "100%",
      label: "闭环能力",
      description:
        "从需求到上线：方案/开发/测试/部署/监控闭环（CI/CD + 可观测性 + 回滚）",
      details: [
        "交付范围覆盖方案、开发、测试、部署、监控与回滚。",
        "需求按可验收里程碑拆解，关键节点明确 What、Why 和验证方式。",
        "通过 lint、build、test、e2e、静态导出与链接检查控制交付质量。",
      ].join("\n"),
      icon: "Code2",
      colSpan: "md:col-span-2",
      rowSpan: "md:row-span-2",
      isFocal: true,
      verification: {
        sourceType: "manual",
        sourceLabel: "项目合集与履历交叉验证",
        verifiedAt: "2026-02-15",
        confidence: "high",
        level: "strict",
      },
    },
    {
      id: "impact-5",
      title: "海量数据",
      value: "300+",
      label: "百万级表同步",
      description:
        "300+ 张百万级数据表同步，数千万条数据迁移至汇总库，并用 `xxl-job` 做每日动态更新",
      details: [
        "完成 300+ 张百万级数据表同步，并将数千万条数据迁移到汇总库。",
        "采用 ClickHouse 代替 MySQL 存储海量数据，支撑更快的查询速度。",
        "通过 `xxl-job` 实现汇总库每日动态更新，优化数据管理流程。",
      ].join("\n"),
      linkedExperienceId: "exp-unicom",
      icon: "Database",
      colSpan: "md:col-span-1",
      bg: "bg-purple-50",
      verification: {
        sourceType: "manual",
        verifiedAt: "2026-03-31",
        confidence: "high",
        level: "strict",
      },
    },
  ],

  timeline: [
    {
      id: "exp-wechat-bot",
      year: "2025.12 - 至今",
      role: "独立开发者 · 开源项目",
      company: "微信智能助手",
      location: "开源项目",
      summary:
        "独立设计并持续迭代 Windows 微信生态智能助手运行时，围绕稳定接入、分层记忆、可降级 RAG 与运行治理，交付可长期运行的桌面化 AI 助手。",
      techTags: [
        "Python",
        "Quart",
        "Asyncio",
        "LangGraph",
        "RAG",
        "Electron",
        "SQLite",
        "ChromaDB",
        "BaseTransport",
        "Cost Analytics",
      ],
      highlighted: true,
      keyOutcomes: [
        "抽象 `BaseTransport` 接入层并以 `LangGraph` 重构回复主链，将同步回复与后台成长任务解耦，建立适合长期运行的微信助手架构。",
        "构建 SQLite 短期记忆、运行期向量记忆与导出语料 RAG 三层记忆体系，支持轻量重排与可选本地 `Cross-Encoder` 自动回退，平衡召回质量与部署成本。",
        "补齐 `/api/status`、`/api/metrics`、`/api/config/audit`、成本分析与 GitHub Release 发布链路，完善运行观测、配置审计与交付能力。",
        "落地配置热重载与回复预算控制机制，支持 2 秒回复 deadline 策略，降低桌面场景下的阻塞风险并提升可用性。",
      ],
      audienceTags: ["hr", "jobSeeker", "partner", "client"],
      businessValue: {
        zh: "将微信自动回复脚本升级为具备接入治理、运行诊断与成本分析能力的桌面智能助手，降低长期运行和排障成本。",
        en: "Turned a script-like WeChat bot into a long-running AI assistant with diagnosability and cost control.",
      },
      engineeringDepth: {
        zh: "覆盖 `BaseTransport` 抽象、LangGraph 运行时、三层记忆、可降级 RAG、配置热重载与 Prometheus 风格观测链路。",
        en: "Showcases transport abstraction, a LangGraph runtime, degradable RAG, config hot reload, cost analytics, and runtime observability.",
      },
      verification: [
        {
          sourceType: "repo",
          sourceLabel: "README / HIGHLIGHTS / SYSTEM_CHAINS / tests / recent commits",
          sourceUrl: "https://github.com/byteD-x/wechat-bot",
          verifiedAt: "2026-03-19",
          confidence: "high",
          level: "strict",
        },
      ],
      expandedDetails: {
        background:
          "目标是在 Windows 微信生态下交付可长期运行的智能助手，同时兼顾消息接入稳定性、记忆增强、配置治理与运行诊断。",
        problem:
          "微信接入边界依赖桌面环境且稳定性敏感；如果把记忆、RAG、诊断和配置能力耦合在主回复链路内，系统很难长期运行与排障。",
        solution:
          "- **重构运行时**：以 `LangChain + LangGraph` 编排 `load_context / build_prompt / invoke / finalize_request`，把同步回复与后台成长任务分层处理。\n- **抽象接入边界**：将微信入口统一收敛到 `BaseTransport`，隔离 Windows 微信版本、权限与消息通道的环境差异。\n- **构建三层记忆**：落地 SQLite 短期记忆、运行期向量记忆与导出语料 RAG，并支持轻量重排与可选本地 `Cross-Encoder` 自动回退。\n- **补齐治理能力**：完善 `/api/status`、`/api/metrics`、`/api/config/audit`、成本分析、配置热重载与 GitHub Release 发布链路。",
        result:
          "交付面向 Windows 微信生态的长期运行智能助手，形成从消息接入、记忆增强到运行观测、配置治理与发布交付的完整闭环。",
        role: "独立开发者",
        techStack: [
          "Python",
          "Quart",
          "Asyncio",
          "LangGraph",
          "Electron",
          "ChromaDB",
          "SQLite",
          "httpx",
        ],
        links: [
          {
            label: "GitHub Repo",
            url: "https://github.com/byteD-x/wechat-bot",
          },
        ],
      },
    },
    {
      id: "exp-customer-ai-runtime",
      year: "2026.02 - 至今",
      role: "独立开发者 · 开源项目",
      company: "智能客服运行时",
      location: "开源项目",
      summary:
        "独立设计企业级智能客服运行时，统一文本、语音、RTC 与宿主挂载接入，并通过插件体系和知识治理将问答能力扩展为可接业务的服务运行时。",
      techTags: [
        "Python",
        "FastAPI",
        "AsyncIO",
        "Pydantic",
        "OpenAI",
        "Voice / RTC",
        "Qdrant",
        "Plugin Runtime",
        "Multi-tenant",
        "Auth Bridge",
      ],
      highlighted: true,
      keyOutcomes: [
        "设计渠道接入、宿主桥接、核心引擎、业务增强、插件平台、提供商适配六层架构，统一文本、Voice API、RTC WebSocket 与 FastAPI 挂载 4 类接入形态。",
        "实现 `route_confidence` 分层、`intent_stack` 回退及 `page_context` / `business_objects` 感知路由，在低置信度与高风险场景优先澄清或转人工。",
        "提供 Route、BusinessTool、Handoff、Industry、AuthBridge、Context、Response 7 类插件扩展点，支持宿主鉴权复用与业务能力按需挂载。",
        "补齐知识版本管理、chunk 优化、消息级反馈、诊断导出、request_id 贯通、限流与提示词脱敏，强化多租户治理与审计能力。",
      ],
      audienceTags: ["hr", "jobSeeker", "partner", "client"],
      businessValue: {
        zh: "将 AI 客服从单纯知识问答扩展为可挂载、可转人工、可接业务且可治理的运行时能力，降低宿主系统改造成本。",
        en: "Turned AI customer service from simple knowledge Q&A into a governed runtime that can be mounted, connected to business tools, and handed off to humans.",
      },
      engineeringDepth: {
        zh: "覆盖六层运行时架构、7 类插件注册中心、Auth Bridge、多提供商适配、知识治理、反馈闭环与多租户边界控制。",
        en: "Showcases a layered runtime, plugin registry, auth bridging, provider adaptation, knowledge governance, diagnostics export, and multi-tenant boundary control.",
      },
      verification: [
        {
          sourceType: "repo",
          sourceLabel: "README / architecture / API tests / recent commits",
          sourceUrl: "https://github.com/byteD-x/customer-ai-runtime",
          verifiedAt: "2026-03-19",
          confidence: "high",
          level: "strict",
        },
      ],
      expandedDetails: {
        background:
          "目标是在统一多通道接入和宿主系统复用的前提下，交付可转人工、可治理、可行业扩展的客服运行时。",
        problem:
          "如果将文本、语音、RTC、业务工具、鉴权和转人工能力写死在单一流程中，宿主系统难接入、租户边界难控制，运行诊断和知识治理也难持续演进。",
        solution:
          "- **搭建分层运行时**：将渠道接入、宿主桥接、核心引擎、业务增强、插件平台、提供商适配六层解耦，统一 4 类接入模式。\n- **设计路由协同机制**：通过 `route_confidence`、`intent_stack`、`page_context`、`business_objects` 组合决策，在低置信度或高风险场景优先澄清或转人工。\n- **沉淀插件扩展体系**：提供 Route、BusinessTool、Handoff、Industry、AuthBridge、Context、Response 7 类扩展点，支持插件启停、范围过滤与宿主鉴权复用。\n- **补齐治理能力**：完善知识版本、chunk 优化、反馈闭环、健康巡检、诊断导出、request_id 贯通、限流与提示词脱敏。",
        result:
          "交付可独立运行或宿主挂载的客服运行时，形成覆盖业务接入、人工协同、知识治理、租户隔离与运行审计的工程基线。",
        role: "独立开发者（架构设计与核心开发）",
        techStack: [
          "Python 3.13",
          "FastAPI",
          "AsyncIO",
          "Pydantic",
          "OpenAI",
          "Qdrant",
          "阿里云/腾讯云语音",
          "Milvus/Pinecone",
        ],
        links: [
          {
            label: "GitHub Repo",
            url: "https://github.com/byteD-x/customer-ai-runtime",
          },
        ],
      },
    },
    {
      id: "exp-sustech",
      year: "2025.11 - 2025.12",
      role: "外包技术顾问",
      company: "南方科技大学",
      location: "深圳",
      summary:
        "独立承接并交付 `IPA Demo` 原型：围绕中文方言语音转写做出可演示、可批处理、可导出的 Web 系统，帮助客户快速验证技术路线。",
      techTags: [
        "Flask",
        "PyTorch",
        "Transformers",
        "Torchaudio",
        "ASR",
        "Pandas",
        "FFmpeg",
      ],
      highlighted: false,
      keyOutcomes: [
        "将本地方言 ASR 模型封装为 Flask Web 服务，支持上传转写、流式转写、浏览器录音与示例音频体验，形成可直接演示的闭环。",
        "补齐音频标准化、批量并发处理、IPA 声母/韵母/声调拆分与日志落盘，使原型既能跑通演示也便于问题定位。",
        "支持 Excel 模板校验、批量识别结果导出与系统手册下载，降低非技术用户试用与验收成本。",
      ],
      audienceTags: ["partner", "client"],
      businessValue: {
        zh: "把研究型语音能力收敛成客户可直接试用的演示系统，帮助对方在短周期内验证技术可行性与交互形态，降低立项风险。",
        en: "Validated solution feasibility with a rapid prototype, reducing project initiation risk.",
      },
      engineeringDepth: {
        zh: "覆盖本地 ASR 推理封装、音频预处理、批量并发处理、结构化结果导出与面向演示场景的 Web 化交付。",
        en: "Demonstrates rapid domain knowledge absorption and strict project timeline management.",
      },
      verification: [
        {
          sourceType: "experience",
          sourceLabel: "项目验收确认",
          verifiedAt: "2026-02-10",
          confidence: "medium",
          level: "strict",
        },
        {
          sourceType: "repo",
          verifiedAt: "2026-03-31",
          confidence: "high",
          level: "strict",
        },
      ],
      expandedDetails: {
        background:
          "客户希望验证中文方言语音自动转写在科研场景中的可行性，需要在较短周期内拿到可直接演示和试用的原型系统。",
        problem:
          "既要把本地 ASR 模型稳定封装成 Web 应用，又要兼顾批量上传、浏览器录音、结果导出和非技术用户可操作性，时间窗口也比较紧。",
        solution:
          "- **推理封装**：基于 Flask + `transformers` ASR pipeline 封装本地模型，并结合 `torchaudio`、`ffmpeg` 做音频格式标准化。\n- **交互链路**：支持多文件上传、流式上传、浏览器录音、示例音频体验与上传后再次转写，覆盖演示与试用主路径。\n- **结果结构化**：通过 Excel 表维护声调/声母/韵母映射，输出 IPA 拆分结果，并支持文本/Excel 导出。\n- **可运维性**：加入请求日志、错误日志、批量并发处理和系统手册页面，方便验收与后续排障。",
        result:
          "按期交付 `IPA Demo` 原型，形成“上传/录音 -> 转写 -> IPA 拆分 -> 导出”的完整演示闭环，可用于后续工程化讨论与立项评估。",
        role: "全栈顾问（需求收敛、后端实现、演示交付）",
        techStack: [
          "Python",
          "Flask",
          "PyTorch",
          "Transformers",
          "Torchaudio",
          "Pandas",
          "OpenPyXL",
          "FFmpeg",
        ],
      },
    },
    {
      id: "exp-chinasoft",
      year: "2025.04 - 2025.09",
      role: "后端/全栈工程师",
      company: "中软国际",
      location: "西安",
      summary:
        "负责企业知识问答系统核心研发，完成多源文档接入、三路混合检索、LangGraph 可恢复运行时与知识治理工作台建设。",
      techTags: [
        "FastAPI",
        "LangGraph",
        "PostgreSQL",
        "Qdrant",
        "RAG",
        "Vue 3",
        "FastEmbed",
        "Docker",
        "LangChain",
      ],
      highlighted: true,
      keyOutcomes: [
        "设计结构检索、全文检索、向量检索三路召回链路，结合加权 RRF 融合与 rerank，支持 `citations`、`grounding_score` 与 `trace_id` 返回。",
        "将 Gateway 问答链路与 KB 检索链路改造为 LangGraph 运行时，支持 checkpoint、interrupt/resume、人工澄清与 `step_events`。",
        "建设 ingest 与知识治理工作台，支持多知识库、多源连接器、chunk 拆分/合并/禁用及 retrieve/debug 调试能力。",
        "建立 smoke-eval 与 regression gate 回归门禁，将检索质量、可恢复执行与发布验证纳入同一交付流程。",
      ],
      audienceTags: ["hr", "jobSeeker", "partner"],
      businessValue: {
        zh: "将分散文档沉淀为可持续同步、可追溯引用的企业知识问答能力，降低资料检索与答复成本，并为后续连接器扩展和运营审计打下基础。",
        en: "Turned scattered documents into an enterprise knowledge QA capability with continuous sync and traceable citations.",
      },
      engineeringDepth: {
        zh: "覆盖三路混合检索、LangGraph 工作流编排、知识治理、连接器安全边界与评测回归体系。",
        en: "Demonstrates integrated engineering across hybrid retrieval, LangGraph orchestration, knowledge governance, connector boundaries, and evaluation baselines.",
      },
      verification: [
        {
          sourceType: "experience",
          sourceLabel: "中软国际项目归档",
          verifiedAt: "2026-03-13",
          confidence: "medium",
          level: "strict",
        },
        {
          sourceType: "repo",
          sourceLabel: "GitHub 仓库 README / docs/reference / tests",
          sourceUrl: "https://github.com/byteD-x/rag-qa-system",
          verifiedAt: "2026-03-13",
          confidence: "high",
          level: "strict",
        },
      ],
      expandedDetails: {
        background:
          "企业资料分散在本地目录、Notion 等多源，业务希望把制度、FAQ、项目文档沉淀为可检索、可引用、可持续同步的知识库问答系统。",
        problem:
          "传统单路检索难以同时覆盖标题、关键词与语义混合场景，问答链路缺少可解释恢复机制，文档接入与 chunk 质量治理也缺乏统一工作台。",
        solution:
          "- **搭建混合检索**：结构、全文、向量三路召回配合 query rewrite、加权 RRF 与 rerank，提升复杂问题场景下的证据命中率。\n- **重构可恢复运行时**：在 Gateway 与检索层引入 LangGraph，支持 checkpoint、interrupt/resume、`step_events` 与人工澄清。\n- **补齐知识治理**：建设多知识库、多源连接器、chunk 治理、retrieve/debug、审计与回归门禁能力。",
        result:
          "形成面向中文企业场景的 RAG 问答系统，支持 grounded answer、引用溯源、多源同步、检索调试与可恢复执行，并具备持续回归验证能力。",
        role: "后端/AI 应用工程师",
        techStack: [
          "FastAPI",
          "LangGraph",
          "Vue 3",
          "PostgreSQL",
          "Qdrant",
          "FastEmbed",
        ],
        links: [
          {
            label: "GitHub Repo",
            url: "https://github.com/byteD-x/rag-qa-system",
          },
        ],
      },
    },
    {
      id: "exp-noc",
      year: "2024.08 - 2024.10",
      role: "后端开发实习生",
      company: "国家骨科临床研究中心",
      location: "远程",
      summary:
        "参与 `SubMed` 医学论文检索小程序后端：围绕 PubMed 抓取、AI 搜索、深度分析、订阅推送与微信支付形成科研信息服务闭环。",
      techTags: [
        "Django",
        "MySQL",
        "Redis",
        "Celery",
        "PubMed",
        "OpenAI",
        "WeChat Mini Program",
        "WeChat Pay",
      ],
      highlighted: false,
      keyOutcomes: [
        "搭建 PubMed 抓取、文章入库、DOI/期刊补全与定时任务链路，为骨科领域论文检索提供持续更新的数据底座。",
        "实现 AI 关键词生成、AI 检索与深度分析接口，降低医学专家从自然语言问题到可用检索结果的门槛。",
        "补齐收藏、订阅、推送历史、积分/VIP、微信支付等业务能力，把内容服务做成可持续运营的小程序后端。",
      ],
      audienceTags: ["hr", "jobSeeker"],
      businessValue: {
        zh: "把医学论文获取、筛选、订阅和深度阅读串成一条连续流程，降低专家跟踪前沿研究的时间成本。",
        en: "Greatly improved efficiency for researchers to access frontier information.",
      },
      engineeringDepth: {
        zh: "覆盖爬取入库、搜索接口、AI 辅助分析、订阅任务、支付积分体系与小程序 API 设计。",
        en: "Demonstrates requirements analysis and system architecture in a vertical domain (Medical).",
      },
      verification: [
        {
          sourceType: "experience",
          sourceLabel: "实习证明",
          verifiedAt: "2026-02-10",
          confidence: "medium",
          level: "strict",
        },
        {
          sourceType: "repo",
          verifiedAt: "2026-03-31",
          confidence: "high",
          level: "strict",
        },
      ],
      expandedDetails: {
        background:
          "医学专家需要持续跟踪骨科等方向的最新论文，但通用搜索入口噪音大、订阅和深度阅读流程割裂，难以形成稳定科研工作流。",
        problem:
          "系统既要稳定抓取和入库 PubMed 论文，又要支持面向小程序的搜索、收藏、订阅、深度分析、支付积分和用户行为治理，业务链路较长。",
        solution:
          "- **数据底座**：以 Django + MySQL 建模论文、主题、订阅、收藏、推送历史等核心实体，并通过 PubMed spider、DOI/期刊补全命令和 Celery 任务维护数据更新。\n- **搜索与分析**：提供关键词检索、AI 关键词生成、AI 搜索、深度分析与个性化推荐接口，降低从问题到论文集合的检索成本。\n- **用户与运营**：实现收藏、订阅频率/渠道配置、推送历史、积分记录、VIP、邀请码与反馈体系。\n- **交易闭环**：接入微信支付，支持会员/积分商品购买和支付回调处理，支撑小程序持续运营。",
        result:
          "形成面向医学专家的小程序后端闭环，覆盖论文抓取、检索、AI 分析、订阅推送与会员积分能力，可支撑日常科研信息获取与运营迭代。",
        role: "后端开发（检索链路、业务 API、任务与数据模型）",
        techStack: [
          "Python",
          "Django",
          "MySQL",
          "Redis",
          "Celery",
          "PubMed",
          "OpenAI API",
          "WeChat Pay",
        ],
      },
    },
    {
      id: "exp-unicom",
      year: "2024.05 - 2024.08",
      role: "后端开发实习生",
      company: "中国联通陕西省分公司",
      location: "西安 · 数字化部",
      summary:
        "参与触点赋能中心、陕西运营平台和数据中台相关开发：完成接口二次授权、查询性能优化、海量数据同步与汇总库日更链路建设。",
      techTags: [
        "Java",
        "ClickHouse",
        "MySQL",
        "xxl-job",
        "API Security",
        "Data Migration",
        "Performance Tuning",
        "Responsive Web",
      ],
      highlighted: true,
      keyOutcomes: [
        "改造对外 API，实现接口第二次授权认证，并对前后端请求做初步加解密优化，使载荷与响应数据在浏览器 F12 中不可直接见。",
        "优化活动查询接口，将响应时间从 20s+ 压到约 4s；在海量数据场景下以 ClickHouse 代替 MySQL，查询速度达到毫秒级。",
        "完成 300+ 张百万级数据表同步，并将数千万条数据迁移至汇总库，通过 `xxl-job` 实现每日动态更新。",
        "维护并二次开发陕西号码复通接口，完成基于既有模型的自动扫描与开机逻辑；同时开发能力管理页面及其简单响应式前后端逻辑。",
      ],
      audienceTags: ["hr", "jobSeeker", "partner"],
      businessValue: {
        zh: "同时支撑了运营平台接口安全、报表查询效率和数据中台汇总更新，让业务系统更快、更稳，也更便于持续维护。",
        en: "Improved API security, analytics performance, and summary-database maintenance for the operator platform.",
      },
      engineeringDepth: {
        zh: "覆盖接口鉴权与加解密、ClickHouse 海量数据承载、百万级表同步、`xxl-job` 定时汇总更新，以及兼顾前后端配合的工程实践。",
        en: "Covers API auth/encryption, ClickHouse-backed large-scale querying, large-table sync, xxl-job scheduling, and cross-stack delivery.",
      },
      verification: [
        {
          sourceType: "manual",
          verifiedAt: "2026-03-31",
          confidence: "high",
          level: "strict",
        },
      ],
      expandedDetails: {
        background:
          "联通数字化部需要同时支撑运营平台接口能力、数据中台建设和省市级汇总数据管理，系统既要能跑业务，也要能承载持续增长的数据规模。",
        problem:
          "一方面活动查询接口耗时高、海量数据查询压力大；另一方面对外 API 安全、号码复通接口维护、汇总库动态更新和前后端协作也都需要同步推进。",
        solution:
          "- **接口与安全**：改造对外 API，加入第二次授权认证，并对请求与响应做初步加解密处理。\n- **性能与存储**：优化活动查询接口，将响应时间从 `20s+` 降到约 `4s`；使用 ClickHouse 替代 MySQL 承载海量数据查询。\n- **数据平台**：完成 `300+` 张百万级数据表同步，并将数千万条数据迁移到汇总库。\n- **持续更新与交付**：使用 `xxl-job` 驱动汇总库每日动态更新，同时开发能力管理页面和相关前后端逻辑。",
        result:
          "联通运营相关系统在接口安全、查询性能和数据汇总更新上都得到明显改善，部分海量查询达到毫秒级，汇总库具备稳定的日更能力。",
        role: "后端开发",
        techStack: [
          "Java",
          "ClickHouse",
          "MySQL",
          "xxl-job",
          "API Auth / Encryption",
          "Responsive Web",
        ],
      },
    },
    {
      id: "exp-cloudpan",
      year: "2024.04 - 2026.02",
      role: "全栈开发 · 开源项目",
      company: "EasyCloudPan",
      location: "开源项目（本地 + Docker）",
      summary:
        "主导企业内网部署网盘系统建设，完成认证、上传下载、分享转存、文件预览、多租户、安全通信与可观测体系的全栈交付，并同时支持本地一键启动与 Docker 全栈部署。",
      techTags: [
        "Java 21",
        "Spring Boot 3.2",
        "Spring Security",
        "OAuth2",
        "MyBatis-Flex",
        "Flyway",
        "PostgreSQL",
        "Redis",
        "MinIO/S3",
        "Vue 3",
        "Docker Compose",
        "Prometheus/Grafana",
      ],
      highlighted: true,
      keyOutcomes: [
        "构建“分片上传 + 秒传 + 断点续传 + SSE 状态回传”主链路，结合 `FileChannel.transferTo()` 零拷贝合并与并发控制，支持 1000+ 并发上传，成功率 >99.5%（README 指标口径）。",
        "完成 PostgreSQL 复合索引、游标分页与 Caffeine / Redis 多级缓存治理，使 API P95 <500ms、P99 <1s、数据库查询 P95 <100ms，慢查询减少 80%（README 指标口径）。",
        "落地 HMAC-SHA256 请求签名防重放、JWT 双 Token + 黑名单、`@FileAccessCheck`、Magic Number 校验与多租户隔离，形成文件平台安全闭环。",
        "建立“本地一键启动 + Docker 全栈部署 + 健康检查 + Prometheus/Grafana + Web Vitals 入库”工程基线，使核心 P0/P1 流程可复现验证。",
      ],
      audienceTags: ["hr", "jobSeeker", "partner", "client"],
      businessValue: {
        zh: "提供可私有化部署的一体化文件平台，兼顾高并发上传、安全治理、身份接入扩展与可观测交付，降低企业文件服务的稳定性与安全风险。",
        en: "Delivered a privately deployable cloud-drive platform that balances performance, security, and observability.",
      },
      engineeringDepth: {
        zh: "覆盖 Java 21 虚拟线程、上传状态机、签名防重放、OAuth 扩展接入、多租户隔离、Web Vitals 采集与脚本化验收，具备可回归验证的工程交付能力。",
        en: "Covers virtual-thread concurrency, upload-state governance, signature replay protection, OAuth extensibility, tenant isolation, and observability with script-based verification.",
      },
      verification: [
        {
          sourceType: "repo",
          sourceLabel:
            "GitHub 仓库、README、RESUME_EasyCloudPan 文档与代码锚点",
          sourceUrl: "https://github.com/byteD-x/easyCloudPan",
          verifiedAt: "2026-02-24",
          confidence: "high",
          level: "strict",
        },
      ],
      expandedDetails: {
        background:
          "项目目标是把网盘能力沉淀为可企业内部署的文件平台，并保持本地一键启动与 Docker 全栈部署两条链路一致可用。",
        problem:
          "需要同时解决大文件上传稳定性、热点查询与深分页性能、安全鉴权一致性、第三方登录接入复杂度，以及上线后的监控与告警闭环。",
        solution:
          "- **重构上传链路**：基于 Java 21 虚拟线程实现分片上传、断点续传、秒传与 `FileChannel.transferTo()` 零拷贝合并，并通过 SSE 回传状态。\n- **优化数据性能**：落地 PostgreSQL 复合索引、游标分页、Caffeine(L1)/Redis(L2) 多级缓存、布隆过滤器与分级 TTL，降低回源与深分页开销。\n- **完善安全体系**：建设请求签名防重放、JWT 双 Token + 黑名单、`@FileAccessCheck`、Magic Number 校验与 `X-Tenant-Id` 多租户隔离。\n- **补齐身份与观测**：接入 GitHub / Google / Microsoft OAuth 登录，并通过 Actuator、Micrometer、Prometheus、Grafana 与 Web Vitals 建立可观测闭环。",
        result:
          "形成可私有化部署的一体化文件平台：API P95 <500ms、P99 <1s、数据库查询 P95 <100ms、慢查询减少 80%、缓存命中率 >90%、上传成功率 >99.5%（README 指标口径）。",
        role: "全栈开发（架构设计、后端核心、前端联调、部署验收）",
        techStack: [
          "Java 21",
          "Spring Boot 3.2",
          "Spring Security",
          "OAuth2",
          "MyBatis-Flex",
          "Flyway",
          "PostgreSQL",
          "Redis",
          "MinIO/S3",
          "Vue 3",
          "Docker Compose",
          "Prometheus",
          "Grafana",
        ],
      },
    },
    {
      id: "exp-jzt-shuttle-path",
      year: "2023.05 - 2023.07",
      role: "项目经理 / 算法研发",
      company: "九州通四向穿梭车路径规划系统",
      location: "本地项目",
      summary:
        "主导仓储四向穿梭车路径规划原型开发，基于 A* 与冲突消解策略完成多车协同路径搜索，并构建 PyQt 可视化仿真工具。",
      techTags: ["Python", "A*", "Path Planning", "PyQt5", "Concurrency"],
      highlighted: false,
      keyOutcomes: [
        "设计 A* 路径搜索算法，完成复杂仓储地图下的最优路径求解与启发式搜索实现。",
        "实现多车冲突检测与优先级等待策略，处理节点占用与时序冲突，验证多车协同调度可行性。",
        "开发 PyQt5 可视化仿真界面，支持地图编辑、起终点设置、路径步进调试及地图保存/加载。",
      ],
      audienceTags: ["hr", "partner"],
      businessValue: {
        zh: "以低成本验证自动化仓储调度算法的可行性，为后续仓储设备调度系统建设提供算法依据。",
        en: "Verified feasibility of warehouse automation scheduling algorithms at low cost.",
      },
      engineeringDepth: {
        zh: "覆盖图搜索算法、冲突消解逻辑、仓储地图建模与图形化界面开发。",
        en: "Demonstrates synthesis of graph search algorithms, concurrent programming, and GUI development.",
      },
      verification: [
        {
          sourceType: "manual",
          verifiedAt: "2026-02-15",
          confidence: "medium",
          level: "strict",
        },
      ],
      expandedDetails: {
        background: "密集存储仓库需要调度多台四向穿梭车协同工作。",
        problem: "多车协同场景下容易出现节点占用冲突、路径交叉与潜在死锁，传统单车寻路难以直接复用。",
        solution:
          "- **实现路径搜索**：基于 A* 完成仓储地图下的启发式路径求解。\n- **处理多车冲突**：引入冲突检测与优先级等待策略，解决多车协同时序冲突问题。\n- **构建仿真工具**：基于 PyQt5 开发地图编辑与路径可视化界面，支持调试与演示。",
        result: "完成多车路径规划原型验证，支持在仿真环境中直观展示路径搜索与冲突消解过程。",
        role: "算法主导",
        techStack: ["Python", "Algorithms", "PyQt5"],
      },
    },
    {
      id: "exp-education",
      year: "2021.09 - 2025.06",
      role: "本科 · 数据科学与大数据技术",
      company: "南阳理工学院",
      location: "河南",
      summary:
        "主修计算机科学与大数据技术，GPA 3.8/4.5 (Top 5%)。注重工程实践与持续学习能力。",
      techTags: ["Computer Science", "Big Data", "Top 5%"],
      highlighted: false,
      audienceTags: ["hr"],
      businessValue: {
        zh: "打下了扎实的计算机理论基础，具备持续学习与工程实践的潜力。",
        en: "Solid CS theoretical foundation with potential for continuous learning and engineering practice.",
      },
      engineeringDepth: {
        zh: "以优秀的学业成绩证明了学习能力与专业素养。",
        en: "Excellent academic record proving learning ability and professionalism.",
      },
      verification: [
        {
          sourceType: "manual",
          sourceLabel: "学位证书与成绩单",
          verifiedAt: "2026-02-15",
          confidence: "high",
          level: "strict",
        },
      ],
    },
  ],

  projects: [
    {
      id: "proj-customer-ai-runtime",
      year: "2026 - 至今",
      name: "智能客服运行时",
      link: "https://github.com/byteD-x/customer-ai-runtime",
      demoLink: "",
      techTags: [
        "Python",
        "FastAPI",
        "AsyncIO",
        "Pydantic",
        "OpenAI",
        "Voice / RTC",
        "Qdrant",
        "Plugin Runtime",
        "Multi-tenant",
        "Auth Bridge",
      ],
      summary:
        "独立设计企业级智能客服运行时，统一文本、语音、RTC 与宿主挂载接入，并通过插件体系和知识治理将问答能力扩展为可接业务的服务运行时。",
      impact: "六层运行时 + 7 类插件 + 多通道接入",
      keyOutcomes: [
        "设计渠道接入、宿主桥接、核心引擎、业务增强、插件平台、提供商适配六层架构，统一文本、Voice API、RTC WebSocket 与 FastAPI 挂载 4 类接入形态。",
        "实现 `route_confidence` 分层、`intent_stack` 回退及 `page_context` / `business_objects` 感知路由，在低置信度与高风险场景优先澄清或转人工。",
        "提供 Route、BusinessTool、Handoff、Industry、AuthBridge、Context、Response 7 类插件扩展点，支持宿主鉴权复用与业务能力按需挂载。",
        "补齐知识版本管理、chunk 优化、消息级反馈、诊断导出、request_id 贯通、限流与提示词脱敏，强化多租户治理与审计能力。",
      ],
      audienceTags: ["hr", "jobSeeker", "partner", "client"],
      businessValue: {
        zh: "将 AI 客服从单纯知识问答扩展为可挂载、可转人工、可接业务且可治理的运行时能力，降低宿主系统改造成本。",
        en: "Turned AI customer service from simple knowledge Q&A into a governed runtime that can be mounted, connected to business tools, and handed off to humans.",
      },
      engineeringDepth: {
        zh: "覆盖六层运行时架构、7 类插件注册中心、Auth Bridge、多提供商适配、知识治理、反馈闭环与多租户边界控制。",
        en: "Showcases a layered runtime, plugin registry, auth bridging, provider adaptation, knowledge governance, diagnostics export, and multi-tenant boundary control.",
      },
      verification: [
        {
          sourceType: "repo",
          sourceLabel: "README / architecture / API tests / recent commits",
          sourceUrl: "https://github.com/byteD-x/customer-ai-runtime",
          verifiedAt: "2026-03-19",
          confidence: "high",
          level: "strict",
        },
      ],
      expandedDetails: {
        background:
          "目标是在统一多通道接入和宿主系统复用的前提下，交付可转人工、可治理、可行业扩展的客服运行时。",
        problem:
          "如果将文本、语音、RTC、业务工具、鉴权和转人工能力写死在单一流程中，宿主系统难接入、租户边界难控制，运行诊断和知识治理也难持续演进。",
        solution:
          "- **搭建分层运行时**：将渠道接入、宿主桥接、核心引擎、业务增强、插件平台、提供商适配六层解耦，统一 4 类接入模式。\n- **设计路由协同机制**：通过 `route_confidence`、`intent_stack`、`page_context`、`business_objects` 组合决策，在低置信度或高风险场景优先澄清或转人工。\n- **沉淀插件扩展体系**：提供 Route、BusinessTool、Handoff、Industry、AuthBridge、Context、Response 7 类扩展点，支持插件启停、范围过滤与宿主鉴权复用。\n- **补齐治理能力**：完善知识版本、chunk 优化、反馈闭环、健康巡检、诊断导出、request_id 贯通、限流与提示词脱敏。",
        result:
          "交付可独立运行或宿主挂载的客服运行时，形成覆盖业务接入、人工协同、知识治理、租户隔离与运行审计的工程基线。",
        role: "独立开发者（架构设计与核心开发）",
        techStack: [
          "Python 3.13",
          "FastAPI",
          "AsyncIO",
          "Pydantic",
          "OpenAI",
          "Qdrant",
          "阿里云/腾讯云语音",
          "Milvus/Pinecone",
        ],
        links: [
          {
            label: "GitHub Repo",
            url: "https://github.com/byteD-x/customer-ai-runtime",
          },
        ],
      },
      highlighted: true,
    },
    {
      id: "proj-wechat-bot",
      year: "2025 - 至今",
      name: "微信智能助手",
      link: "https://github.com/byteD-x/wechat-bot",
      demoLink: "",
      techTags: [
        "Python",
        "Quart",
        "Asyncio",
        "LangGraph",
        "RAG",
        "Electron",
        "SQLite",
        "ChromaDB",
        "BaseTransport",
        "Cost Analytics",
      ],
      summary:
        "独立设计并持续迭代 Windows 微信生态智能助手运行时，围绕稳定接入、分层记忆、可降级 RAG 与运行治理，交付可长期运行的桌面化 AI 助手。",
      impact: "微信接入运行时 + 三层记忆 + 可观测治理",
      keyOutcomes: [
        "抽象 `BaseTransport` 接入层并以 `LangGraph` 重构回复主链，将同步回复与后台成长任务解耦，建立适合长期运行的微信助手架构。",
        "构建 SQLite 短期记忆、运行期向量记忆与导出语料 RAG 三层记忆体系，支持轻量重排与可选本地 `Cross-Encoder` 自动回退，平衡召回质量与部署成本。",
        "补齐 `/api/status`、`/api/metrics`、`/api/config/audit`、成本分析与 GitHub Release 发布链路，完善运行观测、配置审计与交付能力。",
        "落地配置热重载与回复预算控制机制，支持 2 秒回复 deadline 策略，降低桌面场景下的阻塞风险并提升可用性。",
      ],
      audienceTags: ["hr", "jobSeeker", "partner", "client"],
      businessValue: {
        zh: "将微信自动回复脚本升级为具备接入治理、运行诊断与成本分析能力的桌面智能助手，降低长期运行和排障成本。",
        en: "Turned a script-like WeChat bot into a long-running AI assistant with diagnosability and cost control.",
      },
      engineeringDepth: {
        zh: "覆盖 `BaseTransport` 抽象、LangGraph 运行时、三层记忆、可降级 RAG、配置热重载与 Prometheus 风格观测链路。",
        en: "Showcases transport abstraction, a LangGraph runtime, degradable RAG, config hot reload, cost analytics, and runtime observability.",
      },
      verification: [
        {
          sourceType: "repo",
          sourceLabel: "README / HIGHLIGHTS / SYSTEM_CHAINS / tests / recent commits",
          sourceUrl: "https://github.com/byteD-x/wechat-bot",
          verifiedAt: "2026-03-19",
          confidence: "high",
          level: "strict",
        },
      ],
      expandedDetails: {
        background:
          "目标是在 Windows 微信生态下交付可长期运行的智能助手，同时兼顾消息接入稳定性、记忆增强、配置治理与运行诊断。",
        problem:
          "微信接入边界依赖桌面环境且稳定性敏感；如果把记忆、RAG、诊断和配置能力耦合在主回复链路内，系统很难长期运行与排障。",
        solution:
          "- **重构运行时**：以 `LangChain + LangGraph` 编排 `load_context / build_prompt / invoke / finalize_request`，把同步回复与后台成长任务分层处理。\n- **抽象接入边界**：将微信入口统一收敛到 `BaseTransport`，隔离 Windows 微信版本、权限与消息通道的环境差异。\n- **构建三层记忆**：落地 SQLite 短期记忆、运行期向量记忆与导出语料 RAG，并支持轻量重排与可选本地 `Cross-Encoder` 自动回退。\n- **补齐治理能力**：完善 `/api/status`、`/api/metrics`、`/api/config/audit`、成本分析、配置热重载与 GitHub Release 发布链路。",
        result:
          "交付面向 Windows 微信生态的长期运行智能助手，形成从消息接入、记忆增强到运行观测、配置治理与发布交付的完整闭环。",
        role: "独立开发者",
        techStack: [
          "Python",
          "Quart",
          "Asyncio",
          "LangGraph",
          "Electron",
          "RAG",
        ],
        links: [
          { label: "GitHub", url: "https://github.com/byteD-x/wechat-bot" },
        ],
      },
      highlighted: true,
    },
    {
      id: "proj-rag-qa-system",
      year: "2025.04 - 2025.09",
      name: "RAG-QA System",
      link: "https://github.com/byteD-x/rag-qa-system",
      demoLink: "",
      techTags: [
        "FastAPI",
        "LangGraph",
        "Vue 3",
        "PostgreSQL",
        "Qdrant",
        "RAG",
        "FastEmbed",
        "Docker",
        "LangChain",
      ],
      summary:
        "负责企业知识问答系统核心研发，完成多源文档接入、三路混合检索、LangGraph 可恢复运行时与知识治理工作台建设。",
      impact: "三路混合检索 + LangGraph 可恢复运行时",
      keyOutcomes: [
        "设计结构检索、全文检索、向量检索三路召回链路，结合加权 RRF 融合与 rerank，支持 `citations`、`grounding_score` 与 `trace_id` 返回。",
        "将 Gateway 问答链路与 KB 检索链路改造为 LangGraph 运行时，支持 checkpoint、interrupt/resume、人工澄清与 `step_events`。",
        "建设 ingest 与知识治理工作台，支持多知识库、多源连接器、chunk 拆分/合并/禁用及 retrieve/debug 调试能力。",
        "建立 smoke-eval 与 regression gate 回归门禁，将检索质量、可恢复执行与发布验证纳入同一交付流程。",
      ],
      audienceTags: ["hr", "jobSeeker", "partner", "client"],
      businessValue: {
        zh: "将企业分散资料沉淀为可持续同步、可追溯引用的知识问答能力，降低检索和答复成本。",
        en: "Turns scattered enterprise documents into a continuously synced knowledge QA capability with traceable citations.",
      },
      engineeringDepth: {
        zh: "覆盖三路混合检索、LangGraph 编排、知识治理、连接器边界控制与评测回归体系。",
        en: "Shows integrated engineering across hybrid retrieval, LangGraph orchestration, governance workflows, connector boundaries, and evaluation baselines.",
      },
      verification: [
        {
          sourceType: "repo",
          sourceLabel: "GitHub 仓库 README / docs/reference / tests",
          sourceUrl: "https://github.com/byteD-x/rag-qa-system",
          verifiedAt: "2026-03-13",
          confidence: "high",
          level: "strict",
        },
      ],
      expandedDetails: {
        background:
          "企业资料分散在本地目录、Notion 等多源，业务希望把制度、FAQ、项目文档沉淀为可检索、可引用、可持续同步的知识库问答系统。",
        problem:
          "传统单路检索难以同时覆盖标题、关键词与语义混合场景，问答链路缺少可解释恢复机制，文档接入与 chunk 质量治理也缺乏统一工作台。",
        solution:
          "- **搭建混合检索**：结构、全文、向量三路召回配合 query rewrite、加权 RRF 与 rerank，提升复杂问题场景下的证据命中率。\n- **重构可恢复运行时**：在 Gateway 与检索层引入 LangGraph，支持 checkpoint、interrupt/resume、`step_events` 与人工澄清。\n- **补齐知识治理**：建设多知识库、多源连接器、chunk 治理、retrieve/debug、审计与回归门禁能力。",
        result:
          "形成面向中文企业场景的 RAG 问答系统，支持 grounded answer、引用溯源、多源同步、检索调试与可恢复执行，并具备持续回归验证能力。",
        role: "后端/AI 应用工程师",
        techStack: [
          "FastAPI",
          "LangGraph",
          "Vue 3",
          "PostgreSQL",
          "Qdrant",
          "FastEmbed",
        ],
        links: [
          {
            label: "GitHub Repo",
            url: "https://github.com/byteD-x/rag-qa-system",
          },
        ],
      },
      highlighted: true,
    },
    {
      id: "proj-ipa-demo",
      year: "2025.11 - 2025.12",
      name: "IPA Demo",
      techTags: [
        "Python",
        "Flask",
        "PyTorch",
        "Transformers",
        "Torchaudio",
        "ASR",
        "Pandas",
        "FFmpeg",
      ],
      summary:
        "中文方言语音转写演示系统：把本地 ASR 模型封装成可试用的 Web 原型，支持上传、录音、批量处理、IPA 拆分和结果导出。",
      impact: "方言语音转写原型 + 演示闭环",
      keyOutcomes: [
        "基于 Flask 封装本地 ASR 模型，支持多文件上传、流式转写、浏览器录音与示例音频体验。",
        "加入音频标准化、并发处理、IPA 声母/韵母/声调拆分与日志体系，使原型既可演示也便于排障。",
        "支持 Excel 模板校验、批量导出与系统手册下载，降低客户试用和验收成本。",
      ],
      audienceTags: ["jobSeeker", "partner", "client"],
      businessValue: {
        zh: "把研究型语音识别能力快速收敛成可试用原型，帮助客户低成本验证需求与技术路线。",
        en: "Turned research-oriented speech recognition capability into a usable prototype for low-cost validation.",
      },
      engineeringDepth: {
        zh: "覆盖本地模型推理封装、音频预处理、批处理并发、结构化导出和面向演示场景的 Web 交付。",
        en: "Showcases local ASR inference packaging, audio preprocessing, batch concurrency, structured export, and web delivery for demos.",
      },
      verification: [
        {
          sourceType: "repo",
          verifiedAt: "2026-03-31",
          confidence: "high",
          level: "strict",
        },
      ],
      expandedDetails: {
        background:
          "目标是在短周期内把中文方言语音转写能力做成可直接演示的系统，用于科研场景验证和客户验收。",
        problem:
          "需要同时解决模型推理封装、音频标准化、批量转写、结果导出和非技术用户可操作性，且交付周期有限。",
        solution:
          "- **Web 化封装**：用 Flask 承载本地 ASR pipeline，并提供上传、录音、示例音频和二次转写接口。\n- **音频处理**：结合 `torchaudio` 与 `ffmpeg` 做格式检测、标准化转换和并发加载。\n- **结果结构化**：通过 Excel 表维护 IPA 映射，支持声母/韵母/声调拆分与 Excel 导出。\n- **演示交付**：补齐系统手册、模板下载、错误日志与批量处理能力，便于现场演示和验收。",
        result:
          "交付完整的 `IPA Demo` 原型，覆盖“录音/上传 -> 转写 -> IPA 拆分 -> 导出”的核心闭环。",
        role: "全栈顾问",
        techStack: [
          "Python",
          "Flask",
          "PyTorch",
          "Transformers",
          "Torchaudio",
          "Pandas",
          "OpenPyXL",
          "FFmpeg",
        ],
      },
      highlighted: false,
    },
    {
      id: "proj-submed",
      year: "2024.08 - 2024.10",
      name: "SubMed 医学论文检索小程序",
      techTags: [
        "Python",
        "Django",
        "MySQL",
        "Redis",
        "Celery",
        "PubMed",
        "OpenAI",
        "WeChat Mini Program",
        "WeChat Pay",
      ],
      summary:
        "面向医学专家的论文检索与订阅推送后端：围绕 PubMed 抓取、AI 搜索、深度分析、收藏订阅和会员积分体系形成完整服务链路。",
      impact: "医学论文检索 + AI 分析 + 订阅运营",
      keyOutcomes: [
        "构建 PubMed 抓取、文章入库、DOI/期刊补全与定时任务链路，形成持续更新的论文数据底座。",
        "提供 AI 关键词、AI 检索、深度分析、收藏和推荐接口，提升医学场景的检索效率与阅读深度。",
        "补齐订阅推送、推送历史、积分/VIP、邀请码和微信支付回调处理，支撑小程序持续运营。",
      ],
      audienceTags: ["hr", "jobSeeker", "partner"],
      businessValue: {
        zh: "把医学论文获取、筛选、订阅和深度阅读串成一条连续流程，降低专家跟踪前沿研究的时间成本。",
        en: "Connected paper retrieval, filtering, subscription, and deep reading into one continuous workflow for medical experts.",
      },
      engineeringDepth: {
        zh: "覆盖爬取入库、API 设计、AI 辅助分析、任务调度、支付积分体系与小程序后端建模。",
        en: "Combines crawling, API design, AI-assisted analysis, task scheduling, and payment/incentive modeling for a mini-program backend.",
      },
      verification: [
        {
          sourceType: "repo",
          verifiedAt: "2026-03-31",
          confidence: "high",
          level: "strict",
        },
      ],
      expandedDetails: {
        background:
          "目标是为医学专家提供更垂直的论文发现与订阅能力，减少在通用搜索工具中筛选信息的时间成本。",
        problem:
          "除了论文抓取和搜索，还要同时处理个性化订阅、深度分析、用户行为、积分/VIP 和支付等运营需求，系统边界较宽。",
        solution:
          "- **数据与检索**：基于 Django + MySQL 建立论文、主题、订阅和收藏等模型，通过 PubMed spider 与管理命令维护数据。\n- **AI 能力**：提供 AI 关键词生成、AI 搜索、深度分析和相关推荐接口，增强医学场景的检索表达能力。\n- **异步与缓存**：使用 Celery 和 Redis 支撑定时任务、推送流程和接口性能治理。\n- **商业化闭环**：接入微信支付、积分记录、VIP 与邀请码，支撑小程序持续运营。",
        result:
          "形成面向医学检索场景的小程序后端闭环，覆盖数据抓取、搜索分析、订阅推送与支付运营。",
        role: "后端开发",
        techStack: [
          "Python",
          "Django",
          "MySQL",
          "Redis",
          "Celery",
          "PubMed",
          "OpenAI API",
          "WeChat Pay",
        ],
      },
      highlighted: false,
    },
    {
      id: "proj-lexue",
      year: "2024",
      name: "乐学网",
      techTags: ["Spring Boot", "Redis", "Spring Security", "Vue.js", "MySQL"],
      summary:
        "面向校内选课、考试与知识付费场景的教育平台，集成课程管理、支付结算与实时互动能力。",
      impact: "教育平台 + 支付闭环 + 实时互动",
      keyOutcomes: [
        "负责课程、支付与互动链路的全栈实现，形成校内教学与知识付费闭环。",
        "引入 Redis 缓存与 RBAC 权限治理，支撑选课与考试高峰时段的稳定访问。",
        "基于 WebSocket 实现实时互动与在线答疑，提升教学场景的响应效率与参与度。",
      ],
      audienceTags: ["jobSeeker", "partner", "client"],
      businessValue: {
        zh: "为校园场景提供教学工具与支付能力一体化平台，打通课程服务与知识付费闭环。",
        en: "Provided not just teaching tools but also a closed-loop monetization system for campus.",
      },
      engineeringDepth: {
        zh: "覆盖支付系统对接、缓存治理、权限控制与实时互动场景落地。",
        en: "Shows engineering practice in payment integration, concurrency governance, and content security.",
      },
      verification: [
        {
          sourceType: "manual",
          sourceLabel: "项目演示",
          verifiedAt: "2026-02-15",
          confidence: "medium",
          level: "strict",
        },
      ],
      expandedDetails: {
        background: "校园需要自有知识付费与在线学习平台。",
        problem: "现有系统功能单一，不支持支付与高并发。",
        solution:
          "- **构建全栈平台**：围绕课程、支付与互动场景完成后端接口与前端页面开发。\n- **治理高峰流量**：使用 Redis 缓存热点课程数据，提升高峰时段访问稳定性。\n- **补齐交易与安全**：对接支付网关，并通过 Spring Security 实现细粒度 RBAC 权限控制。\n- **落地实时互动**：基于 WebSocket 实现在线互动与答疑能力。",
        result: "完成校内教育平台原型交付，支持课程服务、支付结算与实时互动场景落地。",
        role: "全栈开发",
        techStack: ["Spring Boot", "Redis", "Vue.js"],
      },
      highlighted: true,
    },
    {
      id: "proj-cloudpan",
      year: "2024.04 - 2026.02",
      name: "EasyCloudPan",
      link: "https://github.com/byteD-x/easyCloudPan",
      demoLink: "",
      techTags: [
        "Java 21",
        "Spring Boot 3.2",
        "Spring Security",
        "OAuth2",
        "MyBatis-Flex",
        "Flyway",
        "PostgreSQL",
        "Redis",
        "MinIO/S3",
        "Vue 3",
        "Docker Compose",
        "Prometheus",
        "Grafana",
      ],
      summary:
        "主导企业内网部署网盘系统建设，完成认证、上传下载、分享转存、文件预览、多租户、安全通信与可观测体系的全栈交付，并同时支持本地一键启动与 Docker 全栈部署。",
      impact: "企业级文件平台（私有化部署 + 安全基线 + 可观测）",
      keyOutcomes: [
        "构建“分片上传 + 秒传 + 断点续传 + SSE 状态回传”主链路，结合零拷贝分片合并，支持 1000+ 并发上传，成功率 >99.5%（README 指标口径）。",
        "完成 PostgreSQL 复合索引、游标分页与 Caffeine / Redis 多级缓存治理，使 API P95 <500ms、P99 <1s、数据库查询 P95 <100ms，慢查询减少 80%（README 指标口径）。",
        "落地 HMAC-SHA256 请求签名防重放、JWT 双 Token + 黑名单、`@FileAccessCheck`、Magic Number 校验与多租户隔离，形成文件平台安全闭环。",
        "建立“本地一键启动 + Docker 全栈部署 + 健康检查 + Prometheus/Grafana + Web Vitals 入库”工程基线，使核心 P0/P1 流程可复现验证。",
      ],
      audienceTags: ["hr", "jobSeeker", "partner", "client"],
      businessValue: {
        zh: "提供可私有化部署的文件协作底座，兼顾高并发上传、安全治理、身份接入扩展与监控验收能力。",
        en: "Provides a privately deployable file collaboration platform with lower operational and security risks.",
      },
      engineeringDepth: {
        zh: "落地 Java 21 虚拟线程、零拷贝、签名防重放、OAuth 扩展接入、索引优化、多级缓存、游标分页与可观测体系，并在本地/容器双部署链路下保持一致交付。",
        en: "Combines virtual threads, zero-copy transfer, signature replay protection, OAuth extensibility, layered caching, cursor pagination, and observability into an extensible engineering baseline.",
      },
      verification: [
        {
          sourceType: "repo",
          sourceLabel:
            "GitHub 仓库、README、RESUME_EasyCloudPan 文档与代码锚点",
          sourceUrl: "https://github.com/byteD-x/easyCloudPan",
          verifiedAt: "2026-02-24",
          confidence: "high",
          level: "strict",
        },
      ],
      expandedDetails: {
        background:
          "目标是在前后端分离架构下交付可企业内部署的文件平台，同时兼容本地一键启动与 Docker 全栈部署。",
        problem:
          "需同时满足高并发上传稳定性、深分页与热点查询性能、安全鉴权一致性、第三方登录扩展能力和上线后可观测闭环。",
        solution:
          "- **重构上传链路**：基于 Java 21 虚拟线程实现分片上传、断点续传、秒传与 `FileChannel.transferTo()` 零拷贝合并，并通过 SSE 回传状态。\n- **优化数据性能**：落地 PostgreSQL 复合索引、游标分页、Caffeine(L1)/Redis(L2) 多级缓存、布隆过滤器与分级 TTL，降低回源与深分页开销。\n- **完善安全体系**：建设请求签名防重放、JWT 双 Token + 黑名单、`@FileAccessCheck`、Magic Number 校验与多租户隔离。\n- **补齐身份与观测**：接入 GitHub / Google / Microsoft OAuth 登录，并通过 Actuator、Micrometer、Prometheus、Grafana 与 Web Vitals 建立可观测闭环。",
        result:
          "形成可持续迭代的交付基线：API P95 <500ms、P99 <1s、缓存命中率 >90%、上传成功率 >99.5%，并支持本地与 Docker 双链路部署（README 指标口径）。",
        role: "全栈开发（主导）",
        techStack: [
          "Java 21",
          "Spring Boot 3.2",
          "Spring Security",
          "OAuth2",
          "MyBatis-Flex",
          "Flyway",
          "PostgreSQL",
          "Redis",
          "MinIO/S3",
          "Vue 3",
          "Docker Compose",
          "Prometheus",
          "Grafana",
        ],
        links: [
          { label: "GitHub", url: "https://github.com/byteD-x/easyCloudPan" },
          {
            label: "README",
            url: "https://github.com/byteD-x/easyCloudPan#readme",
          },
        ],
      },
      highlighted: true,
    },
    {
      id: "proj-jzt-shuttle-path",
      year: "2023",
      name: "九州通四向穿梭车路径规划系统",
      techTags: [
        "Python",
        "A*",
        "CBS",
        "PyQt5",
        "ThreadPoolExecutor",
        "Concurrent",
      ],
      summary:
        "主导仓储四向穿梭车路径规划原型开发，基于 A* 与冲突消解策略完成多车协同路径搜索，并构建 PyQt 可视化仿真工具。",
      impact: "仓储自动化算法原型",
      keyOutcomes: [
        "设计 A* 路径搜索算法，完成复杂仓储地图下的最优路径求解与启发式搜索实现。",
        "实现多车冲突检测与优先级等待策略，处理节点占用与时序冲突，验证多车协同调度可行性。",
        "开发 PyQt5 可视化仿真界面，支持地图编辑、起终点设置、路径步进调试及地图保存/加载。",
      ],
      audienceTags: ["hr", "jobSeeker", "partner"],
      businessValue: {
        zh: "为自动化立体仓库调度系统提供算法可行性验证与仿真支撑。",
        en: "Provided core algorithm verification and simulation tools for AS/RS scheduling.",
      },
      engineeringDepth: {
        zh: "覆盖图搜索算法、冲突消解逻辑、仓储地图建模与可视化交互开发。",
        en: "Demonstrates engineering implementation of complex operations research algorithms and GUI dev.",
      },
      verification: [
        {
          sourceType: "repo",
          verifiedAt: "2026-02-15",
          confidence: "medium",
          level: "strict",
        },
      ],
      expandedDetails: {
        background: "仓储自动化需要智能调度算法。",
        problem: "多车协同场景下容易出现节点占用冲突、路径交叉与潜在死锁，单车寻路算法难以直接复用。",
        solution:
          "- **实现路径搜索**：基于 A* 完成仓储地图下的启发式路径求解。\n- **处理多车冲突**：引入冲突检测与优先级等待策略，解决多车协同时序冲突问题。\n- **构建仿真工具**：基于 PyQt5 开发地图编辑与路径可视化界面，支持调试与演示。",
        result: "完成多车路径规划原型验证，支持在仿真环境中直观展示路径搜索与冲突消解过程。",
        role: "算法研发",
        techStack: ["Python", "A*", "PyQt5"],
      },
      highlighted: false,
    },
  ],

  skills: [
    {
      id: "skill-primary",
      category: "核心栈",
      description: "长期主用并可独立负责交付的技术栈。",
      items: [
        "Java / Spring Boot（性能治理、架构演进、CI/CD）",
        "Python / FastAPI / AsyncIO（AI 运行时编排、多通道接入）",
        "LangGraph / RAG / Qdrant（知识检索增强、复杂流程编排）",
        "OpenAI / Tool Calling（业务系统互联、模型能力接入）",
        "PostgreSQL / Redis / ClickHouse（存储选型与查询优化）",
        "Next.js / Vue 3 / TypeScript（工程化前端构建与全栈交付）",
      ],
    },
    {
      id: "skill-proficient",
      category: "扩展栈",
      description: "已在项目中稳定使用的配套能力。",
      items: [
        "Docker / Linux Shell / Nginx",
        "Jenkins / GitLab CI（流水线与自动化部署）",
        "pytest / Playwright（回归测试与 UI 自动化）",
        "WebSocket / SSE / RTC / ASR / TTS（实时与语音流）",
        "多租户隔离 / Auth Bridge / 插件化扩展设计",
        "系统监控 / Prometheus / Grafana 仪表盘",
      ],
    },
    {
      id: "skill-familiar",
      category: "协作栈",
      description: "具备实践经验，可在协作项目中快速接手。",
      items: [
        "Go（微服务开发）",
        "Kubernetes（容器编排基础）",
        "Kafka / RabbitMQ（异步解耦）",
        "Elasticsearch / MinIO（非结构化存储）",
        "AWS / Aliyun（云端基础设施）",
      ],
    },
  ],

  services: [
    {
      id: "svc-fullstack",
      title: "全栈应用开发",
      description:
        "把业务需求落成可上线系统：账号/权限/支付/后台/监控一体化交付，强调可用性与可维护性。",
      icon: "Layout",
      techStack: ["React/Next.js", "Spring Boot", "MySQL/Redis"],
      gradient: "from-blue-500/10 to-cyan-500/10",
      milestones: ["需求澄清", "技术方案", "里程碑交付", "联调验收"],
    },
    {
      id: "svc-ai-integration",
      title: "AI 工程化落地",
      description:
        "将模型能力接入业务流程，补齐知识检索、工具调用、成本控制与安全约束，支持灰度发布与效果复盘。",
      icon: "Bot",
      techStack: ["LangChain", "OpenAI API", "RAG", "Qdrant"],
      gradient: "from-sky-500/10 to-cyan-500/10",
      milestones: ["场景梳理", "方案验证", "成本评估", "灰度发布"],
    },
    {
      id: "svc-performance",
      title: "性能优化与重构",
      description:
        "用数据定位瓶颈并复核收益：SQL/索引、缓存、并发、JVM、压测，让系统更快更稳。",
      icon: "Zap",
      techStack: ["MySQL", "Redis", "JVM", "压测"],
      gradient: "from-amber-500/10 to-orange-500/10",
      milestones: ["基线采样", "瓶颈定位", "方案实施", "压测复核"],
    },
    {
      id: "svc-automation",
      title: "自动化与数据处理",
      description:
        "将重复流程脚本化和定时化，覆盖数据采集、清洗、报表与流程处理，降低人工成本与出错率。",
      icon: "Workflow",
      techStack: ["Python", "Pandas", "ETL", "定时任务"],
      gradient: "from-emerald-500/10 to-teal-500/10",
      milestones: ["流程评估", "自动化设计", "试运行", "稳定运维"],
    },
  ],

  vibeCoding: {
    title: "开发原则",
    description:
      "借助自动化工具提升开发效率，但结果必须通过构建、测试、导出与链接校验验证；涉及性能或成本调整时，先建立基线，再以数据确认收益。",
  },

  contact: {
    phone: "15035925107",
    email: "2041487752dxj@gmail.com",
    github: "https://github.com/byteD-x",
    websiteLinks: [
      {
        label: "国际站（Vercel）",
        url: "https://my-resume-gray-five.vercel.app/",
      },
      {
        label: "GitHub 站（Pages）",
        url: "https://byted-x.github.io/My-Resume/",
      },
      {
        label: "国内站（自托管）",
        url: "https://www.byted.online/",
      },
    ],
    resumeButtonText: "下载简历 PDF",
    ctaText: "开始合作",
    wechat: "w2041487752",
    responseSlaText: "通常在 24 小时内回复（工作日更快）",
    visibility: {
      defaultExpanded: false,
      showPhoneByDefault: false,
      showWechatByDefault: false,
    },
    consultationChecklist: [
      "业务目标与上线时间",
      "当前系统或技术栈现状",
      "预算范围与协作方式",
    ],
  },

  audienceCards: [
    {
      id: "hr",
      title: "HR",
      focus: "快速判断岗位匹配度与候选人稳定性",
      targetSection: "experience",
      primaryCTA: "查看履历证据",
      secondaryCTA: "下载简历 PDF",
      highlightMetrics: ["远程优先", "关键指标可复核", "履历与项目闭环"],
    },
    {
      id: "jobSeeker",
      title: "求职者",
      focus: "理解技术成长路径与工程方法复用",
      targetSection: "projects",
      primaryCTA: "查看项目拆解",
      secondaryCTA: "查看技术取舍",
      highlightMetrics: ["STAR 叙事", "性能/成本指标", "工程化实践"],
    },
    {
      id: "partner",
      title: "合作伙伴",
      focus: "确认协作模式、边界与交付节奏",
      targetSection: "services",
      primaryCTA: "查看合作能力",
      secondaryCTA: "查看里程碑",
      highlightMetrics: ["方案验证到交付", "需求澄清机制", "可验收里程碑"],
    },
    {
      id: "client",
      title: "客户",
      focus: "直达业务价值、风险控制与沟通入口",
      targetSection: "contact",
      primaryCTA: "进入联系通道",
      secondaryCTA: "查看沟通准备项",
      highlightMetrics: ["性能与成本收益", "上线风险可控", "响应时效明确"],
    },
  ],
};
