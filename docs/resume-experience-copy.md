# 简历版经历文案

以下文案与网站中的工作经历、项目经历共享同一套证据口径，可直接复制到 Word / PDF 简历中使用。网站会把部分独立开发项目聚合展示，简历投递时可以按岗位拆成单个项目。

相关材料：
- `docs/resume-writing-kit.md`：岗位取舍、量化口径和写作规则。
- `docs/resume-star-bank.md`：STAR 证据库与面试追问底稿。
- `docs/content-evidence-policy.md`：证据来源、父子项目分组和可写边界。

## 工作经历

### 微信智能助手｜独立开发者 · 开源项目
2025.12 - 至今

- 抽象 `BaseTransport` 接入层并以 `LangGraph` 重构回复主链，将同步回复与后台成长任务解耦，建立适合长期运行的微信助手架构。
- 构建 SQLite 短期记忆、运行期向量记忆与导出语料 RAG 三层记忆体系，支持轻量重排与可选本地 `Cross-Encoder` 自动回退，平衡召回质量与部署成本。
- 补齐 `/api/status`、`/api/readiness`、`/api/metrics`、`/api/config/audit`、知识库治理 API、成本分析与脱敏诊断支持包，完善运行观测、配置审计与排障能力。
- 落地配置热重载、回复预算、人工审批、模型认证中心、受控 Tool Workflow、只读 MCP adapter 与发布更新链路，支持 2 秒回复 deadline 与 27 条离线 smoke eval，降低误发、阻塞和凭据配置风险。

### 智能客服运行时｜独立开发者 · 开源项目
2026.02 - 至今

- 设计渠道接入、宿主桥接、核心引擎、业务增强、插件平台、提供商适配六层架构，统一文本、Voice API、RTC WebSocket 与 FastAPI 挂载 4 类接入形态。
- 实现 `route_confidence` 分层、`intent_stack` 回退及 `page_context` / `business_objects` 感知路由，在低置信度与高风险场景优先澄清或转人工。
- 提供 Route、BusinessTool、Handoff、Industry、AuthBridge、Context、Response 7 类插件扩展点，支持宿主鉴权复用与业务能力按需挂载。
- 补齐知识版本管理、chunk 优化、消息级反馈、provider billing 与 usage 对账、安全知识缓存、8 个本地 RAG eval cases、SQLite 人工接管队列、外部 readiness 审计、request_id 贯通、限流与提示词脱敏，强化多租户治理与审计能力。

### 南方科技大学｜外包技术顾问
2025.11 - 2025.12

- 主导需求澄清与原型方案拆解，在需求不明确、周期受限条件下快速收敛 MVP 范围。
- 负责自动化脚本与 Web 系统联调，完成关键业务流程通信验证，形成端到端演示闭环。
- 按期交付 IPA 原型并通过客户验收，为后续工程化立项、预算评估和方案决策提供依据。

### 中软国际｜后端/全栈工程师
2025.04 - 2025.09

- 设计结构检索、全文检索、向量检索三路召回链路，结合加权 RRF 融合与 rerank，支持 `citations`、`grounding_score` 与 `trace_id` 返回。
- 将 Gateway 问答链路与 KB 检索链路改造为 LangGraph 可恢复运行时，并扩展工具注册中心、任务拆解 DAG、反思闭环与三层记忆。
- 建设 ingest 与知识治理工作台，支持多知识库、多源连接器、batch dry-run/jobs、token-aware chunk、retrieve/debug、五层指令合并、场景模板、企业聊天 v2 与 RAG 幻觉检测。
- 落地三层语义缓存、模型健康熔断、复杂度驱动路由、请求合并、人工接管队列、readyz/trace 诊断与 Python SDK，并用 22 个后端测试文件、9 个前端测试文件和 400+ 测试项覆盖 Agent 能力、推理优化和平台生态。

### 国家骨科临床研究中心｜后端开发实习生
2024.08 - 2024.10

- 设计并实现小程序后端接口，支撑论文搜索、推荐、订阅、收藏、深度分析与下载分享等核心能力。
- 整合 AI 搜索与自然语言检索能力，将医学专家“找文献”流程从小时级压缩至分钟级，提升科研检索效率。
- 建立订阅推送与个性化推荐链路，支持持续追踪特定研究方向的最新论文。
- 支撑微信小程序稳定运行，降低医学场景下的检索门槛并提升结果相关性。

### 中国联通陕西省分公司｜后端开发实习生
2024.05 - 2024.08

- 推动 OLTP / OLAP 分离并引入 ClickHouse，将活动统计接口从 20s+ 优化至 4s（5x），支撑高频运营分析场景。
- 完成 300+ 表、3 亿+ 记录迁移与一致性校验，保障数据中台升级过程可追溯、可回滚。
- 重写聚合 SQL 并补充覆盖索引与缓存，将部分核心查询从 10s+ 压缩至 500ms，持续治理 20+ 慢查询隐患。
- 搭建 CI/CD、lint/build/test 门禁与回滚链路，将发布耗时从 30 分钟缩短至 5 分钟，降低人工发布风险。

### EasyCloudPan｜全栈开发 · 开源项目
2024.04 - 2026.02

- 构建“分片上传 + 秒传 + 断点续传 + SSE 状态回传”主链路，结合 `FileChannel.transferTo()` 零拷贝合并与并发控制，支持 1000+ 并发上传，成功率 >99.5%（README 指标口径）。
- 完成 PostgreSQL 复合索引、游标分页与 Caffeine / Redis 多级缓存治理，使 API P95 <500ms、P99 <1s、数据库查询 P95 <100ms，慢查询减少 80%（README 指标口径）。
- 落地 HMAC-SHA256 请求签名防重放、JWT 双 Token + 黑名单、`@FileAccessCheck`、Magic Number 校验与多租户隔离，形成文件平台安全闭环。
- 建立“本地一键启动 + Docker 全栈部署 + 健康检查 + Prometheus/Grafana + Web Vitals 入库”工程基线，使核心 P0/P1 流程可复现验证。

### 九州通四向穿梭车路径规划系统｜项目经理 / 算法研发
2023.05 - 2023.07

- 设计 A* 路径搜索算法，完成复杂仓储地图下的最优路径求解与启发式搜索实现。
- 实现多车冲突检测与优先级等待策略，处理节点占用与时序冲突，验证多车协同调度可行性。
- 开发 PyQt5 可视化仿真界面，支持地图编辑、起终点设置、路径步进调试及地图保存/加载。

## 项目经历

### RentBox 共享擦窗宝小程序
2026 - 至今

- 设计 `OrderStateMachine` 与 `OrderLifecycleService`，用 `FOR UPDATE`、状态历史和审计日志管理支付、免押、取机、归还、退款与设备事件的状态迁移。
- 接入微信支付 v3、微信支付分免押和柜机厂商 WebAPI，处理支付单复用、金额校验、免押授权、解押、退款与设备回调。
- 针对支付通知、退款通知、设备开门/测物回调和定时任务并发，使用 Redis / JDBC 幂等、`processed_flag` 与回调重放入口控制重复处理。
- 为订单、支付、设备指令、免押、锁和回调回放编写测试，使核心风险点可以在本地复现和回归。

### 论文检索任务平台
2026 - 至今

- 在甲方 Worker 只读写共享 `tasks` 表的边界下，设计用户侧任务创建、状态同步、结果下载、额度扣减和支付回调模块。
- 使用 PostgreSQL `LISTEN/NOTIFY` 驱动任务状态推送，提供单任务、多任务和全局活动任务 SSE；通知缺失时回退到短轮询。
- 通过 Alembic 迁移增加 `check constraint` 与触发器，限制终态回退、缺少 `result_count`、缺少 `finished_at` 等脏数据。
- 设计免费/Pro 额度模型和支付宝支付回调，使用 `SELECT ... FOR UPDATE`、唯一额度流水和金额校验处理并发扣减与重复通知。

### 智能客服运行时
2026 - 至今

- 设计渠道接入、宿主桥接、核心引擎、业务增强、插件平台、提供商适配六层架构，统一文本、Voice API、RTC WebSocket 与 FastAPI 挂载 4 类接入形态。
- 实现 `route_confidence` 分层、`intent_stack` 回退及 `page_context` / `business_objects` 感知路由，在低置信度与高风险场景优先澄清或转人工。
- 提供 Route、BusinessTool、Handoff、Industry、AuthBridge、Context、Response 7 类插件扩展点，支持宿主鉴权复用与业务能力按需挂载。
- 补齐知识版本管理、chunk 优化、消息级反馈、provider billing 与 usage 对账、安全知识缓存、8 个本地 RAG eval cases、SQLite 人工接管队列、外部 readiness 审计、request_id 贯通、限流与提示词脱敏，强化多租户治理与审计能力。

### 微信智能助手
2025 - 至今

- 抽象 `BaseTransport` 接入层并以 `LangGraph` 重构回复主链，将同步回复与后台成长任务解耦，建立适合长期运行的微信助手架构。
- 构建 SQLite 短期记忆、运行期向量记忆与导出语料 RAG 三层记忆体系，支持轻量重排与可选本地 `Cross-Encoder` 自动回退，平衡召回质量与部署成本。
- 补齐 `/api/status`、`/api/readiness`、`/api/metrics`、`/api/config/audit`、知识库治理 API、成本分析与脱敏诊断支持包，完善运行观测、配置审计与排障能力。
- 落地配置热重载、回复预算、人工审批、模型认证中心、受控 Tool Workflow、只读 MCP adapter 与发布更新链路，支持 2 秒回复 deadline 与 27 条离线 smoke eval，降低误发、阻塞和凭据配置风险。

### RAG-QA System
2025.04 - 2025.09

- 设计结构检索、全文检索、向量检索三路召回链路，结合加权 RRF 融合与 rerank，支持 `citations`、`grounding_score` 与 `trace_id` 返回。
- 将 Gateway 问答链路与 KB 检索链路改造为 LangGraph 可恢复运行时，并扩展工具注册中心、任务拆解 DAG、反思闭环与三层记忆。
- 建设 ingest 与知识治理工作台，支持多知识库、多源连接器、chunk 治理、retrieve/debug、五层指令合并、场景模板与 RAG 幻觉检测。
- 落地三层语义缓存、模型健康熔断、复杂度驱动路由、请求合并、人工接管队列、readyz/trace 诊断与 Python SDK，并用 22 个后端测试文件、9 个前端测试文件和 400+ 测试项覆盖 Agent 能力、推理优化和平台生态。

### 乐学网
2024

- 负责课程、支付与互动链路的全栈实现，形成校内教学与知识付费闭环。
- 引入 Redis 缓存与 RBAC 权限治理，支撑选课与考试高峰时段的稳定访问。
- 基于 WebSocket 实现实时互动与在线答疑，提升教学场景的响应效率与参与度。

### EasyCloudPan
2024.04 - 2026.02

- 构建“分片上传 + 秒传 + 断点续传 + SSE 状态回传”主链路，结合 `FileChannel.transferTo()` 零拷贝合并与并发控制，支持 1000+ 并发上传，成功率 >99.5%（README 指标口径）。
- 完成 PostgreSQL 复合索引、游标分页与 Caffeine / Redis 多级缓存治理，使 API P95 <500ms、P99 <1s、数据库查询 P95 <100ms，慢查询减少 80%（README 指标口径）。
- 落地 HMAC-SHA256 请求签名防重放、JWT 双 Token + 黑名单、`@FileAccessCheck`、Magic Number 校验与多租户隔离，形成文件平台安全闭环。
- 建立“本地一键启动 + Docker 全栈部署 + 健康检查 + Prometheus/Grafana + Web Vitals 入库”工程基线，使核心 P0/P1 流程可复现验证。

### 九州通四向穿梭车路径规划系统
2023

- 设计 A* 路径搜索算法，完成复杂仓储地图下的最优路径求解与启发式搜索实现。
- 实现多车冲突检测与优先级等待策略，处理节点占用与时序冲突，验证多车协同调度可行性。
- 开发 PyQt5 可视化仿真界面，支持地图编辑、起终点设置、路径步进调试及地图保存/加载。
