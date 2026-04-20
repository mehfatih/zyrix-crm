"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Plus,
  Loader2,
  CheckSquare,
  Clock,
  AlertTriangle,
  Flame,
  LayoutGrid,
  List,
  Search,
  X,
  CircleDashed,
  Circle,
  CheckCircle2,
  XCircle,
  CalendarClock,
  User,
  Building2,
  Trash2,
  Pencil,
} from "lucide-react";
import {
  fetchTasks,
  fetchTaskStats,
  createTask,
  updateTask,
  deleteTask,
  type Task,
  type TaskStats,
  type TaskStatus,
  type TaskPriority,
  type ListTasksParams,
  type CreateTaskDto,
} from "@/lib/api/tasks";
import { listCustomers, type Customer } from "@/lib/api/customers";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { getUser } from "@/lib/auth/token-storage";

// ============================================================================
// TASKS PAGE
// ============================================================================

const STATUS_ORDER: TaskStatus[] = ["todo", "in_progress", "done", "cancelled"];

const PRIORITY_STYLES: Record<
  TaskPriority,
  { bg: string; text: string; ring: string; label: string }
> = {
  urgent: {
    bg: "bg-red-50",
    text: "text-red-700",
    ring: "ring-red-200",
    label: "Urgent",
  },
  high: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
    label: "High",
  },
  medium: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    ring: "ring-sky-200",
    label: "Medium",
  },
  low: {
    bg: "bg-slate-50",
    text: "text-slate-600",
    ring: "ring-slate-200",
    label: "Low",
  },
};

const STATUS_META: Record<
  TaskStatus,
  { icon: typeof Circle; bg: string; border: string; heading: string }
> = {
  todo: {
    icon: Circle,
    bg: "bg-slate-50",
    border: "border-slate-200",
    heading: "text-slate-700",
  },
  in_progress: {
    icon: CircleDashed,
    bg: "bg-sky-50",
    border: "border-sky-200",
    heading: "text-sky-700",
  },
  done: {
    icon: CheckCircle2,
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    heading: "text-emerald-700",
  },
  cancelled: {
    icon: XCircle,
    bg: "bg-slate-100",
    border: "border-slate-200",
    heading: "text-slate-500",
  },
};

export default function TasksPage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || "en";
  const t = useTranslations("Tasks");

  const me = typeof window !== "undefined" ? getUser() : null;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"kanban" | "list">("kanban");

  const [filters, setFilters] = useState<ListTasksParams>({
    limit: 200,
    sortBy: "dueDate",
    sortOrder: "asc",
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Debounce search input
  useEffect(() => {
    const h = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(h);
  }, [search]);

  async function load() {
    setLoading(true);
    try {
      const [taskRes, statRes] = await Promise.all([
        fetchTasks({
          ...filters,
          search: debouncedSearch || undefined,
        }),
        fetchTaskStats(),
      ]);
      setTasks(taskRes.items);
      setStats(statRes);
    } catch (err) {
      console.error("Failed to load tasks", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, debouncedSearch]);

  // Group tasks by status for Kanban
  const grouped = useMemo(() => {
    const g: Record<TaskStatus, Task[]> = {
      todo: [],
      in_progress: [],
      done: [],
      cancelled: [],
    };
    tasks.forEach((t) => {
      g[t.status].push(t);
    });
    return g;
  }, [tasks]);

  async function handleToggleStatus(task: Task, next: TaskStatus) {
    try {
      const updated = await updateTask(task.id, { status: next });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
      // Refetch stats since counts shift
      try {
        const s = await fetchTaskStats();
        setStats(s);
      } catch {
        // non-critical
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete() {
    if (!deletingTask) return;
    try {
      await deleteTask(deletingTask.id);
      setDeletingTask(null);
      await load();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <DashboardShell locale={locale}>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink">{t("title")}</h1>
            <p className="text-sm text-ink-light mt-1">{t("subtitle")}</p>
          </div>
          <button
            onClick={() => {
              setEditingTask(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {t("create")}
          </button>
        </div>

        {/* Stats row */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              icon={<CheckSquare className="w-4 h-4" />}
              label={t("stats.myOpen")}
              value={stats.myOpen}
              color="primary"
            />
            <StatCard
              icon={<Clock className="w-4 h-4" />}
              label={t("stats.dueToday")}
              value={stats.dueToday}
              color="sky"
            />
            <StatCard
              icon={<AlertTriangle className="w-4 h-4" />}
              label={t("stats.overdue")}
              value={stats.overdue}
              color={stats.overdue > 0 ? "danger" : "slate"}
            />
            <StatCard
              icon={<Flame className="w-4 h-4" />}
              label={t("stats.urgent")}
              value={stats.urgent}
              color={stats.urgent > 0 ? "amber" : "slate"}
            />
          </div>
        )}

        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full rounded-lg border border-line bg-white ltr:pl-9 rtl:pr-9 ltr:pr-3 rtl:pl-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <select
            value={filters.priority ?? ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                priority: (e.target.value || undefined) as TaskPriority | undefined,
              })
            }
            className="rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="">{t("filters.allPriorities")}</option>
            <option value="urgent">{t("priority.urgent")}</option>
            <option value="high">{t("priority.high")}</option>
            <option value="medium">{t("priority.medium")}</option>
            <option value="low">{t("priority.low")}</option>
          </select>

          <button
            onClick={() =>
              setFilters((f) =>
                f.assignedToId === "me"
                  ? { ...f, assignedToId: undefined }
                  : { ...f, assignedToId: "me" }
              )
            }
            className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
              filters.assignedToId === "me"
                ? "bg-primary-600 text-white border-primary-600"
                : "bg-white border-line text-ink-light hover:border-primary-300 hover:text-primary-700"
            }`}
          >
            {t("filters.myTasks")}
          </button>

          <button
            onClick={() =>
              setFilters((f) => ({
                ...f,
                overdueOnly: !f.overdueOnly,
                status: f.overdueOnly ? undefined : f.status,
              }))
            }
            className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
              filters.overdueOnly
                ? "bg-red-600 text-white border-red-600"
                : "bg-white border-line text-ink-light hover:border-red-300 hover:text-red-700"
            }`}
          >
            {t("filters.overdue")}
          </button>

          {/* View toggle */}
          <div className="ms-auto inline-flex rounded-lg border border-line bg-white p-0.5 shadow-sm">
            <button
              onClick={() => setView("kanban")}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold ${
                view === "kanban"
                  ? "bg-primary-600 text-white"
                  : "text-ink-light hover:text-primary-700"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              {t("views.kanban")}
            </button>
            <button
              onClick={() => setView("list")}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold ${
                view === "list"
                  ? "bg-primary-600 text-white"
                  : "text-ink-light hover:text-primary-700"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              {t("views.list")}
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState onCreate={() => setModalOpen(true)} />
        ) : view === "kanban" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {STATUS_ORDER.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                items={grouped[status]}
                onEdit={(t) => {
                  setEditingTask(t);
                  setModalOpen(true);
                }}
                onDelete={(t) => setDeletingTask(t)}
                onToggle={handleToggleStatus}
                meId={me?.id}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-white border border-line-soft overflow-hidden">
            <div className="divide-y divide-slate-100">
              {tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onEdit={() => {
                    setEditingTask(task);
                    setModalOpen(true);
                  }}
                  onDelete={() => setDeletingTask(task)}
                  onToggle={handleToggleStatus}
                  meId={me?.id}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <TaskModal
          locale={locale}
          initial={editingTask}
          onClose={() => {
            setModalOpen(false);
            setEditingTask(null);
          }}
          onSaved={async () => {
            setModalOpen(false);
            setEditingTask(null);
            await load();
          }}
        />
      )}

      {deletingTask && (
        <ConfirmDelete
          title={t("confirmDeleteTitle")}
          message={t("confirmDeleteMessage", { title: deletingTask.title })}
          onCancel={() => setDeletingTask(null)}
          onConfirm={handleDelete}
        />
      )}
    </DashboardShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "primary" | "sky" | "danger" | "amber" | "slate";
}) {
  const colors: Record<typeof color, { bg: string; text: string; ring: string }> =
    {
      primary: {
        bg: "bg-primary-50",
        text: "text-primary-700",
        ring: "ring-primary-100",
      },
      sky: { bg: "bg-sky-50", text: "text-sky-700", ring: "ring-sky-100" },
      danger: { bg: "bg-red-50", text: "text-red-700", ring: "ring-red-100" },
      amber: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        ring: "ring-amber-100",
      },
      slate: {
        bg: "bg-slate-50",
        text: "text-slate-600",
        ring: "ring-slate-100",
      },
    };
  const c = colors[color];
  return (
    <div className="rounded-xl bg-white border border-line-soft p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold text-ink-light uppercase tracking-wide">
            {label}
          </div>
          <div className="text-2xl md:text-3xl font-bold text-ink mt-1">
            {value.toLocaleString()}
          </div>
        </div>
        <div className={`rounded-lg p-2 ${c.bg} ring-1 ${c.ring} ${c.text}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function KanbanColumn({
  status,
  items,
  onEdit,
  onDelete,
  onToggle,
  meId,
}: {
  status: TaskStatus;
  items: Task[];
  onEdit: (t: Task) => void;
  onDelete: (t: Task) => void;
  onToggle: (t: Task, s: TaskStatus) => void;
  meId?: string;
}) {
  const t = useTranslations("Tasks");
  const meta = STATUS_META[status];
  const Icon = meta.icon;

  return (
    <div
      className={`rounded-xl border ${meta.border} ${meta.bg} flex flex-col min-h-[200px]`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/60">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${meta.heading}`} />
          <h3 className={`text-sm font-bold ${meta.heading}`}>
            {t(`status.${status}`)}
          </h3>
        </div>
        <span className="inline-flex items-center justify-center min-w-[24px] h-6 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-600 px-2">
          {items.length}
        </span>
      </div>
      <div className="p-3 space-y-2 flex-1">
        {items.length === 0 ? (
          <div className="text-xs text-slate-400 text-center py-6">
            {t("emptyColumn")}
          </div>
        ) : (
          items.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task)}
              onToggle={onToggle}
              meId={meId}
            />
          ))
        )}
      </div>
    </div>
  );
}

function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggle,
  meId,
}: {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: (t: Task, s: TaskStatus) => void;
  meId?: string;
}) {
  const t = useTranslations("Tasks");
  const pStyle = PRIORITY_STYLES[task.priority];
  const isMine = task.assignedToId && task.assignedToId === meId;
  const overdue =
    task.dueDate &&
    task.status !== "done" &&
    task.status !== "cancelled" &&
    new Date(task.dueDate) < new Date();

  const nextStatus: TaskStatus | null =
    task.status === "todo"
      ? "in_progress"
      : task.status === "in_progress"
        ? "done"
        : task.status === "done"
          ? "todo"
          : null;

  return (
    <div className="group rounded-lg bg-white border border-slate-200 p-3 hover:shadow-md hover:border-primary-200 transition-all">
      <div className="flex items-start gap-2">
        <button
          onClick={() => nextStatus && onToggle(task, nextStatus)}
          disabled={!nextStatus}
          className="mt-0.5 text-slate-400 hover:text-primary-600 disabled:opacity-50 flex-shrink-0"
          title={nextStatus ? t(`advance.${nextStatus}`) : ""}
        >
          {task.status === "done" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : task.status === "cancelled" ? (
            <XCircle className="w-4 h-4" />
          ) : task.status === "in_progress" ? (
            <CircleDashed className="w-4 h-4 text-sky-600" />
          ) : (
            <Circle className="w-4 h-4" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h4
            className={`text-sm font-semibold ${task.status === "done" ? "text-slate-400 line-through" : "text-ink"} break-words`}
          >
            {task.title}
          </h4>
          {task.description && (
            <p className="text-xs text-ink-light mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ring-1 ${pStyle.bg} ${pStyle.text} ${pStyle.ring}`}
            >
              {t(`priority.${task.priority}`)}
            </span>

            {task.dueDate && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  overdue
                    ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                    : "bg-slate-50 text-slate-600 ring-1 ring-slate-200"
                }`}
              >
                <CalendarClock className="w-3 h-3" />
                {formatShortDate(task.dueDate)}
              </span>
            )}

            {task.customer && (
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium bg-sky-50 text-sky-700 ring-1 ring-sky-200">
                <User className="w-3 h-3" />
                <span className="truncate max-w-[100px]">
                  {task.customer.fullName}
                </span>
              </span>
            )}

            {task.deal && (
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium bg-violet-50 text-violet-700 ring-1 ring-violet-200">
                <Building2 className="w-3 h-3" />
                <span className="truncate max-w-[100px]">
                  {task.deal.title}
                </span>
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
            <div className="text-[10px] text-slate-400">
              {task.assignedTo
                ? isMine
                  ? t("assignedToMe")
                  : task.assignedTo.fullName
                : t("unassigned")}
            </div>
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={onEdit}
                className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-primary-600"
                title="Edit"
              >
                <Pencil className="w-3 h-3" />
              </button>
              <button
                onClick={onDelete}
                className="p-1 rounded hover:bg-red-50 text-slate-500 hover:text-red-600"
                title="Delete"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskRow({
  task,
  onEdit,
  onDelete,
  onToggle,
  meId,
}: {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: (t: Task, s: TaskStatus) => void;
  meId?: string;
}) {
  const t = useTranslations("Tasks");
  const pStyle = PRIORITY_STYLES[task.priority];
  const overdue =
    task.dueDate &&
    task.status !== "done" &&
    task.status !== "cancelled" &&
    new Date(task.dueDate) < new Date();

  return (
    <div className="group flex items-center gap-3 px-4 py-3 hover:bg-sky-50/40 transition-colors">
      <button
        onClick={() =>
          onToggle(task, task.status === "done" ? "todo" : "done")
        }
        className="text-slate-400 hover:text-emerald-600 flex-shrink-0"
      >
        {task.status === "done" ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        ) : (
          <Circle className="w-5 h-5" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div
          className={`text-sm font-semibold ${task.status === "done" ? "text-slate-400 line-through" : "text-ink"}`}
        >
          {task.title}
        </div>
        <div className="flex items-center gap-2 text-xs text-ink-light mt-0.5">
          {task.assignedTo && (
            <span className="inline-flex items-center gap-1">
              <User className="w-3 h-3" />
              {task.assignedTo.id === meId
                ? t("assignedToMe")
                : task.assignedTo.fullName}
            </span>
          )}
          {task.customer && (
            <>
              <span>·</span>
              <span>{task.customer.fullName}</span>
            </>
          )}
        </div>
      </div>

      <span
        className={`hidden sm:inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ring-1 ${pStyle.bg} ${pStyle.text} ${pStyle.ring}`}
      >
        {t(`priority.${task.priority}`)}
      </span>

      {task.dueDate && (
        <span
          className={`hidden md:inline-flex items-center gap-1 text-xs font-medium ${overdue ? "text-red-700" : "text-slate-600"}`}
        >
          <CalendarClock className="w-3.5 h-3.5" />
          {formatShortDate(task.dueDate)}
        </span>
      )}

      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-primary-600"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded hover:bg-red-50 text-slate-500 hover:text-red-600"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  const t = useTranslations("Tasks");
  return (
    <div className="rounded-2xl bg-white border border-dashed border-line p-12 text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-50 text-primary-600 mb-4">
        <CheckSquare className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-ink mb-2">{t("emptyTitle")}</h3>
      <p className="text-sm text-ink-light max-w-md mx-auto mb-5">
        {t("emptyBody")}
      </p>
      <button
        onClick={onCreate}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700"
      >
        <Plus className="w-4 h-4" />
        {t("emptyCta")}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Create / Edit Modal
// ─────────────────────────────────────────────────────────────────────────
function TaskModal({
  locale: _locale,
  initial,
  onClose,
  onSaved,
}: {
  locale: string;
  initial: Task | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const t = useTranslations("Tasks");

  const [form, setForm] = useState<CreateTaskDto>(() =>
    initial
      ? {
          title: initial.title,
          description: initial.description ?? undefined,
          status: initial.status,
          priority: initial.priority,
          dueDate: initial.dueDate,
          assignedToId: initial.assignedToId,
          customerId: initial.customerId,
          dealId: initial.dealId,
        }
      : {
          title: "",
          status: "todo",
          priority: "medium",
        }
  );

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoadingCustomers(true);
    listCustomers({ limit: 200 })
      .then((res) => setCustomers(res.customers))
      .catch(() => {
        // non-critical — we can still save without a customer
      })
      .finally(() => setLoadingCustomers(false));
  }, []);

  async function handleSave() {
    if (!form.title.trim()) {
      setError(t("titleRequired"));
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (initial) {
        await updateTask(initial.id, form);
      } else {
        await createTask(form);
      }
      onSaved();
    } catch (err: unknown) {
      const msg =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { error?: { message?: string } } } })
          .response?.data?.error?.message === "string"
          ? (err as { response: { data: { error: { message: string } } } })
              .response.data.error.message
          : t("saveError");
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg my-8">
        <div className="px-6 py-4 border-b border-line-soft flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">
            {initial ? t("editTitle") : t("createTitle")}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-slate-100 text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <Field label={t("fields.title")} required>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="zx-task-input"
              autoFocus
            />
          </Field>

          <Field label={t("fields.description")}>
            <textarea
              rows={3}
              value={form.description ?? ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="zx-task-input resize-y"
              placeholder={t("fields.descriptionPlaceholder")}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t("fields.status")}>
              <select
                value={form.status ?? "todo"}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as TaskStatus })
                }
                className="zx-task-input"
              >
                <option value="todo">{t("status.todo")}</option>
                <option value="in_progress">{t("status.in_progress")}</option>
                <option value="done">{t("status.done")}</option>
                <option value="cancelled">{t("status.cancelled")}</option>
              </select>
            </Field>
            <Field label={t("fields.priority")}>
              <select
                value={form.priority ?? "medium"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    priority: e.target.value as TaskPriority,
                  })
                }
                className="zx-task-input"
              >
                <option value="urgent">{t("priority.urgent")}</option>
                <option value="high">{t("priority.high")}</option>
                <option value="medium">{t("priority.medium")}</option>
                <option value="low">{t("priority.low")}</option>
              </select>
            </Field>
          </div>

          <Field label={t("fields.dueDate")}>
            <input
              type="datetime-local"
              value={toDatetimeLocal(form.dueDate)}
              onChange={(e) =>
                setForm({
                  ...form,
                  dueDate: e.target.value
                    ? new Date(e.target.value).toISOString()
                    : null,
                })
              }
              className="zx-task-input"
            />
          </Field>

          <Field label={t("fields.customer")}>
            <select
              value={form.customerId ?? ""}
              onChange={(e) =>
                setForm({ ...form, customerId: e.target.value || null })
              }
              className="zx-task-input"
              disabled={loadingCustomers}
            >
              <option value="">{t("fields.noCustomer")}</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName}
                  {c.companyName ? ` — ${c.companyName}` : ""}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="px-6 py-4 border-t border-line-soft flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-ink-light hover:bg-slate-100"
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 disabled:opacity-50 shadow-sm"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {initial ? t("save") : t("create")}
          </button>
        </div>
      </div>

      <style jsx global>{`
        .zx-task-input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgb(186 230 253);
          background: white;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: rgb(22 78 99);
          outline: none;
          transition: border-color 120ms, box-shadow 120ms;
        }
        .zx-task-input:focus {
          border-color: rgb(8 145 178);
          box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.15);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-bold uppercase tracking-wider text-ink-mid mb-1.5">
        {label}
        {required && <span className="text-red-500 ms-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}

function ConfirmDelete({
  title,
  message,
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const t = useTranslations("Tasks");
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="p-6">
          <h2 className="text-lg font-bold text-ink">{title}</h2>
          <p className="mt-2 text-sm text-ink-light">{message}</p>
        </div>
        <div className="px-6 py-4 border-t border-line-soft flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-ink-light hover:bg-slate-100"
          >
            {t("cancel")}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
          >
            {t("delete")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────
function formatShortDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const now = new Date();
  const isSameYear = d.getFullYear() === now.getFullYear();
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    ...(isSameYear ? {} : { year: "numeric" }),
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toDatetimeLocal(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
