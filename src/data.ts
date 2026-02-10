import { PortfolioData } from './types';

// ==========================================
// 默认内容 JSON（用于 reset）
// ==========================================
export const defaultPortfolioData: PortfolioData = {
    hero: {
        name: "杜旭嘉",
        title: "全栈工程师（工程效率方向）",
        subtitle: "后端驱动全栈交付：把慢系统变快，把手工流程变流水线，把 Demo 变可发布产品。",
        location: "远程优先 ｜ 可到岗：深圳 / 南京 / 杭州 / 成都",
        bullets: [
            {
                id: "bullet-1",
                title: "性能优化",
                description: "关键查询 20s → 4s（性能提升 5x）"
            },
            {
                id: "bullet-2",
                title: "异步改造",
                description: "异步改造后 API 吞吐提升 5x+，日志内存 <10MB"
            },
            {
                id: "bullet-3",
                title: "成本与稳定性",
                description: "多模态链路优化后 Token 成本下降 40%，图片上传成功率 99%+"
            }
        ],
        quickFacts: {
            role: "全栈工程师（后端性能 / 交付效率）",
            availability: "远程优先｜可到岗：深圳 / 南京 / 杭州 / 成都",
            techStack: ["Java", "Spring Boot", "Python", "React", "Next.js", "CI/CD"]
        },
        roleSnapshot: {
            primaryRole: "全栈工程师（工程效率方向）",
            secondaryRole: "后端 / AI 工程",
            availability: "远程优先",
            location: "远程优先｜可到岗：深圳 / 南京 / 杭州 / 成都",
            updatedAt: "2026-02-10"
        }
    },

    about: {
        zh: "已完成计算机专业本科学习，专注后端架构与 AI 应用工程化。擅长以可验证结果驱动交付：从性能治理、自动化流程到全栈产品上线，均以指标和证据闭环。",
        en: "Backend-focused full-stack engineer with AI engineering delivery experience, emphasizing evidence-backed outcomes in performance, automation, and product shipping."
    },

    impact: [
        {
            id: "impact-1",
            title: "开源项目",
            value: "100+",
            label: "Star 数",
            description: "WeChat AI Assistant 开源项目 (Async / RAG / Electron)",
            linkedExperienceId: "exp-wechat-bot",
            icon: "Star",
            colSpan: "md:col-span-1",
            bg: "bg-sky-50",
            githubRepo: "icefunicu/wechat-bot",
            verification: {
                sourceType: "repo",
                sourceLabel: "GitHub Stars",
                sourceUrl: "https://github.com/icefunicu/wechat-bot",
                verifiedAt: "2026-02-10",
                confidence: "high",
                level: "strict"
            }
        },
        {
            id: "impact-2",
            title: "性能优化",
            value: "5x",
            label: "接口提速",
            description: "活动查询接口从 20s+ 优化至 4s，提升 5 倍性能",
            linkedExperienceId: "exp-unicom",
            icon: "Zap",
            colSpan: "md:col-span-1",
            bg: "bg-blue-50",
            verification: {
                sourceType: "experience",
                sourceLabel: "联通项目性能优化记录",
                verifiedAt: "2026-02-10",
                confidence: "high",
                level: "strict"
            }
        },
        {
            id: "impact-3",
            title: "用户服务",
            value: "稳定",
            label: "校内应用",
            description: "教育平台稳定服务校内用户",
            linkedExperienceId: "exp-chinasoft",
            icon: "Users",
            colSpan: "md:col-span-1",
            bg: "bg-rose-50",
            verification: {
                sourceType: "experience",
                sourceLabel: "教育平台项目交付记录",
                verifiedAt: "2026-02-10",
                confidence: "medium",
                level: "strict"
            }
        },
        {
            id: "impact-4",
            title: "核心能力",
            value: "AI 原生",
            label: "全栈开发",
            description: "AI 驱动的全栈开发，从需求到交付",
            icon: "Code2",
            colSpan: "md:col-span-2",
            rowSpan: "md:row-span-2",
            isFocal: true,
            verification: {
                sourceType: "manual",
                sourceLabel: "项目合集与履历交叉验证",
                verifiedAt: "2026-02-10",
                confidence: "medium",
                level: "strict"
            }
        },
        {
            id: "impact-5",
            title: "数据迁移",
            value: "300+",
            label: "表处理",
            description: "百万级数据表迁移至 ClickHouse，实现毫秒级查询",
            linkedExperienceId: "exp-unicom",
            icon: "Gauge",
            colSpan: "md:col-span-1",
            bg: "bg-emerald-50",
            verification: {
                sourceType: "experience",
                sourceLabel: "数据中台迁移记录",
                verifiedAt: "2026-02-10",
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
            summary: "浏览器扩展与油猴脚本工具集合，覆盖书签整理、术语侧边栏、邮箱广告清理、GitHub/Gitee 增强与沉浸式阅读，强调最小权限、稳定注入与性能治理。",
            techTags: ["Chrome Extension", "Userscript", "JavaScript", "Web Worker", "MutationObserver", "Trie", "AI API", "CSS Highlight API"],
            highlighted: true,
            keyOutcomes: [
                "Terminology Sidebar 覆盖 2,290 条双语术语，列表上限 2,000",
                "GitHub/Gitee Enhancer 提供 6 项功能开关，缓存过期 24h",
                "Email Ad Cleaner 覆盖 8 个邮箱入口与规则库（18 域名词/21 发件人词/8 退订词）",
                "Bookmark Organizer 并发 3、限速 5 req/s、重试 3 次"
            ],
            audienceTags: ["jobSeeker", "partner", "client"],
            businessValue: {
                zh: "以最小权限和稳定注入提升浏览器生产力，降低重复操作成本。",
                en: "Improves browser productivity with stable injection and minimal-permission design."
            },
            engineeringDepth: {
                zh: "展示 SPA 注入治理、并发限速控制和 AI 失败回退等工程手法。",
                en: "Demonstrates SPA reinjection control, concurrency throttling, and AI fallback design."
            },
            verification: [
                {
                    sourceType: "repo",
                    sourceLabel: "GitHub 仓库与发布记录",
                    sourceUrl: "https://github.com/icefunicu?tab=repositories",
                    verifiedAt: "2026-02-10",
                    confidence: "high",
                    level: "strict"
                }
            ],
            expandedDetails: {
                background: "为提升开发效率与浏览体验，整理浏览器扩展与用户脚本工具集，覆盖书签整理、术语侧边栏、邮箱广告清理、代码托管平台增强与沉浸式阅读。",
                problem: "需要在不同站点中保证 SPA 路由下稳定注入，同时控制权限与外部请求成本，并在 AI 不稳定时保持可用。",
                solution: "实现五个子模块：\n1) Terminology Sidebar：Web Worker + CSS Custom Highlight API 实时术语高亮，覆盖 2,290 条双语词条，列表上限 2,000。\n2) GitHub/Gitee Enhancer：History API 补丁 + turbo/pjax 监听 + MutationObserver，保障 SPA 重注入，提供 6 项功能开关与 24h 缓存过期。\n3) Email Ad Cleaner：AI + 规则双引擎并可失败回退，覆盖 8 个邮箱入口、18 域名关键词、21 发件人词、8 退订词。\n4) Bookmark Organizer：Trie + 正则混合匹配，配置并发 3、限速 5 req/s、重试 3 次、延迟 1000ms。\n5) Immersive Reader：一键提取正文并提供主题/布局/目录/进度控制。",
                result: "术语侧边栏覆盖 2,290 条双语术语；增强脚本提供 6 项功能开关并控制缓存 24h；广告清理覆盖多邮箱入口与规则库；书签整理并发/限速参数稳定可控。",
                role: "独立开发者（需求梳理、架构设计、实现与发布）",
                techStack: ["JavaScript", "Chrome Extension", "Tampermonkey", "Web Worker", "MutationObserver", "Trie", "CSS Custom Highlight API", "AI API"],
                links: [{ label: "GitHub", url: "https://github.com/icefunicu?tab=repositories" }]
            }
        },
        {
            id: "exp-wechat-bot",
            year: "2025.12 - 至今",
            role: "独立开发者 · 开源项目",
            company: "WeChat AI Bot",
            location: "开源项目",
            summary: "基于 wxauto 的微信 PC 客户端自动化 AI 助手，集成 LLM + RAG 长期记忆与 Electron/Web 管理端，后端采用 Quart 异步架构。",
            techTags: ["Python", "Quart", "Asyncio", "Electron", "SQLite", "ChromaDB", "SSE"],
            highlighted: true,
            keyOutcomes: ["API 吞吐量提升 5x+", "日志读取内存 <10MB", "Token 成本降低 40%"],
            audienceTags: ["hr", "jobSeeker", "partner", "client"],
            businessValue: {
                zh: "在保持稳定性的前提下降低运行成本并提升可用性。",
                en: "Improves stability while reducing runtime cost and failure rate."
            },
            engineeringDepth: {
                zh: "覆盖异步 I/O 解耦、日志流式处理、多模态成本优化等关键工程点。",
                en: "Covers async I/O decoupling, streaming logs, and multimodal cost optimization."
            },
            verification: [
                {
                    sourceType: "repo",
                    sourceLabel: "wechat-bot 仓库与变更记录",
                    sourceUrl: "https://github.com/icefunicu/wechat-bot",
                    verifiedAt: "2026-02-10",
                    confidence: "high",
                    level: "strict"
                }
            ],
            expandedDetails: {
                background: "微信自动化需要同时处理消息轮询、模型调用与管理端操作，且日志与多模态输入会带来额外 I/O 与成本压力。",
                problem: "阻塞 I/O 导致 API 超时与卡顿；日志文件膨胀引发内存/磁盘压力；多模态 Token 成本高且易触发图片限制。",
                solution: "用 `asyncio.to_thread` 将 wxauto/SQLite I/O 从主循环剥离，迁移至 `aiosqlite` 并开启 WAL；SSE 推送实时状态；日志读取改为 `deque(maxlen=N)` 流式方案；多模态引入 Pillow 压缩、Context Trimming 与 `lru_cache` 优化 Token 估算。",
                result: "API 吞吐量提升 5x+，日志读取延迟稳定在 10ms 级且内存 <10MB，Token 成本降低 40%，图片上传成功率提升至 99%+。",
                role: "独立开发者",
                techStack: ["Python", "Quart", "Asyncio", "Electron", "SQLite", "ChromaDB", "OpenAI API", "Tenacity", "wxauto"],
                links: [{ label: "GitHub", url: "https://github.com/icefunicu/wechat-bot" }]
            }
        },
        {
            id: "exp-sustech",
            year: "2025.11 - 2025.12",
            role: "外包技术顾问",
            company: "南方科技大学",
            location: "深圳",
            summary: "独立交付智能流程自动化（IPA）原型系统，验证核心技术可行性。",
            techTags: ["Python", "自动化", "端到端交付"],
            highlighted: true,
            keyOutcomes: ["端到端交付 IPA 系统", "按期通过客户验收"],
            audienceTags: ["partner", "client"],
            businessValue: {
                zh: "短周期完成可验收原型，验证技术可行性并降低项目不确定性。",
                en: "Delivered an acceptable prototype quickly to reduce solution uncertainty."
            },
            engineeringDepth: {
                zh: "强调端到端链路打通与交付节奏控制。",
                en: "Focuses on end-to-end integration and delivery cadence control."
            },
            verification: [
                {
                    sourceType: "experience",
                    sourceLabel: "项目验收结果",
                    verifiedAt: "2026-02-10",
                    confidence: "medium",
                    level: "strict"
                }
            ],
            expandedDetails: {
                background: "南方科技大学研究项目需要智能流程自动化（IPA）系统原型来验证技术方案。",
                problem: "需要在短时间内完成从数据采集、处理到可视化的完整链路。",
                solution: "设计并实现端到端的智能流程自动化方案，打通数据采集、处理、可视化全链路。",
                result: "按期高质量完成验收，获得客户认可。",
                role: "独立承接，从需求沟通到最终交付全程负责。",
                techStack: ["Python", "数据处理", "可视化"]
            }
        },
        {
            id: "exp-chinasoft",
            year: "2025.04 - 2025.09",
            role: "后端/全栈工程师",
            company: "中软国际（项目制）",
            location: "西安",
            summary: "负责 SQL 慢查询治理与关键接口性能优化，并推动 CI/CD 规范化交付。",
            techTags: ["Java", "Spring Boot", "MySQL", "Redis", "Docker", "CI/CD"],
            highlighted: true,
            keyOutcomes: ["关键接口耗时降低 60%+", "建立慢查询治理流程", "规范 CI/CD 交付"],
            audienceTags: ["hr", "jobSeeker", "partner", "client"],
            businessValue: {
                zh: "降低关键接口响应时延并减少发布风险，提高系统稳定交付能力。",
                en: "Reduced latency and release risk, improving predictable delivery."
            },
            engineeringDepth: {
                zh: "体现 SQL 治理方法、缓存策略和 CI/CD 工程实践。",
                en: "Shows SQL governance, caching strategy, and CI/CD practices."
            },
            verification: [
                {
                    sourceType: "experience",
                    sourceLabel: "中软项目性能优化记录",
                    verifiedAt: "2026-02-10",
                    confidence: "high",
                    level: "strict"
                }
            ],
            expandedDetails: {
                background: "企业级系统关键接口响应时间过长，影响用户体验。",
                problem: "SQL 慢查询普遍、缺乏统一的性能监控与优化机制，发布流程不规范导致风险高。",
                solution: "建立慢查询排查流程（Top SQL/耗时分层）。通过索引优化、SQL 改写、分页策略、热点缓存等手段提升性能。推动 CI/CD 流水线落地。",
                result: "关键接口耗时下降 60%+，减少人为发布风险与回滚成本。",
                role: "主导性能优化专项，参与 CI/CD 建设。",
                techStack: ["Java", "Spring Boot", "MySQL", "Redis", "Docker", "CI/CD"]
            }
        },
        {
            id: "exp-noc",
            year: "2024.08 - 2024.10",
            role: "后端开发实习生",
            company: "国家骨科临床研究中心",
            location: "远程",
            summary: "主导医学论文智能检索小程序后端架构，为顶尖医学专家提供 AI 驱动的科研工具。",
            techTags: ["后端", "AI搜索", "小程序", "订阅推送"],
            highlighted: false,
            keyOutcomes: ["构建智能论文检索架构", "打造个性化推送服务"],
            audienceTags: ["hr", "jobSeeker"],
            businessValue: {
                zh: "缩短专家检索论文所需时间，提升科研信息获取效率。",
                en: "Reduced research retrieval time for medical experts."
            },
            engineeringDepth: {
                zh: "突出 AI 检索与后端架构协同。",
                en: "Highlights collaboration between AI retrieval and backend architecture."
            },
            verification: [
                {
                    sourceType: "experience",
                    sourceLabel: "项目交付记录",
                    verifiedAt: "2026-02-10",
                    confidence: "medium",
                    level: "strict"
                }
            ],
            expandedDetails: {
                background: "医学专家需要高效的论文检索与追踪工具来跟进领域前沿。",
                problem: "传统检索方式效率低，难以满足专家对精准性和时效性的需求。",
                solution: "构建 Submet 医学论文检索小程序，深度整合 AI 搜索引擎，打造个性化推送服务。",
                result: "大幅缩减论文检索与辨别的时间成本，服务国内医学领域专家群体。",
                role: "主导后端架构设计与实现。",
                techStack: ["后端开发", "AI 搜索引擎", "微信小程序"]
            }
        },
        {
            id: "exp-unicom",
            year: "2024.05 - 2024.08",
            role: "后端开发实习生",
            company: "中国联通陕西省分公司",
            location: "西安 · 数字化部",
            summary: "核心参与运营平台与数据中台建设，实现接口性能 5 倍提升，完成百万级数据迁移。",
            techTags: ["Java", "ClickHouse", "MySQL", "性能优化", "数据迁移"],
            highlighted: false,
            keyOutcomes: ["接口性能提升 5x (20s→4s)", "迁移 300+ 百万级数据表", "实现 ClickHouse 毫秒级查询"],
            audienceTags: ["hr", "jobSeeker", "partner", "client"],
            businessValue: {
                zh: "通过性能治理与数据迁移显著提升业务查询效率。",
                en: "Improved business query efficiency via performance tuning and data migration."
            },
            engineeringDepth: {
                zh: "体现 ClickHouse 迁移、查询优化与批处理调度经验。",
                en: "Demonstrates ClickHouse migration, query optimization, and scheduling experience."
            },
            verification: [
                {
                    sourceType: "experience",
                    sourceLabel: "联通数字化部项目记录",
                    verifiedAt: "2026-02-10",
                    confidence: "high",
                    level: "strict"
                }
            ],
            expandedDetails: {
                background: "陕西联通数字化部门需要建设统一的运营平台与数据中台。",
                problem: "活动查询接口响应时间超过 20 秒，数据分散在多个 MySQL 实例中难以统一分析。",
                solution: "将活动查询接口响应时间从 20s+ 优化至 4s；完成 300+ 张百万级数据表的同步迁移，采用 ClickHouse 替代 MySQL。",
                result: "性能提升 5 倍，实现毫秒级查询，整合数千万条数据。",
                role: "核心参与性能优化与数据迁移工作。",
                techStack: ["Java", "MySQL", "ClickHouse", "xxl-job"]
            }
        },
        {
            id: "exp-cloudpan",
            year: "2024.01 - 2024.02",
            role: "全栈开发 · 个人项目",
            company: "EasyCloudPan（仿百度网盘）",
            location: "开源项目",
            summary: "全栈网盘系统，打通大文件分片上传、MD5 秒传去重、异步视频转码、分享与回收站完整链路。",
            techTags: ["Spring Boot", "MyBatis", "MySQL", "Redis", "Vue 3", "Vite", "FFmpeg", "HLS"],
            highlighted: true,
            keyOutcomes: [
                "支持 GB 级文件分片上传与断点续传",
                "基于 MD5 与索引实现重复文件秒传去重",
                "通过 afterCommit + @Async 解耦上传与视频转码流程"
            ],
            audienceTags: ["hr", "jobSeeker", "partner", "client"],
            businessValue: {
                zh: "将上传、转码、分享、回收站等高频能力整合为可维护闭环，提升文件服务可用性。",
                en: "Delivers a maintainable end-to-end file workflow across upload, transcoding, sharing, and recovery."
            },
            engineeringDepth: {
                zh: "覆盖分片上传、事务后异步任务、AOP 鉴权校验、Redis 配额治理与生命周期建模。",
                en: "Covers chunked uploads, post-commit async processing, AOP guards, Redis quota control, and lifecycle modeling."
            },
            verification: [
                {
                    sourceType: "repo",
                    sourceLabel: "easyCloudPan 仓库与 STAR_REPO_HIGHLIGHTS 文档",
                    sourceUrl: "https://github.com/icefunicu/easyCloudPan",
                    verifiedAt: "2026-02-10",
                    confidence: "high",
                    level: "strict"
                }
            ],
            expandedDetails: {
                background: "针对大文件上传与在线预览场景，目标是实现接近商用网盘体验的可运行系统。",
                problem: "单请求上传在大文件场景下稳定性差，视频转码耗时会阻塞响应，接口层鉴权与参数校验易重复与遗漏。",
                solution: "前端采用 SparkMD5 + 分片上传，后端在 uploadFile/union 链路合并分片并结合 idx_md5 实现秒传；通过 TransactionSynchronizationManager.afterCommit 触发 @Async transferFile，使用 FFmpeg 生成缩略图与 HLS 切片；使用 @GlobalInterceptor/@VerifyParam + AOP 统一处理鉴权与参数校验，Redis 管理空间配额与缓存。",
                result: "形成上传、去重、转码、分享、回收站完整链路，核心能力可通过仓库代码与索引设计直接复核。",
                role: "全栈开发（后端、前端、数据库与工程化）",
                techStack: ["Spring Boot", "MyBatis", "MySQL", "Redis", "Vue 3", "Vite", "FFmpeg", "HLS"],
                links: [{ label: "GitHub", url: "https://github.com/icefunicu/easyCloudPan" }]
            }
        },
        {
            id: "exp-jzt-shuttle-path",
            year: "2023.05 - 2023.07",
            role: "项目经理 / 算法研发与系统原型开发",
            company: "九州通四向穿梭车路径规划系统",
            location: "本地项目",
            summary: "面向医药物流仓储的路径规划原型，覆盖 A* 寻路、多车并发、冲突检测/消解与 PyQt5 可视化调试。",
            techTags: ["Python", "A* 路径规划", "CBS 冲突搜索", "PyQt5", "ThreadPoolExecutor", "multiprocessing", "并发调度"],
            highlighted: false,
            keyOutcomes: [
                "在 27x42（1134 格）仓储地图上完成路径搜索与可视化验证",
                "实现双车同步路径规划与路径区分展示",
                "实现冲突检测与等待避让策略（并发收益为定性推断，待压测补充）"
            ],
            audienceTags: ["hr", "jobSeeker", "partner"],
            businessValue: {
                zh: "将仓储调度从人工经验迁移到可复用算法原型，为自动化调度系统提供验证基础。",
                en: "Moves dispatching from manual heuristics to a reusable algorithmic prototype for warehouse automation."
            },
            engineeringDepth: {
                zh: "体现路径规划算法、并发任务编排、冲突消解策略与 GUI 可视化调试工具链整合。",
                en: "Demonstrates integration of planning algorithms, concurrent scheduling, conflict resolution, and GUI-based debugging."
            },
            verification: [
                {
                    sourceType: "manual",
                    sourceLabel: "STAR_REPO_STAR.md 与 A-star 代码目录",
                    verifiedAt: "2026-02-10",
                    confidence: "medium",
                    level: "strict",
                    confidenceBasis: [
                        "可在本地目录复核 A_Search、Vehicle、has_conflict 等实现",
                        "map.txt 可解析为 27x42 共 1134 格地图",
                        "当前缺少公开仓库链接与量化压测报告"
                    ],
                    confidenceReason: "判定为中置信度：关键实现可在本地代码复核，但缺少公开链接与量化性能数据。"
                }
            ],
            expandedDetails: {
                background: "医药物流四向穿梭车需要在高密度仓储地图中进行自动路径规划，并支持可视化调试与演示。",
                problem: "需统一处理单车寻路、多车并发和冲突避让，并在载货/空车差异化通行规则下保持可解释性。",
                solution: "基于 Python 实现 A* 搜索核心（A_Search、F_Min、getAroundPoint、process/yield）；使用 Vehicle 封装多车任务并实验线程池/进程池并发；通过 has_conflict 与优先级等待策略处理时间同步冲突；基于 PyQt5 构建可视化回放界面。",
                result: "完成仓储地图路径规划、双车协同与冲突消解原型验证，为后续扩展到更大规模调度提供技术基线。",
                role: "项目经理 / 算法研发与系统原型开发",
                techStack: ["Python", "A*", "CBS", "PyQt5", "ThreadPoolExecutor", "multiprocessing"]
            }
        },
        {
            id: "exp-education",
            year: "2021.09 - 2025.06",
            role: "本科 · 数据科学与大数据技术",
            company: "南阳理工学院",
            location: "河南",
            summary: "GPA 3.8/4.5 (Top 5%)，多次获得校级荣誉，省级首届程序设计大赛优秀奖。",
            techTags: ["计算机科学", "大数据", "项目实践"],
            highlighted: false,
            keyOutcomes: ["GPA 3.8/4.5 (Top 5%)", "交付校地合作小程序"],
            audienceTags: ["hr"],
            businessValue: {
                zh: "形成数据与工程复合背景，为后续项目交付打基础。",
                en: "Built a strong data + engineering foundation for delivery work."
            },
            engineeringDepth: {
                zh: "体现系统性学习与项目实践能力。",
                en: "Represents structured learning and project execution ability."
            },
            verification: [
                {
                    sourceType: "manual",
                    sourceLabel: "教育经历与荣誉记录",
                    verifiedAt: "2026-02-10",
                    confidence: "medium",
                    level: "strict"
                }
            ],
            expandedDetails: {
                background: "本科阶段系统学习计算机科学与大数据技术。",
                result: "GPA 3.8/4.5，获校级三好学生、优秀学生干部、院级奖学金等多项荣誉。",
                role: "参与学校及当地政府网站维护工作，在校地合作项目中完成小程序开发与交付。",
                techStack: ["Java", "Python", "数据分析", "Web 开发"]
            }
        }
    ],

    projects: [
        {
            id: "proj-jiaoben",
            year: "2026",
            name: "浏览器生产力套件",
            link: "https://github.com/icefunicu?tab=repositories",
            demoLink: "",
            tech: ["JavaScript", "Chrome Extension", "Tampermonkey", "Web Worker", "CSS Highlight API"],
            techTags: ["Chrome Extension", "Userscript", "JavaScript", "Web Worker", "MutationObserver", "Trie", "AI API", "CSS Highlight API"],
            summary: "浏览器扩展与油猴脚本工具集合，覆盖书签整理、术语侧边栏、邮箱广告清理、GitHub/Gitee 增强与沉浸式阅读，强调最小权限、稳定注入与性能治理。",
            impact: "浏览器插件与用户脚本合集",
            details: [
                "Terminology Sidebar：Web Worker + CSS Custom Highlight API 实时术语高亮，覆盖 2,290 条双语词条，列表上限 2,000。",
                "GitHub/Gitee Enhancer：History API 补丁 + turbo/pjax 监听 + MutationObserver 保证 SPA 重注入，提供 6 项功能开关与 24h 缓存过期。",
                "Email Ad Cleaner：AI + 规则双引擎并可失败回退，覆盖 8 个邮箱匹配入口、18 域名关键词、21 发件人词、8 退订词。",
                "Bookmark Organizer：Trie + 正则混合匹配，配置并发 3、限速 5 req/s、重试 3 次、延迟 1000ms。",
                "Immersive Reader：一键提取正文并提供沉浸式阅读 UI（主题/布局/目录/进度）。"
            ],
            keyOutcomes: [
                "Terminology Sidebar 覆盖 2,290 条双语术语，列表上限 2,000",
                "GitHub/Gitee Enhancer 提供 6 项功能开关，缓存过期 24h",
                "Email Ad Cleaner 覆盖 8 个邮箱入口与规则库（18 域名词/21 发件人词/8 退订词）",
                "Bookmark Organizer 并发 3、限速 5 req/s、重试 3 次"
            ],
            audienceTags: ["jobSeeker", "partner", "client"],
            businessValue: {
                zh: "用最小权限与稳定注入降低高频重复操作成本。",
                en: "Cuts repetitive workflow cost through minimal-permission browser automation."
            },
            engineeringDepth: {
                zh: "包含 Worker 下沉、注入重试、限速重试等可复用工程模式。",
                en: "Includes reusable patterns for worker offloading, reinjection, and retry throttling."
            },
            verification: [
                {
                    sourceType: "repo",
                    sourceLabel: "仓库代码与功能清单",
                    sourceUrl: "https://github.com/icefunicu?tab=repositories",
                    verifiedAt: "2026-02-10",
                    confidence: "high",
                    level: "strict"
                }
            ],
            expandedDetails: {
                background: "为提升开发效率与浏览体验，整理浏览器扩展与用户脚本工具集，覆盖书签整理、术语侧边栏、邮箱广告清理、代码托管平台增强与沉浸式阅读。",
                problem: "需要在不同站点与 SPA 路由下稳定注入，同时控制权限与外部请求成本，并在 AI 不稳定时保持可用。",
                solution: "按 extensions/scripts/web 分项目隔离；SPA 注入采用 History API 补丁 + turbo/pjax 监听 + MutationObserver；术语识别下沉至 Web Worker 并用 CSS Custom Highlight API 高亮；AI 识别设置超时与失败回退；书签整理使用 Trie + 并发/限速/重试治理。",
                result: "术语侧边栏覆盖 2,290 条双语词条；脚本增强提供 6 项功能开关并控制缓存 24h；广告清理覆盖 8 个邮箱入口并具备规则库；书签整理并发/限速参数稳定可控。",
                techStack: ["JavaScript", "Chrome Extension", "Tampermonkey", "Web Worker", "MutationObserver", "Trie", "CSS Custom Highlight API", "AI API"],
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
            tech: ["Python", "Quart", "Asyncio", "Electron", "ChromaDB"],
            techTags: ["Quart", "Asyncio", "Electron", "SQLite", "RAG", "SSE", "LLM APIs"],
            summary: "基于 wxauto 的微信 PC 自动化 AI 助手，集成 LLM + RAG 长期记忆与 Electron 控制台，异步架构支持实时日志与配置管理。",
            impact: "异步架构 + RAG 记忆",
            details: [
                "【异步解耦】基于 Quart + Asyncio，使用 `asyncio.to_thread` 将阻塞 I/O 迁出主循环，SSE 推送实时状态",
                "【RAG 记忆】SQLite + ChromaDB 构建分层记忆（短期/长期/事实），支持语义检索与上下文增强",
                "【日志性能】`deque(maxlen=N)` 流式读取大日志文件，内存占用 <10MB，读取延迟 10ms 级",
                "【多模态优化】Pillow 压缩 + Context Trimming + `lru_cache`，Token 成本降低 40%，图片上传成功率 99%+"
            ],
            keyOutcomes: ["API 吞吐量提升 5x+", "日志读取稳定 10ms 级", "Token 成本降低 40%"],
            audienceTags: ["hr", "jobSeeker", "partner", "client"],
            businessValue: {
                zh: "提高自动化助手稳定性并显著降低模型调用成本。",
                en: "Improves assistant reliability while significantly lowering model cost."
            },
            engineeringDepth: {
                zh: "体现异步架构改造、I/O 解耦与多模态成本治理。",
                en: "Demonstrates async architecture migration and multimodal cost governance."
            },
            verification: [
                {
                    sourceType: "repo",
                    sourceLabel: "wechat-bot 提交记录与文档",
                    sourceUrl: "https://github.com/icefunicu/wechat-bot",
                    verifiedAt: "2026-02-10",
                    confidence: "high",
                    level: "strict"
                }
            ],
            expandedDetails: {
                background: "微信自动化机器人需要长期稳定运行，涉及消息轮询、模型调用、日志管理与多模态输入。",
                problem: "阻塞 I/O 与大日志读取拖慢响应；多模态 Token 成本高且图片限制影响可用性。",
                solution: "引入 Quart 异步架构，阻塞 I/O 使用 `asyncio.to_thread` 卸载；日志读取采用 `deque(maxlen=N)`；多模态引入 Pillow 压缩、Context Trimming 与缓存策略。",
                result: "API 吞吐量提升 5x+，日志读取内存 <10MB 且延迟 10ms 级，Token 成本降低 40%。",
                role: "独立开发者",
                techStack: ["Python", "Quart", "Asyncio", "Electron", "SQLite", "ChromaDB", "OpenAI API", "Tenacity", "wxauto"],
                links: [{ label: "GitHub", url: "https://github.com/icefunicu/wechat-bot" }]
            },
            highlighted: true
        },
        {
            id: "proj-lexue",
            year: "2024",
            name: "乐学网",
            tech: ["Spring Boot", "Redis", "Spring Security"],
            techTags: ["Spring Boot", "Redis", "Spring Security", "Vue.js"],
            summary: "全栈教育平台，支持在线课程、视频播放、微信支付等完整功能。",
            impact: "校内应用",
            details: [
                "【缓存架构】采用 Redis 缓存高频数据，保障数据一致性",
                "【网关设计】Gateway + Redis 实现统一鉴权与分布式会话共享",
                "【实时排行】基于 Redis Zset 实现实时排行榜",
                "【云服务】集成微信支付、阿里云短信、OSS 对象存储"
            ],
            keyOutcomes: ["支持视频点播", "支付功能上线"],
            audienceTags: ["jobSeeker", "partner", "client"],
            businessValue: {
                zh: "提供课程、支付、内容服务一体化能力，支撑校内业务运营。",
                en: "Delivers integrated learning, payment, and content workflows for campus usage."
            },
            engineeringDepth: {
                zh: "体现鉴权网关、缓存一致性与业务模块化设计。",
                en: "Shows gateway auth, cache consistency, and modular service design."
            },
            verification: [
                {
                    sourceType: "manual",
                    sourceLabel: "项目交付与上线记录",
                    verifiedAt: "2026-02-10",
                    confidence: "medium",
                    level: "strict"
                }
            ],
            expandedDetails: {
                background: "校园内缺乏一个集课程点播、直播、互动于一体的综合性学习平台。",
                problem: "现有平台功能单一，无法满足学生多样化的学习需求，且并发性能较差。",
                solution: "构建基于微服务思想的单体架构（模块化），引入 Redis 缓存热点数据，对接云服务提升可靠性。",
                result: "上线后成为校内学习平台之一，稳定运行。",
                role: "全栈开发者",
                techStack: ["Spring Boot", "Redis", "Vue.js", "MySQL"]
            },
            highlighted: true
        },
        {
            id: "proj-cloudpan",
            year: "2024.01 - 2024.02",
            name: "EasyCloudPan（仿百度网盘）",
            link: "https://github.com/icefunicu/easyCloudPan",
            demoLink: "",
            tech: ["Spring Boot", "Vue.js", "Redis", "FFmpeg", "MySQL"],
            techTags: ["Spring Boot", "MyBatis", "MySQL", "Redis", "Vue 3", "Vite", "FFmpeg", "HLS"],
            summary: "全栈网盘系统，支持大文件分片上传、MD5 秒传去重、异步视频转码与分享/回收站完整生命周期。",
            impact: "文件服务与流媒体链路工程化",
            details: [
                "【分片上传 + 秒传】前端 `SparkMD5` + 5MB 分片，后端按分片落盘并在 `union()` 合并；基于 `idx_md5` 实现重复文件秒传。",
                "【异步转码】`uploadFile` 中通过 `afterCommit` 触发 `@Async transferFile`，集成 FFmpeg 生成缩略图与 HLS 切片，避免上传请求阻塞。",
                "【统一鉴权校验】`@GlobalInterceptor` + `@VerifyParam` + AOP 切面集中处理登录/管理员权限与参数校验，减少 Controller 重复逻辑。",
                "【缓存与配额】Redis 分层缓存系统配置、用户空间与分片临时大小，上传阶段可实时预判并阻断超额写入。",
                "【分享与回收站】支持提取码与有效期分享、匿名访问、转存、回收站恢复/彻底删除等完整状态流转。"
            ],
            keyOutcomes: [
                "支持 GB 级文件断点续传与 MD5 秒传去重（代码路径可复核）",
                "上传与转码解耦：事务提交后异步处理视频切片与状态流转",
                "数据库索引覆盖高频场景（含 `idx_md5`、`idx_del_flag`、`idx_recovery_time`）"
            ],
            audienceTags: ["hr", "jobSeeker", "partner", "client"],
            businessValue: {
                zh: "把上传、转码、分享、回收站等高频网盘能力打通为可维护闭环，提升文件服务可用性与可扩展性。",
                en: "Delivers an end-to-end, maintainable file-service workflow from upload and transcoding to sharing and recovery."
            },
            engineeringDepth: {
                zh: "覆盖分片上传、事务后异步任务、AOP 权限校验、Redis 配额治理与分享生命周期建模。",
                en: "Covers chunked uploads, post-commit async jobs, AOP-based guards, Redis quota control, and share lifecycle modeling."
            },
            verification: [
                {
                    sourceType: "repo",
                    sourceLabel: "easyCloudPan 仓库与 STAR_REPO_HIGHLIGHTS 文档",
                    sourceUrl: "https://github.com/icefunicu/easyCloudPan",
                    verifiedAt: "2026-02-10",
                    confidence: "high",
                    level: "strict"
                }
            ],
            expandedDetails: {
                background: "针对大文件上传、在线预览与分享协作的个人云盘场景，目标是做出接近商用网盘体验的可运行系统。",
                problem: "传统单请求上传在大文件场景不稳定，重复上传浪费带宽；视频播放兼容性与转码耗时会拖慢响应；权限校验与参数校验在多接口场景下容易重复且遗漏。",
                solution: "前端采用 SparkMD5 + 分片上传，后端 `uploadFile` 落盘并在 `union()` 合并分片，结合 `idx_md5` 实现秒传；通过 `TransactionSynchronizationManager.afterCommit` 触发 `@Async transferFile`，用 FFmpeg 生成缩略图与 HLS 切片；以 `@GlobalInterceptor`/`@VerifyParam` + AOP 统一处理鉴权与参数校验；Redis 管理用户空间、临时分片体积与系统配置缓存。",
                result: "形成上传、去重、转码、分享、回收站的完整链路，核心能力可通过仓库代码与数据库索引直接复核。",
                role: "全栈开发（后端、前端、数据库与工程化）",
                techStack: ["Spring Boot", "MyBatis", "MySQL", "Redis", "Vue 3", "Vite", "FFmpeg", "HLS"],
                links: [{ label: "GitHub", url: "https://github.com/icefunicu/easyCloudPan" }]
            },
            highlighted: true
        },
        {
            id: "proj-jzt-shuttle-path",
            year: "2023",
            name: "九州通四向穿梭车路径规划系统",
            tech: ["Python", "A*", "CBS", "PyQt5", "multiprocessing"],
            techTags: ["Python", "A* 路径规划", "CBS 冲突搜索", "PyQt5", "ThreadPoolExecutor", "multiprocessing", "并发调度"],
            summary: "面向医药物流仓储的四向穿梭车路径规划原型，覆盖单车寻路、多车并发、冲突检测/消解与可视化调试。",
            impact: "仓储自动化算法原型",
            details: [
                "【A* 引擎】实现 `A_Search`（open/close 管理、F/G/H 评估、曼哈顿启发），并用 `yield` 将搜索过程可视化逐步回放。",
                "【业务规则建模】在 `getAroundPoint` 中区分空车/载货通行规则；地图支持道路、墙壁、无货货架、有货货架四类地形。",
                "【多车并发】通过 `Vehicle` 封装车辆搜索任务，实验 `ThreadPoolExecutor` 与 `multiprocessing.Pool` 两种并发方案。",
                "【冲突消解】实现 `has_conflict()` 节点冲突检测，并在优先级策略中通过插入等待动作进行时间同步避让。",
                "【可视化调试】基于 PyQt5 `QMainWindow` + `QBasicTimer` 绘制 open/close/path，支持地图编辑与回放。"
            ],
            keyOutcomes: [
                "在 27x42（1134 格）仓储地图上完成路径搜索与可视化验证",
                "完成双车路径规划与路径区分展示，验证多车协同流程",
                "实现冲突检测与等待避让机制；并发加速收益为定性推断（待压测补充）"
            ],
            audienceTags: ["hr", "jobSeeker", "partner"],
            businessValue: {
                zh: "把仓储调度从人工经验迁移到可复用算法原型，为后续自动化调度系统提供验证基础。",
                en: "Moves warehouse dispatching from manual heuristics to a reusable algorithmic prototype for future automation."
            },
            engineeringDepth: {
                zh: "体现 A* 路径规划、并发任务编排、冲突消解策略与 GUI 可视化调试工具链整合。",
                en: "Demonstrates integration of A* planning, concurrent task orchestration, conflict resolution, and GUI-based debugging."
            },
            verification: [
                {
                    sourceType: "repo",
                    sourceLabel: "本地项目文档 STAR_REPO_STAR.md 与 A-star 代码目录",
                    verifiedAt: "2026-02-10",
                    confidence: "medium",
                    level: "strict",
                    confidenceBasis: [
                        "可在本地目录复核 A_Search、Vehicle、has_conflict 等实现",
                        "map.txt 可解析为 27x42 共 1134 格地图",
                        "当前缺少公开仓库链接与压测报告"
                    ],
                    confidenceReason: "判定为中置信度：核心算法与结构可在本地代码复核，但缺少公开链接与量化压测结果。"
                }
            ],
            expandedDetails: {
                background: "医药物流四向穿梭车在高密度货架环境中需要自动规划路径，并通过可视化手段提升调试与演示效率。",
                problem: "单车寻路、多车并发和冲突避让需要统一建模；同时要支持载货与空车的差异化通行规则，且能在图形界面中复盘算法过程。",
                solution: "基于 Python 实现 A* 搜索核心（A_Search、F_Min、getAroundPoint、process/yield），在 PyQt5 中构建 GameBoard 可视化；引入 Vehicle 封装多车任务并实验线程池/进程池并发搜索；通过 has_conflict 与优先级等待策略处理多车同节点冲突。",
                result: "完成仓储地图（27x42）上的路径规划、双车协同与冲突消解原型验证；性能提升幅度目前为工程定性推断，待补充压测量化结果。",
                role: "项目经理 / 算法研发与系统原型开发",
                techStack: ["Python", "A*", "CBS", "PyQt5", "ThreadPoolExecutor", "multiprocessing"]
            },
            highlighted: false
        }
    ],

    skills: [
        {
            id: "skill-backend",
            category: "后端开发",
            description: "Java/Spring、Python/Flask/Django、API 设计、鉴权、性能优化、稳定性",
            items: ["Java", "Spring Boot", "MyBatis Plus", "Spring Cloud", "Python", "Flask", "Django"]
        },
        {
            id: "skill-data",
            category: "数据存储",
            description: "MySQL、Redis、ClickHouse、ES、数据迁移与建模",
            items: ["MySQL", "Redis", "ClickHouse", "Elasticsearch"]
        },
        {
            id: "skill-ai",
            category: "AI 工程化",
            description: "主流 LLM API 集成、工具调用、Prompt 工程、成本优化",
            items: ["OpenAI/Claude/Gemini", "Function Calling", "Prompt Engineering", "AI Bot 开发"]
        },
        {
            id: "skill-devops",
            category: "工程 & 运维",
            description: "CI/CD、容器化、Linux、Git、可观测性",
            items: ["Docker", "Linux", "Git", "Maven", "Nginx", "CI/CD"]
        },
        {
            id: "skill-frontend",
            category: "前端 & 全栈",
            description: "Vue.js、Next.js、TailwindCSS、响应式设计",
            items: ["Vue.js", "Next.js", "TypeScript", "TailwindCSS"]
        }
    ],

    services: [
        {
            id: "svc-fullstack",
            title: "全栈应用开发",
            description: "从高性能后端架构到流畅的前端交互，构建企业级 Web 应用。擅长 Spring Boot + React/Next.js 技术栈，确保高可用与安全性。",
            icon: "Layout",
            techStack: ["React/Next.js", "Spring Boot", "PostgreSQL"],
            gradient: "from-blue-500/10 to-cyan-500/10",
            milestones: ["需求澄清", "技术方案", "里程碑交付", "联调验收"]
        },
        {
            id: "svc-ai-integration",
            title: "AI 工程化落地",
            description: "将 LLM 能力（GPT-4/Claude）集成到现有业务流中。提供 RAG 知识库搭建、Agent 智能代理开发及 Prompt 优化服务。",
            icon: "Bot",
            techStack: ["LangChain", "LLM APIs", "RAG", "Vector DB"],
            gradient: "from-sky-500/10 to-cyan-500/10",
            milestones: ["场景梳理", "PoC 验证", "成本评估", "灰度上线"]
        },
        {
            id: "svc-performance",
            title: "性能优化与重构",
            description: "诊断并解决系统瓶颈。包括 SQL 慢查询治理、接口响应提速、JVM 调优及高并发场景下的架构改进。",
            icon: "Zap",
            techStack: ["MySQL Tuning", "Redis", "System Design"],
            gradient: "from-amber-500/10 to-orange-500/10",
            milestones: ["基线采样", "瓶颈定位", "方案实施", "压测复核"]
        },
        {
            id: "svc-automation",
            title: "自动化与数据处理",
            description: "构建自动化脚本与数据管道，提升业务效率。包含爬虫数据采集、ETL 数据清洗及各类办公流程自动化。",
            icon: "Workflow",
            techStack: ["Python", "Pandas", "Automation", "ETL"],
            gradient: "from-emerald-500/10 to-teal-500/10",
            milestones: ["流程评估", "自动化设计", "试运行", "稳定运维"]
        }
    ],

    vibeCoding: {
        title: "Vibe Coding · AI 原生开发者",
        description: "以 AI 作为工程杠杆，常用 Codex、Cursor、Windsurf、Claude、ChatGPT、Gemini 等工具贯穿需求澄清、架构设计、编码、测试与优化全流程。擅长在 Java/Python 后端、Vue/React 前端与自动化脚本场景中快速交付可维护代码，并通过评审、测试与指标追踪控制质量与成本。"
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
