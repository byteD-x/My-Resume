# 简历 STAR 证据库

这份文档把关键经历拆成 STAR 结构，并显式区分“已验证结果”“保守推断”和“待补充指标”。用途是写简历项目详情、自我介绍、面试追问和项目复盘。

证据标签说明：
- `已验证`：站内文案或关联仓库 README / docs / 代码中已有明确支撑。
- `保守推断`：能从功能结构推导出结果，但没有强量化口径。
- `待补充`：建议后续补截图、日志、评测或时间线证明。

## RentBox 共享擦窗宝小程序

### Situation
- 租赁业务同时涉及支付、免押、取机、归还、退款和设备事件，异步回调与重复通知会直接影响订单状态和资金安全。

### Task
- 建立可回放、可审计、可测试的租赁订单主链路，并把小程序、管理端、支付和柜机设备接到同一套状态流转中。

### Action
- 设计 `OrderStateMachine` 与 `OrderLifecycleService`，用 `FOR UPDATE`、状态历史和审计日志管理订单迁移。
- 接入微信支付 v3、微信支付分免押和柜机厂商 WebAPI，处理支付单复用、免押授权、解押、退款和设备回调。
- 使用 Redis / JDBC 幂等、`processed_flag`、分布式锁和回调重放入口收口重复通知与并发事件。
- 为订单、支付、设备指令、免押、锁和回调回放补充测试，保证高风险路径可复现。

### Result
- `已验证`：形成支付、免押、设备、订单状态和审计日志贯通的租赁闭环。
- `已验证`：核心风险路径具备本地测试与回调回放能力。
- `待补充`：缺少柜机数、点位数、订单量、支付成功率和正式发布记录。

### Evidence
- `src/data.ts`
- `docs/resume-ai-main.md`
- `docs/resume-experience-copy.md`

### 简历可打标签
- Spring Boot
- 微信支付
- 支付分免押
- 设备集成
- 幂等治理
- 状态机

### 待补充
- 正式环境发布时间、柜机/点位口径、订单/退款/设备异常统计、回滚或健康检查记录。

## 论文检索任务平台

### Situation
- 用户侧平台需要提交论文检索任务并跟踪进度，但实际检索由甲方 Worker 通过共享 PostgreSQL `tasks` 表完成。

### Task
- 在不侵入 Worker 的前提下，交付认证、任务提交、状态同步、结果下载、额度流水、支付升级和管理后台的测试验收版闭环。

### Action
- 设计用户侧任务创建、状态同步、结果下载、额度扣减和支付宝支付回调模块。
- 使用 PostgreSQL `LISTEN/NOTIFY` 推送任务状态，并以 SSE keep-alive 与短轮询兜底保证前端可见进度。
- 通过 Alembic 迁移加入 `check constraint` 与触发器，限制终态回退、终态缺少 `finished_at` 等脏数据。
- 使用 `SELECT ... FOR UPDATE`、唯一额度流水和 `app_id / seller / amount` 校验处理并发扣减与重复通知。

### Result
- `已验证`：形成用户认证、任务提交、状态同步、结果下载、额度流水、支付升级和管理后台闭环。
- `已验证`：用户侧平台与甲方 Worker 通过共享表契约解耦。
- `待补充`：缺少任务量、活跃用户、支付升级、SSE 成功率和测试覆盖统计。

### Evidence
- `src/data.ts`
- `docs/resume-ai-main.md`
- `docs/resume-experience-copy.md`

### 简历可打标签
- FastAPI
- PostgreSQL
- SSE
- 支付回调
- 数据库约束
- 测试验收

### 待补充
- 任务表/订单表导出、SSE 成功率、真实 E2E 通过率、管理后台截图。

## 智能客服运行时

### Situation
- 面向真实业务的客服场景，需要统一文本、语音、RTC 通话三种交互，并支持宿主系统挂载、知识问答、业务数据查询和转人工。

### Task
- 从单一问答能力扩展为可接业务、可治理、可扩展的客服运行时。

### Action
- 设计渠道接入、宿主桥接、核心引擎、业务增强、插件平台、提供商适配六层架构。
- 统一文本、Voice API、RTC WebSocket 与 FastAPI 子应用挂载 4 类接入形态。
- 实现 `route_confidence` 分层、`intent_stack` 回退和 `page_context` / `business_objects` 感知路由。
- 提供 Route、BusinessTool、Handoff、Industry、AuthBridge、Context、Response 7 类插件扩展点。
- 补齐知识版本管理、智能切片优化、消息级反馈、provider billing 与 usage 对账、安全知识缓存、8 个本地 RAG eval cases、SQLite 人工接管队列、外部 readiness 审计、诊断导出、限流和提示词脱敏。

### Result
- `已验证`：支持 4 类接入形态，具备 7 类插件扩展点。
- `已验证`：形成可挂载、可多租户隔离、可知识版本切换的客服运行时骨架。
- `已验证`：本地 eval 与 demo 可输出成本对账、RAG eval 结果、转人工队列、queue_wait_seconds 和 claim-next 认领结果。
- `保守推断`：显著降低新增业务场景接入时的耦合成本，便于按租户、行业、渠道装配能力。

### Evidence
- `customer-ai-runtime/README.md`
- `customer-ai-runtime/STAR-HIGHLIGHTS.md`
- `customer-ai-runtime/RESUME_SNIPPETS.md`
- `customer-ai-runtime/tests/test_runtime_api.py`
- `customer-ai-runtime/tests/test_interview_artifacts.py`
- `src/data.ts`

### 简历可打标签
- RAG
- Agent Runtime
- FastAPI
- 多租户
- 插件化架构
- 业务系统集成

### 待补充
- 接口总数、关键路径延迟、真实转人工比例、线上 RAG 准确率或管理端截图。

## 微信智能助手

### Situation
- 微信桌面场景下的 AI 助手需要同时解决接入稳定性、回复速度、记忆质量、配置治理和长期运行观测问题。

### Task
- 将微信机器人从“调用模型回复”升级为可长期运行的本地 Agent 基础设施。

### Action
- 抽象 `BaseTransport` 接入层，收敛微信自动化的不稳定边界。
- 基于 `LangGraph` 重构回复主链，将同步对话链与后台成长任务解耦。
- 构建 SQLite 短期记忆、运行期向量记忆、导出语料 RAG 三层记忆体系。
- 落地轻量重排与可选本地 `Cross-Encoder` 回退策略，平衡效果与部署成本。
- 补齐 `/api/status`、`/api/readiness`、`/api/metrics`、`/api/config/audit`、知识库治理 API、模型认证中心、成本分析、配置热重载、受控 Tool Workflow、只读 MCP adapter 和离线 eval。

### Result
- `已验证`：形成三层记忆架构，并支持 RAG 精排失败自动回退。
- `已验证`：建立状态诊断、Prometheus 指标、配置审计和成本分析能力。
- `已验证`：支持 2 秒回复 deadline 策略，降低桌面场景下的阻塞风险。
- `已验证`：27 条离线 smoke eval 覆盖 Prompt 回滚、受控工具流、Windows 首次运行、导出语料 RAG、无命中回退与误命中防护场景。
- `保守推断`：显著提升长期运行、排障和配置治理的可维护性。

### Evidence
- `wechat-chat/README.md`
- `wechat-chat/docs/HIGHLIGHTS.md`
- `wechat-chat/docs/SYSTEM_CHAINS.md`
- `wechat-chat/tests/test_api.py`
- `wechat-chat/tests/test_model_auth_center.py`
- `src/data.ts`

### 简历可打标签
- LangGraph
- 本地 Agent
- RAG
- 可观测性
- 配置热重载
- 成本治理
- 模型认证治理
- 受控工具流

### 待补充
- 回复成功率、平均响应时间、GitHub Star 快照。

## RAG-QA System / 中软国际

### Situation
- 企业知识问答场景需要多知识库管理、证据引用、可恢复执行、Agent 多步处理和回归门禁，不能停留在单链路 Demo。

### Task
- 交付可用于知识治理、Agent 问答验证和平台化集成的 AI 问答系统，而不是单一问答接口。

### Action
- 设计结构检索、全文检索、向量检索三路召回，结合加权 RRF 和 rerank 提升命中质量。
- 将问答链路与检索链路改造成 LangGraph 可恢复运行时，并扩展工具注册中心、任务拆解 DAG、反思闭环和三层记忆。
- 建设 ingest 与知识治理工作台，支持多知识库、多源连接器、batch dry-run/jobs、token-aware chunk、retrieve/debug、人工接管队列、五层指令合并、场景模板、企业聊天 v2 与 RAG 幻觉检测。
- 落地三层语义缓存、模型健康熔断、复杂度驱动路由、请求合并、readyz/trace 诊断与 Python SDK，并用 22 个后端测试文件、9 个前端测试文件和 400+ 测试项覆盖 Agent 能力、推理优化、人工接管和平台生态。

### Result
- `已验证`：支持 3 路召回、引用溯源、`grounding_score` 与 `trace_id` 返回。
- `已验证`：支持 LangGraph 可恢复运行时、工具注册、任务拆解、反思闭环、三层记忆、人工接管队列、分层指令、企业聊天 v2 与 RAG 幻觉检测。
- `已验证`：22 个后端 `test_*.py`、9 个前端 `*.test.ts` 覆盖 400+ 测试项，覆盖 Agent 能力、推理优化、平台生态与 SDK 相关能力。
- `保守推断`：提升问答可信度、知识库治理效率、Agent 可控性和发布稳定性。

### Evidence
- `rag-qa-system/README.md`
- `rag-qa-system/AI_HIGHLIGHTS.md`
- `rag-qa-system/docs/reference/RAG_STAR_TECHNICAL_CHALLENGES.md`
- `rag-qa-system/tests/test_agent_capabilities.py`
- `rag-qa-system/tests/test_inference_optimization.py`
- `rag-qa-system/tests/test_platform_ecosystem.py`
- `rag-qa-system/tests/test_backend_infra.py`
- `rag-qa-system/tests/test_agent_orchestration.py`
- `rag-qa-system/tests/test_agent_metacognition.py`
- `src/data.ts`

### 简历可打标签
- RAG
- 混合检索
- LangGraph
- Agent 自主决策
- 推理优化
- Python SDK
- 引用溯源
- 评测回归
- 知识治理

### 待补充
- 评测样本规模、Recall / Citation / Faithfulness 指标截图。

## EasyCloudPan

### Situation
- 网盘系统的核心挑战在于高并发上传、权限安全、缓存治理、对象存储和工程化交付，需要兼顾性能、可用性与安全。

### Task
- 构建可长期演进的前后端分离网盘系统，并将上传、鉴权、预览、分享和部署运维能力做成完整闭环。

### Action
- 构建“分片上传 + 秒传 + 断点续传 + SSE 状态回传”主链路，并用 `FileChannel.transferTo()` 做零拷贝合并。
- 完成 PostgreSQL 复合索引、游标分页、Caffeine / Redis 多级缓存治理。
- 落地 HMAC-SHA256 请求签名、防重放、JWT 双 Token、文件权限校验和 Magic Number 类型校验。
- 建立本地一键启动、Docker 全栈部署、健康检查、Prometheus/Grafana 监控与 Web Vitals 入库。

### Result
- `已验证`：支持 `1000+` 并发上传，上传成功率 `>99.5%`。
- `已验证`：API 延迟达到 `P95 <500ms`、`P99 <1s`，数据库查询 `P95 <100ms`。
- `已验证`：慢查询减少 `80%`。
- `保守推断`：形成兼顾安全、性能和交付效率的文件平台底座。

### Evidence
- `easyCloudPan/README.md`
- `easyCloudPan/RESUME_EasyCloudPan.md`
- `src/data.ts`

### 简历可打标签
- Java 21
- Spring Boot
- 高并发上传
- 缓存治理
- 安全鉴权
- 可观测性

### 待补充
- 上传高峰测试脚本、监控截图、关键接口压测报告。

## 中国联通陕西省分公司

### Situation
- 活动统计与报表接口响应慢，数据中台升级涉及海量表迁移和发布效率问题，直接影响运营分析时效。

### Task
- 在保证数据一致性和业务连续性的前提下，完成性能治理、迁移校验和发布链路优化。

### Action
- 推动 OLTP / OLAP 分离，引入 ClickHouse 承接聚合分析。
- 重写聚合 SQL，补充覆盖索引与缓存策略，持续治理慢查询。
- 完成 300+ 表、3 亿+ 记录迁移，并建立脚本化一致性校验与回滚思路。
- 搭建 CI/CD、lint / build / test 门禁和发布回滚链路。

### Result
- `已验证`：活动统计接口从 `20s+` 优化至 `4s`，约 `5x` 提速。
- `已验证`：部分核心查询从 `10s+` 压缩至 `500ms`。
- `已验证`：完成 `300+` 表、`3 亿+` 记录迁移。
- `已验证`：发布耗时从 `30 分钟` 缩短至 `5 分钟`。

### Evidence
- `src/data.ts`
- `docs/resume-experience-copy.md`

### 简历可打标签
- ClickHouse
- SQL 优化
- 数据迁移
- CI/CD
- 发布治理

### 待补充
- 迁移校验脚本样例、发布链路截图、慢查询治理前后明细。

## 国家骨科临床研究中心

### Situation
- 医学论文检索与跟踪存在专业门槛，研究人员需要在检索、订阅、收藏、深度分析和分享之间形成完整闭环。

### Task
- 为微信小程序提供后端接口和 AI 检索能力，降低医学场景的检索门槛。

### Action
- 设计并实现论文搜索、推荐、订阅、收藏、深度分析、下载分享等后端接口。
- 整合 AI 搜索与自然语言检索能力，压缩人工筛文流程。
- 建立订阅推送与个性化推荐链路，支持持续追踪特定研究方向。

### Result
- `保守推断`：支撑小程序核心科研检索链路稳定运行。
- `保守推断`：将专家找文献流程从小时级压缩到分钟级。
- `待补充`：缺少明确使用量、用户规模或响应延迟指标。

### Evidence
- `submed-miniapp/readme.md`
- 小程序代码结构（`pages/`、`components/`、接口页面）
- `src/data.ts`

### 简历可打标签
- 微信小程序
- AI 搜索
- 推荐系统
- 后端接口设计

### 待补充
- 实际交付周期、页面截图、接口数量、使用对象范围。

## 南方科技大学

### Situation
- 需求不明确、周期紧张，需要先完成原型验证而不是直接投入完整工程开发。

### Task
- 快速收敛 MVP 范围，并完成自动化脚本与 Web 系统联调，交付可验收原型。

### Action
- 主导需求澄清与原型方案拆解。
- 完成自动化脚本与 Web 系统关键流程联调。
- 组织端到端演示闭环，支撑客户验收。

### Result
- `已验证`：按期交付 IPA 原型并通过客户验收。
- `保守推断`：为后续预算评估、方案决策与工程化立项提供依据。

### Evidence
- `src/data.ts`
- `docs/resume-experience-copy.md`

### 简历可打标签
- 需求澄清
- MVP
- 原型交付
- 客户协作

### 待补充
- 交付周期、验收范围、涉及的具体业务流程。

## 九州通四向穿梭车路径规划系统

### Situation
- 仓储路径规划场景需要在复杂地图和多车环境下完成路径求解、冲突处理和可视化验证。

### Task
- 用可演示、可调试的方式验证路径规划算法和多车调度可行性。

### Action
- 设计 A* 路径搜索算法并实现启发式搜索。
- 实现节点占用、优先级等待等冲突处理逻辑。
- 开发 PyQt5 可视化界面，支持地图编辑、起终点设置、路径步进调试与地图保存/加载。

### Result
- `已验证`：完成 A* 路径搜索与 PyQt5 仿真界面。
- `保守推断`：验证多车协同调度与冲突处理方案的可行性。
- `待补充`：缺少地图规模、车辆数量、求解时间等实验口径。

### Evidence
- `九州通项目/A-star/test4.py`
- `九州通项目/A-star/test5(1).py`
- `src/data.ts`

### 简历可打标签
- A*
- 路径规划
- 冲突检测
- PyQt5
- 仿真系统

### 待补充
- 典型地图截图、实验参数、最终演示视频或求解耗时记录。
