import { PortfolioData } from "./types";

// ==========================================
// 默认内容 JSON（用于 reset）
// ==========================================
export const defaultPortfolioData: PortfolioData = {
  hero: {
    name: "杜旭嘉",
    title: "AI Agent / FDE 工程师（企业 AI 落地）",
    subtitle:
      "贴近业务现场设计并交付可用的 AI Agent。服务从小团队试点到大型企业系统接入，重点改造传统行业的知识与流程，并把 AI 接进既有系统。上线后继续复核效果、成本与稳定性。",
    location: "远程优先 ｜ 可到岗：深圳 / 南京 / 杭州 / 成都",
    bullets: [
      {
        id: "bullet-1",
        title: "AI Agent 产品化",
        description:
          "从知识问答、流程自动化到工具调用，交付有依据、可恢复、可评测的 Agent 工作流",
      },
      {
        id: "bullet-2",
        title: "FDE 现场交付",
        description:
          "贴近团队与一线流程，把模型接入既有系统、权限与数据，让试点进入上线和运营",
      },
      {
        id: "bullet-3",
        title: "传统行业 AI 化",
        description:
          "按企业规模与数字化基础选择切入点，先改造高频、重复、可验证的业务环节，再看成本与风险",
      },
    ],
    quickFacts: {
      role: "AI Agent / FDE 工程师",
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
      primaryRole: "AI Agent / FDE 工程师",
      secondaryRole: "企业 AI 落地｜后端 / 全栈交付",
      availability: "远程优先",
      location: "远程优先｜可到岗：深圳 / 南京 / 杭州 / 成都",
      updatedAt: "2026-03-13",
    },
  },

  about: {
    zh: "AI Agent / FDE 工程师，贴近业务现场把模型接入知识、流程与既有系统；服务从小团队试点到大型企业接入的不同场景，也关注传统行业流程智能化，并坚持用仓库、测试与指标证明结果。",
    en: "AI Agent and forward-deployed engineer who works close to the business to connect models with existing knowledge, workflows, and systems, from small-team pilots to enterprise rollouts, including traditional-industry modernization.",
  },

  aboutLenses: {
    business: [
      "**业务要点**",
      "- 问答可信：支持 citations、grounding_score、trace_id，回答有来源",
      "- 运行时能力：支持 checkpoint、interrupt/resume、人工澄清与回归门禁",
      "- FDE 业务接入：贴近团队现场，覆盖文本 / 语音 / RTC、Auth Bridge 与 Business Tool",
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
      title: "GitHub 开源项目",
      value: "51",
      label: "累计 Stars",
      description:
        "byteD-x 公开账号快照：14 个公开仓库累计 51 Stars、7 Forks；统计截止 2026-10-12",
      details: [
        "GitHub 公开账号当前维护 14 个公开仓库，累计获得 51 Stars 和 7 Forks。",
        "其中 wechat-bot 37 Stars / 5 Forks、easyCloudPan 5 Stars、customer-ai-runtime 4 Stars / 1 Fork。",
        "该指标来自 GitHub 公开仓库页快照，统计日期与仓库范围明确。",
      ].join("\n"),
      linkedExperienceId: "exp-independent-developer",
      icon: "TrendingUp",
      colSpan: "md:col-span-1",
      bg: "bg-sky-50",
      verification: {
        sourceType: "manual",
        sourceLabel: "GitHub 公开账号与仓库页面快照",
        sourceUrl: "https://github.com/byteD-x",
        verifiedAt: "2026-10-12",
        confidence: "high",
        level: "strict",
      },
    },
    {
      id: "impact-wechat",
      title: "微信智能助手",
      value: "37 / 5",
      label: "Stars / Forks",
      description:
        "GitHub 公开仓库当前 37 Stars、5 Forks（统计截止 2026-10-12）；本地运行链路另有 2 秒回复 deadline 与离线评测约束",
      details: [
        "GitHub 公开仓库当前 37 Stars、5 Forks，作为开源项目外部反馈快照。",
        "以 `BaseTransport` 抽象微信接入边界，拆分前台回复与后台记忆任务，支撑长期运行。",
        "构建 SQLite 三层记忆、可降级 RAG、模型认证、受控 Tool、运行准备度、配置审计与发布门禁。",
      ].join("\n"),
      linkedExperienceId: "exp-wechat-bot",
      icon: "Star",
      colSpan: "md:col-span-1",
      bg: "bg-indigo-50",
      verification: {
        sourceType: "manual",
        sourceLabel: "GitHub 公开仓库页 / 项目运行证据",
        sourceUrl: "https://github.com/byteD-x/wechat-bot",
        verifiedAt: "2026-10-12",
        confidence: "high",
        level: "strict",
      },
    },
    {
      id: "impact-customer-ai",
      title: "客服运行时",
      value: "4 / 1",
      label: "Stars / Forks",
      description:
        "GitHub 公开仓库当前 4 Stars、1 Fork（统计截止 2026-10-12）；本地电商售后样例另有 20/20 通过记录",
      details: [
        "GitHub 公开仓库当前 4 Stars、1 Fork，作为开源项目外部反馈快照。",
        "通过渠道接入、宿主桥接、核心引擎、业务增强、插件平台和提供商适配六层解耦，统一文本、语音、RTC 与挂载接入。",
        "本地电商售后样例 20/20 通过；另有知识版本管理、人工接管队列、成本对账和 RAG 评测治理。",
      ].join("\n"),
      linkedExperienceId: "exp-customer-ai-runtime",
      icon: "Bot",
      colSpan: "md:col-span-1",
      bg: "bg-teal-50",
      verification: {
        sourceType: "manual",
        sourceLabel: "GitHub 公开仓库页 / 本地电商售后样例",
        sourceUrl: "https://github.com/byteD-x/customer-ai-runtime",
        verifiedAt: "2026-10-12",
        confidence: "high",
        level: "strict",
      },
    },
    {
      id: "impact-2",
      title: "活动报表 API",
      value: "5x",
      label: "20s → 4s",
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
      title: "IPA 语音原型",
      value: "2380",
      label: "累计识别次数",
      description:
        "IPA Demo 运行日志累计 2380 次识别、60 次批量任务，单批最多 500 个文件；50 文件批次平均 25.36s（n=23）",
      details: [
        "把本地 ASR 模型封装成 Flask Web 服务，统一音频预处理、批量识别和结果导出。",
        "运行日志记录累计 2380 次识别与 60 次批量任务，单批最多 500 个文件。",
        "50 文件批次平均耗时 25.36s（n=23），用于客户现场验收和后续工程化评估。",
      ].join("\n"),
      linkedExperienceId: "exp-sustech",
      icon: "AudioLines",
      colSpan: "md:col-span-1",
      bg: "bg-emerald-50",
      verification: {
        sourceType: "experience",
        sourceLabel: "客户验收记录 / 运行日志",
        verifiedAt: "2026-02-10",
        confidence: "high",
        level: "strict",
      },
    },
    {
      id: "impact-4",
      title: "RentBox",
      value: "27",
      label: "客户需求交付",
      description:
        "共享擦窗宝租赁系统已交付客户 27 项需求，覆盖小程序、商家端、管理端、设备与支付链路",
      details: [
        "围绕订单状态机、幂等键、设备快照和支付/设备回调补偿处理乱序与重复事件。",
        "以 TCP、MQTT、HTTP 的 DeviceProfile 路由隔离厂商协议，并保留超时重试与状态查询。",
        "多端链路完成客户验收，已交付 27 项需求。",
      ].join("\n"),
      linkedExperienceId: "exp-rentbox",
      icon: "PackageCheck",
      colSpan: "md:col-span-2",
      isFocal: true,
      verification: {
        sourceType: "experience",
        sourceLabel: "客户交付记录 / 项目验收",
        verifiedAt: "2026-05-17",
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
        "采用 ClickHouse 代替 MySQL 存储海量数据，用于更快的查询。",
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
      id: "exp-independent-developer",
      year: "2025.09 - 至今",
      role: "独立开发者",
      company: "AI 应用 / 全栈项目",
      location: "独立开发阶段代表项目",
      summary:
        "2025.09 起独立承接商业与外包项目，完成简租科技小程序、论文检索任务平台和 IPA 方言语音转写原型交付；同时维护智能客服运行时、Windows 微信助手等开源项目，具备企业知识库 RAG · Agent 工作台、支付与设备接入、跨端交付经历。",
      techTags: [
        "Java 21",
        "Spring Boot 3.5",
        "Python",
        "FastAPI",
        "Flask",
        "Quart",
        "React 19",
        "TypeScript",
        "PostgreSQL",
        "MySQL",
        "Redis",
        "SSE",
        "MQTT",
      ],
      highlighted: true,
      keyOutcomes: [
        "2025.09 起独立承接商业与外包项目，完成简租科技小程序、论文检索任务平台和 IPA 方言语音转写原型交付。",
        "同时维护智能客服运行时、Windows 微信助手等开源项目；GitHub 公开账号 14 个仓库累计 51 Stars、7 Forks（2026-10-12 快照）。",
        "具备企业知识库 RAG · Agent 工作台、支付与设备接入、跨端交付经历。",
      ],
      childIds: [
        "exp-rentbox",
        "exp-paper-retrieval-platform",
        "exp-sustech",
        "exp-customer-ai-runtime",
        "exp-wechat-bot",
      ],
      verification: [
        {
          sourceType: "manual",
          sourceLabel: "主简历 / 英文 PDF 交叉校对",
          verifiedAt: "2026-05-18",
          confidence: "high",
          level: "strict",
        },
      ],
      expandedDetails: {
        background:
          "这是最新简历中独立开发阶段的主线，覆盖多个 AI 应用与全栈项目的并行推进。",
        solution:
          "- 统一承接 RentBox、论文检索任务平台、IPA 方言语音转写、智能客服运行时与微信智能助手五个子项目。\n- 以独立开发者视角完成方案设计、全栈实现、联调验证、测试交付和运行治理。\n- 按子项目分别保留独立 slug 与详情页能力，方便继续追溯单个项目证据。",
        result:
          "独立开发阶段以一个主经历呈现，五个代表项目仍可单独查看和核验。",
        role: "独立开发者",
        techStack: [
          "Java",
          "Spring Boot",
          "微信支付",
          "MQTT",
          "TCP",
          "HTTP",
          "React",
          "uni-app",
        ],
      },
    },
    {
      id: "exp-rentbox",
      year: "2026.05 - 至今",
      role: "独立开发者 · 全栈项目",
      company: "简租科技小程序（RentBox）",
      location: "本地项目 / 多端交付",
      summary:
        "面向共享擦窗宝租赁的微信小程序、商家端和柜机管理端，覆盖商家入驻、支付免押、取机归还及设备回调，解决租赁订单与硬件状态不同步问题。",
      techTags: [
        "Java",
        "Spring Boot",
        "微信支付",
        "MQTT",
        "TCP",
        "HTTP",
        "React",
        "uni-app",
      ],
      highlighted: true,
      keyOutcomes: [
        "商家与订单链路：围绕商家入驻、租赁商品、支付免押、取机归还，采用订单状态机、幂等键与结果回放处理乱序 / 重复回调，保证订单按合法路径推进。",
        "设备接入与安全开锁：接入柜机心跳、柜门事件和开锁回执，使用新鲜设备快照校验在线与闭门状态；异常状态进入工单，避免设备状态不明时放行。",
        "协议适配与可靠性：在接入层统一适配 TCP、MQTT、HTTP，并按板型与协议码路由；开锁超时通过重试、状态查询和定时补偿推进，最终转异常工单，不阻塞请求线程。",
        "上线交付：统筹域名与 ICP 备案、微信 / 支付宝支付及微信支付分开通，完成小程序、商家端、管理端、渠道端与正式环境部署，交付客户 27 项需求。",
      ],
      audienceTags: ["hr", "jobSeeker", "partner", "client"],
      groupParentId: "exp-independent-developer",
      hideFromSection: true,
      businessValue: {
        zh: "共享租赁业务覆盖小程序下单、支付担保、柜机开锁、归还审核和渠道结算，减少线下设备、资金和运营协同的交付风险。",
        en: "The delivery covers mini-program rental, payment guarantee, cabinet operations, returns, and channel settlement in a verifiable path.",
      },
      engineeringDepth: {
        zh: "覆盖模块化单体、支付/免押网关、设备适配层、回调验签、幂等与重放防护、渠道结算、审计日志、Flyway 迁移和多端前端工程化。",
        en: "Uses a modular monolith, payment/deposit-free gateways, device adapters, callback verification, idempotency, settlement, audit logs, Flyway migrations, and multi-client delivery.",
      },
      verification: [
        {
          sourceType: "repo",
          sourceLabel:
            "本地仓库 README / AGENTS / doc/技术方案说明 / server / miniapp / tests / deploy",
          verifiedAt: "2026-05-17",
          confidence: "high",
          level: "strict",
        },
      ],
      expandedDetails: {
        background:
          "目标是面向共享擦窗宝租赁场景交付可测试上线的业务系统，同时承接用户端、后台运营、渠道合作、支付担保和柜机厂商联调。",
        problem:
          "支付、免押、设备开锁、归还审核和渠道结算都存在外部回调、人工补偿和状态乱序风险；如果仅靠前端流程推进，容易出现重复扣款、错发开锁或状态倒退。",
        solution:
          "- **商家与订单链路**：围绕商家入驻、租赁商品、支付免押、取机归还，采用订单状态机、幂等键与结果回放处理乱序 / 重复回调，保证订单按合法路径推进。\n- **设备接入与安全开锁**：接入柜机心跳、柜门事件和开锁回执，使用新鲜设备快照校验在线与闭门状态；异常状态进入工单，避免设备状态不明时放行。\n- **协议适配与可靠性**：在接入层统一适配 TCP、MQTT、HTTP，并按板型与协议码路由；开锁超时通过重试、状态查询和定时补偿推进，最终转异常工单，不阻塞请求线程。\n- **上线交付**：统筹域名与 ICP 备案、微信 / 支付宝支付及微信支付分开通，完成小程序、商家端、管理端、渠道端与正式环境部署，交付客户 27 项需求。",
        result:
          "完成客户 27 项需求交付。",
        role: "独立开发者（产品收敛、后端核心、多端联调、部署交付）",
        techStack: [
          "Java",
          "Spring Boot",
          "微信支付",
          "MQTT",
          "TCP",
          "HTTP",
          "React",
          "uni-app",
        ],
      },
    },
    {
      id: "exp-paper-retrieval-platform",
      year: "2026.01 - 2026.05",
      role: "独立开发者 · 全栈项目",
      company: "数阁科技（深圳）｜论文检索任务平台",
      location: "本地项目 / 测试验收版",
      summary:
        "面向论文检索任务的全栈平台，为用户提供任务创建、进度跟踪、结果下载与订阅支付，解决共享任务表回写下的状态与额度一致性。",
      techTags: ["Python", "FastAPI", "React", "PostgreSQL", "SSE"],
      highlighted: true,
      keyOutcomes: [
        "任务状态同步：Worker 仅通过共享任务表回写时，采用数据库事件通知与 SSE，并以快照轮询兜底，保证进度可见、终态不回退。",
        "契约、权限与额度：将任务状态、终态字段和回写约束下沉到数据库；结果文件按路径边界与用户归属校验，额度在任务成功后通过事务锁与唯一流水扣减。",
        "支付与交付：支持月付 / 年付订单、支付验签、待支付复用和过期关闭，配套健康检查与 Windows 一键发布，完成客户交付。",
      ],
      audienceTags: ["hr", "jobSeeker", "partner", "client"],
      groupParentId: "exp-independent-developer",
      hideFromSection: true,
      businessValue: {
        zh: "把甲方论文检索 Worker 与用户侧平台边界隔离，用户只需要创建任务、观察进度、下载结果和管理额度，便于测试验收和后续生产联调。",
        en: "Separated the customer worker from the user-facing platform while keeping task creation, progress tracking, result download, and quota management coherent.",
      },
      engineeringDepth: {
        zh: "覆盖异步任务契约、PostgreSQL 触发器、LISTEN/NOTIFY、SSE 推送、额度流水、支付宝回调、FastAPI 分层、React 功能模块和 pytest/Vitest/Playwright 回归。",
        en: "Covers async task contracts, PostgreSQL triggers, LISTEN/NOTIFY, SSE, quota ledgers, payment callbacks, layered FastAPI services, React modules, and automated tests.",
      },
      verification: [
        {
          sourceType: "repo",
          sourceLabel:
            "本地仓库 README / docs/架构说明 / docs/交付文档 / apps/api / apps/web / tests",
          verifiedAt: "2026-05-17",
          confidence: "high",
          level: "strict",
        },
      ],
      expandedDetails: {
        background:
          "平台需要为用户提供论文检索任务入口，但实际检索由甲方 Worker 通过共享 PostgreSQL `tasks` 表执行，系统必须清晰隔离用户侧和 Worker 边界。",
        problem:
          "任务执行是异步且跨系统的：用户需要看到实时进度，Worker 需要按数据库契约回写结果，额度又不能在任务失败或重复通知时被误扣。",
        solution:
          "- **任务状态同步**：Worker 仅通过共享任务表回写时，采用数据库事件通知与 SSE，并以快照轮询兜底，保证进度可见、终态不回退。\n- **契约、权限与额度**：将任务状态、终态字段和回写约束下沉到数据库；结果文件按路径边界与用户归属校验，额度在任务成功后通过事务锁与唯一流水扣减。\n- **支付与交付**：支持月付 / 年付订单、支付验签、待支付复用和过期关闭，配套健康检查与 Windows 一键发布，完成客户交付。",
        result: "完成客户交付。",
        role: "独立开发者（后端架构、前端页面、Worker 契约、测试交付）",
        techStack: ["Python", "FastAPI", "React", "PostgreSQL", "SSE"],
      },
    },
    {
      id: "exp-wechat-bot",
      year: "2025.12 - 至今",
      role: "独立开发者 · 开源项目",
      company: "微信智能助手",
      location: "开源项目",
      summary:
        "面向 Windows 微信用户的桌面智能助手，提供消息处理、记忆检索与模型管理，解决长期运行中的接入不稳定、响应阻塞与发布诊断问题。",
      techTags: ["Python", "Quart", "Electron", "SQLite", "OpenAI-compatible API", "RAG", "SSE"],
      highlighted: true,
      keyOutcomes: [
        "接入层抽象：针对 Windows 微信版本、权限和通道差异，统一消息收发与运行状态接口，避免主链路绑定具体自动化实现。",
        "响应与记忆解耦：将事实提取、记忆写入、联系人画像和语料同步移出回复主链路，分层管理短期对话、运行期记忆和导出语料；排序增强不可用时回退关键词或轻量语义检索。",
        "认证与发布治理：统一凭据回退，提供提示词版本回滚、备份恢复、脱敏诊断、Windows 发布门禁，并通过离线评测和 smoke 用例回归主路径。",
        "开源反馈：GitHub 仓库截至 2026-10-12 获 37 Stars、5 Forks。",
      ],
      audienceTags: ["hr", "jobSeeker", "partner", "client"],
      groupParentId: "exp-independent-developer",
      hideFromSection: true,
      businessValue: {
        zh: "将微信自动回复脚本升级为具备接入治理、运行诊断与成本分析能力的桌面智能助手，降低长期运行和排障成本。",
        en: "The script-like WeChat bot now runs as a long-running AI assistant with diagnostics and cost control.",
      },
      engineeringDepth: {
        zh: "覆盖 `BaseTransport` 抽象、分层 Agent 运行时、SQLite 三层记忆、可降级 RAG、模型认证中心、知识库治理、受控工具流、发布更新与运行观测。",
        en: "Uses transport abstraction, a layered agent runtime, SQLite-backed memory tiers, degradable RAG, auth governance, controlled tools, release gates, and runtime observability.",
      },
      verification: [
        {
          sourceType: "repo",
          sourceLabel: "GitHub 公开仓库页 / README / HIGHLIGHTS / tests / recent commits",
          sourceUrl: "https://github.com/byteD-x/wechat-bot",
          verifiedAt: "2026-10-12",
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
          "- **接入层抽象**：针对 Windows 微信版本、权限和通道差异，统一消息收发与运行状态接口，避免主链路绑定具体自动化实现。\n- **响应与记忆解耦**：将事实提取、记忆写入、联系人画像和语料同步移出回复主链路，分层管理短期对话、运行期记忆和导出语料；排序增强不可用时回退关键词或轻量语义检索。\n- **认证与发布治理**：统一凭据回退，提供提示词版本回滚、备份恢复、脱敏诊断、Windows 发布门禁，并通过离线评测和 smoke 用例回归主路径。",
        result: "完成主路径回归。",
        role: "独立开发者",
        techStack: ["Python", "Quart", "Electron", "SQLite", "OpenAI-compatible API", "RAG", "SSE"],
      },
    },
    {
      id: "exp-customer-ai-runtime",
      year: "2026.02 - 至今",
      role: "独立开发者 · 开源项目",
      company: "智能客服运行时",
      location: "开源项目",
      summary:
        "面向企业客服的 Agent 运行时，支持知识问答、订单查询与低置信转人工，解决多渠道接入、工具副作用与知识版本治理问题。",
      techTags: ["Python", "FastAPI", "RAG", "Redis", "Qdrant / Pinecone / Milvus", "WebSocket", "Docker"],
      highlighted: true,
      keyOutcomes: [
        "插件化接入与上下文路由：隔离渠道、业务工具与模型适配，统一文本、语音、RTC 和宿主页面入口；结合用户意图、页面上下文和业务对象区分自动回答、追问与转人工。",
        "受控执行器：以白名单、参数校验、步骤上限、失败停止、断点恢复和审批门禁控制工具调用，保证副作用可控、过程可追溯。",
        "知识、成本与评测治理：按租户管理知识库、文档、切片和版本，支持快照激活与引用回传；知识问答可缓存，业务查询保持实时，记录模型用量并以离线评测和回归门禁约束版本发布。",
        "开源反馈：GitHub 仓库截至 2026-10-12 获 4 Stars、1 Fork。",
      ],
      audienceTags: ["hr", "jobSeeker", "partner", "client"],
      groupParentId: "exp-independent-developer",
      hideFromSection: true,
      businessValue: {
        zh: "AI 客服现在支持挂载宿主系统、调用业务工具、转人工和知识治理，减少宿主系统改造成本。",
        en: "The AI customer-service flow now runs as a controlled runtime that can mount into host systems, call business tools, and hand off to humans.",
      },
      engineeringDepth: {
        zh: "覆盖六层运行时架构、7 类插件注册中心、Auth Bridge、多提供商适配、知识治理、成本对账、RAG eval、SQLite 人工队列、readiness 审计与多租户边界控制。",
        en: "Includes a layered runtime, plugin registry, auth bridging, provider adaptation, knowledge governance, cost governance, RAG evaluation, handoff queues, and multi-tenant boundary control.",
      },
      verification: [
        {
          sourceType: "repo",
          sourceLabel: "GitHub 公开仓库页 / README / STAR-HIGHLIGHTS / runtime tests / recent commits",
          sourceUrl: "https://github.com/byteD-x/customer-ai-runtime",
          verifiedAt: "2026-10-12",
          confidence: "high",
          level: "strict",
        },
      ],
      expandedDetails: {
        background:
          "目标是在统一多通道接入和宿主系统复用的前提下，交付支持转人工、知识治理和行业扩展的客服运行时。",
        problem:
          "如果将文本、语音、RTC、业务工具、鉴权和转人工能力写死在单一流程中，宿主系统难接入、租户边界难控制，运行诊断和知识治理也难持续演进。",
        solution:
          "- **插件化接入与上下文路由**：隔离渠道、业务工具与模型适配，统一文本、语音、RTC 和宿主页面入口；结合用户意图、页面上下文和业务对象区分自动回答、追问与转人工。\n- **受控执行器**：以白名单、参数校验、步骤上限、失败停止、断点恢复和审批门禁控制工具调用，保证副作用可控、过程可追溯。\n- **知识、成本与评测治理**：按租户管理知识库、文档、切片和版本，支持快照激活与引用回传；知识问答可缓存，业务查询保持实时，记录模型用量并以离线评测和回归门禁约束版本发布。",
        result: "完成智能客服运行时交付。",
        role: "独立开发者（架构设计与核心开发）",
        techStack: ["Python", "FastAPI", "RAG", "Redis", "Qdrant / Pinecone / Milvus", "WebSocket", "Docker"],
      },
    },
    {
      id: "exp-sustech",
      year: "2025.11 - 2025.12",
      groupParentId: "exp-independent-developer",
      hideFromSection: true,
      role: "外包技术顾问",
      company: "数阁科技（深圳）｜IPA 方言语音转写原型",
      location: "深圳 · 终端客户：南方科技大学",
      summary:
        "面向南方科技大学研究人员的方言 IPA 标注原型，提供本地转写、批量复核和 Excel 导出，解决音频格式与规则整理分散的问题。",
      techTags: ["Python", "Flask", "PyTorch", "SSE", "Excel"],
      highlighted: false,
      keyOutcomes: [
        "需求收敛：在需求不清、周期受限下，将范围收敛为本地转写、批量复核、Excel 导出的可验收 MVP，按期交付客户。",
        "输入与规则标准化：统一音频采样率和声道后进入识别链路，将 IPA 拆分规则改为表格驱动，输出声母、韵母和调值，支持研究人员复核与二次整理。",
        "验收闭环：打通批量处理、流式进度和 Excel 导出，客户以真实音频样本完成现场验收；运行日志可追溯累计 2380 次识别、60 次批量任务，单批最大 500 个文件。",
      ],
      audienceTags: ["partner", "client"],
      businessValue: {
        zh: "把研究型语音能力收敛成客户可直接试用的演示系统，帮助对方在短周期内验证技术可行性与交互形态，降低立项风险。",
        en: "Validated solution feasibility with a rapid prototype, reducing project initiation risk.",
      },
      engineeringDepth: {
        zh: "覆盖本地 ASR 推理封装、音频预处理、批量并发处理、结构化结果导出与面向演示场景的 Web 化交付。",
        en: "Worked through a new domain quickly while keeping the project on its delivery schedule.",
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
          "- **需求收敛**：在需求不清、周期受限下，将范围收敛为本地转写、批量复核、Excel 导出的可验收 MVP，按期交付客户。\n- **输入与规则标准化**：统一音频采样率和声道后进入识别链路，将 IPA 拆分规则改为表格驱动，输出声母、韵母和调值，支持研究人员复核与二次整理。\n- **验收闭环**：打通批量处理、流式进度和 Excel 导出，客户以真实音频样本完成现场验收；运行日志可追溯累计 2380 次识别、60 次批量任务，单批最大 500 个文件。",
        result: "完成客户交付。",
        role: "全栈顾问（需求收敛、后端实现、演示交付）",
        techStack: ["Python", "Flask", "PyTorch", "SSE", "Excel"],
      },
    },
    {
      id: "exp-chinasoft",
      year: "2025.04 - 2025.09",
      role: "后端/全栈工程师",
      company: "中软国际",
      location: "西安",
      summary:
        "面向企业制度与流程知识治理的 RAG + Agent 平台，要求回答可引用、证据不足可拒答、复杂任务可恢复。",
      techTags: ["Python", "FastAPI", "LangGraph", "RAG", "PostgreSQL 全文检索", "Qdrant", "Vue 3"],
      highlighted: true,
      keyOutcomes: [
        "混合检索：针对制度条款、编号、图文教程等精确查询易漏检，融合结构化信号、全文检索和向量召回，再做查询改写与重排，提升候选覆盖。",
        "可信回答：按证据强度输出回答、补充或拒答，并强制引用与可信度回传，把无证据回答挡在生成前。",
        "可恢复工作流：将问答拆为可暂停、可恢复的图工作流，支持复杂问题并行拆解、工具调用、人工澄清和失败恢复，便于持续交付。",
        "权限与发布门禁：在召回前按租户、部门过滤文档，缓存按权限隔离；用安全回归、检索对比和引用质量检查约束版本发布。",
        "开源反馈：GitHub 仓库截至 2026-10-12 获 2 Stars；仓库内另有 400+ 项回归测试证据。",
      ],
      audienceTags: ["hr", "jobSeeker", "partner"],
      businessValue: {
        zh: "把分散文档和多步问答流程整理成可持续同步、带引用来源、可配置 Agent 能力的企业 AI 问答平台，为连接器扩展、运营审计和低成本推理治理提供基础。",
        en: "Built an enterprise AI QA platform from scattered documents, with continuous sync, traceable citations, configurable agent workflows, and inference governance.",
      },
      engineeringDepth: {
        zh: "覆盖三路混合检索、LangGraph 编排、Agent 自主决策、工具生态、三层缓存、模型健康、分层指令、幻觉检测、Python SDK 与评测回归体系。",
        en: "Covers hybrid retrieval, LangGraph orchestration, agent autonomy, tool ecosystems, semantic caching, model health, layered instructions, hallucination checks, SDK delivery, and evaluation gates.",
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
          sourceLabel: "GitHub 公开仓库页 / README / AI_HIGHLIGHTS / docs/reference / tests",
          sourceUrl: "https://github.com/byteD-x/rag-qa-system",
          verifiedAt: "2026-10-12",
          confidence: "high",
          level: "strict",
        },
      ],
      expandedDetails: {
        background:
          "企业资料分散在本地目录、Notion 等多源，业务希望把制度、FAQ、项目文档整理为可检索、可引用、可持续同步，并能支持多步 Agent 问答的知识平台。",
        problem:
          "传统单路检索难以同时覆盖标题、关键词与语义混合场景；Agent 模式如果缺少工具边界、反思、自主拆解、缓存治理和安全检测，也容易变成不可解释的高成本黑盒。",
        solution:
          "- **混合检索**：针对制度条款、编号、图文教程等精确查询易漏检，融合结构化信号、全文检索和向量召回，再做查询改写与重排，提升候选覆盖。\n- **可信回答**：按证据强度输出回答、补充或拒答，并强制引用与可信度回传，把无证据回答挡在生成前。\n- **可恢复工作流**：将问答拆为可暂停、可恢复的图工作流，支持复杂问题并行拆解、工具调用、人工澄清和失败恢复，便于持续交付。\n- **权限与发布门禁**：在召回前按租户、部门过滤文档，缓存按权限隔离；用安全回归、检索对比和引用质量检查约束版本发布。",
        result: "完成企业制度与流程知识治理平台交付。",
        role: "后端/AI 应用工程师",
        techStack: ["Python", "FastAPI", "LangGraph", "RAG", "PostgreSQL 全文检索", "Qdrant", "Vue 3"],
      },
    },
    {
      id: "exp-noc",
      year: "2024.08 - 2024.10",
      role: "后端开发实习生",
      company: "国家骨科临床研究中心",
      location: "远程",
      summary:
        "面向骨科临床研究人员的医学论文检索小程序，覆盖搜索、语音输入、分析、推荐与订阅，解决科研信息从一次查询到持续跟踪的问题。",
      techTags: ["微信小程序", "REST API", "语音识别", "订阅推送"],
      highlighted: false,
      keyOutcomes: [
        "检索与订阅链路：负责文献搜索、详情、推荐、收藏、深度分析和分享接口设计与联调。",
        "语音输入：接入微信语音识别，将口述查询转成检索请求，降低移动端输入成本。",
        "订阅信息流：设计按关键词、影响因子、分区和频率的订阅配置与推送历史，把一次性搜索扩展为持续科研跟踪。",
      ],
      audienceTags: ["hr", "jobSeeker"],
      businessValue: {
        zh: "把医学论文获取、筛选、订阅和深度阅读串成一条连续流程，降低专家跟踪前沿研究的时间成本。",
        en: "Greatly improved efficiency for researchers to access frontier information.",
      },
      engineeringDepth: {
        zh: "覆盖爬取入库、搜索接口、AI 辅助分析、订阅任务、支付积分体系与小程序 API 设计。",
        en: "Covers requirements analysis and system architecture for a medical search product.",
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
          "- **检索与订阅链路**：负责文献搜索、详情、推荐、收藏、深度分析和分享接口设计与联调。\n- **语音输入**：接入微信语音识别，将口述查询转成检索请求，降低移动端输入成本。\n- **订阅信息流**：设计按关键词、影响因子、分区和频率的订阅配置与推送历史，把一次性搜索扩展为持续科研跟踪。",
        result: "完成医学论文检索小程序交付。",
        role: "后端开发（检索链路、业务 API、任务与数据模型）",
        techStack: ["微信小程序", "REST API", "语音识别", "订阅推送"],
      },
    },
    {
      id: "exp-unicom",
      year: "2024.05 - 2024.08",
      role: "后端开发实习生",
      company: "中国联通陕西省分公司",
      location: "西安 · 数字化部",
      summary:
        "面向运营团队的活动统计与数据中台，解决高频统计查询慢、海量数据迁移与发布回滚效率问题。",
      techTags: ["Java", "SQL", "ClickHouse", "CI/CD"],
      highlighted: true,
      keyOutcomes: [
        "查询与数据治理：针对活动统计接口响应慢，推动交易与分析数据分离。",
        "聚合查询：重写聚合查询并补充索引、缓存和增量校验，保障分析数据可用。",
        "发布治理：建设发布门禁、回滚链路与变更追踪，降低变更风险。",
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
          "- **查询与数据治理**：针对活动统计接口响应慢，推动交易与分析数据分离。\n- **聚合查询**：重写聚合查询并补充索引、缓存和增量校验，保障分析数据可用。\n- **发布治理**：建设发布门禁、回滚链路与变更追踪，降低变更风险。",
        result: "完成运营平台与数据中台相关交付。",
        role: "后端开发",
        techStack: ["Java", "SQL", "ClickHouse", "CI/CD"],
      },
    },
    {
      id: "exp-cloudpan",
      year: "2024.04 - 2026.02",
      hideFromSection: true,
      role: "全栈开发 · 开源项目",
      company: "EasyCloudPan",
      location: "开源项目（本地 + Docker）",
      summary:
        "面向个人与团队的云盘系统，提供大文件上传、对象存储与安全访问，解决弱网续传、权限控制和数据一致性问题。",
      techTags: ["Java", "Spring Boot", "React", "PostgreSQL", "Redis", "MinIO", "Docker"],
      highlighted: true,
      keyOutcomes: [
        "上传闭环：针对大文件、弱网和重复上传，构建分片、秒传、断点续传与进度回传链路，支持中断恢复。",
        "查询与一致性：用复合索引、游标分页和分层缓存治理高频列表查询，并校验文件元数据与对象存储状态，减少脏数据。",
        "安全访问：通过请求签名、防重放、双令牌、文件权限和真实类型校验，形成从请求入口到文件落地的访问控制。",
        "部署可运维：提供 Docker 部署、健康检查与监控基线，保证核心流程可复现、问题可定位。",
        "开源反馈：GitHub 仓库截至 2026-10-12 获 5 Stars。",
      ],
      audienceTags: ["hr", "jobSeeker", "partner", "client"],
      businessValue: {
        zh: "提供可私有化部署的一体化文件平台，兼顾高并发上传、安全治理、身份接入扩展与可观测交付，降低企业文件服务的稳定性与安全风险。",
        en: "Built a privately deployable cloud-drive platform with performance, security, and observability controls.",
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
          "项目目标是把网盘能力做成可企业内部署的文件平台，并保持本地一键启动与 Docker 全栈部署两条链路一致可用。",
        problem:
          "需要同时解决大文件上传稳定性、热点查询与深分页性能、安全鉴权一致性、第三方登录接入复杂度，以及上线后的监控与告警流程。",
        solution:
          "- **上传闭环**：针对大文件、弱网和重复上传，构建分片、秒传、断点续传与进度回传链路，支持中断恢复。\n- **查询与一致性**：用复合索引、游标分页和分层缓存治理高频列表查询，并校验文件元数据与对象存储状态，减少脏数据。\n- **安全访问**：通过请求签名、防重放、双令牌、文件权限和真实类型校验，形成从请求入口到文件落地的访问控制。\n- **部署可运维**：提供 Docker 部署、健康检查与监控基线，保证核心流程可复现、问题可定位。",
        result: "完成核心流程交付。",
        role: "全栈开发（架构设计、后端核心、前端联调、部署验收）",
        techStack: ["Java", "Spring Boot", "React", "PostgreSQL", "Redis", "MinIO", "Docker"],
      },
    },
    {
      id: "exp-jzt-shuttle-path",
      year: "2023.05 - 2023.07",
      hideFromSection: true,
      role: "项目经理 / 算法研发",
      company: "九州通四向穿梭车路径规划系统",
      location: "本地项目",
      summary:
        "面向医药仓储四向穿梭车调度的路径规划原型，验证网格寻路、多车冲突消解与可视化调试方案。",
      techTags: ["Python", "A*", "PyQt5"],
      highlighted: false,
      keyOutcomes: [
        "路径建模：使用 A* 处理道路、墙壁和货架等通行约束，统一空车与载货场景的路径规则。",
        "冲突消解：针对多车争用节点，实现节点冲突检测与优先级等待策略，验证多车避让逻辑。",
        "可视化调试：提供地图编辑、起终点设置、路径步进和保存加载，把算法验证从日志观察变成可视化调试。",
      ],
      audienceTags: ["hr", "partner"],
      businessValue: {
        zh: "以低成本验证自动化仓储调度算法的可行性，为后续仓储设备调度系统建设提供算法依据。",
        en: "Verified feasibility of warehouse automation scheduling algorithms at low cost.",
      },
      engineeringDepth: {
        zh: "覆盖图搜索算法、冲突消解逻辑、仓储地图建模与图形化界面开发。",
        en: "Combined graph search algorithms, concurrent programming, and GUI development.",
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
          "- **路径建模**：使用 A* 处理道路、墙壁和货架等通行约束，统一空车与载货场景的路径规则。\n- **冲突消解**：针对多车争用节点，实现节点冲突检测与优先级等待策略，验证多车避让逻辑。\n- **可视化调试**：提供地图编辑、起终点设置、路径步进和保存加载，把算法验证从日志观察变成可视化调试。",
        result: "完成路径规划原型交付。",
        role: "算法研发",
        techStack: ["Python", "A*", "PyQt5"],
      },
    },
    {
      id: "exp-education",
      year: "2021.09 - 2025.06",
      role: "本科 · 数据科学与大数据技术",
      company: "南阳理工学院",
      location: "南阳",
      summary:
        "完成数据科学与大数据技术本科阶段学习，建立软件工程、数据处理与算法基础。",
      techTags: ["Python", "Java", "数据结构与算法", "数据库"],
      highlighted: false,
      keyOutcomes: [
        "完成本科阶段课程学习，获得 GPA 3.8/4.5、Top 5% 的学业成绩。",
        "获得校级优秀学生、学生干部和奖学金等荣誉。",
        "将课程学习转化为全栈、算法与数据工程项目实践。",
      ],
      verification: [
        {
          sourceType: "manual",
          sourceLabel: "简历教育经历",
          verifiedAt: "2026-03-31",
          confidence: "high",
          level: "strict",
        },
      ],
      expandedDetails: {
        background: "完成数据科学与大数据技术本科阶段学习。",
        solution: "- 课程学习\n- 项目实践\n- 学业与综合荣誉",
        result: "GPA 3.8/4.5，Top 5%。",
        role: "本科生",
        techStack: ["Python", "Java", "数据结构与算法", "数据库"],
      },
    },
  ],

  projects: [
    {
      id: "proj-independent-developer",
      year: "2025.09 - 至今",
      name: "独立开发者｜AI 应用 / 全栈项目",
      techTags: [
        "Java 21",
        "Spring Boot 3.5",
        "Python",
        "FastAPI",
        "React 19",
        "TypeScript",
        "PostgreSQL",
        "MySQL",
        "Redis",
        "Flask",
        "SSE",
        "MQTT",
      ],
      summary:
        "以独立开发者身份推进 5 个代表项目，覆盖租赁业务、任务平台、方言语音转写、客服运行时与桌面智能助手，并按子项目保留独立详情与证据入口。",
      impact: "5 个代表项目的方案设计 / 全栈实现 / 联调验证 / 运行治理",
      highlighted: true,
      keyOutcomes: [
        "GitHub 公开账号快照：14 个公开仓库累计 51 Stars、7 Forks（2026-10-12）。",
        "聚合租赁、论文检索、方言转写、客服运行时与微信助手五个代表项目，覆盖方案设计、全栈实现、联调验证和运行治理。",
      ],
      childIds: [
        "proj-rentbox",
        "proj-paper-retrieval-platform",
        "proj-ipa-demo",
        "proj-customer-ai-runtime",
        "proj-wechat-bot",
      ],
      verification: [
        {
          sourceType: "manual",
          sourceLabel: "主简历 / 英文 PDF 交叉校对",
          verifiedAt: "2026-05-18",
          confidence: "high",
          level: "strict",
        },
      ],
      expandedDetails: {
        background:
          "该分组用于承接最新简历中的独立开发阶段，把并行推进的代表项目集中展示。",
        solution:
          "- 统一展示 RentBox、论文检索任务平台、IPA 方言语音转写、智能客服运行时和微信智能助手五个子项目。\n- 在项目区保留每个子项目的独立卡片能力，同时提供父项视角的整体概览。\n- 通过父子关系维持最新简历结构与现有详情页 slug 的兼容。",
        result:
          "让独立开发者相关项目在项目区以一个大项聚合展示，同时保留单个项目的独立访问路径。",
        role: "独立开发者",
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
    {
      id: "proj-rentbox",
      year: "2026.05 - 至今",
      groupParentId: "proj-independent-developer",
      hideFromSection: true,
      name: "简租科技小程序（RentBox）",
      demoLink: "",
      techTags: [
        "Java",
        "Spring Boot",
        "微信支付",
        "MQTT",
        "TCP",
        "HTTP",
        "React",
        "uni-app",
      ],
      summary:
        "面向共享擦窗宝租赁的微信小程序、商家端和柜机管理端，覆盖商家入驻、支付免押、取机归还及设备回调，解决租赁订单与硬件状态不同步问题。",
      impact: "商家与订单链路 + 设备接入与安全开锁",
      keyOutcomes: [
        "商家与订单链路：围绕商家入驻、租赁商品、支付免押、取机归还，采用订单状态机、幂等键与结果回放处理乱序 / 重复回调，保证订单按合法路径推进。",
        "设备接入与安全开锁：接入柜机心跳、柜门事件和开锁回执，使用新鲜设备快照校验在线与闭门状态；异常状态进入工单，避免设备状态不明时放行。",
        "协议适配与可靠性：在接入层统一适配 TCP、MQTT、HTTP，并按板型与协议码路由；开锁超时通过重试、状态查询和定时补偿推进，最终转异常工单，不阻塞请求线程。",
        "上线交付：统筹域名与 ICP 备案、微信 / 支付宝支付及微信支付分开通，完成小程序、商家端、管理端、渠道端与正式环境部署，交付客户 27 项需求。",
      ],
      audienceTags: ["hr", "jobSeeker", "partner", "client"],
      businessValue: {
        zh: "把线下设备租赁中的用户操作、资金担保、柜机状态、渠道结算和后台运维统一到可追踪系统内，降低测试上线和后续运营风险。",
        en: "Unified user rental flows, payment guarantees, cabinet state, channel settlement, and operations into a traceable delivery system.",
      },
      engineeringDepth: {
        zh: "覆盖 Spring Boot 模块化单体、微信支付/支付分、厂商设备适配、Redis 幂等与锁、审计日志、Flyway 迁移、多端 React/uni-app 工程和宿主机发布。",
        en: "Uses Spring Boot modules, WeChat payment integrations, vendor device adapters, Redis idempotency and locking, audit logs, Flyway, multi-client frontends, and host deployment.",
      },
      verification: [
        {
          sourceType: "repo",
          sourceLabel:
            "本地仓库 README / doc/技术方案说明 / server / miniapp / tests / deploy",
          verifiedAt: "2026-05-17",
          confidence: "high",
          level: "strict",
        },
      ],
      expandedDetails: {
        background:
          "共享擦窗宝租赁需要同时处理微信小程序用户体验、后台运营、渠道合作、支付担保、柜机开锁和归还审核。",
        problem:
          "租赁链路涉及多方外部系统，支付、免押和设备回调可能重复、延迟或乱序；如果缺少统一状态和审计，资金与设备动作很难安全推进。",
        solution:
          "- **多端工程组织**：单仓维护 Spring Boot 后端、React 管理端/渠道端、uni-app 小程序和共享组件，接口与文档同步推进。\n- **状态与幂等治理**：围绕订单生命周期建立状态历史、审计日志、Redis/JDBC 幂等、分布式锁和人工补偿入口。\n- **外部能力适配**：通过支付、免押和设备网关隔离微信支付、微信支付分和柜机厂商协议，真实配置缺失时暴露阻塞态。\n- **发布与回滚**：保留 Flyway 迁移策略、Maven/Vite 门禁、小程序验证清单和宿主机 release 切换流程。",
        result:
          "完成测试期租赁主体能力：扫码租用、在线预约、支付/免押、开门取机、归还审核、异常反馈、渠道结算、后台运维与服务器发布。",
        role: "独立开发者",
        techStack: [
          "Java 21",
          "Spring Boot 3.5",
          "Spring JDBC",
          "Flyway",
          "MySQL",
          "Redis",
          "React 19",
          "TypeScript",
          "Vite",
          "uni-app",
        ],
      },
      highlighted: true,
    },
    {
      id: "proj-paper-retrieval-platform",
      year: "2026.01 - 2026.05",
      groupParentId: "proj-independent-developer",
      hideFromSection: true,
      name: "论文检索任务平台",
      techTags: [
        "Python",
        "FastAPI",
        "React",
        "PostgreSQL",
        "SSE",
      ],
      summary:
        "面向论文检索任务的全栈平台，为用户提供任务创建、进度跟踪、结果下载与订阅支付，解决共享任务表回写下的状态与额度一致性。",
      impact: "任务状态同步 + 契约、权限与额度",
      keyOutcomes: [
        "任务状态同步：Worker 仅通过共享任务表回写时，采用数据库事件通知与 SSE，并以快照轮询兜底，保证进度可见、终态不回退。",
        "契约、权限与额度：将任务状态、终态字段和回写约束下沉到数据库；结果文件按路径边界与用户归属校验，额度在任务成功后通过事务锁与唯一流水扣减。",
        "支付与交付：支持月付 / 年付订单、支付验签、待支付复用和过期关闭，配套健康检查与 Windows 一键发布，完成客户交付。",
      ],
      audienceTags: ["hr", "jobSeeker", "partner", "client"],
      businessValue: {
        zh: "在甲方 Worker 不接入用户系统的前提下，交付可验收的用户侧任务平台，降低跨团队联调和后续生产化风险。",
        en: "Built a testable user-facing task platform while keeping the customer worker integration behind a database contract.",
      },
      engineeringDepth: {
        zh: "覆盖 FastAPI 分层、异步 SQLAlchemy、PostgreSQL 触发器、LISTEN/NOTIFY、SSE、额度流水、支付宝回调、React 功能分层和自动化回归。",
        en: "Covers layered FastAPI services, async SQLAlchemy, PostgreSQL triggers, LISTEN/NOTIFY, SSE, quota ledgers, payment callbacks, React feature modules, and automated regression.",
      },
      verification: [
        {
          sourceType: "repo",
          sourceLabel:
            "本地仓库 README / docs/架构说明 / docs/交付文档 / apps/api / apps/web / tests",
          verifiedAt: "2026-05-17",
          confidence: "high",
          level: "strict",
        },
      ],
      expandedDetails: {
        background:
          "用户需要提交论文检索任务并跟踪结果，但真正执行检索的 Worker 由甲方维护，只通过共享数据库表与平台对接。",
        problem:
          "异步任务跨系统执行，状态同步、终态契约、结果链接安全和额度扣减都需要由平台侧兜住，否则容易出现进度不可见、终态回退或重复扣费。",
        solution:
          "- **用户侧路径**：交付登录注册、任务工作台、结果下载、个人中心、额度流水、支付升级和管理后台。\n- **Worker 契约**：使用 Alembic 迁移加入 check constraint 与触发器，约束状态流转、终态完成时间和成功任务结果数。\n- **状态同步**：通过 PostgreSQL `pg_notify` + asyncpg LISTEN 唤醒 SSE，前端保留轮询兜底。\n- **额度治理**：成功任务再扣减额度，结合 `SELECT ... FOR UPDATE`、唯一额度事件和测试覆盖处理并发。",
        result:
          "交付测试验收版论文检索任务平台，覆盖用户认证、任务提交、进度同步、结果下载、额度流水、支付宝升级和管理后台。",
        role: "独立开发者",
        techStack: [
          "Python",
          "FastAPI",
          "SQLAlchemy",
          "Alembic",
          "PostgreSQL",
          "Redis",
          "React 19",
          "TypeScript",
          "Vite",
          "Playwright",
        ],
      },
      highlighted: true,
    },
    {
      id: "proj-customer-ai-runtime",
      year: "2026.02 - 至今",
      groupParentId: "proj-independent-developer",
      hideFromSection: true,
      name: "智能客服运行时",
      link: "https://github.com/byteD-x/customer-ai-runtime",
      demoLink: "",
      techTags: [
        "Python",
        "FastAPI",
        "RAG",
        "Redis",
        "Qdrant / Pinecone / Milvus",
        "WebSocket",
        "Docker",
      ],
      summary:
        "面向企业客服的 Agent 运行时，支持知识问答、订单查询与低置信转人工，解决多渠道接入、工具副作用与知识版本治理问题。",
      impact: "插件化接入 + 上下文路由 + 受控执行器",
      keyOutcomes: [
        "插件化接入与上下文路由：隔离渠道、业务工具与模型适配，统一文本、语音、RTC 和宿主页面入口；结合用户意图、页面上下文和业务对象区分自动回答、追问与转人工。",
        "受控执行器：以白名单、参数校验、步骤上限、失败停止、断点恢复和审批门禁控制工具调用，保证副作用可控、过程可追溯。",
        "知识、成本与评测治理：按租户管理知识库、文档、切片和版本，支持快照激活与引用回传；知识问答可缓存，业务查询保持实时，记录模型用量并以离线评测和回归门禁约束版本发布。",
        "开源反馈：GitHub 仓库截至 2026-10-12 获 4 Stars、1 Fork。",
      ],
      audienceTags: ["hr", "jobSeeker", "partner", "client"],
      businessValue: {
        zh: "将 AI 客服从单纯知识问答扩展为可挂载、可转人工、可接业务且可治理的运行时能力，降低宿主系统改造成本。",
        en: "The AI customer-service flow now runs as a controlled runtime that can mount into host systems, call business tools, and hand off to humans.",
      },
      engineeringDepth: {
        zh: "覆盖六层运行时架构、7 类插件注册中心、Auth Bridge、多提供商适配、知识治理、成本对账、RAG eval、SQLite 人工队列、readiness 审计与多租户边界控制。",
        en: "Includes a layered runtime, plugin registry, auth bridging, provider adaptation, knowledge governance, cost governance, RAG evaluation, handoff queues, and multi-tenant boundary control.",
      },
      verification: [
        {
          sourceType: "repo",
          sourceLabel: "GitHub 公开仓库页 / README / STAR-HIGHLIGHTS / runtime tests / recent commits",
          sourceUrl: "https://github.com/byteD-x/customer-ai-runtime",
          verifiedAt: "2026-10-12",
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
          "- **搭建分层运行时**：将渠道接入、宿主桥接、核心引擎、业务增强、插件平台、提供商适配六层解耦，统一 4 类接入模式。\n- **设计路由协同机制**：通过 `route_confidence`、`intent_stack`、`page_context`、`business_objects` 组合决策，在低置信度或高风险场景优先澄清或转人工。\n- **建立插件扩展体系**：提供 Route、BusinessTool、Handoff、Industry、AuthBridge、Context、Response 7 类扩展点，支持插件启停、范围过滤与宿主鉴权复用。\n- **提供治理能力**：完善知识版本、chunk 优化、反馈流程、provider billing 与 usage 对账、安全知识缓存、8 个本地 RAG eval cases、SQLite 人工接管队列、外部 readiness 审计、诊断导出、request_id 贯通、限流与提示词脱敏。",
        result:
          "交付可独立运行或宿主挂载的客服运行时，形成覆盖业务接入、人工协同、知识治理、成本观测、评测复现、租户隔离与运行审计的工程基线。",
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
      year: "2025.12 - 至今",
      groupParentId: "proj-independent-developer",
      hideFromSection: true,
      name: "微信智能助手",
      link: "https://github.com/byteD-x/wechat-bot",
      demoLink: "",
      techTags: [
        "Python",
        "Quart",
        "Electron",
        "SQLite",
        "OpenAI-compatible API",
        "RAG",
        "SSE",
      ],
      summary:
        "面向 Windows 微信用户的桌面智能助手，提供消息处理、记忆检索与模型管理，解决长期运行中的接入不稳定、响应阻塞与发布诊断问题。",
      impact: "接入层抽象 + 响应与记忆解耦 + 认证与发布治理",
      keyOutcomes: [
        "接入层抽象：针对 Windows 微信版本、权限和通道差异，统一消息收发与运行状态接口，避免主链路绑定具体自动化实现。",
        "响应与记忆解耦：将事实提取、记忆写入、联系人画像和语料同步移出回复主链路，分层管理短期对话、运行期记忆和导出语料；排序增强不可用时回退关键词或轻量语义检索。",
        "认证与发布治理：统一凭据回退，提供提示词版本回滚、备份恢复、脱敏诊断、Windows 发布门禁，并通过离线评测和 smoke 用例回归主路径。",
        "开源反馈：GitHub 仓库截至 2026-10-12 获 37 Stars、5 Forks。",
      ],
      audienceTags: ["hr", "jobSeeker", "partner", "client"],
      businessValue: {
        zh: "将微信自动回复脚本升级为具备接入治理、运行诊断与成本分析能力的桌面智能助手，降低长期运行和排障成本。",
        en: "The script-like WeChat bot now runs as a long-running AI assistant with diagnostics and cost control.",
      },
      engineeringDepth: {
        zh: "覆盖 `BaseTransport` 抽象、分层 Agent 运行时、SQLite 三层记忆、可降级 RAG、模型认证中心、知识库治理、受控工具流、发布更新与运行观测。",
        en: "Uses transport abstraction, a layered agent runtime, SQLite-backed memory tiers, degradable RAG, auth governance, controlled tools, release gates, and runtime observability.",
      },
      verification: [
        {
          sourceType: "repo",
          sourceLabel: "GitHub 公开仓库页 / README / HIGHLIGHTS / tests / recent commits",
          sourceUrl: "https://github.com/byteD-x/wechat-bot",
          verifiedAt: "2026-10-12",
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
          "- **抽象接入边界**：针对 Windows 微信版本、权限和通道差异统一消息收发与运行状态接口。\n- **解耦回复与记忆**：将事实提取、记忆写入、联系人画像和语料同步移出回复主链路，分层管理短期对话、运行期记忆和导出语料。\n- **保留检索回退**：排序增强不可用时回退关键词或轻量语义检索，避免单一向量依赖阻断回复。\n- **加入发布治理**：统一凭据回退，提供提示词版本回滚、备份恢复、脱敏诊断、Windows 发布门禁与离线 smoke 评测。",
        result:
        "交付面向 Windows 微信生态的长期运行智能助手，覆盖消息接入、记忆增强、模型认证、知识库治理、运行观测、配置治理、排障评测与发布更新。",
        role: "独立开发者",
        techStack: [
          "Python",
          "Quart",
          "Asyncio",
          "OpenAI-compatible API",
          "Electron",
          "SQLite",
          "SSE",
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
        "Python",
        "FastAPI",
        "LangGraph",
        "RAG",
        "PostgreSQL 全文检索",
        "Qdrant",
        "Vue 3",
      ],
      summary:
        "面向企业制度与流程知识治理的 RAG + Agent 平台，要求回答可引用、证据不足可拒答、复杂任务可恢复。",
      impact: "混合检索 + 可信回答与权限 + 可恢复工作流",
      keyOutcomes: [
        "混合检索：针对制度条款、编号、图文教程等精确查询易漏检，融合结构化信号、全文检索和向量召回，再做查询改写与重排，并通过离线检索对比检查版本回归。",
        "可信回答与权限：按证据强度输出回答、补充或拒答并强制回传引用；召回前按租户、部门过滤文档，缓存按权限隔离。",
        "可恢复工作流：将问答拆为可暂停、可恢复的图工作流，支持复杂问题并行拆解、工具调用、人工澄清和失败恢复，便于持续交付。",
        "发布门禁：用安全回归、检索对比和引用质量检查约束版本发布。",
        "开源反馈：GitHub 仓库截至 2026-10-12 获 2 Stars；仓库内另有 400+ 项回归测试证据。",
      ],
      audienceTags: ["hr", "jobSeeker", "partner", "client"],
      businessValue: {
        zh: "将企业分散资料整理为可持续同步、可追溯引用、可配置 Agent 能力的 AI 问答平台，降低检索、答复、治理和后续集成成本。",
        en: "Turns scattered enterprise documents into a continuously synced AI QA platform with traceable citations, configurable agents, and lower integration overhead.",
      },
      engineeringDepth: {
        zh: "覆盖三路混合检索、LangGraph 编排、Agent 自主决策、工具生态、三层缓存、模型健康、分层指令、幻觉检测、Python SDK 与评测回归体系。",
        en: "Covers hybrid retrieval, LangGraph orchestration, agent autonomy, tool ecosystems, semantic caching, model health, layered instructions, hallucination checks, SDK delivery, and evaluation gates.",
      },
      verification: [
        {
          sourceType: "repo",
          sourceLabel: "GitHub 公开仓库页 / README / AI_HIGHLIGHTS / docs/reference / tests",
          sourceUrl: "https://github.com/byteD-x/rag-qa-system",
          verifiedAt: "2026-10-12",
          confidence: "high",
          level: "strict",
        },
      ],
      expandedDetails: {
        background:
          "企业资料分散在本地目录、Notion 等多源，业务希望把制度、FAQ、项目文档整理为可检索、可引用、可持续同步，并能支持多步 Agent 问答的知识平台。",
        problem:
          "传统单路检索难以同时覆盖标题、关键词与语义混合场景；Agent 模式如果缺少工具边界、反思、自主拆解、缓存治理和安全检测，也容易变成不可解释的高成本黑盒。",
        solution:
          "- **搭建混合检索**：结构、全文、向量三路召回配合 query rewrite、加权 RRF 与 rerank，提升复杂问题场景下的证据命中率。\n- **重构 Agent 运行时**：在 Gateway 与检索层引入 LangGraph，支持 checkpoint、interrupt/resume、`step_events`、工具注册中心、任务拆解 DAG、反思流程与三层记忆。\n- **提供平台治理能力**：建设多知识库、多源连接器、batch dry-run/jobs、token-aware chunk、retrieve/debug、人工接管队列、五层指令合并、6 类场景模板、RAG 幻觉检测、企业聊天 v2 与 Python SDK。\n- **强化推理与评测流程**：引入三层语义缓存、模型健康熔断、复杂度驱动路由、请求合并和 readyz/trace 诊断，并通过 retrieval fixture、local ingest fixture、22 个后端测试文件、9 个前端测试文件和 400+ 测试项约束回归。",
        result:
          "形成面向中文企业场景的 AI 问答平台，支持 grounded answer、引用溯源、多源同步、可解释检索调试、可恢复执行、Agent 自主决策、人工接管、推理治理和最小评测回归流程。",
        role: "后端/AI 应用工程师",
        techStack: [
          "FastAPI",
          "LangGraph",
          "Vue 3",
          "PostgreSQL",
          "Qdrant",
          "FastEmbed",
          "Agent Runtime",
          "Semantic Cache",
          "Python SDK",
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
      groupParentId: "proj-independent-developer",
      name: "IPA Demo",
      techTags: [
        "Python",
        "Flask",
        "PyTorch",
        "SSE",
        "Excel",
      ],
      summary:
        "面向南方科技大学研究人员的方言 IPA 标注原型，提供本地转写、批量复核和 Excel 导出，解决音频格式与规则整理分散的问题。",
        impact: "需求收敛 + 输入与规则标准化 + 验收闭环",
      keyOutcomes: [
        "需求收敛：在需求不清、周期受限下，将范围收敛为本地转写、批量复核、Excel 导出的可验收 MVP，按期交付客户。",
        "输入与规则标准化：统一音频采样率和声道后进入识别链路，将 IPA 拆分规则改为表格驱动，输出声母、韵母和调值，支持研究人员复核与二次整理。",
        "验收闭环：打通批量处理、流式进度和 Excel 导出，客户以真实音频样本完成现场验收；运行日志可追溯累计 2380 次识别、60 次批量任务，单批最大 500 个文件。",
      ],
      audienceTags: ["jobSeeker", "partner", "client"],
      businessValue: {
        zh: "把研究型语音识别能力快速收敛成可试用原型，帮助客户低成本验证需求与技术路线。",
        en: "Packaged research-oriented speech recognition into a usable prototype for low-cost validation.",
      },
      engineeringDepth: {
        zh: "覆盖本地模型推理封装、音频预处理、批处理并发、结构化导出和面向演示场景的 Web 交付。",
        en: "Uses local ASR inference packaging, audio preprocessing, batch concurrency, structured export, and web delivery for demos.",
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
          "- **Web 化封装**：用 Flask 承载本地 ASR pipeline，并提供上传、录音、示例音频和二次转写接口。\n- **音频处理**：结合 `torchaudio` 与 `ffmpeg` 做格式检测、标准化转换和并发加载。\n- **结果结构化**：通过 Excel 表维护 IPA 映射，支持声母/韵母/声调拆分与 Excel 导出。\n- **演示交付**：加入系统手册、模板下载、错误日志与批量处理能力，便于现场演示和验收。",
        result:
          "交付完整的 `IPA Demo` 原型，覆盖“录音/上传 -> 转写 -> IPA 拆分 -> 导出”的核心流程。",
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
        "微信小程序",
        "REST API",
        "语音识别",
        "订阅推送",
      ],
      summary:
        "面向骨科临床研究人员的医学论文检索小程序，覆盖搜索、语音输入、分析、推荐与订阅，解决科研信息从一次查询到持续跟踪的问题。",
      impact: "检索与订阅链路",
      keyOutcomes: [
        "检索与订阅链路：负责文献搜索、详情、推荐、收藏、深度分析和分享接口设计与联调；接入微信语音识别，并设计按关键词、影响因子、分区和频率的订阅配置与推送历史。",
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
          "- **数据与检索**：基于 Django + MySQL 建立论文、主题、订阅和收藏等模型，通过 PubMed spider 与管理命令维护数据。\n- **AI 能力**：提供 AI 关键词生成、AI 搜索、深度分析和相关推荐接口，增强医学场景的检索表达能力。\n- **异步与缓存**：使用 Celery 和 Redis 支撑定时任务、推送流程和接口性能治理。\n- **商业化流程**：接入微信支付、积分记录、VIP 与邀请码，支撑小程序持续运营。",
        result:
          "形成面向医学检索场景的小程序后端流程，覆盖数据抓取、搜索分析、订阅推送与支付运营。",
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
      impact: "教育平台 + 支付流程 + 实时互动",
      keyOutcomes: [
        "负责课程、支付与互动链路的全栈实现，覆盖校内教学与知识付费场景。",
        "引入 Redis 缓存与 RBAC 权限治理，支持选课与考试高峰时段的稳定访问。",
        "基于 WebSocket 实现实时互动与在线答疑，改善教学场景的响应效率与参与度。",
      ],
      audienceTags: ["jobSeeker", "partner", "client"],
      businessValue: {
        zh: "为校园场景提供教学工具与支付能力一体化平台，连接课程服务与知识付费。",
        en: "Provided teaching tools and a campus monetization system.",
      },
      engineeringDepth: {
        zh: "覆盖支付系统对接、缓存治理、权限控制与实时互动场景实现。",
        en: "Covers payment integration, concurrency governance, and content security.",
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
          "- **构建全栈平台**：围绕课程、支付与互动场景完成后端接口与前端页面开发。\n- **治理高峰流量**：使用 Redis 缓存热点课程数据，改善高峰时段访问稳定性。\n- **加入交易与安全**：对接支付网关，并通过 Spring Security 实现细粒度 RBAC 权限控制。\n- **实现实时互动**：基于 WebSocket 实现在线互动与答疑能力。",
        result: "完成校内教育平台原型交付，覆盖课程服务、支付结算与实时互动场景。",
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
        "Java",
        "Spring Boot",
        "React",
        "PostgreSQL",
        "Redis",
        "MinIO",
        "Docker",
      ],
      summary:
        "面向个人与团队的云盘系统，提供大文件上传、对象存储与安全访问，解决弱网续传、权限控制和数据一致性问题。",
      impact: "上传闭环 + 查询与一致性 + 安全访问",
      keyOutcomes: [
        "上传闭环：针对大文件、弱网和重复上传，构建分片、秒传、断点续传与进度回传链路，支持中断恢复。",
        "查询与一致性：用复合索引、游标分页和分层缓存治理高频列表查询，并校验文件元数据与对象存储状态，减少脏数据。",
        "安全访问：通过请求签名、防重放、双令牌、文件权限和真实类型校验，形成从请求入口到文件落地的访问控制。",
        "部署可运维：提供 Docker 部署、健康检查与监控基线，保证核心流程可复现、问题可定位。",
        "开源反馈：GitHub 仓库截至 2026-10-12 获 5 Stars。",
      ],
      audienceTags: ["hr", "jobSeeker", "partner", "client"],
      businessValue: {
        zh: "提供可私有化部署的文件协作底座，兼顾高并发上传、安全治理、身份接入扩展与监控验收能力。",
        en: "Built a privately deployable file collaboration platform with operational and security controls.",
      },
      engineeringDepth: {
        zh: "使用 Java 21 虚拟线程、零拷贝、签名防重放、OAuth 扩展接入、索引优化、多级缓存、游标分页与可观测体系，并在本地/容器双部署链路下保持一致交付。",
        en: "Uses virtual threads, zero-copy transfer, signature replay protection, OAuth extensibility, layered caching, cursor pagination, and observability in the delivery baseline.",
      },
      verification: [
        {
          sourceType: "repo",
          sourceLabel:
            "GitHub 仓库、README、RESUME_EasyCloudPan 文档与代码锚点",
          sourceUrl: "https://github.com/byteD-x/easyCloudPan",
          verifiedAt: "2026-10-12",
          confidence: "high",
          level: "strict",
        },
      ],
      expandedDetails: {
        background:
          "目标是在前后端分离架构下交付可企业内部署的文件平台，同时兼容本地一键启动与 Docker 全栈部署。",
        problem:
          "需同时满足高并发上传稳定性、深分页与热点查询性能、安全鉴权一致性、第三方登录扩展能力和上线后的监控告警。",
        solution:
          "- **重构上传链路**：基于 Java 21 虚拟线程实现分片上传、断点续传、秒传与 `FileChannel.transferTo()` 零拷贝合并，并通过 SSE 回传状态。\n- **优化数据性能**：加入 PostgreSQL 复合索引、游标分页、Caffeine(L1)/Redis(L2) 多级缓存、布隆过滤器与分级 TTL，降低回源与深分页开销。\n- **完善安全体系**：建设请求签名防重放、JWT 双 Token + 黑名单、`@FileAccessCheck`、Magic Number 校验与多租户隔离。\n- **加入身份与观测**：接入 GitHub / Google / Microsoft OAuth 登录，并通过 Actuator、Micrometer、Prometheus、Grafana 与 Web Vitals 提供监控数据。",
        result:
          "交付可持续迭代的基线：API P95 <500ms、P99 <1s、缓存命中率 >90%、上传成功率 >99.5%，并支持本地与 Docker 双链路部署（README 指标口径）。",
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
      year: "2023.05 - 2023.07",
      name: "九州通四向穿梭车路径规划系统",
      techTags: [
        "Python",
        "A*",
        "PyQt5",
      ],
      summary:
        "面向医药仓储四向穿梭车调度的路径规划原型，验证网格寻路、多车冲突消解与可视化调试方案。",
      impact: "路径建模 + 冲突消解 + 可视化调试",
      keyOutcomes: [
        "路径建模：使用 A* 处理道路、墙壁和货架等通行约束，统一空车与载货场景的路径规则。",
        "冲突消解：针对多车争用节点，实现节点冲突检测与优先级等待策略，验证多车避让逻辑。",
        "可视化调试：提供地图编辑、起终点设置、路径步进和保存加载，把算法验证从日志观察变成可视化调试。",
      ],
      audienceTags: ["hr", "jobSeeker", "partner"],
      businessValue: {
        zh: "为自动化立体仓库调度系统提供算法可行性验证与仿真工具。",
        en: "Provided core algorithm verification and simulation tools for AS/RS scheduling.",
      },
      engineeringDepth: {
        zh: "覆盖图搜索算法、冲突消解逻辑、仓储地图建模与可视化交互开发。",
        en: "Implemented operations-research algorithms and a GUI for the scheduling prototype.",
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
        result: "完成多车路径规划原型验证，可在仿真环境中展示路径搜索与冲突消解过程。",
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
      title: "AI Agent / FDE 落地",
      description:
        "贴近业务现场把模型接入现有知识、流程、权限与系统，适配从小团队试点到大型企业接入，并通过成本评估、灰度发布与效果复盘推进上线。",
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

  harnessEngineering: {
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
        label: "国内站（自托管）",
        url: "https://blog.byted.online/",
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
      highlightMetrics: ["远程优先", "关键指标可复核", "履历与项目证据"],
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
