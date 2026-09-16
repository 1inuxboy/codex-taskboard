import assert from "node:assert/strict";
import { test } from "node:test";
import { pendingAttentionTasks } from "../web/src/pendingAttention.ts";

test("pending attention follows status, archive and stable activity order, not read state", () => {
  const task = (id, status, extra = {}) => ({ id, status, archivedAt: null, activityUpdatedAt: "2026-09-12T00:00:00Z", ...extra });
  const tasks = [task("b", "in_review", { unread: false }), task("a", "blocked"),
    task("new", "in_review", { activityUpdatedAt: "2026-09-13T00:00:00Z" }),
    ...["todo", "backlog", "in_progress", "done", "canceled"].map((s) => task(s, s, { unread: true })),
    task("archived", "blocked", { archivedAt: "2026-09-13" })];
  const before = [...tasks];
  assert.deepEqual(pendingAttentionTasks(tasks).map((t) => t.id), ["new", "a", "b"]);
  assert.deepEqual(tasks, before);
  assert.deepEqual(pendingAttentionTasks([]), []);
});
