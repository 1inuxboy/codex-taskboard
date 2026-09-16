---
name: work-progress
description: Maintain human-facing work progress and visualize outcomes, blockers, dependencies, and next steps. Use when the user asks to track ongoing work, see overall progress, or resume an overview of work. Deliver a Codex visualize progress panel on first activation and when the user requests an overview; fall back to Markdown only when unavailable or explicitly requested. Not an agent-memory or project-instruction manager.
---

# 工作进展

帮助用户快速看懂：为什么做、做到哪里、有什么成果、哪里卡住、需要自己决定什么。项目文档保存设计与知识，AGENTS.md / CLAUDE.md 指导 Agent；本 Skill 维护给人看的进展，不创建另一套项目记忆。

## 维护进展

1. 确认跟踪范围，先读项目根目录 `.agent-project/project.md` 与 `.agent-project/tasks.yaml`，再核对相关成果。前者仅存目标、范围与原文链接；后者是唯一任务进度来源。没有时按下面的结构创建，不再新增或并行维护 `to-do.md`、`TO-DO.md`、`progress.md`。
2. 用一句话保留目标及重要边界，链接已有设计文档。列出主要工作、当前状态、成果或验证依据、阻塞影响、下一步和待用户决定事项。注明更新时间；没有内容的栏目省略，不为填表编造信息。
3. 在形成成果、验证结果变化、出现或解除阻塞、用户作出决定等有意义的变化后更新。启用本 Skill 的工作中主动维护，不逐条记录工具调用，没有变化就不重写。
4. 区分未开始、进行中、阻塞、待确认、已完成。以具体交付及验证依据判断完成；Agent 停止、测试通过或用户读过页面不等于用户验收。没有证据的状态标为未核实，旧记录注明核实时间，不假装实时状态。
5. 记录依赖时说明前置成果与阻塞影响；只有依赖和已知共享资源允许时才标注可以并行，未知条件写明待确认。展示并发可能性不授权启动工作。
6. 用户改变目标或推翻重要结论时，简短保留变化原因与依据；长篇设计和历史链接到原文，不复制聊天记录。只更新获准范围，遵守当前只读或规划限制。

## 项目内持久化

- `.agent-project/project.md`：简短项目目标、跟踪范围、现有设计文档链接；不复制 AGENTS.md / CLAUDE.md 或长篇知识。
- `.agent-project/tasks.yaml`：任务事实。`id` 稳定且唯一；`parent` 表达主子关系，`depends_on` 表达前置依赖，引用须存在且无环，不另外维护可反推的 `blocks`。
- 状态使用 `todo / in_progress / blocked / in_review / done`。外部阻塞原因写入 `blocker`，不要把“用户确认”等文字当作不存在的任务 ID。
- 每项必填 `id/title/description/status/updated_at`。`updated_at` 用带时区的 ISO 8601 字符串，仅在该任务实际内容变化时更新；阅读、重新渲染不刷新时间。历史更新时间不明时用迁入时间，并在证据中说明，不伪造原始时间。
- 其他字段按需使用。主任务与子任务分别维护状态和进度；百分比必须配 `progress_basis`，无依据则省略 `progress`、展示阶段及已完成子任务数，不简单平均。子任务完成不自动代表主任务验收完成。
- 迁移已有待办时保留范围内的描述、关系、状态与证据，核对后将旧文档中的已迁移清单替换为新文件链接，停止双写；不删除无关内容，不跨项目批量迁移。
- 两个文件纳入项目 Git，在授权的正常提交中保存；只有已提交的版本才进入 Git 历史。检查差异后只提交本次修改，不自动推送、改写历史或建立提交 Hook。非 Git 项目仍可保存文件，明确说明没有 Git 版本历史，不自动初始化仓库。

最小示例（内容与时间替换为实际值；没有子任务或依赖时省略对应字段）：

```yaml
tasks:
  - id: deliver-feature
    title: 交付功能
    description: 实现并验证约定的用户路径
    status: in_progress
    updated_at: "2026-09-16T14:00:00+08:00"
    next: [完成直接路径验证]
  - id: verify-feature
    parent: deliver-feature
    title: 验证功能
    description: 检查目标路径与交付依据
    status: todo
    updated_at: "2026-09-16T14:00:00+08:00"
```

可选字段：`parent`、`depends_on`（ID 列表）、`evidence`（证据说明或链接列表）、`blocker`（原因）、`next`（下一步列表）、`progress`（0–100 数值）、`progress_basis`（口径与依据）。不要写空占位字段。

## 展示给用户

- 当前可视化依赖 **Codex 的 `visualize` Skill**。首次启用本 Skill，以及用户要求查看整体进展时，默认交付会话内可视化进展面板，不能只写文档就结束。先读取当前环境提供的 `visualize` Skill，按其合同生成并在最终回复中嵌入展示；只创建 HTML 文件或返回文件路径不算完成展示。用户明确只要文字、表格或只维护记录时遵循用户要求。
- 沿用主任务与子任务分层展示：主任务展示自身进度，选择后展示子任务各自进度。进行中、阻塞和待确认事项直接可见，避免所有内容都要展开。每项显示最新更新时间，注明时区。使用 visualize 提供的 HTML/CSS/JavaScript 展示能力，不新增 React 或组件库依赖。局部静态依赖关系可用 Mermaid，但不以单独一张关系图代替用户要求的进展面板。
- 每层已完成任务默认收进“已完成（N）”，允许展开查看，不删除源数据；`in_review` 不折叠。若已完成父项仍有未完成子项，保持父项可见并提示状态不一致，避免隐藏活动工作。
- 后续只有影响整体理解的重要变化才更新面板；普通工具调用或仅调整文档措辞不重画。tasks.yaml 是数据来源，面板是给用户的主要交付物。
- 展示从进展记录和已核实成果派生，标注截至时间，不把视图当成独立状态源。界面中的展示操作不直接改变工作状态；确认或执行仍走用户原有工作流程。
- `visualize` 不可用时明确说明，提供 Markdown 进展；不自动安装插件或搭建替代网站。证据使用可访问的链接或准确路径，不编造会话链接。
- 记录不包含渲染器专属字段。未来可扩展其他可视化工具，本期不建设适配层、后台、Hook 或调度系统。

## 轻量迭代

只为真实使用中暴露的问题增加规则。首轮每三次有意义的使用做一次精简回顾：合并重复信息，删除无用字段或流程，保留关键成果与依据。次数不确定时不声称已达到回顾周期；不另建计数系统或定时任务。
