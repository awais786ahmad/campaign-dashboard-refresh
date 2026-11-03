import * as React from "react";
import { Check, Plus, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { WidgetBody } from "@/components/dashboard/widget-renderers";
import {
  canUseWidget,
  resolveData,
  resolveTitle,
  rolePermissions,
  roleScope,
  sizeLabel,
  widgetCatalogue,
  widgetCategories,
  type SystemRole,
  type WidgetCategory,
  type WidgetDefinition,
} from "@/data/dashboard-widgets";
import { cn } from "@/lib/utils";

export function WidgetLibraryModal({
  open,
  onOpenChange,
  role,
  activeIds,
  onToggle,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  role: SystemRole;
  activeIds: Set<string>;
  onToggle: (def: WidgetDefinition) => void;
}) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<"All" | WidgetCategory>("All");
  const scope = roleScope[role];

  const allowed = React.useMemo(
    () => widgetCatalogue.filter((w) => canUseWidget(w, role, rolePermissions[role])),
    [role],
  );
  const visible = allowed.filter((w) => {
    if (category !== "All" && w.category !== category) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return w.title.toLowerCase().includes(q) || w.description.toLowerCase().includes(q) || w.type.toLowerCase().includes(q);
  });
  const counts = React.useMemo(() => {
    const m = new Map<string, number>();
    for (const w of allowed) m.set(w.category, (m.get(w.category) ?? 0) + 1);
    return m;
  }, [allowed]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[85vh] max-w-5xl flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl">
        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle className="font-display">Widget library</DialogTitle>
          <DialogDescription>
            {allowed.length} widgets available for your {role} role. Click a preview to add or remove it from your dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-1">
          <aside className="hidden w-52 shrink-0 space-y-0.5 overflow-y-auto border-r border-border p-3 md:block">
            {widgetCategories.map((c) => {
              const n = c === "All" ? allowed.length : (counts.get(c) ?? 0);
              if (n === 0) return null;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
                    category === c && "bg-primary/10 font-medium text-primary hover:bg-primary/10 hover:text-primary",
                  )}
                >
                  {c}
                  <span className="text-xs tabular-nums">{n}</span>
                </button>
              );
            })}
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search widgets…" className="pl-9" />
              </div>
              <div className="flex gap-1 overflow-x-auto md:hidden">
                {widgetCategories.slice(0, 5).map((c) => (
                  <Button key={c} size="sm" variant={category === c ? "default" : "outline"} onClick={() => setCategory(c)}>
                    {c}
                  </Button>
                ))}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((w) => {
                const active = activeIds.has(w.id);
                const data = resolveData(w, scope);
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => onToggle(w)}
                    aria-pressed={active}
                    className={cn(
                      "group flex flex-col overflow-hidden rounded-2xl border bg-card text-left transition-colors hover:border-primary/50",
                      active ? "border-primary ring-2 ring-primary/20" : "border-border",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 px-4 pt-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{resolveTitle(w, scope)}</p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{w.description}</p>
                      </div>
                      <span
                        className={cn(
                          "flex size-7 shrink-0 items-center justify-center rounded-full border",
                          active ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground group-hover:border-primary group-hover:text-primary",
                        )}
                      >
                        {active ? <Check className="size-4" /> : <Plus className="size-4" />}
                      </span>
                    </div>
                    <div className="pointer-events-none relative mt-3 h-44 overflow-hidden px-4">
                      <WidgetBody
                        data={data}
                        def={w}
                        compact
                        instance={{ instanceId: "preview", widgetId: w.id, size: w.defaultSize }}
                      />
                      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-card to-transparent" />
                    </div>
                    <div className="flex items-center gap-1.5 border-t border-border px-4 py-2">
                      <Badge variant="secondary" className="text-[10px]">{w.type}</Badge>
                      <Badge variant="outline" className="text-[10px]">{w.category}</Badge>
                      <span className="ml-auto text-[10px] text-muted-foreground">{sizeLabel[w.defaultSize.w]}</span>
                    </div>
                  </button>
                );
              })}
                {visible.length === 0 ? (
                  <p className="col-span-full py-12 text-center text-sm text-muted-foreground">No widgets match your search.</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
