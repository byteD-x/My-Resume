import { PortfolioData } from './types';

// ==========================================
// 默认内容 JSON（用于 reset）
// ==========================================
export const defaultPortfolioData: PortfolioData = {
    hero: {
        name: "杜旭嘉",
        title: "全栈工程师（工程效率与交付方向）",
        subtitle: "把慢系统做快，把手工流程做成流水线，把原型做成可上线产品。以指标与证据闭环交付。",
        location: "远程优先 ｜ 可到岗：深圳 / 南京 / 杭州 / 成都",
        bullets: [
            {
                id: "bullet-1",
                title: "性能倍增",
                description: "核心接口查询 20s → 4s (5x)，日志处理延迟 <10ms"
            },
            {
                id: "bullet-2",
                title: "成本与稳定性",
                description: "多模态 Token 成本降低 40%，图片上传成功率 >99%"
            },
            {
                id: "bullet-3",
                title: "工程化交付",
                description: "构建自动化工作流与 CI/CD，显著减少重复劳动与交付风险"
            }
        ],
        quickFacts: {
            role: "全栈工程师（后端性能 / 交付效率）",
            availability: "远程优先｜可到岗：深圳 / 南京 / 杭州 / 成都",
            techStack: ["Java", "Spring Boot", "Python", "React", "Next.js", "CI/CD"]
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
        zh: "具备全栈交付能力的工程师，专注于后端架构与 AI 应用落地。擅长通过异步架构、性能调优和自动化工具解决复杂工程问题。在多个项目中通过技术手段实现了显著的降本增效，包括 5 倍性能提升与 40% 成本节约。致力于以可验证的数据和代码交付业务价值。",
        en: "Full-stack engineer specializing in backend architecture and AI engineering. Expert in solving complex engineering challenges through async architecture, performance tuning, and automation. Delivered measurable business value across multiple projects, including 5x performance gains and 40% cost reduction. Committed to shipping high-quality, verifiable software solutions."
    },

    aboutLenses: {
        business: [
            "**我能带来的结果（业务可读）**",
            "- 报表/接口：20s+ → 4s（5x）",
            "- AI 成本：-40%（Token 压缩 + 缓存）",
            "- 交付：CI/CD + 回滚，降低发布风险",
            "",
            "**我怎么做（方法论）**",
            "- 先做基线（压测/监控/日志），再动手优化",
            "- 每一步都有证据：指标、PR、仓库、脚本、验收记录",
        ].join("\n"),
        engineering: [
            "**擅长的工程问题（技术可读）**",
            "- SQL/索引/执行计划，OLTP/OLAP 分离（ClickHouse）",
            "- 异步 I/O 与解耦：Quart/asyncio、SSE、流式日志",
            "- 大文件/媒体链路：分片、秒传、FFmpeg/HLS",
            "- 工程化：lint/build/test/e2e、静态导出、可观测性、回滚",
            "",
            "**差异点**",
            "- “快”不是拍脑袋：基线 → 优化 → 复核",
            "- “能交付”不止能写完：部署、监控、回滚一并考虑",
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
                "2200+ 术语实时高亮：Worker 计算 + Highlight API 渲染，零 DOM 污染",
                "SPA 稳定注入：History API + MutationObserver，路由切换不丢功能",
                "并发与容错：请求节流 (3 req/s) + 重试；规则引擎结合 AI 兜底"
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
                "吞吐提升 5x：Quart + asyncio，消息处理不阻塞",
                "长期记忆：ChromaDB + SQLite 分层存储，支持多轮上下文",
                "成本降低 40%：Token 压缩 + 缓存；日志流式处理 <10MB"
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
            highlighted: true,
            keyOutcomes: [
                "交付能力: 2 周内完成从需求到可演示原型的全流程，按期通过客户验收",
                "技术验证: 验证了自动化脚本与 Web 系统的通讯可行性，为后续工程落地奠定基础"
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
                "接口秒开：核心聚合查询 10s+ → 500ms（执行计划/索引/缓存）",
                "交付标准化：引入 CI/CD + 质量门禁，减少人工发布事故",
                "慢查询治理：建立 Top SQL 监控与优化闭环，清理 20+ 隐患"
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
                "架构设计: 设计并实现高可用后端架构，支撑小程序稳定运行",
                "业务价值: 将专家检索文献的平均耗时从小时级缩短至分钟级",
                "AI 集成: 对接外部 AI 搜索 API，实现自然语言查文献"
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
                "报表秒开：活动统计 20s+ → 4s (5x)，关键聚合秒级呈现",
                "OLAP 落地：ClickHouse 承载分析负载，解耦 MySQL 事务库",
                "迁移与校对：300+ 表、数亿记录无损迁移，脚本化一致性校验"
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
            year: "2024.01 - 2024.02",
            role: "全栈开发 · 个人项目",
            company: "EasyCloudPan",
            location: "开源项目",
            summary: "从零开发企业级网盘：分片断点续传、秒传去重、异步转码与回收站全链路（Spring Boot + Redis + FFmpeg）。",
            techTags: ["Spring Boot", "Vue 3", "Redis", "FFmpeg", "File Systems"],
            highlighted: true,
            keyOutcomes: [
                "核心上传: 实现 GB 级文件分片断点续传，结合 MD5 索引实现秒级去重",
                "异步处理: 事务提交后异步触发 FFmpeg 视频转码与切片，解耦核心链路",
                "全栈闭环: 实现了文件预览、分享有效期、回收站恢复等完整状态机管理"
            ],
            audienceTags: ["hr", "jobSeeker", "partner"],
            businessValue: {
                zh: "构建了高可用、可扩展的文件存储解决方案，具备商用网盘的核心特性。",
                en: "Built a highly available, scalable file storage solution with core features of commercial cloud storage."
            },
            engineeringDepth: {
                zh: "深入实践了文件分块算法、Redis 资源配额管理、AOP 权限切面及异步任务调度。",
                en: "Deep practice in chunking algorithms, Redis quota management, AOP auth aspects, and async task scheduling."
            },
            verification: [
                {
                    sourceType: "repo",
                    sourceLabel: "GitHub 仓库",
                    sourceUrl: "https://github.com/icefunicu/easyCloudPan",
                    verifiedAt: "2026-02-15",
                    confidence: "high",
                    level: "strict"
                }
            ],
            expandedDetails: {
                background: "为了深入掌握大文件处理与全栈架构，从零构建网盘系统。",
                problem: "大文件上传占用带宽且易失败；视频在线播放转码复杂；多用户权限管理繁琐。",
                solution: "- **传输优化**：SparkMD5 计算文件指纹，分片并行上传，后端自动合并。\n- **媒体处理**：利用 FFmpeg 生成 HLS 流，支持流畅在线播放。\n- **权限控制**：基于 AOP 实现统一的鉴权与参数校验拦截器。",
                result: "系统稳定运行，核心上传下载功能流畅，代码结构清晰，易于扩展。",
                role: "全栈开发",
                techStack: ["Spring Boot", "MyBatis", "MySQL", "Redis", "Vue 3", "FFmpeg"]
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
            tech: ["JavaScript", "Chrome Extension", "Web Worker", "CSS Highlight API"],
            techTags: ["Chrome Extension", "Web Worker", "MutationObserver", "CSS Highlight API", "Trie"],
            summary: "一套浏览器生产力工具：术语实时高亮、Git 平台增强、广告/噪音净化（Web Worker + CSS Highlight API，零 DOM 污染渲染）。",
            impact: "浏览器插件与用户脚本合集",
            details: [
                "【术语侧边栏】Worker 线程处理匹配，CSS Highlight API 渲染，支持 2200+ 术语实时高亮，无卡顿。",
                "【Git 增强】通过 History API 劫持与 MutationObserver 监听，完美适配 GitHub/Gitee 单页应用路由切换。",
                "【智能净化】结合 AI 语义分析与规则引擎，精准拦截网页广告与推广邮件，准确率达 95%。",
                "【性能治理】书签工具引入漏桶算法控制并发 (5 req/s)，避免触发站点反爬策略。"
            ],
            keyOutcomes: [
                "覆盖 2200+ 双语术语，实现毫秒级响应",
                "解决 SPA 站点插件失效难题",
                "构建了可扩展的浏览器脚本工程体系"
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
            tech: ["Python", "Quart", "Asyncio", "RAG", "Electron"],
            techTags: ["Python", "Quart", "Asyncio", "RAG", "Electron", "SQLite", "ChromaDB"],
            summary: "微信 AI 助手：异步架构提升并发能力，RAG 提供长期记忆，Electron 管理端便于运维（成本与体验兼顾）。",
            impact: "异步架构 + RAG 记忆",
            details: [
                "【异步核心】使用 `asyncio` 重写消息轮询与处理逻辑，API 吞吐量提升 5 倍，支持高并发对话。",
                "【分层记忆】集成 ChromaDB 向量库，实现基于语义的长短期记忆检索，让机器人具备‘记忆’。",
                "【桌面终端】Electron + React 构建跨平台管理界面，通过 SSE 实时监控运行状态与日志流。",
                "【成本优化】引入 Context Trimming 与 Token 压缩策略，使长文本对话成本降低 40%。"
            ],
            keyOutcomes: [
                "API 吞吐量提升 5x+ (异步 I/O)",
                "日志内存占用 <10MB (流式处理)",
                "Token 成本降低 40% (压缩策略)"
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
            tech: ["Spring Boot", "Redis", "Spring Security", "Vue.js"],
            techTags: ["Spring Boot", "Redis", "Spring Security", "Vue.js", "MySQL"],
            summary: "面向校内选课/考试高峰的教育平台：视频点播、支付、实时互动一体化（Redis 缓存 + RBAC + WebSocket）。",
            impact: "校内应用",
            details: [
                "【高并发架构】使用 Redis 缓存热点课程数据，削峰填谷，保障系统在高负载下稳定运行。",
                "【支付集成】对接微信支付 API，实现订单创建、回调处理与对账流程的闭环，确保资金安全。",
                "【安全防护】基于 Spring Security 实现细粒度的 RBAC 权限控制与接口限流，防止恶意刷课。",
                "【实时互动】基于 WebSocket 实现直播弹幕与在线答疑功能。"
            ],
            keyOutcomes: [
                "上线校内支付功能，流水稳定",
                "支持数百人并发在线考试",
                "视频点播流畅无卡顿"
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
                solution: "构建全栈微服务化应用，引入 Redis 与支付网关。",
                result: "平台上线并稳定运行，满足校内高峰期使用需求。",
                role: "全栈开发",
                techStack: ["Spring Boot", "Redis", "Vue.js"],
            },
            highlighted: true
        },
        {
            id: "proj-cloudpan",
            year: "2024.01 - 2024.02",
            name: "EasyCloudPan",
            link: "https://github.com/icefunicu/easyCloudPan",
            demoLink: "",
            tech: ["Spring Boot", "Vue 3", "Redis", "FFmpeg", "MySQL"],
            techTags: ["Spring Boot", "MyBatis", "MySQL", "Redis", "Vue 3", "Vite", "FFmpeg", "HLS"],
            summary: "企业级网盘系统：支持 GB 级大文件传输与在线播放；分片秒传、异步转码、回收站机制完整闭环。",
            impact: "文件服务与流媒体链路工程化",
            details: [
                "【极速传输】SparkMD5 前端计算指纹，后端并行接收分片并利用 `Sendfile` (逻辑层面) 实现高效合并；MD5 索引实现秒传。",
                "【媒体中心】上传视频后，事务提交钩子自动触发 FFmpeg 异步转码，生成 HLS 切片以适应不同带宽播放。",
                "【资源治理】基于 AOP 切面统一校验用户配额，利用 Redis Lua 脚本保证空间扣减原子性。",
                "【完整生命周期】实现了文件的分享（有效期/提取码）、转存、回收站恢复及彻底删除的完整状态流转。"
            ],
            keyOutcomes: [
                "GB 级文件稳定传输 (分片 + 断点续传)",
                "视频在线秒播 (HLS 切片)",
                "存储空间利用率提升 (MD5 去重)"
            ],
            audienceTags: ["hr", "jobSeeker", "partner", "client"],
            businessValue: {
                zh: "构建了私有化部署的高性能文件存储与协作中心。",
                en: "Built a high-performance private cloud storage and collaboration hub."
            },
            engineeringDepth: {
                zh: "深入解析了断点续传协议、视音频编解码流程及分布式锁的应用。",
                en: "Deep analysis of resumable upload protocols, AV transcoding, and distributed locks."
            },
            verification: [
                {
                    sourceType: "repo",
                    sourceLabel: "GitHub 仓库",
                    sourceUrl: "https://github.com/icefunicu/easyCloudPan",
                    verifiedAt: "2026-02-15",
                    confidence: "high",
                    level: "strict"
                }
            ],
            expandedDetails: {
                background: "打造个人与小团队可用的高性能网盘。",
                problem: "大文件传输难，视频播放难，权限管理难。",
                solution: "分片上传，异步转码，RBAC 权限。",
                result: "功能完备，体验流畅，代码规范。",
                role: "全栈开发",
                techStack: ["Spring Boot", "FFmpeg", "Vue 3"],
                links: [{ label: "GitHub", url: "https://github.com/icefunicu/easyCloudPan" }]
            },
            highlighted: true
        },
        {
            id: "proj-jzt-shuttle-path",
            year: "2023",
            name: "九州通四向穿梭车路径规划系统",
            tech: ["Python", "A*", "CBS", "PyQt5", "multiprocessing"],
            techTags: ["Python", "A* 路径规划", "CBS 冲突搜索", "PyQt5", "ThreadPoolExecutor", "Concurrent"],
            summary: "面向密集仓储的多车路径规划原型：基于 A* + CBS 解决协同避让与死锁，并提供可视化仿真调试平台。",
            impact: "仓储自动化算法原型",
            details: [
                "【路径引擎】定制 A* 启发式函数，综合考虑曼哈顿距离与拥堵权重，规划最优路径。",
                "【冲突检测】建立时空预留表，实时检测多车路径的时间片冲突并计算避让策略 (CBS)。",
                "【仿真平台】基于 PyQt5 `QPainter` 构建可视化调试环境，支持单步回放算法运行过程，直观验证逻辑。",
                "【并发调度】利用 `multiprocessing` 多进程加速路径搜索，提升系统在大规模地图下的响应速度。"
            ],
            keyOutcomes: [
                "1000+ 格点地图路径秒级规划",
                "多车协同无死锁运行",
                "可视化工具提升调试效率 10 倍"
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
                solution: "A* 算法 + 冲突搜索策略 + 可视化仿真。",
                result: "算法有效，仿真直观，验证了方案可行性。",
                role: "算法研发",
                techStack: ["Python", "A*", "PyQt5"],
            },
            highlighted: false
        }
    ],

    skills: [
        {
            id: "skill-backend",
            category: "后端架构",
            description: "以性能与可用性为核心，能从 SQL/缓存/异步架构到可观测性打通闭环。",
            items: ["Java (Spring Boot / Cloud)", "Python (Quart / Asyncio / Django)", "Go", "Microservices", "JVM Tuning", "High Concurrency"]
        },
        {
            id: "skill-data",
            category: "数据与中间件",
            description: "擅长海量数据存储与查询优化：索引、分库分表、OLAP/OLTP 分离与数据迁移。",
            items: ["MySQL (Index / Optimization)", "Redis (Cluster / Lua)", "ClickHouse (OLAP)", "Elasticsearch", "Kafka / RabbitMQ", "MinIO"]
        },
        {
            id: "skill-ai",
            category: "AI 工程化",
            description: "把 LLM 能力接入真实业务：RAG、工具调用、成本控制与可观测性。",
            items: ["RAG (LangChain / LlamaIndex)", "Prompt Engineering", "Agent Design", "Vector DB (Chroma / Milvus)", "LLM API Integration", "Function Calling"]
        },
        {
            id: "skill-devops",
            category: "DevOps 与云原生",
            description: "关注交付确定性：CI/CD、容器化、监控告警与回滚方案，减少线上风险。",
            items: ["Docker / Kubernetes", "CI/CD (GitLab / Jenkins)", "Nginx / OpenResty", "Prometheus / Grafana", "Linux Shell", "AWS / Aliyun"]
        },
        {
            id: "skill-frontend",
            category: "前端与全栈",
            description: "能把后端能力产品化：复杂交互、性能优化、跨端（Web/Electron/Extension）。",
            items: ["Vue 3 / Nuxt.js", "React / Next.js", "TypeScript", "TailwindCSS", "Chrome Extension", "Electron"]
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
