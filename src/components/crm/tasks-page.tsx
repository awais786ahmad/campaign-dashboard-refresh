import * as React from "react";
import { CalendarClock, CalendarPlus, Check, ChevronsUpDown, Plus, Search, Settings2, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ConfirmDialog, DetailDrawer, RecordFormModal } from "@/components/dashboard/crud";
import { FieldRow, SettingsHeader } from "@/components/settings/settings-header";
import { StatusBoard, statusName } from "@/components/crm/status-board";
import { cn } from "@/lib/utils";
import {
  crmAgents,
  crmCampaigns,
  leadSeed,
  taskPriorities,
  taskSeed,
  taskStatusColumnsSeed,
  type StatusColumn,
  type Task,
} from "@/data/crm";

const priorityTone: Record<Task["priority"], string> = {
  Low: "bg-muted text-muted-foreground border-border",
  Medium: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  High: "bg-rose-500/15 text-rose-600 border-rose-500/30",
};

const todayIso = () => new Date().toISOString().slice(0, 10);

const formatDate = (iso: string) => {
  if (!iso) return "No due date";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
};

const emptyForm = {
  title: "",
  description: "",
  priority: "Medium" as Task["priority"],
  assignee: crmAgents[0]!,
  dueDate: "",
  relatedLead: leadSeed[0]!.name,
  relatedCampaign: crmCampaigns[0]!,
  reason: "",
};

/** Searchable assignee picker (combobox). */
function AssigneePicker({
  value,
  onChange,
  allowAll,
  className,
  compact,
}: {
  value: string;
  onChange: (v: string) => void;
  allowAll?: boolean;
  className?: string;
  compact?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-label="Assignee"
          className={cn("justify-between font-normal", compact && "h-7 px-2 text-xs", className)}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="truncate">{value || "All assignees"}</span>
          <ChevronsUpDown className="ml-1 size-3.5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0" align="start" onClick={(e) => e.stopPropagation()}>
        <Command>
          <CommandInput placeholder="Search assignee…" />
          <CommandList>
            <CommandEmpty>No one found.</CommandEmpty>
            <CommandGroup>
              {allowAll ? (
                <CommandItem
                  value="All assignees"
                  onSelect={() => {
                    onChange("");
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 size-4", value ? "opacity-0" : "opacity-100")} />
                  All assignees
                </CommandItem>
              ) : null}
              {crmAgents.map((a) => (
                <CommandItem
                  key={a}
                  value={a}
                  onSelect={() => {
                    onChange(a);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 size-4", value === a ? "opacity-100" : "opacity-0")} />
                  {a}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function TasksPage() {
  const [list, setList] = React.useState<Task[]>(taskSeed);
  const [columns, setColumns] = React.useState<StatusColumn[]>(taskStatusColumnsSeed);
  const [editingColumns, setEditingColumns] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [assignee, setAssignee] = React.useState("");
  const [priority, setPriority] = React.useState<string>("All");
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Task | null>(null);
  const [active, setActive] = React.useState<Task | null>(null);
  const [deleting, setDeleting] = React.useState<Task | null>(null);
  const [form, setForm] = React.useState(emptyForm);
  const [today, setToday] = React.useState("");

  React.useEffect(() => setToday(todayIso()), []);

  const doneId = columns.find((c) => c.name.toLowerCase() === "completed")?.id;
  const isOverdue = (t: Task) => !!today && !!t.dueDate && t.dueDate < today && t.status !== doneId;

  const q = query.trim().toLowerCase();
  const filtered = list.filter(
    (t) =>
      (!q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) &&
      (!assignee || t.assignee === assignee) &&
      (priority === "All" || t.priority === priority) &&
      (!from || (t.dueDate && t.dueDate >= from)) &&
      (!to || (t.dueDate && t.dueDate <= to)),
  );
  const hasFilters = !!(q || assignee || priority !== "All" || from || to);
  const overdueCount = filtered.filter(isOverdue).length;

  const clearFilters = () => {
    setQuery("");
    setAssignee("");
    setPriority("All");
    setFrom("");
    setTo("");
  };

  const patch = (id: string, fn: (t: Task) => Task) => {
    setList((l) => l.map((t) => (t.id === id ? fn(t) : t)));
    setActive((a) => (a && a.id === id ? fn(a) : a));
  };

  const log = (t: Task, text: string): Task["activity"] => [
    { id: crypto.randomUUID(), when: "just now", text },
    ...t.activity,
  ];

  const changeStatus = (id: string, statusId: string) => {
    const task = list.find((t) => t.id === id);
    if (!task || task.status === statusId) return;
    const name = statusName(columns, statusId);
    patch(id, (t) => ({ ...t, status: statusId, activity: log(t, `Moved to ${name}`) }));
    toast.success(`"${task.title}" moved to ${name}`);
  };

  const changeAssignee = (id: string, who: string) => {
    patch(id, (t) => (t.assignee === who ? t : { ...t, assignee: who, activity: log(t, `Reassigned to ${who}`) }));
    toast.success(`Assigned to ${who}`);
  };

  const updateColumns = (next: StatusColumn[], removed?: StatusColumn) => {
    if (removed) {
      const fallback = next[0]!;
      setList((l) => l.map((t) => (t.status === removed.id ? { ...t, status: fallback.id } : t)));
      toast.success(`"${removed.name}" deleted`);
    } else if (next.length > columns.length) {
      toast.success(`"${next[next.length - 1]!.name}" status added`);
    }
    setColumns(next);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditing(task);
    setForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      assignee: task.assignee,
      dueDate: task.dueDate,
      relatedLead: task.relatedLead,
      relatedCampaign: task.relatedCampaign,
      reason: task.reason,
    });
    setFormOpen(true);
  };

  const save = () => {
    if (!form.title.trim()) {
      toast.error("Task title is required");
      return;
    }
    if (editing) {
      patch(editing.id, (t) => ({ ...t, ...form, title: form.title.trim() }));
      toast.success("Task updated");
      return;
    }
    setList((l) => [
      {
        id: crypto.randomUUID(),
        ...form,
        title: form.title.trim(),
        status: columns[0]!.id,
        createdBy: "You",
        createdAt: todayIso(),
        reason: form.reason || "Created manually.",
        activity: [{ id: "a1", when: "just now", text: "Task created manually" }],
      },
      ...l,
    ]);
    toast.success("Task created");
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <SettingsHeader
        title="Tasks"
        description="Follow-ups and callbacks created by you, your team, automations or the AI agent after a call."
        actions={
          <div className="flex gap-2">
            <Button variant={editingColumns ? "default" : "outline"} onClick={() => setEditingColumns((v) => !v)}>
              {editingColumns ? <Check className="mr-2 size-4" /> : <Settings2 className="mr-2 size-4" />}
              {editingColumns ? "Done editing" : "Edit columns"}
            </Button>
            <Button onClick={openCreate}>
              <Plus className="mr-2 size-4" />
              New task
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap items-end gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or description"
            className="pl-9"
          />
        </div>
        <AssigneePicker value={assignee} onChange={setAssignee} allowAll className="w-48" />
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-36" aria-label="Priority">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All priorities</SelectItem>
            {taskPriorities.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1.5 rounded-md border border-input px-2">
          <CalendarClock className="size-4 text-muted-foreground" />
          <input
            type="date"
            aria-label="Due from"
            value={from}
            max={to || undefined}
            onChange={(e) => setFrom(e.target.value)}
            className="h-9 bg-transparent text-sm outline-none"
          />
          <span className="text-xs text-muted-foreground">to</span>
          <input
            type="date"
            aria-label="Due to"
            value={to}
            min={from || undefined}
            onChange={(e) => setTo(e.target.value)}
            className="h-9 bg-transparent text-sm outline-none"
          />
        </div>
        {hasFilters ? (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-1 size-4" />
            Clear
          </Button>
        ) : null}
        <div className="ml-auto text-sm text-muted-foreground">
          {filtered.length} task{filtered.length === 1 ? "" : "s"}
          {overdueCount ? <span className="font-semibold text-destructive"> · {overdueCount} overdue</span> : null}
        </div>
      </div>

      {editingColumns ? (
        <p className="rounded-xl border border-dashed border-accent/40 bg-accent-soft px-4 py-2.5 text-sm text-muted-foreground">
          Drag columns to reorder them, or use the pencil and bin icons to rename or delete a status.
        </p>
      ) : null}

      <StatusBoard
        columns={columns}
        onColumnsChange={updateColumns}
        items={filtered}
        getStatus={(t) => t.status}
        onMoveItem={changeStatus}
        editing={editingColumns}
        entityLabel="task"
        emptyText={hasFilters ? "No matching tasks" : "Drop a task here"}
        renderCard={(task) => {
          const overdue = isOverdue(task);
          return (
            <div
              role="button"
              tabIndex={0}
              onClick={() => setActive(task)}
              onKeyDown={(e) => e.key === "Enter" && setActive(task)}
              className={cn(
                "w-full rounded-xl border bg-background p-3 text-left transition-shadow hover:shadow-sm",
                overdue ? "border-2 border-destructive" : "border-border",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="text-sm font-medium leading-snug">{task.title}</div>
                <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium ${priorityTone[task.priority]}`}>
                  {task.priority}
                </span>
              </div>
              {task.description ? (
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{task.description}</p>
              ) : null}
              <div className="mt-3" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                <AssigneePicker compact value={task.assignee} onChange={(v) => changeAssignee(task.id, v)} className="w-full" />
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1" title="Created">
                  <CalendarPlus className="size-3" />
                  {formatDate(task.createdAt)}
                </span>
                <span className={cn("inline-flex items-center gap-1", overdue && "text-destructive")} title="Due">
                  <CalendarClock className="size-3" />
                  {formatDate(task.dueDate)}
                </span>
              </div>
              {overdue ? <p className="mt-2 text-xs font-bold uppercase tracking-wide text-destructive">Overdue</p> : null}
            </div>
          );
        }}
      />

      <RecordFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editing ? "Edit task" : "New task"}
        description="Tasks can be linked to a lead and a campaign so the whole context travels with them."
        mode={editing ? "edit" : "create"}
        onSubmit={save}
        {...(editing ? {} : { onSaveDraft: () => toast.info("Task saved as draft") })}
      >
        <div className="space-y-2">
          <Label htmlFor="task-title">Title</Label>
          <Input
            id="task-title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Call back Ali Raza"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="task-desc">Description</Label>
          <Textarea
            id="task-desc"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select value={form.priority} onValueChange={(v) => setForm((f) => ({ ...f, priority: v as Task["priority"] }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {taskPriorities.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Assignee</Label>
            <AssigneePicker value={form.assignee} onChange={(v) => setForm((f) => ({ ...f, assignee: v }))} className="w-full" />
          </div>
          <div className="space-y-2">
            <Label>Related lead</Label>
            <Select value={form.relatedLead} onValueChange={(v) => setForm((f) => ({ ...f, relatedLead: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {leadSeed.map((l) => (
                  <SelectItem key={l.id} value={l.name}>
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Campaign</Label>
            <Select value={form.relatedCampaign} onValueChange={(v) => setForm((f) => ({ ...f, relatedCampaign: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {crmCampaigns.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="task-due">Due date</Label>
          <Input
            id="task-due"
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
          />
        </div>
      </RecordFormModal>

      <DetailDrawer
        open={!!active}
        onOpenChange={(v) => !v && setActive(null)}
        activity={active ? { entityType: "Task", entityId: active.id, record: active.title } : null}
        title={active?.title ?? ""}
        description={active?.description ?? ""}
        footer={
          <div className="flex justify-between gap-2">
            <Button variant="ghost" onClick={() => active && setDeleting(active)}>
              <Trash2 className="mr-2 size-4" />
              Delete
            </Button>
            <Button variant="outline" onClick={() => active && openEdit(active)}>
              Edit task
            </Button>
          </div>
        }
      >
        {active ? (
          <div className="space-y-6 pt-4">
            {isOverdue(active) ? (
              <p className="rounded-xl border-2 border-destructive px-4 py-2 text-sm font-bold text-destructive">
                Overdue — was due {formatDate(active.dueDate)}
              </p>
            ) : null}
            <div className="rounded-xl border border-border p-4">
              <FieldRow
                label="Status"
                value={
                  <Select value={active.status} onValueChange={(v) => changeStatus(active.id, v)}>
                    <SelectTrigger className="h-8 w-40" aria-label="Change status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                }
              />
              <FieldRow label="Priority" value={active.priority} />
              <FieldRow
                label="Assignee"
                value={<AssigneePicker value={active.assignee} onChange={(v) => changeAssignee(active.id, v)} className="h-8 w-44" />}
              />
              <FieldRow label="Created by" value={active.createdBy} />
              <FieldRow label="Created" value={formatDate(active.createdAt)} />
              <FieldRow label="Due" value={formatDate(active.dueDate)} />
              <FieldRow label="Lead" value={active.relatedLead} />
              <FieldRow label="Campaign" value={<Badge variant="outline">{active.relatedCampaign}</Badge>} />
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium">Why this task exists</h3>
              <p className="rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">{active.reason}</p>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium">Activity</h3>
              <ol className="space-y-3 border-l border-border pl-4">
                {active.activity.map((a) => (
                  <li key={a.id} className="relative text-sm">
                    <span className="absolute -left-[21px] top-1.5 size-2 rounded-full bg-accent" />
                    <div>{a.text}</div>
                    <div className="text-xs text-muted-foreground">{a.when}</div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : null}
      </DetailDrawer>

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title={`Delete "${deleting?.title}"?`}
        description="The task and its activity history are removed permanently."
        confirmLabel="Delete task"
        destructive
        onConfirm={() => {
          setList((l) => l.filter((t) => t.id !== deleting?.id));
          setActive(null);
          setDeleting(null);
          toast.success("Task deleted");
        }}
      />
    </div>
  );
}
