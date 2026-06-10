<style>
  :root {
    --resume-ink: #111827;
    --resume-muted: #4b5563;
    --resume-soft: #f6f8fb;
    --resume-line: #d8dee8;
    --resume-accent: #2563eb;
    --resume-accent-ink: #1d4ed8;
    --resume-accent-soft: #eef4ff;
    --resume-heading-ink: #0f172a;
    --resume-code: #1e40af;
    --resume-code-bg: rgba(37, 99, 235, 0.08);
    --resume-code-line: rgba(37, 99, 235, 0.15);
    --resume-table-line: #e6edf7;
    --resume-surface: #fbfdff;
    --resume-shadow: 0 20px 48px rgba(15, 23, 42, 0.08);
  }

  body,
  .markdown-body {
    max-width: 980px !important;
    margin: 0 auto !important;
    padding: 38px 52px 58px !important;
    color: var(--resume-ink);
    font-family:
      "Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", "Source Han Sans SC",
      sans-serif;
    font-size: 15.4px;
    line-height: 1.72;
    letter-spacing: 0.01em;
    font-kerning: normal;
    font-variant-numeric: tabular-nums;
    text-rendering: optimizeLegibility;
    background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
  }

  .resume-header {
    margin-bottom: 26px;
    padding-bottom: 18px;
    text-align: center;
    border-bottom: 1px solid var(--resume-line);
  }

  .resume-header h1 {
    margin: 0 0 8px;
    color: var(--resume-heading-ink);
    font-size: 35px;
    line-height: 1.08;
    font-weight: 800;
    letter-spacing: 0.03em;
  }

  .resume-title {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 32px;
    margin: 0;
    padding: 4px 14px;
    color: var(--resume-heading-ink);
    font-size: 15.2px;
    font-weight: 760;
    letter-spacing: 0.015em;
    background: linear-gradient(90deg, rgba(37, 99, 235, 0.08), rgba(37, 99, 235, 0.03));
    border: 1px solid rgba(37, 99, 235, 0.12);
    border-radius: 999px;
  }

  .resume-contact {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 820px;
    gap: 6px 14px;
    margin: 14px auto 0;
    color: var(--resume-muted);
    font-size: 13.2px;
  }

  .resume-contact a {
    color: var(--resume-accent-ink);
    font-weight: 650;
    text-decoration: none;
  }

  .resume-contact span {
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
  }

  .resume-intent {
    max-width: 760px;
    margin: 14px auto 0;
    padding-top: 10px;
    color: #1f2937;
    font-size: 13.6px;
    border-top: 1px dashed rgba(148, 163, 184, 0.5);
  }

  h2 {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 28px 0 14px;
    padding: 0 0 8px;
    color: var(--resume-heading-ink);
    font-size: 22px;
    line-height: 1.15;
    font-weight: 800;
    letter-spacing: 0.01em;
    border-bottom: 1px solid var(--resume-line);
  }

  h2::before {
    content: "";
    width: 5px;
    height: 1.05em;
    border-radius: 999px;
    background: var(--resume-accent);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  h3 {
    margin: 0;
    color: var(--resume-heading-ink);
    font-size: 18.6px;
    line-height: 1.3;
    font-weight: 800;
    text-wrap: balance;
  }

  h4 {
    margin: 14px 0 9px;
    padding: 7px 12px;
    color: #172033;
    font-size: 15.2px;
    line-height: 1.45;
    font-weight: 770;
    background: linear-gradient(90deg, rgba(37, 99, 235, 0.08), rgba(37, 99, 235, 0.03));
    border: 1px solid rgba(191, 219, 254, 0.92);
    border-left: 4px solid rgba(59, 130, 246, 0.72);
    border-radius: 8px;
  }

  p {
    margin: 8px 0;
  }

  ul {
    margin: 8px 0 14px;
    padding-left: 1.12em;
  }

  li {
    margin: 6px 0;
    padding-left: 4px;
  }

  li::marker {
    color: #3b82f6;
  }

  strong {
    color: var(--resume-heading-ink);
    font-weight: 800;
  }

  code {
    display: inline-block;
    padding: 0.08em 0.42em;
    color: var(--resume-code);
    font-family: inherit;
    font-size: 0.83em;
    font-weight: 700;
    letter-spacing: 0.01em;
    background: var(--resume-code-bg);
    border: 1px solid var(--resume-code-line);
    border-radius: 999px;
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
    white-space: nowrap;
  }

  a {
    color: var(--resume-accent-ink);
    font-weight: 650;
    text-underline-offset: 2px;
  }

  hr {
    margin: 20px 0;
    border: 0;
    border-top: 1px solid var(--resume-line);
  }

  table {
    width: 100%;
    margin: 10px 0 16px;
    color: #1f2937;
    font-size: 14px;
    line-height: 1.58;
    border-collapse: separate;
    border-spacing: 0;
    background: var(--resume-surface);
    border: 1px solid var(--resume-table-line);
    border-radius: 10px;
    overflow: hidden;
  }

  thead th {
    padding: 7px 10px;
    color: var(--resume-muted);
    font-size: 12.5px;
    font-weight: 750;
    text-align: left;
    background: #f6f9fe;
    border-bottom: 1px solid var(--resume-table-line);
  }

  tbody td {
    padding: 8px 10px;
    vertical-align: top;
    border-bottom: 1px solid var(--resume-table-line);
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }

  tbody td:first-child {
    width: 94px;
    color: #172033;
    font-weight: 800;
    white-space: nowrap;
    background: rgba(248, 250, 252, 0.75);
  }

  tbody td:last-child {
    overflow-wrap: anywhere;
  }

  .experience-heading {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 136px;
    align-items: end;
    gap: 14px;
    margin: 22px 0 9px;
  }

  .resume-date {
    display: block;
    color: var(--resume-muted);
    font-size: 13.4px;
    font-weight: 700;
    letter-spacing: 0.02em;
    text-align: right;
    white-space: nowrap;
  }

  @media screen {
    body {
      background:
        radial-gradient(circle at top, rgba(37, 99, 235, 0.08), transparent 30%),
        linear-gradient(90deg, rgba(37, 99, 235, 0.04), transparent 18%),
        #f6f8fc;
    }

    .markdown-body {
      box-shadow: var(--resume-shadow);
      border-radius: 24px;
    }
  }

  @media (max-width: 760px) {
    body,
    .markdown-body {
      padding: 28px 22px 40px !important;
      font-size: 15px;
    }

    .resume-header h1 {
      font-size: 30px;
    }

    .resume-title {
      min-height: 0;
      padding-inline: 12px;
      font-size: 14.3px;
    }

    .resume-contact {
      justify-content: flex-start;
    }

    .resume-intent {
      text-align: left;
    }

    .experience-heading {
      grid-template-columns: 1fr;
      gap: 6px;
    }

    .resume-date {
      text-align: left;
    }
  }

  @media print {
    @page {
      size: A4;
      margin: 11.8mm 12.6mm 12.4mm;
    }

    html,
    body,
    .markdown-body {
      width: auto !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 0 !important;
      background: #fff !important;
      color: #111827 !important;
      font-size: 9.35pt;
      line-height: 1.42;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .resume-header {
      margin-bottom: 10pt;
      padding-bottom: 8pt;
    }

    .resume-header h1 {
      font-size: 21.6pt;
    }

    .resume-title {
      min-height: 0;
      padding: 2.8pt 8.6pt;
      font-size: 10.2pt;
    }

    .resume-contact,
    .resume-intent {
      font-size: 8.65pt;
    }

    .resume-contact {
      max-width: none;
      gap: 3pt 10pt;
      margin-top: 10pt;
    }

    .resume-intent {
      margin-top: 8pt;
      padding-top: 6pt;
    }

    h2 {
      break-after: avoid-page;
      margin: 12pt 0 5pt;
      padding-bottom: 3.5pt;
      font-size: 13.8pt;
    }

    h3,
    h4,
    .experience-heading,
    table {
      break-after: avoid;
      page-break-after: avoid;
    }

    h3 {
      font-size: 10.4pt;
    }

    h4 {
      margin: 6.5pt 0 3.5pt;
      padding: 2.4pt 5.5pt;
      font-size: 9.35pt;
      border-left-width: 2.4pt;
      border-radius: 4pt;
    }

    p {
      margin: 3.5pt 0;
      orphans: 2;
      widows: 2;
    }

    ul {
      margin: 3pt 0 5.5pt;
      padding-left: 12pt;
    }

    li {
      break-inside: avoid;
      margin: 2.2pt 0;
      orphans: 2;
      widows: 2;
    }

    code {
      padding: 0.03em 0.32em;
      font-size: 0.84em;
      border-radius: 999pt;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    table {
      margin: 4pt 0 7pt;
      font-size: 8.55pt;
      line-height: 1.35;
      border-radius: 0;
    }

    thead th {
      padding: 2.8pt 4.4pt;
      font-size: 7.9pt;
    }

    tbody td {
      padding: 3.2pt 4.8pt;
    }

    tbody td:first-child {
      width: 50pt;
    }

    .experience-heading {
      grid-template-columns: minmax(0, 1fr) 92pt;
      gap: 8pt;
      margin: 11pt 0 5pt;
    }

    .resume-date {
      font-size: 8.7pt;
    }

    hr {
      margin: 10pt 0;
    }
  }
</style>

<!--
维护说明：
- 作品集网站的数据源以 src/data.ts 为准，简历投递版可按岗位拆分独立开发者父级项目。
- 技术亮点必须遵守 docs/content-evidence-policy.md：repo 证据用于工程实现，manual / experience 只校对事实骨架。
-->

<header class="resume-header">
  <h1>杜旭嘉</h1>
  <p class="resume-title">AI 应用工程师｜RAG / Agent / 后端工程化</p>
  <div class="resume-contact">
    <span>手机：15035925107</span>
    <span>邮箱：<a href="mailto:2041487752dxj@gmail.com">2041487752dxj@gmail.com</a></span>
    <span>城市：深圳 / 南京 / 杭州 / 成都</span>
    <span><a href="https://github.com/byteD-x">GitHub</a></span>
    <span><a href="https://www.byted.online/">国内作品集</a></span>
    <span><a href="https://my-resume-gray-five.vercel.app/">国际站</a></span>
  </div>
  <p class="resume-intent">求职方向：AI 应用工程师 / LLM 应用工程师 / 后端工程师（AI 工程方向）</p>
</header>

## 个人简介

主要做 `RAG`、`Agent Runtime`、业务后台和多端系统，习惯把 AI 能力接进真实业务流程，而不是只停在单接口问答。熟悉 `Python/FastAPI`、`Java/Spring Boot`、`React/Next.js`，能独立完成方案设计、核心开发、联调、测试和上线。

工程上更关注可追溯、可恢复、可回放和可验证：检索结果要能看到证据来源，异步任务失败后要能恢复，支付与设备回调要能幂等处理，关键路径要有测试和运行指标。

## 核心能力

- **AI 应用开发**：熟悉 `RAG`、`LangGraph`、工具调用、工作流编排、多通道接入和知识库治理，能把问答流程接到查询、提交、转人工等业务动作。
- **后端系统设计**：熟悉认证、支付、任务流、后台管理、数据迁移和性能治理，常用 `FastAPI`、`Spring Boot`、`PostgreSQL`、`Redis`、`ClickHouse`。
- **质量与发布**：习惯用 `pytest`、`Vitest`、`Playwright`、`lint/build`、健康检查、回归测试和回滚方案控制上线风险。
- **可验证结果**：在中国联通项目中将活动统计接口从 `20s+` 降到 `4s`，完成 `300+` 表、`3 亿+` 记录迁移，部分核心查询从 `10s+` 降到 `500ms`。

---

## 工作经历

<div class="experience-heading">
  <h3>独立开发者｜AI 应用 / 全栈项目</h3>
  <span class="resume-date">2025.12 - 至今</span>
</div>

#### RentBox 共享擦窗宝小程序｜Spring Boot / React / uni-app

- 面对租赁流程中支付、免押、取机、归还和设备回调并发到达的问题，设计订单状态机与生命周期服务，用 `FOR UPDATE` 锁、状态历史和审计日志处理支付成功、免押授权、取机、租赁中、异常、归还等状态流转。
- 接入微信支付 v3、微信支付分免押和柜机厂商 WebAPI，将支付单复用、回调 `processed_flag` 去重、金额不一致人工台账、设备指令记录和厂商开门/测物回调串联到同一条订单流程。
- 针对支付、退款、免押、设备重复事件和定时任务并发，加入 `Redis / JDBC` 幂等、分布式锁和回调回放入口，并为订单、支付、设备、免押、锁等模块编写测试，降低重复扣款、错发开锁和状态乱序风险。

#### 论文检索任务平台｜FastAPI / React / PostgreSQL

- 在甲方 Worker 只能读写共享 `tasks` 表的边界下，负责用户侧任务系统；设计任务创建、状态同步、结果下载和额度扣减流程，用 `PostgreSQL LISTEN/NOTIFY`、`SSE keep-alive` 和降级轮询把异步检索进度推给前端。
- 为 Worker 状态写入设计数据库契约，在 Alembic 迁移中加入 `check constraint` 和 `trigger`，限制终态回退、成功任务缺少 `result_count`、终态缺少 `finished_at` 等脏数据。
- 实现免费/Pro 权限、活动任务占用剩余额度、成功后扣减和支付宝回调验签；通过 `SELECT ... FOR UPDATE`、唯一额度事件、`app_id / seller / amount` 校验处理并发扣减和重复回调，并用 `pytest / Vitest / Playwright` 验证关键路径。

#### 智能客服运行时｜Agent Runtime / FastAPI

- 面向企业客服同时处理知识问答、业务查询、语音/RTC 和转人工的场景，设计 6 层 Runtime：渠道接入、宿主桥接、核心引擎、业务增强、插件平台、模型提供商适配。
- 实现基于 `intent_stack`、`page_context`、`business_objects` 和置信度分层的路由策略；在订单详情等上下文中优先走业务工具，连续低置信对话转入澄清或人工处理。
- 设计 `PluginRegistry` 与 7 类扩展点，覆盖路由、业务工具、人工转接、行业适配、宿主鉴权、上下文增强和响应后处理；补齐 provider billing / usage 对账、安全知识缓存、8 个本地 RAG eval cases、SQLite 人工接管队列与外部 readiness 审计，用路由、插件、鉴权和运行时测试保护关键行为。

#### 微信智能助手｜LangGraph / Electron / RAG

- 面对桌面微信自动化不稳定、回复不能长时间阻塞的问题，抽象 `BaseTransport` 接入层，并用 `LangGraph` 把前台回复路径与后台成长任务分离，按回复预算控制同步路径。
- 构建 SQLite 短期记忆、Chroma 向量记忆和导出聊天记录 RAG；后台批处理负责情绪、联系人画像、向量记忆、事实抽取和导出语料同步，避免把长期记忆计算压到用户回复路径上。
- 开发 `/api/status`、`/api/readiness`、`/api/metrics`、配置审计、知识库治理、成本分析、模型认证中心、受控 Tool Workflow、只读 MCP adapter、备份恢复、发布更新和 27 条离线 eval；敏感关键词、静默时段、群聊白名单和新联系人策略进入人工审批队列，降低误发消息和凭据配置风险。

<div class="experience-heading">
  <h3>中软国际｜企业知识库 RAG / Agent 工作台｜后端 / 全栈工程师</h3>
  <span class="resume-date">2025.04 - 2025.09</span>
</div>

- 企业知识库问答需要同时给出答案、证据和检索诊断；设计结构检索、全文检索、向量检索 3 路召回，结合 `query rewrite`、加权 `RRF` 和 `rerank`，返回 `citations`、`grounding_score`、`trace_id` 与候选来源。
- 将 Gateway 问答流程迁移到 `LangGraph` 可恢复运行时，使用 `checkpoint`、`interrupt/resume`、人工确认和 `step_events` 记录执行过程，并扩展工具注册中心、任务拆解 DAG、反思闭环与三层记忆。
- 建设 ingest 与知识库治理工作台，处理多知识库、多源连接器、本地目录、Notion、Web、飞书、钉钉和 SQL 数据源；补齐 batch dry-run/jobs、token-aware chunk、人工接管队列、五层指令合并、企业聊天 v2、场景模板、RAG 幻觉检测、三层语义缓存、模型健康熔断、Python SDK、readyz/trace 和 400+ 测试项回归检查。

<div class="experience-heading">
  <h3>国家骨科临床研究中心｜SubMed 医学论文检索小程序｜后端开发实习生</h3>
  <span class="resume-date">2024.08 - 2024.10</span>
</div>

- 面向医学专家检索 PubMed 文献、筛选高价值论文和持续跟踪研究主题的需求，参与 SubMed 小程序后端接口设计与小程序联调，覆盖检索、推荐、订阅、收藏、深度分析、下载和分享。
- 对接 `/api/articles/ai_search`、`/api/articles/ai_search_test`、`/api/deep_analysis`、`/api/recommend_paper`、`/api/favorite` 等接口，在论文详情页展示 DOI、IF、CAS、JCR、SCI、AI 关键词、相关推荐和 PDF 下载入口。
- 设计检索主题页、分页论文列表、订阅配置和推送历史页面；通过搜索历史、Topic 选择、订阅频率和推送状态管理，把一次性搜索改为可持续跟踪的科研信息流。

<div class="experience-heading">
  <h3>中国联通陕西省分公司｜触点赋能中心 / 陕西运营平台 / 数据中台｜后端开发实习生</h3>
  <span class="resume-date">2024.05 - 2024.08</span>
</div>

- **触点赋能中心**：改造对外 API 二次授权认证，并治理活动统计查询；通过 `OLTP / OLAP` 分离和 `ClickHouse` 聚合分析，将活动统计接口从 `20s+` 降到 `4s`。
- **陕西运营平台**：开发能力管理页面与后端逻辑，处理请求/响应加解密；维护陕西号码复通接口，并完成按模型扫描号码和自动开机的二次开发。
- **数据中台**：完成 `300+` 表、`3 亿+` 记录迁移和一致性校验，用 `xxl-job` 执行每日动态更新；重写聚合 SQL、增加覆盖索引和缓存后，部分核心查询从 `10s+` 降到 `500ms`，发布耗时从 `30 分钟` 降到 `5 分钟`。

---

## 精选项目

### RentBox 共享擦窗宝小程序｜Spring Boot / React / uni-app / MySQL / Redis

- 面对租赁业务中支付、免押授权、取机、归还、退款和设备事件异步到达的问题，设计 `OrderStateMachine` 与 `OrderLifecycleService`，用 `FOR UPDATE`、状态历史和审计日志管理订单状态迁移，避免晚到回调把订单改回旧状态。
- 接入微信支付 v3、微信支付分免押和柜机厂商 WebAPI；在 `OrderPaymentService`、`WechatPayScoreDepositFreeGateway`、`DepositFreeIntegrationCallbackController` 中处理支付单复用、金额校验、免押授权、解押和退款回调。
- 针对支付通知、退款通知、设备开门/测物回调和定时任务并发，使用 `RedisIdempotencyService`、JDBC 幂等记录、`processed_flag` 和回调重放入口，把重复扣款、重复开门、重复处理控制在服务层。
- 为订单、支付、设备指令、免押、锁和回调回放编写测试，核心风险点可通过本地用例复现；设备侧以 `DeviceCommandService` 记录命令下发、厂商响应和异常工单，便于排查真实柜机联调问题。

### 论文检索任务平台｜FastAPI / React / PostgreSQL / SQLAlchemy

- 在甲方 Worker 只能读写共享 `tasks` 表的边界下，负责用户侧任务系统，设计任务创建、状态同步、结果下载、额度扣减和支付回调模块，让前端不直接依赖 Worker 进程状态。
- 使用 PostgreSQL `LISTEN/NOTIFY` 驱动任务状态推送，后端提供单任务、多任务和全局活动任务 SSE；连接空闲时发送 keep-alive，通知缺失时回退到短轮询，前端异常时继续使用任务列表与状态查询。
- 通过 Alembic 迁移为 `tasks` 增加 `check constraint` 与触发器，限制终态回退、成功任务缺少 `result_count`、终态缺少 `finished_at`、结果数为负等脏数据，并通过 `pg_notify('task_status_changed', ...)` 通知后端监听器。
- 设计免费/Pro 额度模型和支付宝支付回调，使用 `SELECT ... FOR UPDATE`、唯一额度流水、`app_id / seller / amount` 校验处理并发扣减和重复通知；后端 `pytest`、前端 `Vitest` 与 `Playwright` 用例覆盖任务、支付、额度和 SSE 行为。

### 智能客服运行时｜FastAPI / Agent Runtime / WebSocket / Plugin System

- 面向企业客服同时接入文本、语音轮次、RTC 实时通话和人工接手的场景，设计 6 层 Runtime：渠道接入、宿主桥接、核心引擎、业务上下文、插件平台和模型/语音提供商适配。
- 在 `RoutingService` 与 `SessionService` 中维护 `intent_stack`，结合 `page_context`、`business_objects` 和置信度分层做路由决策；相同意图合并低置信计数，连续低置信或用户明确要求时转人工。
- 设计 `PluginRegistry` 和 7 类扩展点，包括路由策略、业务工具、人工接手、行业适配、鉴权桥、上下文补充和响应后处理；宿主系统可按优先级注册插件，而不是改 Runtime 主干代码。
- 在 `AuthBridgePlugin` 中统一 API Key、Session/Cookie、JWT/Bearer、Custom Token 与自定义 Header 桥接；补齐 provider billing / usage 对账、安全知识缓存、8 个本地 RAG eval cases、SQLite 人工接管队列和外部 readiness 审计，相关行为由路由、插件、鉴权和运行时测试固定。

### 微信智能助手｜Quart / Electron / LangGraph / ChromaDB

- 面向 Windows 微信自动化不稳定、回复路径不能长时间阻塞的场景，抽象 `BaseTransport` 接入层，将 WCFerry 适配与 Bot 主循环解耦，桌面端和 Web 控制台共用 Quart 后端状态。
- 使用 `LangGraph` 组织上下文加载、提示词构建、模型调用和回写，将前台回复与后台成长任务分开：前台按回复预算生成消息，后台再处理情绪、画像、事实抽取、向量记忆和导出聊天 RAG。
- 构建 SQLite 短期记忆、Chroma 向量记忆和导出聊天记录 RAG；长记忆写入、embedding、联系人画像和导出语料同步放到后台任务，避免把高成本计算放进用户回复路径。
- 提供 `/api/status`、`/api/readiness`、`/api/metrics`、配置审计、知识库治理、成本分析、模型认证中心、受控 Tool Workflow、只读 MCP adapter、备份恢复、发布更新和 27 条离线 eval；敏感关键词、静默时段、群聊白名单和新联系人策略进入人工审批队列，减少误触发消息风险。

### RAG-QA System｜FastAPI / Vue / LangGraph / Agent Runtime

- 面向企业知识库“答案必须能追溯来源”的需求，开发多知识库问答系统，包含文档上传、异步解析、统一聊天、SSE 流式回答、引用返回和检索诊断信息。
- 在检索服务中实现结构化检索、全文检索、向量检索三路召回，结合 query rewrite、RRF 和 rerank 返回候选来源、`citations`、`grounding_score`、耗时分解和 `trace_id`。
- 将 Gateway 问答流程迁移到 `LangGraph` 可恢复运行时，并扩展工具注册中心、任务拆解 DAG、反思闭环和三层记忆，让复杂问题可以被拆解、执行、复盘和复用策略。
- 建设知识库与平台治理能力：本地目录、Notion、Web、飞书、钉钉和 SQL 连接器，batch dry-run/jobs、token-aware chunk、`retrieve/debug`、人工接管队列、五层指令合并、企业聊天 v2、6 类场景模板、RAG 幻觉检测、Prompt Injection 防护和 429 背压返回。
- 落地三层语义缓存、模型健康熔断、复杂度驱动路由、请求合并、readyz/trace 诊断与 Python SDK，并用 22 个后端测试文件、9 个前端测试文件和 400+ 测试项覆盖 Agent 能力、推理优化、人工接管和平台生态。

### EasyCloudPan｜Spring Boot / React / PostgreSQL / Redis / MinIO

- 面向个人云盘的大文件、弱网中断和重复上传场景，设计分片上传、秒传、断点续传和 SSE 状态回传；`ChunkUploadService` 用 Redis 记录分片状态并限制单文件并发，`QuickUploadService` 通过 `fileMd5 -> fileId` 复用已有对象。
- 在上传和转码状态上使用受管异步执行与 `SseEmitter`，前端从轮询改为长连接接收进度；连接生命周期、超时和异常返回由服务端统一管理，避免状态任务长期占用线程。
- 设计 `HMAC-SHA256 + timestamp + nonce` 请求签名，nonce 写入 Redis 拦截重放；同时接入 JWT 双 Token、黑名单、Magic Number 文件类型校验、多租户隔离和文件访问切面。
- 引入 Caffeine + Redis + DB 多级缓存、MinIO/S3 主存储与本地回退、Actuator/Micrometer/Prometheus/Grafana 指标；项目文档记录 API `P95 <500ms`、`P99 <1s`，数据库查询 `P95 <100ms`，上传成功率 `>99.5%`。

### SubMed 医学论文检索小程序后端（wereader）｜Django / Celery / Redis / MySQL

- 面向医学专家检索 PubMed 文献、筛选高价值论文和持续跟踪研究主题的需求，参与 SubMed 小程序后端开发，提供首页、主题列表、搜索、推荐搜索、论文详情、收藏、订阅、积分、订单和管理后台接口。
- 在 `Paper`、`Journal`、`Task`、`Subscription`、`PushHistory` 等模型中管理 PMID、DOI、下载链接、JCR/IF、CAS 分区、推送任务和用户订阅配置；`build_fe_json` 统一输出小程序需要的论文展示字段。
- 实现 `articles_ai_search` 与 `articles_ai_search_2`：先把用户问题转为中英文检索词，再调用 `PubMedSpider` 拉取候选论文，使用 GPT 对摘要相关度二次打分，按 `ai_score` 排序并保存命中的 PubMed 数据。
- 参与校地合作小程序开发与交付，支持多方向混合搜索、Redis 查询缓存、Celery 异步缓存刷新、深度分析收藏和订阅推送历史，将一次性文献检索延伸为研究主题的持续跟踪。

### IPA 方言语音转写原型｜Flask / PyTorch / Transformers / torchaudio

- 面向方言语音采集后的 IPA 转写整理，开发本地 Web 原型，支持批量上传、录音上传、示例音频、单文件二次转写、流式进度和结果导出。
- 使用 `transformers.pipeline` 加载本地 ASR checkpoint，并按 CUDA/CPU 自动选择设备；`AudioLoader` 基于 `torchaudio` 读取音频字节、重采样到 16kHz 单声道，必要时通过 `ffmpeg` 转成标准 WAV。
- 将音标转写拆成声母、韵母和声调：从 Excel 读取声母集合、声调集合和声调数字映射，`split_ipa` 按位置规则处理兼类字符，再把识别结果缓存到内存供后续导出使用。
- 批量识别时用 `ThreadPoolExecutor` 并发加载音频、后台线程异步保存原始文件；提供 SSE 进度事件、模板 Excel 校验、`openpyxl` 导出和方正国际音标字体设置，方便把转写结果交给研究人员复核。

### 九州通四向穿梭车路径规划系统｜Python / A\* / PyQt5 / multiprocessing

- 面向医药物流仓库中的四向穿梭车调度，基于 42×27 仓储网格建模道路、墙壁、无货货架和有货货架，负责 A\* 寻路、地图编辑、多车路径展示和冲突处理原型。
- 实现 `A_Search`：使用 open/close 列表、F/G/H 值、曼哈顿距离启发函数和方向一致性选择策略；通过 `point.__new__` 让同坐标节点复用同一实例，减少搜索过程中的重复对象。
- 针对空车和载货两种场景，在 `getAroundPoint` 中动态切换可通行规则：空车可通过货架区，载货时避开已有货物的满货架；`process()` 使用 `yield` 输出搜索步骤，供界面逐帧显示 open/close 和当前路径。
- 设计 `Vehicle` 类、多车配置、进程池并发搜索和基于优先级的时间步冲突处理；低优先级车辆在冲突点前插入等待动作，PyQt5 侧通过 `QBasicTimer`、地图保存/加载和颜色编码展示调度结果。

---

## 技能栈

| 方向           | 技术栈                                                                                                                                              |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AI 工程**    | `RAG` / `LangGraph` / `Agent Runtime` / 工具调用 / 工作流编排 / OpenAI API / 向量检索 / 引用溯源                                                    |
| **后端与数据** | `Python` / `FastAPI` / `AsyncIO` / `Pydantic` / `SQLAlchemy` / `Java` / `Spring Boot` / `MyBatis` / `PostgreSQL` / `MySQL` / `Redis` / `ClickHouse` |
| **全栈交付**   | `React` / `Next.js` / `TypeScript` / `Vite` / `uni-app` / REST API / 支付集成 / 管理后台 / 多端协同                                                 |
| **工程质量**   | `pytest` / `pytest-asyncio` / `Vitest` / `Playwright` / `Prometheus` / `Grafana` / 健康检查 / 发布回滚 / `lint` / `build` / E2E                     |

---

## 教育背景

<div class="experience-heading">
  <h3>南阳理工学院｜数据科学与大数据技术</h3>
  <span class="resume-date">2021.09 - 2025.06</span>
</div>

- GPA `3.8/4.5`，`Top 5%`
- 校级三好学生、校级优秀学生干部、院级奖学金
