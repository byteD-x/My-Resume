import { PortfolioData } from './types';

// ==========================================
// 默认内容 JSON（用于 reset）
// ==========================================
export const defaultPortfolioData: PortfolioData = {
    hero: {
        name: "杜旭嘉",
        title: "后端工程师",
        subtitle: "主投：后端开发 ｜ 兼任：AI 工程 / 全栈 ｜ 远程办公 (优先) ｜ Base：深圳 (可到岗：南京/杭州/成都)",
        location: "远程办公 (优先) ｜ Base：深圳 ｜ 可到岗：南京 / 杭州 / 成都",
        bullets: [
            {
                id: "bullet-1",
                title: "高并发/高可用",
                description: "SQL 慢查询治理 (20s→4s)、接口延迟降低 60%+"
            },
            {
                id: "bullet-2",
                title: "数据密集型架构",
                description: "MySQL/Redis/ClickHouse 百万级数据迁移与查询优化"
            },
            {
                id: "bullet-3",
                title: "AI 工程化落地",
                description: "LLM API 集成与工具调用，从 Demo 到生产环境交付"
            }
        ],
        quickFacts: {
            role: "主投：后端 ｜ 兼任：AI / 全栈",
            availability: "可立即入职 ｜ 擅长 AI 落地",
            techStack: ["Java", "Spring Boot", "Python", "MySQL", "Redis", "LLM APIs"]
        }
    },

    about: "2025届计算机专业毕业生，专注于后端架构与 AI 应用开发。AI 原生开发践行者，擅长使用 Cursor/Windsurf 等工具极速交付高质量全栈应用。从复杂后端架构到精美前端交互，皆可独立完成。",

    impact: [
        {
            id: "impact-1",
            title: "开源项目",
            value: "100+",
            label: "Star 数",
            description: "WeChat Bot 开源项目 (Async / Quart 重构)",
            linkedExperienceId: "exp-wechat-bot",
            icon: "Star",
            colSpan: "md:col-span-1",
            bg: "bg-indigo-50",
            githubRepo: "icefunicu/wechat-bot"
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
            bg: "bg-blue-50"
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
            bg: "bg-rose-50"
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
            isFocal: true
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
            bg: "bg-emerald-50"
        }
    ],

    timeline: [
        {
            id: "exp-wechat-bot",
            year: "2025.12 - 至今",
            role: "独立开发者",
            company: "WeChat AI Bot",
            location: "开源项目",
            summary: "基于大模型的微信智能助手，V2.0 重构为异步架构 (Quart)，实现全链路非阻塞与可视化管理。",
            techTags: ["Python", "Quart", "Asyncio", "React", "SSE"],
            highlighted: true,
            keyOutcomes: ["架构重构 (Flask → Quart)", "全链路异步 I/O", "100+ Stars"],
            expandedDetails: {
                background: "随着功能模块增加，原有的 Flask 同步架构在高并发场景下出现瓶颈，且缺乏友好的可视化管理界面。",
                problem: "多模型并发请求阻塞主线程，命令行配置繁琐且无法实时查看运行状态。",
                solution: "重构为基于 Quart 的异步架构，引入 BotManager 实现生命周期管理；开发 React 前端控制台，支持 Server-Sent Events (SSE) 实时日志流与动态配置。",
                result: "系统响应速度大幅提升，实现从单一脚本到现代化 AI Agent 平台的演进。",
                role: "独立开发者",
                techStack: ["Python", "Quart", "Asyncio", "React", "wxauto"],
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
            id: "exp-education",
            year: "2021.09 - 2025.06",
            role: "本科 · 数据科学与大数据技术",
            company: "南阳理工学院",
            location: "河南",
            summary: "GPA 3.8/4.5 (Top 5%)，多次获得校级荣誉，省级首届程序设计大赛优秀奖。",
            techTags: ["计算机科学", "大数据", "项目实践"],
            highlighted: false,
            keyOutcomes: ["GPA 3.8/4.5 (Top 5%)", "交付校地合作小程序"],
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
            id: "proj-wechat-bot",
            year: "2025",
            name: "WeChat AI Bot",
            link: "https://github.com/icefunicu/wechat-bot",
            demoLink: "",
            tech: ["Quart", "Asyncio", "React", "wxauto"],
            techTags: ["Quart", "Asyncio", "React", "SSE", "LLM APIs"],
            summary: "基于大模型的微信智能助手，V2.0 重构为异步架构，集成 Web 控制台实现配置热更新与实时日志监控。",
            impact: "架构重构 & 体验升级",
            details: [
                "【异步重构】从 Flask 迁移至 Quart，基于 Asyncio 实现全链路非阻塞 I/O，大幅提升并发处理能力",
                "【可视化】新增 React 管理后台，支持 Server-Sent Events (SSE) 实时日志流监控与多模型配置热更新",
                "【架构设计】设计 BotManager 生命周期管理器，解耦业务逻辑与底层驱动，提升系统稳定性与可维护性",
                "【自动化】基于 wxauto 实现微信消息监听与自动回复，支持 OpenAI/Claude/Gemini 多模型无缝切换"
            ],
            keyOutcomes: ["Flask 转 Quart", "实时日志监控", "异步事件驱动"],
            expandedDetails: {
                background: "项目初期使用 Flask 同步框架，在处理 LLM 长文本响应时会阻塞消息接收，且配置依赖配置文件，交互体验较差。",
                problem: "并发性能瓶颈、缺乏可视化监控、配置修改需重启。",
                solution: "采用 Quart 重写后端核心，利用 await 实现 LLM 流式调用不阻塞主线程；前端采用 React 构建 SPA，通过 API 动态管理 presets 配置。",
                result: "成功从脚本工具转型为现代化 AI 应用，显著降低了用户的配置门槛与系统延迟。",
                role: "独立开发者",
                techStack: ["Python", "Quart", "Asyncio", "React", "TailwindCSS"],
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
            year: "2024",
            name: "个人云盘",
            link: "https://github.com/icefunicu/easyCloudPan",
            demoLink: "",
            tech: ["Spring Boot", "Vue.js", "Redis", "FFmpeg"],
            techTags: ["Spring Boot", "Vue.js", "Redis", "FFmpeg"],
            summary: "仿百度网盘 Web 端，支持文件秒传、视频转码、分享链接。",
            impact: "个人项目",
            details: [
                "【极速秒传】基于 MD5 生成唯一文件 ID，实现文件秒传功能",
                "【视频处理】集成 FFmpeg 实现视频索引生成、切片及转码",
                "【缓存优化】Redis 存储高频链接与分享码",
                "【社交登录】提供多元化登录方式"
            ],
            keyOutcomes: ["实现文件秒传", "支持视频在线倍速播放"],
            expandedDetails: {
                background: "个人文件存储与分享在局域网/公网环境下需求大，但商业网盘限速严重。",
                problem: "自建网盘往往功能简陋，缺乏视频转码、断点续传等高级功能。",
                solution: "仿照商业网盘架构，实现基于 MD5 的秒传去重；后端集成 FFmpeg 自动转码视频以支持 HLS 播放。",
                result: "实现了核心网盘功能，作为个人作品集展示。",
                role: "独立开发者",
                techStack: ["Spring Boot", "Vue.js", "Redis", "FFmpeg", "MySQL"],
                links: [{ label: "GitHub", url: "https://github.com/icefunicu/easyCloudPan" }]
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
            gradient: "from-blue-500/10 to-indigo-500/10"
        },
        {
            id: "svc-ai-integration",
            title: "AI 工程化落地",
            description: "将 LLM 能力（GPT-4/Claude）集成到现有业务流中。提供 RAG 知识库搭建、Agent 智能代理开发及 Prompt 优化服务。",
            icon: "Bot",
            techStack: ["LangChain", "LLM APIs", "RAG", "Vector DB"],
            gradient: "from-purple-500/10 to-fuchsia-500/10"
        },
        {
            id: "svc-performance",
            title: "性能优化与重构",
            description: "诊断并解决系统瓶颈。包括 SQL 慢查询治理、接口响应提速、JVM 调优及高并发场景下的架构改进。",
            icon: "Zap",
            techStack: ["MySQL Tuning", "Redis", "System Design"],
            gradient: "from-amber-500/10 to-orange-500/10"
        },
        {
            id: "svc-automation",
            title: "自动化与数据处理",
            description: "构建自动化脚本与数据管道，提升业务效率。包含爬虫数据采集、ETL 数据清洗及各类办公流程自动化。",
            icon: "Workflow",
            techStack: ["Python", "Pandas", "Automation", "ETL"],
            gradient: "from-emerald-500/10 to-teal-500/10"
        }
    ],

    vibeCoding: {
        title: "Vibe Coding · AI 原生开发者",
        description: "熟练运用 AI 作为核心生产力工具，主要使用 Codex（GPT-5.2-codex）与 Antigravity （ Claude 与 Gemini3pro ），并灵活驾驭 Cursor、Windsurf、Claude、ChatGPT、Gemini 等主流 AI 工具进行全栈开发。从需求分析、架构设计、代码实现到调试优化，AI 贯穿开发全流程。无论是后端 Java/Python、前端 Vue/React，还是数据处理、自动化脚本，皆可通过 AI 辅助快速交付高质量代码。不设技术栈边界，以问题为导向，以 AI 为杠杆，极速实现产品落地。"
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
        ctaText: "开始合作"
    }
};
