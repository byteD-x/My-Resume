import { PortfolioData } from './types';

// ==========================================
// 默认内容 JSON（用于 reset）
// ==========================================
export const defaultPortfolioData: PortfolioData = {
    hero: {
        name: "杜旭嘉",
        title: "把系统做快做稳，把 AI 做到可上线。",
        subtitle: "后端 / 全栈 / AI 工程｜深圳/南京/西安/杭州/成都｜优先远程（也接受到岗/混合）",
        location: "深圳 / 南京 / 西安 / 杭州 / 成都 / 远程 (优先)",
        bullets: [
            {
                id: "bullet-1",
                title: "性能与稳定性",
                description: "SQL 慢查询治理、接口延迟优化、可观测与回归"
            },
            {
                id: "bullet-2",
                title: "数据链路",
                description: "MySQL/Redis/ES + ClickHouse 迁移与 OLAP 查询优化"
            },
            {
                id: "bullet-3",
                title: "AI 落地",
                description: "LLM API 集成、工具调用、Bot/搜索类应用快速交付"
            }
        ],
        quickFacts: {
            role: "后端 / 全栈 / AI 工程",
            availability: "可立即入职",
            techStack: ["Java", "Spring", "Python", "LLM API", "MySQL", "Redis"]
        }
    },

    about: "2025届计算机专业毕业生，专注于后端架构与 AI 应用开发。AI 原生开发践行者，擅长使用 Cursor/Windsurf 等工具极速交付高质量全栈应用。从复杂后端架构到精美前端交互，皆可独立完成。",

    impact: [
        {
            id: "impact-1",
            title: "开源项目",
            value: "Open",
            label: "Source",
            description: "WeChat AI Bot 开源项目",
            linkedExperienceId: "exp-wechat-bot",
            icon: "Star",
            colSpan: "md:col-span-1",
            bg: "bg-amber-50"
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
            value: "Stable",
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
            value: "AI Native",
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
            summary: "基于大模型的微信智能助手，实现消息自动化与个性化AI回复。",
            techTags: ["Python", "wxauto", "OpenAI", "Claude", "Gemini"],
            highlighted: true,
            keyOutcomes: ["开源获 100+ Stars", "落地 AI 工程化能力"],
            expandedDetails: {
                background: "微信作为国内最主流的即时通讯工具，缺乏官方的自动化与 AI 集成能力。",
                problem: "用户希望在微信中接入大模型能力，实现智能回复、消息总结等功能，但缺乏成熟的解决方案。",
                solution: "基于 Python + wxauto 实现微信 PC 端自动化，对接 OpenAI/Claude/Gemini 等主流大模型 API。",
                result: "项目开源于 GitHub 获得 100+ Stars，展现 AI 工程化落地能力。",
                role: "独立完成从需求分析、架构设计到代码实现的全流程。",
                techStack: ["Python", "wxauto", "OpenAI", "Claude", "Gemini"],
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
            tech: ["Python", "wxauto", "LLM APIs"],
            techTags: ["Python", "wxauto", "LLM APIs"],
            summary: "基于大模型的微信智能助手，实现消息自动化与个性化 AI 回复。",
            impact: "GitHub 开源项目",
            details: [
                "【自动化】基于 wxauto 实现微信 PC 端消息自动监控与回复",
                "【多模型】支持 OpenAI、Claude、Gemini 等多种大模型 API 一键切换",
                "【个性化】可针对不同联系人配置独立的 AI 人设与回复风格",
                "【开源】项目完整开源，展现 AI 工程化实战能力"
            ],
            keyOutcomes: ["开源项目", "活跃用户社区"],
            expandedDetails: {
                background: "微信生态封闭，缺乏官方 AI 接口，用户通过个人号接入 AI 需求强烈。",
                problem: "现有的个人号接入方案往往风险高（易封号）或配置复杂。",
                solution: "利用 wxauto 模拟 PC 端操作（非 hook 协议），安全稳定；封装多模型 API，提供统一的配置化接口。",
                result: "GitHub 开源项目，帮助开发者低成本接入 AI 助手。",
                role: "独立开发者",
                techStack: ["Python", "wxauto", "OpenAI API", "Claude API"],
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

    vibeCoding: {
        title: "Vibe Coding · AI 原生开发者",
        description: "熟练运用 AI 作为核心生产力工具，灵活驾驭 Cursor、Windsurf、Claude、ChatGPT、Gemini 等主流 AI 工具进行全栈开发。从需求分析、架构设计、代码实现到调试优化，AI 贯穿开发全流程。无论是后端 Java/Python、前端 Vue/React，还是数据处理、自动化脚本，皆可通过 AI 辅助快速交付高质量代码。不设技术栈边界，以问题为导向，以 AI 为杠杆，极速实现产品落地。"
    },

    contact: {
        phone: "15035925107",
        email: "2041487752dxj@gmail.com",
        github: "https://github.com/icefunicu",
        website: "https://my-resume-gray-five.vercel.app/",
        resumeButtonText: "下载简历 PDF",
        ctaText: "开始合作"
    }
};
