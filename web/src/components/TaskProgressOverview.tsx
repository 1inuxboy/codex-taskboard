import type { Task } from "../types";
import type { TaskConversationItem } from "../taskConversations";
import { useTaskboardI18n } from "../i18n";
import { ConversationIcon } from "./SemanticIcons";

interface TaskProgressOverviewProps {
  task: Task;
  onOpenTask: (task: Task) => void;
  onOpenConversation: (conversation: TaskConversationItem) => void;
}

export function TaskProgressOverview({ task, onOpenTask, onOpenConversation }: TaskProgressOverviewProps) {
  const { text, locale } = useTaskboardI18n();
  const children = task.relations.subIssues;
  const completed = children.filter((child) => child.status === "done").length;
  const activeChildren = children.filter((child) => child.status === "in_progress");
  const blockers = task.relations.blockedBy.filter((blocker) => (
    blocker.status !== "done" && blocker.status !== "canceled" && !blocker.archivedAt
  ));
  const latest = task.conversationRefs.reduce<Task["conversationRefs"][number] | null>(
    (current, ref) => ref.source === "comment" && (!current || ref.updatedAt > current.updatedAt)
      ? ref
      : current,
    null,
  );
  const binding = task.threadBinding;
  const updatedAt = latest?.updatedAt ?? task.activityUpdatedAt;
  const formattedTime = new Intl.DateTimeFormat(locale, {
    month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(new Date(updatedAt));

  function openOwner() {
    if (!binding) return;
    onOpenConversation({
      key: `codex:${binding.threadId}`,
      projectId: task.projectId,
      kind: "native",
      title: task.title,
      source: "task",
      nativeThreadId: binding.threadId,
      threadBinding: binding,
      legacyLocalThreadId: null,
      aiThreadId: null,
      updatedAt: task.updatedAt,
      currentRun: null,
      latestTodo: null,
    });
  }

  return (
    <section className="task-progress-overview" aria-label={text("任务进展", "Task progress")}>
      {children.length > 0 && (
        <div className="task-child-progress">
          <div className="task-progress-heading">
            <span>{text("子任务完成", "Subtasks completed")}</span>
            <strong>{completed}<span> / {children.length}</span></strong>
          </div>
          <progress
            value={completed}
            max={children.length}
            aria-label={text(`子任务完成 ${completed}/${children.length}`, `Subtasks completed ${completed}/${children.length}`)}
          />
        </div>
      )}
      {activeChildren.length > 0 && (
        <div className="task-current-step">
          <span>{text("当前进行", "In progress")}</span>
          <p>{activeChildren.map((child) => child.title).join(text("、", ", "))}</p>
        </div>
      )}
      {blockers.length > 0 && (
        <div className="task-progress-blocker">
          <span>{text("等待依赖", "Waiting for")}</span>
          <p>{blockers.map((blocker) => blocker.title).join(text("、", ", "))}</p>
        </div>
      )}
      <button
        type="button"
        className="task-latest-activity"
        aria-label={text(`查看 ${task.identifier} 最新会话动态全文`, `Read latest conversation update for ${task.identifier}`)}
        onClick={(event) => { event.stopPropagation(); onOpenTask(task); }}
        onPointerDown={(event) => event.stopPropagation()}
        draggable={false}
      >
        <span>{text("最新会话动态", "Latest conversation update")}</span>
        <p className={latest ? "" : "is-empty"}>
          {latest?.title ?? text("尚无进展记录", "No progress update yet")}
        </p>
      </button>
      <div className="task-progress-footer">
        <time dateTime={updatedAt} title={new Date(updatedAt).toLocaleString(locale)}>
          {text("更新于 ", "Updated ")}{formattedTime}
        </time>
        {binding && (
          <button
            type="button"
            className="task-owner-link"
            title={binding.threadId}
            aria-label={text(`打开 ${task.identifier} 负责会话`, `Open owner conversation for ${task.identifier}`)}
            onClick={(event) => { event.stopPropagation(); openOwner(); }}
            onPointerDown={(event) => event.stopPropagation()}
            draggable={false}
          >
            <ConversationIcon color="currentColor" size={14} />
            {text("负责会话", "Owner conversation")}
          </button>
        )}
      </div>
    </section>
  );
}
