import type { Task } from "./types";

export function pendingAttentionTasks(tasks: Task[]): Task[] {
  return tasks.filter((task) => !task.archivedAt && (task.status === "in_review" || task.status === "blocked"))
    .sort((left, right) => right.activityUpdatedAt.localeCompare(left.activityUpdatedAt)
      || left.id.localeCompare(right.id));
}
