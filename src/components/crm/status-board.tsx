import * as React from "react";
import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/dashboard/crud";
import { cn } from "@/lib/utils";
import type { StatusColumn } from "@/data/crm";

/** Modal used to create or edit a status column (name + description). */
export function StatusColumnModal({
  open,
  onOpenChange,
  initial,
  entityLabel,
  existingNames,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: StatusColumn | null;
  entityLabel: string;
  existingNames: string[];
  onSave: (v: { name: string; description: string }) => void;
}) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setDescription(initial?.description ?? "");
      setError("");
    }
  }, [open, initial]);

  const submit = () => {
    const n = name.trim();
    if (!n) return setError("Status name is required");
    if (existingNames.some((x) => x.toLowerCase() === n.toLowerCase() && x !== initial?.name))
      return setError("A status with this name already exists");
    onSave({ name: n, description: description.trim() });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? `Edit ${entityLabel} status` : `New ${entityLabel} status`}</DialogTitle>
          <DialogDescription>
            {initial
              ? "Rename this column or update what it means for your team."
              : "A new column is added at the end of the pipeline."}
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4 py-2"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="status-name">Name</Label>
            <Input
              id="status-name"
              autoFocus
              value={name}
              maxLength={40}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="e.g. Negotiation"
            />
            {error ? <p className="text-xs text-destructive">{error}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="status-desc">Description</Label>
            <Textarea
              id="status-desc"
              value={description}
              maxLength={160}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="When should something move into this column?"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{initial ? "Save changes" : "Create status"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Kanban board with user-managed columns. Cards are dragged between columns
 * to change status; in edit mode the columns themselves can be reordered,
 * renamed and deleted.
 */
export function StatusBoard<T extends { id: string }>({
  columns,
  onColumnsChange,
  items,
  getStatus,
  onMoveItem,
  renderCard,
  editing,
  entityLabel,
  emptyText = "Drop here",
}: {
  columns: StatusColumn[];
  onColumnsChange: (next: StatusColumn[], removed?: StatusColumn) => void;
  items: T[];
  getStatus: (item: T) => string;
  onMoveItem: (id: string, statusId: string) => void;
  renderCard: (item: T) => React.ReactNode;
  editing: boolean;
  entityLabel: string;
  emptyText?: string;
}) {
  const [dragItem, setDragItem] = React.useState<string | null>(null);
  const [dragCol, setDragCol] = React.useState<string | null>(null);
  const [overCol, setOverCol] = React.useState<string | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingCol, setEditingCol] = React.useState<StatusColumn | null>(null);
  const [deleting, setDeleting] = React.useState<StatusColumn | null>(null);

  const moveColumn = (fromId: string, toId: string) => {
    if (fromId === toId) return;
    const next = [...columns];
    const from = next.findIndex((c) => c.id === fromId);
    const to = next.findIndex((c) => c.id === toId);
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved!);
    onColumnsChange(next);
  };

  const deleteTarget = deleting ? columns.find((c) => c.id !== deleting.id) : undefined;
  const deletingCount = deleting ? items.filter((i) => getStatus(i) === deleting.id).length : 0;

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-3">
        {columns.map((col) => {
          const inCol = items.filter((i) => getStatus(i) === col.id);
          const isOver = overCol === col.id;
          return (
            <div
              key={col.id}
              draggable={editing}
              onDragStart={(e) => {
                if (!editing) return;
                e.dataTransfer.effectAllowed = "move";
                setDragCol(col.id);
              }}
              onDragEnd={() => {
                setDragCol(null);
                setOverCol(null);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                if (overCol !== col.id) setOverCol(col.id);
              }}
              onDragLeave={() => setOverCol((o) => (o === col.id ? null : o))}
              onDrop={() => {
                if (editing && dragCol) moveColumn(dragCol, col.id);
                else if (dragItem && !editing) onMoveItem(dragItem, col.id);
                setDragItem(null);
                setDragCol(null);
                setOverCol(null);
              }}
              className={cn(
                "flex w-[272px] shrink-0 flex-col rounded-2xl border border-border bg-muted/30 p-3 transition-colors",
                isOver && "border-accent bg-accent-soft",
                editing && "cursor-grab border-dashed active:cursor-grabbing",
                dragCol === col.id && "opacity-50",
              )}
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-1.5">
                  {editing ? <GripVertical className="size-4 shrink-0 text-muted-foreground" /> : null}
                  <span className="truncate text-sm font-medium">{col.name}</span>
                  <Badge variant="outline">{inCol.length}</Badge>
                </div>
                {editing ? (
                  <div className="flex shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      aria-label={`Edit ${col.name}`}
                      onClick={() => {
                        setEditingCol(col);
                        setModalOpen(true);
                      }}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-destructive"
                      aria-label={`Delete ${col.name}`}
                      disabled={columns.length <= 1}
                      onClick={() => setDeleting(col)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ) : null}
              </div>
              <p className="mb-3 line-clamp-2 min-h-8 text-xs text-muted-foreground">
                {col.description || "No description"}
              </p>
              <div className={cn("space-y-2", editing && "pointer-events-none opacity-60")}>
                {inCol.map((item) => (
                  <div
                    key={item.id}
                    draggable={!editing}
                    onDragStart={(e) => {
                      e.stopPropagation();
                      setDragItem(item.id);
                    }}
                    onDragEnd={() => setDragItem(null)}
                    className={cn("cursor-grab active:cursor-grabbing", dragItem === item.id && "opacity-50")}
                  >
                    {renderCard(item)}
                  </div>
                ))}
                {!inCol.length ? (
                  <p className="rounded-xl border border-dashed border-border py-6 text-center text-xs text-muted-foreground">
                    {emptyText}
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => {
            setEditingCol(null);
            setModalOpen(true);
          }}
          aria-label={`Add ${entityLabel} status`}
          className="flex min-h-48 w-[136px] shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-accent hover:bg-accent-soft hover:text-foreground"
        >
          <span className="flex size-9 items-center justify-center rounded-full border border-border bg-background">
            <Plus className="size-4" />
          </span>
          <span className="text-xs font-medium">Add status</span>
        </button>
      </div>

      <StatusColumnModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initial={editingCol}
        entityLabel={entityLabel}
        existingNames={columns.map((c) => c.name)}
        onSave={(v) => {
          if (editingCol) {
            onColumnsChange(columns.map((c) => (c.id === editingCol.id ? { ...c, ...v } : c)));
          } else {
            onColumnsChange([...columns, { id: crypto.randomUUID(), ...v }]);
          }
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title={`Delete "${deleting?.name}" column?`}
        description={
          deletingCount && deleteTarget
            ? `${deletingCount} ${entityLabel}${deletingCount > 1 ? "s" : ""} in this column will move to "${deleteTarget.name}".`
            : "This column is empty and will be removed."
        }
        confirmLabel="Delete column"
        destructive
        onConfirm={() => {
          if (deleting) onColumnsChange(columns.filter((c) => c.id !== deleting.id), deleting);
          setDeleting(null);
        }}
      />
    </>
  );
}

/** Small inline status picker used in tables, cards and drawers. */
export function statusName(columns: StatusColumn[], id: string) {
  return columns.find((c) => c.id === id)?.name ?? id;
}
