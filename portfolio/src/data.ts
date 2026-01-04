import { PortfolioData } from './types';

// ==========================================
// 编辑模式开关
// true: 启用可视化编辑模式
// false: 普通静态展示模式
// ==========================================
export const ENABLE_EDITING = false;

// ==========================================
// Portfolio 数据
// ==========================================
export const portfolioData: PortfolioData = {
    hero: {
        title: "杜旭嘉",
        subtitle: "全栈工程师 · AI 原生开发者 · 用代码与智能重新定义可能"
    },
    about: "2025届计算机专业毕业生，专注于后端架构与 AI 应用开发。曾服务于中国联通、国家骨科临床研究中心、中软国际等机构，深度参与核心系统研发。擅长 Vibe Coding —— 以 AI 为核心驱动力，快速交付跨技术栈的高质量产品。从后端到前端，从传统架构到 AI 集成，皆可独立完成。",
    timeline: [
        {
            year: "2025.12 - 2026.01",
            role: "独立开发者",
            company: "个人项目 · WeChat AI Bot",
            summary: "打造基于大模型的微信智能助手，实现消息自动化与个性化AI回复。",
            details: [
                "【产品】独立开发 WeChat AI Bot，基于 Python + wxauto 实现微信 PC 端自动化",
                "【AI集成】对接 OpenAI/Claude/Gemini 等主流大模型 API，实现智能对话与个性化回复",
                "【自动化】构建实时消息轮询机制，支持后台静默运行与智能自动回复",
                "【开源】项目开源于 GitHub，展现 AI 工程化落地能力"
            ]
        },
        {
            year: "2025.11 - 2025.12",
            role: "外包技术顾问",
            company: "南方科技大学 · IPA Demo",
            summary: "为南方科技大学独立交付智能流程自动化原型系统，验证核心技术可行性。",
            details: [
                "【项目】独立承接南方科技大学研究项目，完成 IPA (Intelligent Process Automation) 系统原型开发",
                "【架构】设计并实现端到端的智能流程自动化方案，打通数据采集、处理、可视化全链路",
                "【交付】从需求沟通到最终交付全程独立负责，按期高质量完成验收"
            ]
        },
        {
            year: "2025.04 - 2025.09",
            role: "技术工程师",
            company: "中软国际",
            summary: "参与企业级系统开发与交付，深度实践敏捷开发与 DevOps 流程。",
            details: [
                "【系统研发】参与多个企业级项目的后端模块开发，负责核心业务逻辑实现与接口设计",
                "【性能优化】主导 SQL 慢查询优化与接口性能调优，将关键接口响应时间优化 60%+",
                "【DevOps】参与 CI/CD 流水线建设，实现代码自动化构建、测试与部署",
                "【协作】与跨部门团队紧密协作，积累大型项目管理与敏捷开发实战经验"
            ]
        },
        {
            year: "2024.08 - 2024.10",
            role: "后端开发实习生",
            company: "国家骨科临床研究中心",
            summary: "主导医学论文智能检索小程序后端架构，为顶尖医学专家提供 AI 驱动的科研工具。",
            details: [
                "【产品】构建 Submet 医学论文检索小程序，服务国内医学领域专家群体",
                "【AI集成】深度整合 AI 搜索引擎，将论文检索与辨别的时间成本大幅缩减",
                "【订阅系统】打造个性化推送服务，为专家定期推送感兴趣方向的前沿期刊论文"
            ]
        },
        {
            year: "2024.05 - 2024.08",
            role: "后端开发实习生",
            company: "中国联通陕西省分公司 · 数字化部",
            summary: "核心参与运营平台与数据中台建设，实现接口性能 5 倍提升，完成百万级数据迁移架构设计。",
            details: [
                "【性能优化】将活动查询接口响应时间从 20s+ 优化至 4s，提升 5 倍性能",
                "【数据架构】完成 300+ 张百万级数据表的同步迁移，采用 ClickHouse 替代 MySQL，实现毫秒级查询",
                "【安全加固】设计并实现对外 API 二次授权认证机制，完成前后端请求加解密优化",
                "【数据中台】整合陕西省及各地市数千万条空间资源与无线设备数据，运用 xxl-job 实现汇总库每日动态更新"
            ]
        },
        {
            year: "2021.09 - 2025.06",
            role: "数据科学与大数据技术",
            company: "南阳理工学院",
            summary: "GPA 3.8/4.5，多次获得校级荣誉，参与校地合作项目完成小程序交付。",
            details: [
                "【学业】GPA 3.8/4.5，获校级三好学生、优秀学生干部、院级奖学金等多项荣誉",
                "【竞赛】省级首届程序设计大赛优秀奖",
                "【实践】参与学校及当地政府网站维护工作，在校地合作项目中完成小程序开发与交付"
            ]
        }
    ],
    projects: [
        {
            year: "2025",
            name: "WeChat AI Bot",
            link: "https://github.com/icefunicu/wechat-bot",
            tech: ["Python", "wxauto", "OpenAI API", "Claude API", "Gemini API"],
            summary: "基于大模型的微信智能助手，实现消息自动化与个性化 AI 回复。",
            details: [
                "【自动化】基于 wxauto 实现微信 PC 端消息自动监控与回复",
                "【多模型】支持 OpenAI、Claude、Gemini 等多种大模型 API 一键切换",
                "【个性化】可针对不同联系人配置独立的 AI 人设与回复风格",
                "【开源】项目完整开源，展现 AI 工程化实战能力"
            ]
        },
        {
            year: "2024",
            name: "乐学网",
            tech: ["Spring Boot", "MySQL", "Redis", "Spring Security", "JWT", "Nginx"],
            summary: "全栈教育平台，支持在线课程、视频播放、微信支付、动态权限管理等完整功能。",
            details: [
                "【缓存架构】采用 Redis 缓存高频数据，配合主动更新+超时剔除策略保障数据一致性",
                "【网关设计】Gateway + Redis 实现统一鉴权与分布式会话共享，集成全局异常处理",
                "【实时排行】基于 Redis Zset 实现实时排行榜，解决传统数据库高频交互瓶颈",
                "【云服务】集成微信支付、阿里云短信、OSS 对象存储、视频点播等核心能力"
            ]
        },
        {
            year: "2024",
            name: "个人云盘",
            link: "https://github.com/icefunicu/easyCloudPan",
            tech: ["Spring Boot", "Spring Security", "Spring Data JPA", "Vue.js", "MySQL", "Redis", "FFmpeg"],
            summary: "仿百度网盘 Web 端，支持文件秒传、视频转码、分享链接等核心功能。已获 3 Stars。",
            details: [
                "【极速秒传】基于 MD5 生成唯一文件 ID，实现文件秒传功能",
                "【视频处理】集成 FFmpeg 实现视频索引生成、切片、缩略图生成及异步转码",
                "【缓存优化】Redis 存储高频链接与分享码，使用布隆过滤器解决缓存穿透问题",
                "【社交登录】接入 QQ 邮箱 SMTP 服务与 QQ 登录 API，提供多元化登录方式"
            ]
        },
        {
            year: "2023",
            name: "智能基金管理系统",
            link: "https://github.com/icefunicu/ry-fund",
            tech: ["Spring Boot", "Vue.js", "RuoYi Framework", "MySQL"],
            summary: "基于若依框架的企业级基金管理系统，展现模块化后端架构能力。",
            details: [
                "【架构】采用 RuoYi 企业级框架，模块化拆分 admin/framework/system 层",
                "【功能】支持个人基金追踪、数据统计、报表导出等完整功能",
                "【工程化】展现专业级后端组织能力与企业开发规范理解"
            ]
        }
    ],
    skills: [
        {
            category: "后端核心",
            items: ["Java", "Spring Boot", "MyBatis Plus", "Spring Security", "Spring Cloud", "Python"]
        },
        {
            category: "数据存储",
            items: ["MySQL", "Redis", "ClickHouse", "Elasticsearch"]
        },
        {
            category: "分布式",
            items: ["Nacos", "Gateway", "Ribbon", "RabbitMQ", "分布式锁"]
        },
        {
            category: "前端",
            items: ["Vue.js", "JavaScript", "HTML/CSS", "响应式设计"]
        },
        {
            category: "DevOps",
            items: ["Docker", "Linux", "Git", "Maven", "Nginx", "CI/CD"]
        },
        {
            category: "AI 工程 · Vibe Coding",
            items: ["Claude API", "ChatGPT API", "Gemini API", "Cursor", "Windsurf", "AI 辅助全栈开发"]
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
        website: "https://netxx.cn"
    }
};
