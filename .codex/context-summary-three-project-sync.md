# 三项目作品集同步证据摘要

更新时间：2026-06-10

## 范围

- 源仓库：`E:\Project\rag-qa-system`
- 源仓库：`E:\Project\wechat-chat`
- 源仓库：`E:\Project\customer-ai-runtime`
- 目标仓库：`E:\Project\portfolio`

本次只同步作品集与简历材料中已有的三项目条目，不新增 slug，不调整父子分组，不修改源仓库。

## RAG-QA System

主要证据：

- `README.md`
- `AI_HIGHLIGHTS.md`
- `docs/reference/RAG_STAR_TECHNICAL_CHALLENGES.md`
- `docs/reference/enterprise-chat-v2.md`
- `tests/`
- 最近提交：`feat(platform): 保留就绪失败检查摘要`、`feat(kb): 支持可选 token 预算分块` 等

采用结论：

- 保留三路混合检索、LangGraph 可恢复运行时、Agent 自主决策、Python SDK、RAG 幻觉检测等既有口径。
- 同步新增 batch dry-run/jobs、token-aware chunk、readyz/trace 诊断、企业聊天 v2/version_assist。
- 将旧的 `75+ pytest 用例` 更新为 `22 个后端 test_*.py + 9 个前端 *.test.ts + 400+ 测试项`。

未写入内容：

- 未写入真实业务延迟、吞吐、命中率、成本收益等线上指标；源仓库文档仍标注需要业务数据或压测报告补充。

## 微信智能助手

主要证据：

- `README.md`
- `docs/HIGHLIGHTS.md`
- `docs/SYSTEM_CHAINS.md`
- `docs/RELEASE_UPDATES.md`
- `docs/MODEL_AUTH_CENTER.md`
- `tests/fixtures/evals/smoke_cases.json`
- 最近提交：知识库治理、发布链路、渲染层清理相关提交

采用结论：

- 保留 BaseTransport、LangGraph 主链路、三层记忆、可降级 RAG、模型认证中心、成本分析与运行观测口径。
- 同步知识库治理 API、受控 Tool Workflow、只读 MCP adapter、安装版自动更新与 portable 手动更新链路。
- 将旧的 `24 条离线 smoke eval` 更新为 `27 条离线 smoke eval`。

未写入内容：

- 未写入 GitHub Star 实时数之外的增长或用户规模指标。
- `E:\Project\wechat-chat` 当前存在未提交的 `src/renderer/js/app.module.js` 修改，本次未触碰源仓库。

## 智能客服运行时

主要证据：

- `README.md`
- `STAR-HIGHLIGHTS.md`
- `RESUME_SNIPPETS.md`
- `src/customer_ai_runtime/`
- `tests/`
- `examples/rag_eval_cases.json`
- 最近提交：成本对账、provider billing、外部 readiness、SQLite handoff queue 相关提交

采用结论：

- 保留六层运行时、4 类接入形态、7 类插件扩展点、Auth Bridge、多租户知识治理、8 个本地 RAG eval cases 等口径。
- 同步 provider billing / usage 对账、SQLite 人工接管队列、queue_wait_seconds、外部 readiness 审计、context precision/recall。

未写入内容：

- 未写入真实成本节省比例、线上 RAG 准确率、生产 SLA、外部 provider 端到端联调通过等未由本地证据直接支撑的指标。

## 子代理评估

三个源仓库可并行审阅，但当前可用子代理工具要求用户显式请求子代理或并行代理工作；本次用户未显式授权，因此未启用子代理。实际并行化通过本地只读搜索和多命令读取完成。

## 修改落点

- `src/data.ts`
- `docs/resume-writing-kit.md`
- `docs/resume-star-bank.md`
- `docs/resume-experience-copy.md`
- `docs/resume-ai-main.md`

