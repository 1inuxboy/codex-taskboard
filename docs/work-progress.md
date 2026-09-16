# 工作进展：最轻量实验

产品原则：轻量起步，一点点增加，定期删减。目标是让用户快速看懂 AI 工作的进度、成果、阻塞和下一步，不建设 Agent 记忆系统，也不要求用户维护任务表。

源文件：[work-progress Skill](../skills/work-progress/SKILL.md)。当前由 Agent 维护项目已有进展文件（没有时用 `progress.md`），按需调用 Codex `visualize` 展示。设计依据留在原有 docs，Agent 指令留在 AGENTS.md / CLAUDE.md；进展记录仅链接它们。

## 使用

在具备该 Skill 的新会话中输入：

> $work-progress 跟踪当前工作的进展；有重要变化时维护记录，需要看全局时用 visualize 展示。

当前可视化依赖 Codex `visualize`，不可用时说明并展示 Markdown。记录与渲染方式分开，未来按实际需求接入其他工具，本期不做适配层、后台或自动调度。

## 维护与安装

项目的 `skills/work-progress/SKILL.md` 是唯一维护源。将目录复制到本机 `~/.agents/skills/work-progress/` 或 Windows `%USERPROFILE%\.agents\skills\work-progress\`，同步后比较 SHA-256。只同步 Skill，不同步各项目进展或覆盖其他 Skill；现有目标有差异时先比较并保留原内容。

## 试用标准

- 重要成果或阻塞变化会更新记录，普通查询不会产生流水账。
- 用户能看懂当前重点、成果依据和需要自己决定的事情。
- 待确认与已完成区分清楚；并行建议有依据，不触发自动执行。
- 新会话读取进展文件后能展示正确的工作现状；旧数据明确标注时间。
- 首轮三次有意义使用后精简一次，优先删除无用内容，再决定是否增加能力。

安装和格式校验不代表长期维护效果已验证；后者在真实工作中观察，不为实验自动启动其他项目操作。
