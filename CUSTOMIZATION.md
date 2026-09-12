# Task progress card customization

This repository is a focused fork of [chuspeeism/dashi-taskboard](https://github.com/chuspeeism/dashi-taskboard). It keeps the upstream data model and adds a compact progress section to main board cards.

## Added behavior

Main board cards can show:

- completed and total direct subtasks;
- direct subtasks currently in progress;
- unfinished `blocked_by` dependencies;
- the latest conversation-attributed update and its timestamp;
- an explicit shortcut to the task's bound owner conversation.

The owner shortcut is shown only when the task has a complete `threadBinding`. A comment from another conversation does not replace the task's owner binding. The existing linked-conversation menu remains available for task and comment conversations.

The card does not infer business progress from prose. Subtask completion uses existing task statuses, dependency display uses existing relations, and the update preview uses the existing conversation reference summary. Full content remains in the task detail view.

## Scope

The customization changes only the main board card presentation. It does not add:

- database fields or migrations;
- new HTTP or CLI contracts;
- background polling or AI summaries;
- automatic interpretation of deployment, download, or test percentages;
- changes to list, dashboard, or completed-task sidebar layouts.

## Upstream baseline

The initial customization is based on Dashi Taskboard `v1.1.22`, commit `bd264e7ff3402785f1e8b0bb789106358352707b`.

Keep the official repository as the `upstream` remote and periodically reconcile upstream releases before extending the fork:

```bash
git fetch upstream --tags
git rebase upstream/main
```

## Verification

Run:

```bash
