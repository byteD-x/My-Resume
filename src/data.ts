import { PortfolioData } from './types';

// ==========================================
// 默认内容 JSON（用于 reset）
// ==========================================
export const defaultPortfolioData: PortfolioData = {
    hero: {
        name: "杜旭嘉",
        title: "全栈工程师（工程效率与交付方向）",
        subtitle: "全栈通用定位：后端性能 + AI 工程化 + 交付确定性。把慢系统做快，把流程做成流水线，且关键指标均可复核。",
        location: "远程优先 ｜ 可到岗：深圳 / 南京 / 杭州 / 成都",
        bullets: [
            {
                id: "bullet-1",
                title: "性能倍增",
                description: "核心接口查询 20s → 4s (5x)，通过 SQL 改写与 OLTP/OLAP 分离支撑高频运营决策"
            },
            {
                id: "bullet-2",
                title: "成本与稳定性",
                description: "多模态 Token 成本降低 40%，图片上传成功率 >99%，在体验不下降前提下降本"
            },
            {
                id: "bullet-3",
                title: "工程化交付",
                description: "构建自动化工作流与 CI/CD，建立 lint/build/test/e2e 门禁与回滚预案，降低发布风险"
            }
        ],
        quickFacts: {
            role: "全栈工程师（后端性能 / AI 工程化 / 交付效率）",
            availability: "远程优先｜可到岗：深圳 / 南京 / 杭州 / 成都",
            techStack: ["Java/Spring Boot", "Python/Asyncio", "MySQL/Redis/ClickHouse", "React/Next.js", "RAG/LLM", "CI/CD"]
        },
        roleSnapshot: {
            primaryRole: "全栈工程师（工程效率与交付方向）",
            secondaryRole: "后端 / AI 工程",
            availability: "远程优先",
            location: "远程优先｜可到岗：深圳 / 南京 / 杭州 / 成都",
            updatedAt: "2026-02-15"
        }
    },

    about: {
        zh: "全栈工程师，主攻后端性能优化、AI 工程化落地与可回滚交付；在真实项目中实现接口 5x 提速与 AI 成本 40% 降低，并坚持以可复核证据交付结果。",
        en: "Full-stack engineer focused on backend performance, AI engineering, and deterministic delivery, with 5x API acceleration and 40% AI cost reduction backed by verifiable evidence."
    },

    aboutLenses: {
        business: [
            "**6 秒看结果（全栈通用）**",
            "- 性能：活动统计/报表接口 20s+ → 4s（5x，联通项目）",
            "- 成本：WeChat AI Bot 推理成本 -40%（Token 压缩 + 缓存）",
            "- 交付确定性：CI/CD + 质量门禁 + 回滚预案（中软项目）",
            "",
            "**口径说明（严格可复核）**",
            "- 关键数字统一按“指标名-起点-终点-时间窗-来源”管理",
            "- 无法给出完整口径的数据降级为定性描述，不作为核心卖点",
        ].join("\n"),
        engineering: [
            "**ATS 关键词（前半页优先）**",
            "- Java / Spring Boot / MySQL / Redis / ClickHouse",
            "- Python / Asyncio / Quart / RAG / ChromaDB",
            "- React / Next.js / TypeScript / CI/CD / Docker",
            "",
            "**工程方法（可追问）**",
            "- 基线压测 -> 瓶颈定位 -> 方案实施 -> 指标复核",
            "- 需求拆解 -> 质量门禁 -> 发布回滚 -> 监控告警",
        ].join("\n"),
    },

    impact: [
        {
            id: "impact-1",
            title: "开源贡献",
            value: "2200+",
            label: "术语覆盖",
            description: "2200+ 双语术语实时高亮，减少查资料/复制粘贴（Worker + CSS Highlight API）",
            details: [
                "**对非技术**：把常用术语一键高亮/查阅，减少上下文切换与理解成本。",
                "",
                "**关键做法（技术）**",
                "- Web Worker 承担匹配计算，主线程只负责渲染",
                "- CSS Highlight API 直接高亮，避免 DOM 包裹导致的性能/兼容问题",
                "- Trie 结构加速匹配，控制复杂度与内存上限",
            ].join("\n"),
            linkedExperienceId: "exp-jiaoben",
            icon: "TrendingUp",
            colSpan: "md:col-span-1",
            bg: "bg-sky-50",
            verification: {
                sourceType: "repo",
                sourceLabel: "GitHub Data",
                sourceUrl: "https://github.com/icefunicu?tab=repositories",
                verifiedAt: "2026-02-15",
                confidence: "high",
                level: "strict"
            }
        },
        {
            id: "impact-wechat",
            title: "开源新作",
            value: "5+",
            label: "开源关注 (Stars)",
            description: "WeChat AI Bot：可并发、可记忆、低成本运行的微信 AI 助理（异步 + RAG）",
            details: [
                "**对非技术**：把 AI 助手做成“能持续跑、能记住、响应快”的微信工具。",
                "",
                "**关键做法（技术）**",
                "- Quart + asyncio 异步架构，避免 I/O 阻塞导致丢消息",
                "- RAG 记忆：ChromaDB + SQLite 分层存储，支持长期上下文",
                "- Electron 管理端 + SSE，方便运行监控与问题定位",
                "- Token 压缩与缓存策略，控制长对话成本",
            ].join("\n"),
            linkedExperienceId: "exp-wechat-bot",
            icon: "Star",
            colSpan: "md:col-span-1",
            bg: "bg-indigo-50",
            githubRepo: "icefunicu/wechat-bot",
            verification: {
                sourceType: "repo",
                sourceLabel: "GitHub Stars",
                sourceUrl: "https://github.com/icefunicu/wechat-bot",
                verifiedAt: "2026-02-15",
                confidence: "high",
                level: "strict"
            }
        },
        {
            id: "impact-2",
            title: "性能极致",
            value: "5x",
            label: "API 提速",
            description: "活动统计/报表接口 20s → 4s (5x)，把“等半分钟”变成“秒开”（ClickHouse + SQL 改写）",
            details: [
                "**对非技术**：核心报表从“等 20 秒”变成“4 秒出结果”，更适合高频运营决策。",
                "",
                "**关键做法（技术）**",
                "- OLTP/OLAP 分离：ClickHouse 承载聚合分析，MySQL 回归事务库",
                "- SQL 改写与数据建模：利用列存特性优化聚合/过滤",
                "- 基线压测 → 优化 → 复核，确保收益真实稳定",
            ].join("\n"),
            linkedExperienceId: "exp-unicom",
            icon: "Zap",
            colSpan: "md:col-span-1",
            bg: "bg-blue-50",
            verification: {
                sourceType: "experience",
                sourceLabel: "联通项目/微信机器人",
                verifiedAt: "2026-02-15",
                confidence: "high",
                level: "strict"
            }
        },
        {
            id: "impact-3",
            title: "成本治理",
            value: "40%",
            label: "成本降低",
            description: "多模态 Token 压缩 + 缓存策略，使 AI 运行成本降低 40%（体验与稳定性并重）",
            details: [
                "**对非技术**：在不牺牲体验的前提下，让 AI 更省钱、更稳定。",
                "",
                "**关键做法（技术）**",
                "- Context Trimming：裁剪冗余上下文，减少无效 Token",
                "- 多模态压缩：图片/文本链路做压缩与降采样，保留关键信息",
                "- 结果缓存：对可复用回答做缓存与失效策略，降低重复调用",
            ].join("\n"),
            linkedExperienceId: "exp-wechat-bot",
            icon: "TrendingDown",
            colSpan: "md:col-span-1",
            bg: "bg-emerald-50",
            verification: {
                sourceType: "experience",
                sourceLabel: "WeChat Bot Metrics",
                verifiedAt: "2026-02-15",
                confidence: "high",
                level: "strict"
            }
        },
        {
            id: "impact-4",
            title: "全栈交付",
            value: "100%",
            label: "闭环能力",
            description: "从需求到上线：方案/开发/测试/部署/监控闭环（CI/CD + 可观测性 + 回滚）",
            details: [
                "**对非技术**：你得到的是可上线、可维护的结果，而不是“能跑的 Demo”。",
                "",
                "**关键做法（技术）**",
                "- 需求拆解：把目标拆成可验收里程碑（What/Why/How to verify）",
                "- 质量门禁：lint/build/test/e2e + 静态导出/链接检查",
                "- 部署与运维：容器化、监控告警、回滚预案",
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
                level: "strict"
            }
        },
        {
            id: "impact-5",
            title: "海量数据",
            value: "3亿+",
            label: "数据迁移",
            description: "300+ 表、3亿+ 记录无损迁移与校对，脚本化校验确保一致性",
            details: [
                "**对非技术**：迁移不只是“搬数据”，关键是“搬完还能对得上”。",
                "",
                "**关键做法（技术）**",
                "- 迁移策略：全量回灌 + 增量同步，降低停机窗口",
                "- 一致性校验：行数/聚合校验 + 抽样比对 + 关键字段 checksum",
                "- 风险控制：可回滚方案与差异修复脚本，确保可追溯",
            ].join("\n"),
            linkedExperienceId: "exp-unicom",
            icon: "Database",
            colSpan: "md:col-span-1",
            bg: "bg-purple-50",
            verification: {
                sourceType: "experience",
                sourceLabel: "数据中台迁移记录",
                verifiedAt: "2026-02-15",
                confidence: "high",
                level: "strict"
            }
        }
    ],

    timeline: [
        {
            id: "exp-jiaoben",
            year: "2026.01 - 至今",
            role: "独立开发者 · 开源项目",
            company: "浏览器生产力套件",
            location: "开源项目",
            summary: "一套浏览器生产力工具：术语实时高亮、Git 平台增强、广告/噪音净化；在 GitHub/Gitee 等 SPA 站点也能稳定运行（Web Worker + CSS Highlight API + 路由适配）。",
            techTags: ["Chrome Extension", "Web Worker", "MutationObserver", "CSS Highlight API", "Trie"],
            highlighted: true,
            keyOutcomes: [
                "将术语匹配下沉至 Web Worker 并改用 CSS Highlight API，在 GitHub/Gitee 场景实现 2200+ 术语实时高亮，减少检索与复制成本。",
                "通过 History API 重写 + MutationObserver 重注入，保证 SPA 路由切换后插件能力不丢失，提升持续可用性。",
                "引入节流（3 req/s）与重试兜底机制，稳定处理高频请求并降低错误中断对使用体验的影响。"
            ],
            audienceTags: ["jobSeeker", "partner", "client"],
            businessValue: {
                zh: "以极低资源占用解决浏览器高频痛点，显著提升信息获取与开发调试效率。",
                en: "Solves high-frequency browser pain points with minimal resource usage, boosting productivity."
            },
            engineeringDepth: {
                zh: "展示了对 DOM 性能、SPA 路由机制、Web Worker 多线程及并发请求控制的深度理解。",
                en: "Demonstrates deep understanding of DOM performance, SPA routing, Web Worker threading, and concurrency control."
            },
            verification: [
                {
                    sourceType: "repo",
                    sourceLabel: "GitHub 仓库提交记录",
                    sourceUrl: "https://github.com/icefunicu?tab=repositories",
                    verifiedAt: "2026-02-15",
                    confidence: "high",
                    level: "strict"
                }
            ],
            expandedDetails: {
                background: "开发过程中频繁遇到术语查阅繁琐、SPA 网页插件失效、有效信息被广告淹没等问题。",
                problem: "传统插件常因大量 DOM 操作导致页面卡顿，且难以在 SPA 路由切换时保持稳定注入。",
                solution: "- **架构优化**：将计算密集型任务（如术语匹配）下沉至 Web Worker，避免阻塞主线程；采用 CSS Custom Highlight API 替代 DOM 包裹，零干扰渲染。\n- **SPA 治理**：重写 History API 并结合 MutationObserver，确保在 GitHub/Gitee 等 SPA 站点中稳定重注入。\n- **算法应用**：使用 Trie 树优化书签匹配性能，引入漏桶算法控制并发请求速率。",
                result: "实现了 2200+ 术语毫秒级高亮，插件在复杂 SPA 站点稳定运行，广告清理准确率达 95% 以上。",
                role: "独立开发者（全周期设计与实现）",
                techStack: ["JavaScript", "Chrome Extension", "Web Worker", "CSS Custom Highlight API", "Trie", "MutationObserver"],
                links: [{ label: "GitHub Repos", url: "https://github.com/icefunicu?tab=repositories" }]
            }
        },
        {
            id: "exp-wechat-bot",
            year: "2025.12 - 至今",
            role: "独立开发者 · 开源项目",
            company: "WeChat AI Bot",
            location: "开源项目",
            summary: "构建微信 AI 助手：支持长期记忆与管理端，面对高并发不阻塞（Quart 异步 + RAG + I/O 解耦 + 流式日志）。",
            techTags: ["Python", "Quart", "Asyncio", "RAG", "Electron", "SQLite", "ChromaDB"],
            highlighted: true,
            keyOutcomes: [
                "将同步调用改为 Quart + asyncio 异步链路，消息处理吞吐提升 5x，并支撑高并发场景稳定响应。",
                "使用 ChromaDB + SQLite 构建分层记忆，支持多轮上下文检索，提升复杂对话连续性。",
                "采用 Token 压缩与缓存策略，将推理成本降低 40%，并通过流式日志控制内存占用 <10MB。"
            ],
            audienceTags: ["hr", "jobSeeker", "partner", "client"],
            businessValue: {
                zh: "在保持高并发响应能力的同时，大幅降低了模型调用成本与硬件资源消耗。",
                en: "Significantly reduced operational costs and resource usage while maintaining high concurrency."
            },
            engineeringDepth: {
                zh: "展示了异步 I/O 编程、多模态数据处理管道及向量数据库集成的完整架构能力。",
                en: "Showcases async I/O programming, multimodal pipelines, and vector DB integration."
            },
            verification: [
                {
                    sourceType: "repo",
                    sourceLabel: "GitHub 提交记录",
                    sourceUrl: "https://github.com/icefunicu/wechat-bot",
                    verifiedAt: "2026-02-15",
                    confidence: "high",
                    level: "strict"
                }
            ],
            expandedDetails: {
                background: "原有基于同步框架的微信机器人无法处理并发请求，且长对话中 Token 消耗过快。",
                problem: "主线程阻塞导致消息丢失；大文件日志读取导致内存溢出；缺乏长期记忆能力。",
                solution: "- **异步化**：使用 `asyncio.to_thread` 将 wxauto 阻塞调用剥离，基于 SSE 推送实时状态。\n- **记忆系统**：构建 RAG 检索增强生成链路，利用向量数据库存储长期记忆。\n- **资源优化**：实现日志流式读取与 LRU 缓存，优化图片压缩策略。",
                result: "实现 7x24 小时稳定运行，支持多轮复杂对话与图片识别，API 响应速度提升 5 倍。",
                role: "独立开发者",
                techStack: ["Python", "Quart", "Asyncio", "Electron", "ChromaDB", "SQLite"],
                links: [{ label: "GitHub Repo", url: "https://github.com/icefunicu/wechat-bot" }]
            }
        },
        {
            id: "exp-sustech",
            year: "2025.11 - 2025.12",
            role: "外包技术顾问",
            company: "南方科技大学",
            location: "深圳",
            summary: "独立承接并交付智能流程自动化 (IPA) 原型：从需求澄清到可演示系统闭环，帮助客户快速验证可行性。",
            techTags: ["Python", "Automation", "Full Stack", "End-to-End Delivery"],
            highlighted: false,
            keyOutcomes: [
                "在需求不清晰且周期受限场景下，以敏捷迭代完成 IPA 原型交付，并按期通过客户验收。",
                "完成自动化脚本与 Web 系统通信验证，为后续工程化立项提供可行性依据。"
            ],
            audienceTags: ["partner", "client"],
            businessValue: {
                zh: "通过快速原型交付帮助客户低成本验证方案可行性，降低立项风险。",
                en: "Validated solution feasibility with a rapid prototype, reducing project initiation risk."
            },
            engineeringDepth: {
                zh: "体现了快速学习业务领域知识并转化为技术实现的能力，以及严格的项目进度管理。",
                en: "Demonstrates rapid domain knowledge absorption and strict project timeline management."
            },
            verification: [
                {
                    sourceType: "experience",
                    sourceLabel: "项目验收确认",
                    verifiedAt: "2026-02-10",
                    confidence: "medium",
                    level: "strict"
                }
            ],
            expandedDetails: {
                background: "客户需要验证自动化技术在特定科研流程中的可行性。",
                problem: "时间紧迫，需求模糊，需要探索性开发。",
                solution: "采用敏捷开发模式，快速迭代原型，与客户保持高频沟通确认需求。",
                result: "按时交付原型系统，功能满足预期，获得客户好评。",
                role: "全栈顾问",
                techStack: ["Python", "Web Development", "Automation"]
            }
        },
        {
            id: "exp-chinasoft",
            year: "2025.04 - 2025.09",
            role: "后端/全栈工程师",
            company: "中软国际（项目制）",
            location: "西安",
            summary: "负责企业级系统性能治理与工程化落地：慢查询专项 + CI/CD 流水线，把“卡顿接口”变成“秒开体验”。",
            techTags: ["Java", "Spring Boot", "MySQL Performance", "CI/CD", "Redis"],
            highlighted: true,
            keyOutcomes: [
                "重写聚合 SQL 并补充覆盖索引与缓存，将核心查询从 10s+ 降至 500ms，明显改善关键接口体验。",
                "搭建 CI/CD + lint/build/test 门禁与回滚链路，发布耗时从 30 分钟降至 5 分钟，降低人工发布风险。",
                "建立 Top SQL 监控与优化闭环，持续清理 20+ 慢查询隐患，提升系统稳定性。"
            ],
            audienceTags: ["hr", "jobSeeker", "partner"],
            businessValue: {
                zh: "显著提升了系统的响应速度与用户体验，规范了研发流程，降低了线上故障率。",
                en: "Improved system responsiveness and UX, standardized R&D processes, and reduced production incidents."
            },
            engineeringDepth: {
                zh: "深入实践了 MySQL 索引调优、执行计划分析及企业级 CI/CD 流程设计。",
                en: "Deep dive into MySQL index tuning, execution plan analysis, and enterprise CI/CD design."
            },
            verification: [
                {
                    sourceType: "experience",
                    sourceLabel: "性能测试报告",
                    verifiedAt: "2026-02-15",
                    confidence: "high",
                    level: "strict"
                }
            ],
            expandedDetails: {
                background: "随着数据量增长，系统部分核心接口变慢，且部署流程依赖人工，容易出错。",
                problem: "复杂 SQL 导致数据库 CPU 飙升；手动打包部署效率低且无回滚机制。",
                solution: "- **SQL 优化**：重写关联查询，添加覆盖索引，引入 Redis 缓存热点配置数据。\n- **DevOps**：编写 Dockerfile 与 Pipeline 脚本，实现提交即构建，一键部署。",
                result: "核心接口实现秒开，发布耗时从 30 分钟缩短至 5 分钟，且回滚可控。",
                role: "核心开发",
                techStack: ["Java", "Spring Boot", "MySQL", "Redis", "Jenkins/GitLab CI"]
            }
        },
        {
            id: "exp-noc",
            year: "2024.08 - 2024.10",
            role: "后端开发实习生",
            company: "国家骨科临床研究中心",
            location: "远程",
            summary: "为医学专家做论文智能检索小程序后端：整合 AI 搜索与订阅推送，把“找文献”从小时级压到分钟级。",
            techTags: ["Backend Architecture", "AI Search", "WeChat Mini Program", "System Design"],
            highlighted: false,
            keyOutcomes: [
                "设计并实现高可用后端架构，支撑医学检索小程序稳定运行。",
                "整合 AI 搜索与订阅推送，将文献检索时延从小时级降至分钟级，提升科研效率。",
                "对接自然语言检索能力，降低专家检索门槛并提升结果相关性。"
            ],
            audienceTags: ["hr", "jobSeeker"],
            businessValue: {
                zh: "极大提升了科研人员获取前沿信息的效率，助力科研成果产出。",
                en: "Greatly improved efficiency for researchers to access frontier information."
            },
            engineeringDepth: {
                zh: "体现了在特定垂直领域（医疗）下的需求分析与系统架构落地能力。",
                en: "Demonstrates requirements analysis and system architecture in a vertical domain (Medical)."
            },
            verification: [
                {
                    sourceType: "experience",
                    sourceLabel: "实习证明",
                    verifiedAt: "2026-02-10",
                    confidence: "medium",
                    level: "strict"
                }
            ],
            expandedDetails: {
                background: "医学专家需要及时获取特定领域的最新论文，通用搜索引擎噪音大。",
                problem: "信息检索效率低，无法自动跟踪最新进展。",
                solution: "构建垂直领域的论文检索平台，结合 AI 进行语义匹配与精准推送。",
                result: "小程序上线后获得专家认可，成为日常科研辅助工具。",
                role: "后端开发",
                techStack: ["Java/Python", "AI API", "Mini Program Backend"]
            }
        },
        {
            id: "exp-unicom",
            year: "2024.05 - 2024.08",
            role: "后端开发实习生",
            company: "中国联通陕西省分公司",
            location: "西安 · 数字化部",
            summary: "参与运营平台与数据中台建设：报表从 20s+ 到 4s，ClickHouse 承载 OLAP，完成 300+ 表迁移与校对。",
            techTags: ["Java", "ClickHouse", "MySQL", "Data Migration", "Performance Tuning"],
            highlighted: true,
            keyOutcomes: [
                "推动 OLTP/OLAP 分离并引入 ClickHouse，将活动统计接口从 20s+ 优化到 4s（5x），支撑高频运营分析。",
                "落地 MySQL 到 ClickHouse 增量同步与 SQL 改写，承接聚合分析负载并缓解事务库压力。",
                "完成 300+ 表、3亿+ 记录迁移与一致性校验，保障数据中台升级可追溯、可回滚。"
            ],
            audienceTags: ["hr", "jobSeeker", "partner"],
            businessValue: {
                zh: "解决了数据中台的性能瓶颈，支持了业务部门对运营数据的实时分析需求。",
                en: "Resolved performance bottlenecks in data platform, enabling real-time analytics for business ops."
            },
            engineeringDepth: {
                zh: "掌握了海量数据处理、OLAP 数据库应用及异构数据迁移的实战经验。",
                en: "Mastered massive data processing, OLAP DB application, and heterogeneous data migration."
            },
            verification: [
                {
                    sourceType: "experience",
                    sourceLabel: "项目代码与数据库日志",
                    verifiedAt: "2026-02-15",
                    confidence: "high",
                    level: "strict"
                }
            ],
            expandedDetails: {
                background: "联通数字化部需要整合全省运营数据，原有 MySQL 架构无法支撑复杂聚合查询。",
                problem: "报表加载超时，数据分散难以统一挖掘。",
                solution: "- **架构选型**：引入 ClickHouse 作为分析引擎。\n- **数据同步**：使用 DataX/Custom Scripts 实现 MySQL 到 ClickHouse 的增量同步。\n- **查询改写**：优化 SQL 逻辑，利用 ClickHouse 列存特性加速聚合。",
                result: "平台查询性能质变，能够支持更加复杂的业务分析模型。",
                role: "后端开发",
                techStack: ["Java", "ClickHouse", "MySQL", "Data Optimization"]
            }
        },
        {
            id: "exp-cloudpan",
            year: "2024.04 - 2026.02",
            role: "全栈开发 · 开源项目",
            company: "EasyCloudPan",
            location: "开源项目（本地 + Docker）",
            summary: "面向企业内网部署的前后端分离网盘系统：支持本地一键启动与 Docker 全栈部署，覆盖认证、上传下载、分享转存、回收站、文件预览、多租户、安全通信、OAuth 登录与监控告警。",
            techTags: ["Java 21", "Spring Boot 3.2", "Spring Security", "OAuth2", "MyBatis-Flex", "Flyway", "PostgreSQL", "Redis", "MinIO/S3", "Vue 3", "Docker Compose", "Prometheus/Grafana"],
            highlighted: true,
            keyOutcomes: [
                "构建“分片上传 + 秒传 + 断点续传 + SSE 状态回传”主链路，结合 `FileChannel.transferTo()` 零拷贝合并与并发控制，支持 1000+ 并发上传，成功率 >99.5%（README 指标口径）。",
                "落地请求签名防重放（HMAC-SHA256 + timestamp + nonce）与 JWT 双 Token + 黑名单治理，兼容 query token 退场；叠加 `@FileAccessCheck`、Magic Number 与多租户校验形成安全闭环。",
                "建立“本地一键启动 + 健康检查 + 日志分层 + 监控告警 + Web Vitals 入库”工程基线，按 README 口径达到 API P95 <500ms、P99 <1s、缓存命中率 >90%。"
            ],
            audienceTags: ["hr", "jobSeeker", "partner", "client"],
            businessValue: {
                zh: "提供可私有化部署的一体化文件平台，兼顾高并发上传、安全治理、可观测与工程交付，降低企业文件服务的稳定性与安全风险。",
                en: "Delivered a privately deployable cloud-drive platform that balances performance, security, and observability."
            },
            engineeringDepth: {
                zh: "覆盖虚拟线程并发、上传状态机、签名防重放、OAuth 扩展接入、多租户隔离、Web Vitals 采集与脚本化验收，具备可回归验证的工程交付能力。",
                en: "Covers virtual-thread concurrency, upload-state governance, signature replay protection, OAuth extensibility, tenant isolation, and observability with script-based verification."
            },
            verification: [
                {
                    sourceType: "repo",
                    sourceLabel: "GitHub 仓库、README、RESUME_EasyCloudPan 文档与代码锚点",
                    sourceUrl: "https://github.com/icefunicu/easyCloudPan",
                    verifiedAt: "2026-02-24",
                    confidence: "high",
                    level: "strict"
                }
            ],
            expandedDetails: {
                background: "项目目标是把网盘能力沉淀为可企业内部署的文件平台，并保持本地一键启动与 Docker 全栈部署两条链路一致可用。",
                problem: "需要同时解决大文件上传稳定性、热点查询与深分页性能、安全鉴权一致性、第三方登录接入复杂度，以及上线后的监控与告警闭环。",
                solution: "- **传输链路**：Java 21 虚拟线程 + 分片上传/断点续传/秒传 + `FileChannel.transferTo()` 零拷贝合并，配合上传限流、分片并发控制与 SSE 状态推送。\n- **数据性能**：PostgreSQL 复合索引 + 游标分页，结合 Caffeine(L1)/Redis(L2)、布隆过滤器与分级 TTL，降低回源与深分页开销。\n- **安全与隔离**：请求签名防重放（HMAC-SHA256 + timestamp + nonce）+ JWT 双 Token + 黑名单、`@FileAccessCheck`、Magic Number、`X-Tenant-Id` 多租户上下文隔离。\n- **身份接入**：通过 `OAuthController` + `OAuthLoginService` 接入 GitHub/Google/Microsoft 三方登录，并与既有 QQ 登录兼容。\n- **观测与交付**：Actuator/Micrometer + Prometheus/Grafana + 结构化日志；前端 Web Vitals 上报到 `AnalyticsController` 入库，结合脚本化 smoke test 固化 P0/P1 验收链路。",
                result: "形成可私有化部署的一体化文件平台：API P95 <500ms、P99 <1s、数据库查询 P95 <100ms、慢查询减少 80%、缓存命中率 >90%、上传成功率 >99.5%（README 指标口径）。",
                role: "全栈开发（架构设计、后端核心、前端联调、部署验收）",
                techStack: ["Java 21", "Spring Boot 3.2", "Spring Security", "OAuth2", "MyBatis-Flex", "Flyway", "PostgreSQL", "Redis", "MinIO/S3", "Vue 3", "Docker Compose", "Prometheus", "Grafana"]
            }
        },
        {
            id: "exp-jzt-shuttle-path",
            year: "2023.05 - 2023.07",
            role: "项目经理 / 算法研发",
            company: "九州通四向穿梭车路径规划系统",
            location: "本地项目",
            summary: "在仓储场景实现多车路径规划原型：A* + CBS 解决冲突与死锁，并提供可视化仿真调试工具。",
            techTags: ["Python", "A*", "Path Planning", "PyQt5", "Concurrency"],
            highlighted: false,
            keyOutcomes: [
                "算法落地: 基于 A* 算法实现复杂仓储地图下的最优路径搜索",
                "冲突消解: 设计 CBS (Constraint-Based Search) 策略处理多车路权冲突",
                "可视化: 使用 PyQt5 开发动态仿真界面，支持算法过程步进调试"
            ],
            audienceTags: ["hr", "partner"],
            businessValue: {
                zh: "极低成本验证了自动化仓储调度算法的可行性，为设备上云提供理论支撑。",
                en: "Verified feasibility of warehouse automation scheduling algorithms at low cost."
            },
            engineeringDepth: {
                zh: "体现了图搜索算法、并发编程及图形化界面开发的综合运用能力。",
                en: "Demonstrates synthesis of graph search algorithms, concurrent programming, and GUI development."
            },
            verification: [
                {
                    sourceType: "manual",
                    sourceLabel: "本地项目演示",
                    verifiedAt: "2026-02-15",
                    confidence: "medium",
                    level: "strict"
                }
            ],
            expandedDetails: {
                background: "密集存储仓库需要调度多台四向穿梭车协同工作。",
                problem: "车辆间路径冲突频发，死锁检测困难。",
                solution: "基于 A* 算法改进启发式函数，引入时间维度解决动态冲突。",
                result: "在仿真环境中实现了多车无冲突运行，路径规划效率满足预期。",
                role: "算法主导",
                techStack: ["Python", "Algorithms", "PyQt5"]
            }
        },
        {
            id: "exp-education",
            year: "2021.09 - 2025.06",
            role: "本科 · 数据科学与大数据技术",
            company: "南阳理工学院",
            location: "河南",
            summary: "主修计算机科学与大数据技术，GPA 3.8/4.5 (Top 5%)。注重工程实践与持续学习能力。",
            techTags: ["Computer Science", "Big Data", "Top 5%"],
            highlighted: false,
            audienceTags: ["hr"],
            businessValue: {
                zh: "打下了扎实的计算机理论基础，具备持续学习与工程实践的潜力。",
                en: "Solid CS theoretical foundation with potential for continuous learning and engineering practice."
            },
            engineeringDepth: {
                zh: "以优秀的学业成绩证明了学习能力与专业素养。",
                en: "Excellent academic record proving learning ability and professionalism."
            },
            verification: [
                {
                    sourceType: "manual",
                    sourceLabel: "学位证书与成绩单",
                    verifiedAt: "2026-02-15",
                    confidence: "high",
                    level: "strict"
                }
            ]
        }
    ],

    projects: [
        {
            id: "proj-jiaoben",
            year: "2026",
            name: "浏览器生产力套件",
            link: "https://github.com/icefunicu?tab=repositories",
            demoLink: "",
            techTags: ["Chrome Extension", "Web Worker", "MutationObserver", "CSS Highlight API", "Trie"],
            summary: "一套浏览器生产力工具：术语实时高亮、Git 平台增强、广告/噪音净化（Web Worker + CSS Highlight API，零 DOM 污染渲染）。",
            impact: "浏览器插件与用户脚本合集",
            keyOutcomes: [
                "将术语匹配计算下沉至 Web Worker，并以 CSS Highlight API 渲染，实现 2200+ 术语实时高亮。",
                "通过 History API + MutationObserver 适配 SPA 路由，保持插件在 GitHub/Gitee 场景稳定生效。",
                "构建可扩展的脚本工程结构与容错机制，降低功能迭代风险。"
            ],
            audienceTags: ["jobSeeker", "partner", "client"],
            businessValue: {
                zh: "显著降低了开发者的重复操作成本，提升了信息获取的信噪比。",
                en: "Significantly reduces repetitive tasks and improves information signal-to-noise ratio."
            },
            engineeringDepth: {
                zh: "深入应用了 Web Worker 多线程、CSS 新特性及 SPA 路由劫持等前端进阶技术。",
                en: "Applied advanced frontend tech like Web Workers, CSS Highlight API, and SPA route hijacking."
            },
            verification: [
                {
                    sourceType: "repo",
                    sourceLabel: "GitHub 仓库",
                    sourceUrl: "https://github.com/icefunicu?tab=repositories",
                    verifiedAt: "2026-02-15",
                    confidence: "high",
                    level: "strict"
                }
            ],
            expandedDetails: {
                background: "为了解决日常浏览中的低效痛点，开发了一系列浏览器增强工具。",
                problem: "页面卡顿、SPA 适配差、广告干扰严重。",
                solution: "采用 Web Worker 下沉计算任务，CSS Highlight API 优化渲染，History API 适配 SPA。",
                result: "工具集稳定运行，获得开源社区关注。",
                role: "独立开发者",
                techStack: ["JavaScript", "Chrome Extension", "Web Worker"],
                links: [{ label: "GitHub", url: "https://github.com/icefunicu?tab=repositories" }]
            },
            highlighted: true
        },
        {
            id: "proj-wechat-bot",
            year: "2025",
            name: "WeChat AI Bot",
            link: "https://github.com/icefunicu/wechat-bot",
            demoLink: "",
            techTags: ["Python", "Quart", "Asyncio", "RAG", "Electron", "SQLite", "ChromaDB"],
            summary: "微信 AI 助手：异步架构提升并发能力，RAG 提供长期记忆，Electron 管理端便于运维（成本与体验兼顾）。",
            impact: "异步架构 + RAG 记忆",
            keyOutcomes: [
                "基于 Quart + asyncio 改造消息链路，API 吞吐提升 5x+ 并降低阻塞风险。",
                "采用日志流式处理与缓存策略，将运行期内存占用控制在 <10MB。",
                "通过 Token 压缩与响应缓存，将模型调用成本降低 40%。"
            ],
            audienceTags: ["hr", "jobSeeker", "partner", "client"],
            businessValue: {
                zh: "打造了低成本、高可用的 AI 客服自动化解决方案。",
                en: "Created a low-cost, high-availability AI customer service automation solution."
            },
            engineeringDepth: {
                zh: "全栈展示了异步 Python 后端、向量检索应用及 Electron 桌面开发能力。",
                en: "Full-stack demo of async Python backend, vector search, and Electron desktop dev."
            },
            verification: [
                {
                    sourceType: "repo",
                    sourceLabel: "GitHub 仓库",
                    sourceUrl: "https://github.com/icefunicu/wechat-bot",
                    verifiedAt: "2026-02-15",
                    confidence: "high",
                    level: "strict"
                }
            ],
            expandedDetails: {
                background: "传统微信机器人基于同步 IO，无法处理高频消息。",
                problem: "并发差，无记忆，交互体验生硬。",
                solution: "全面异步化重构，引入 RAG 增强记忆。",
                result: "性能与体验双重提升，成为可靠的 AI 助理。",
                role: "独立开发者",
                techStack: ["Python", "Quart", "Asyncio", "Electron", "RAG"],
                links: [{ label: "GitHub", url: "https://github.com/icefunicu/wechat-bot" }]
            },
            highlighted: true
        },
        {
            id: "proj-lexue",
            year: "2024",
            name: "乐学网",
            techTags: ["Spring Boot", "Redis", "Spring Security", "Vue.js", "MySQL"],
            summary: "面向校内选课/考试高峰的教育平台：视频点播、支付、实时互动一体化（Redis 缓存 + RBAC + WebSocket）。",
            impact: "校内应用",
            keyOutcomes: [
                "落地支付、课程、互动链路一体化交付，形成校内教学与付费闭环。",
                "通过 Redis 缓存与 RBAC 权限治理，支撑高峰时段在线考试并保持稳定。",
                "使用 WebSocket 实现实时互动，提升教学场景响应效率与参与度。"
            ],
            audienceTags: ["jobSeeker", "partner", "client"],
            businessValue: {
                zh: "为校园不仅提供了教学工具，还打通了知识付费的商业闭环。",
                en: "Provided not just teaching tools but also a closed-loop monetization system for campus."
            },
            engineeringDepth: {
                zh: "体现了支付系统对接、并发流量治理及内容安全防护的工程实践。",
                en: "Shows engineering practice in payment integration, concurrency governance, and content security."
            },
            verification: [
                {
                    sourceType: "manual",
                    sourceLabel: "项目演示",
                    verifiedAt: "2026-02-15",
                    confidence: "medium",
                    level: "strict"
                }
            ],
            expandedDetails: {
                background: "校园需要自有知识付费与在线学习平台。",
                problem: "现有系统功能单一，不支持支付与高并发。",
                solution: "构建全栈微服务化应用，引入 Redis 与支付网关。\n- **高并发架构**：使用 Redis 缓存热点课程数据，削峰填谷。\n- **支付集成**：对接微信支付 API，实现订单/回调/对账闭环。\n- **安全防护**：基于 Spring Security 实现细粒度 RBAC 权限控制与接口限流。\n- **实时互动**：基于 WebSocket 实现直播弹幕与在线答疑。",
                result: "平台上线并稳定运行，满足校内高峰期使用需求。",
                role: "全栈开发",
                techStack: ["Spring Boot", "Redis", "Vue.js"],
            },
            highlighted: true
        },
        {
            id: "proj-cloudpan",
            year: "2024.04 - 2026.02",
            name: "EasyCloudPan",
            link: "https://github.com/icefunicu/easyCloudPan",
            demoLink: "",
            techTags: ["Java 21", "Spring Boot 3.2", "Spring Security", "OAuth2", "MyBatis-Flex", "Flyway", "PostgreSQL", "Redis", "MinIO/S3", "Vue 3", "Docker Compose", "Prometheus", "Grafana"],
            summary: "前后端分离的一体化网盘系统：覆盖认证、上传下载、分享转存、回收站、文件预览、多租户、安全通信、OAuth 登录与监控告警，支持本地一键启动与 Docker 全栈部署。",
            impact: "企业级文件平台（私有化部署 + 安全基线 + 可观测）",
            keyOutcomes: [
                "构建“分片上传 + 秒传 + 断点续传 + SSE 状态回传”主链路，结合零拷贝分片合并，支持 1000+ 并发上传，成功率 >99.5%（README 指标口径）。",
                "完成 PostgreSQL 复合索引 + 游标分页 + Caffeine/Redis 多级缓存治理，API P95 <500ms、P99 <1s、数据库查询 P95 <100ms、缓存命中率 >90%。",
                "构建请求签名防重放 + JWT 双 Token + 黑名单 + 多租户隔离 + OAuth 多提供方登录，并接入 Prometheus/Grafana 与 Web Vitals 入库，核心 P0/P1 流程可复现验证。"
            ],
            audienceTags: ["hr", "jobSeeker", "partner", "client"],
            businessValue: {
                zh: "为团队提供可私有化部署的文件协作底座，兼顾高并发上传、安全治理、身份接入扩展、监控告警与脚本化验收。",
                en: "Provides a privately deployable file collaboration platform with lower operational and security risks."
            },
            engineeringDepth: {
                zh: "落地虚拟线程、零拷贝、签名防重放、OAuth 扩展接入、索引优化、多级缓存、游标分页与可观测体系，并在本地/容器双部署链路下保持一致交付。",
                en: "Combines virtual threads, zero-copy transfer, signature replay protection, OAuth extensibility, layered caching, cursor pagination, and observability into an extensible engineering baseline."
            },
            verification: [
                {
                    sourceType: "repo",
                    sourceLabel: "GitHub 仓库、README、RESUME_EasyCloudPan 文档与代码锚点",
                    sourceUrl: "https://github.com/icefunicu/easyCloudPan",
                    verifiedAt: "2026-02-24",
                    confidence: "high",
                    level: "strict"
                }
            ],
            expandedDetails: {
                background: "目标是在前后端分离架构下交付可企业内部署的文件平台，同时兼容本地一键启动与 Docker 全栈部署。",
                problem: "需同时满足高并发上传稳定性、深分页与热点查询性能、安全鉴权一致性、第三方登录扩展能力和上线后可观测闭环。",
                solution: "- **上传与下载链路**：分片上传、断点续传、秒传、令牌桶限流与零拷贝合并（`FileChannel.transferTo()`），并通过 SSE 回传转码状态。\n- **数据与缓存治理**：PostgreSQL 复合索引 + 游标分页，配套 Caffeine/Redis 多级缓存、布隆过滤器与分级 TTL。\n- **安全体系**：请求签名防重放、JWT 双 Token + 黑名单、`@FileAccessCheck`、Magic Number 文件校验、敏感配置加密与日志脱敏。\n- **身份接入**：`OAuthController` + `OAuthLoginService` 统一接入 GitHub/Google/Microsoft，并与 QQ 登录兼容。\n- **可观测与验收**：Actuator/Micrometer 指标、Prometheus/Grafana 仪表板与告警规则；前端 Web Vitals 通过 `AnalyticsController` 入库，脚本化 smoke test 覆盖核心 P0/P1 流程。",
                result: "形成可持续迭代的交付基线：API P95 <500ms、P99 <1s、缓存命中率 >90%、上传成功率 >99.5%，并支持本地与 Docker 双链路部署（README 指标口径）。",
                role: "全栈开发（主导）",
                techStack: ["Java 21", "Spring Boot 3.2", "Spring Security", "OAuth2", "MyBatis-Flex", "Flyway", "PostgreSQL", "Redis", "MinIO/S3", "Vue 3", "Docker Compose", "Prometheus", "Grafana"],
                links: [
                    { label: "GitHub", url: "https://github.com/icefunicu/easyCloudPan" },
                    { label: "README", url: "https://github.com/icefunicu/easyCloudPan#readme" }
                ]
            },
            highlighted: true
        },
        {
            id: "proj-jzt-shuttle-path",
            year: "2023",
            name: "九州通四向穿梭车路径规划系统",
            techTags: ["Python", "A*", "CBS", "PyQt5", "ThreadPoolExecutor", "Concurrent"],
            summary: "面向密集仓储的多车路径规划原型：基于 A* + CBS 解决协同避让与死锁，并提供可视化仿真调试平台。",
            impact: "仓储自动化算法原型",
            keyOutcomes: [
                "构建 A* + CBS 路径规划引擎，解决密集仓储多车协同冲突问题。",
                "建立时空预留与冲突检测机制，保障多车路径规划稳定运行。",
                "开发 PyQt5 可视化仿真工具，显著提升算法调试与演示效率。"
            ],
            audienceTags: ["hr", "jobSeeker", "partner"],
            businessValue: {
                zh: "为自动化立体仓库的调度系统提供了核心算法验证与仿真工具。",
                en: "Provided core algorithm verification and simulation tools for AS/RS scheduling."
            },
            engineeringDepth: {
                zh: "展示了复杂运筹算法的工程化落地与可视化交互开发能力。",
                en: "Demonstrates engineering implementation of complex operations research algorithms and GUI dev."
            },
            verification: [
                {
                    sourceType: "repo",
                    sourceLabel: "本地代码 A-star",
                    verifiedAt: "2026-02-15",
                    confidence: "medium",
                    level: "strict"
                }
            ],
            expandedDetails: {
                background: "仓储自动化需要智能调度算法。",
                problem: "路径规划复杂，冲突难处理。",
                solution: "- **路径引擎**：定制 A* 启发式函数，综合考虑曼哈顿距离与拥堵权重。\n- **冲突检测**：建立时空预留表，实时检测多车路径冲突 (CBS)。\n- **并发与仿真**：利用 `multiprocessing` 加速搜索，基于 PyQt5 构建可视化调试环境刷。",
                result: "算法有效，仿真直观，验证了方案可行性。",
                role: "算法研发",
                techStack: ["Python", "A*", "PyQt5"],
            },
            highlighted: false
        }
    ],

    skills: [
        {
            id: "skill-primary",
            category: "主力（可独立负责）",
            description: "与核心经历强绑定，可独立承担方案设计、实施和指标复核。",
            items: [
                "Java / Spring Boot（性能优化、接口治理、CI/CD）",
                "Python / Asyncio / Quart（异步 I/O、任务解耦）",
                "MySQL / Redis / ClickHouse（OLTP+OLAP、查询提速）",
                "RAG / ChromaDB / LLM 成本治理",
                "React / Next.js / TypeScript（全栈交付与静态导出）",
            ]
        },
        {
            id: "skill-proficient",
            category: "熟练（可独立交付）",
            description: "可在项目中独立落地，并与主力能力形成交付闭环。",
            items: [
                "Docker / Linux Shell / Nginx",
                "Jenkins / GitLab CI（质量门禁与回滚）",
                "Vue 3 / Electron / Chrome Extension",
                "WebSocket / SSE / FFmpeg-HLS",
                "DataX / ETL / 数据一致性校验脚本",
            ]
        },
        {
            id: "skill-familiar",
            category: "了解（可协作落地）",
            description: "具备实践基础，可在团队协作中快速接手和扩展。",
            items: [
                "Go（服务开发基础）",
                "Kubernetes（部署与资源编排基础）",
                "Kafka / RabbitMQ（消息队列基础）",
                "Elasticsearch / MinIO（检索与对象存储基础）",
                "AWS / Aliyun（云资源基础）",
            ]
        }
    ],

    services: [
        {
            id: "svc-fullstack",
            title: "全栈应用开发",
            description: "把业务需求落成可上线系统：账号/权限/支付/后台/监控一体化交付，强调可用性与可维护性。",
            icon: "Layout",
            techStack: ["React/Next.js", "Spring Boot", "MySQL/Redis"],
            gradient: "from-blue-500/10 to-cyan-500/10",
            milestones: ["需求澄清", "技术方案", "里程碑交付", "联调验收"]
        },
        {
            id: "svc-ai-integration",
            title: "AI 工程化落地",
            description: "将 LLM 能力接入业务流程：RAG 知识库、工具调用/Agent、成本与安全控制，支持灰度上线与效果复盘。",
            icon: "Bot",
            techStack: ["LangChain", "LLM APIs", "RAG", "Vector DB"],
            gradient: "from-sky-500/10 to-cyan-500/10",
            milestones: ["场景梳理", "PoC 验证", "成本评估", "灰度上线"]
        },
        {
            id: "svc-performance",
            title: "性能优化与重构",
            description: "用数据定位瓶颈并复核收益：SQL/索引、缓存、并发、JVM、压测，让系统更快更稳。",
            icon: "Zap",
            techStack: ["MySQL Tuning", "Redis", "System Design"],
            gradient: "from-amber-500/10 to-orange-500/10",
            milestones: ["基线采样", "瓶颈定位", "方案实施", "压测复核"]
        },
        {
            id: "svc-automation",
            title: "自动化与数据处理",
            description: "把重复工作变自动化：数据采集、清洗、报表、流程机器人，减少人工成本与出错率。",
            icon: "Workflow",
            techStack: ["Python", "Pandas", "Automation", "ETL"],
            gradient: "from-emerald-500/10 to-teal-500/10",
            milestones: ["流程评估", "自动化设计", "试运行", "稳定运维"]
        }
    ],

    vibeCoding: {
        title: "Vibe Coding · AI 原生开发者",
        description: "把 AI 当作效率杠杆，但不把质量押在“感觉对了”上：每个迭代都有 lint/build/test/e2e、静态导出与链接检查等门禁；对性能/成本先做基线，再复核收益。"
    },

    contact: {
        phone: "15035925107",
        email: "2041487752dxj@gmail.com",
        github: "https://github.com/icefunicu",
        websites: [
            "https://my-resume-gray-five.vercel.app/",
            "https://icefunicu.github.io/My-Resume/"
        ],
        resumeButtonText: "下载简历 PDF",
        ctaText: "开始合作",
        wechat: "w2041487752",
        responseSlaText: "通常在 24 小时内回复（工作日更快）",
        visibility: {
            defaultExpanded: false,
            showPhoneByDefault: false,
            showWechatByDefault: false
        },
        consultationChecklist: [
            "业务目标与上线时间",
            "当前系统或技术栈现状",
            "预算范围与协作方式"
        ]
    },

    audienceCards: [
        {
            id: "hr",
            title: "HR",
            focus: "快速判断岗位匹配度与候选人稳定性",
            targetSection: "experience",
            primaryCTA: "查看履历证据",
            secondaryCTA: "下载简历 PDF",
            highlightMetrics: ["远程优先", "关键指标可复核", "履历与项目闭环"]
        },
        {
            id: "jobSeeker",
            title: "求职者",
            focus: "理解技术成长路径与工程方法复用",
            targetSection: "projects",
            primaryCTA: "查看项目拆解",
            secondaryCTA: "查看技术取舍",
            highlightMetrics: ["STAR 叙事", "性能/成本指标", "工程化实践"]
        },
        {
            id: "partner",
            title: "合作伙伴",
            focus: "确认协作模式、边界与交付节奏",
            targetSection: "services",
            primaryCTA: "查看合作能力",
            secondaryCTA: "查看里程碑",
            highlightMetrics: ["PoC 到交付", "需求澄清机制", "可验收里程碑"]
        },
        {
            id: "client",
            title: "客户",
            focus: "直达业务价值、风险控制与沟通入口",
            targetSection: "contact",
            primaryCTA: "进入联系通道",
            secondaryCTA: "查看沟通准备项",
            highlightMetrics: ["性能与成本收益", "上线风险可控", "响应 SLA 明确"]
        }
    ]
};
