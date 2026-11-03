import * as React from "react";
import {
  Check,
  Download,
  LayoutGrid,
  MoreHorizontal,
  Plus,
  RefreshCw,
  RotateCcw,
  Settings2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GRID_GAP, ROW_HEIGHT, WidgetCard } from "@/components/dashboard/widget-card";
import { WidgetLibraryModal } from "@/components/dashboard/widget-library-modal";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  canUseWidget,
  dateRanges,
  defaultLayouts,
  rolePermissions,
  roleMeta,
  roleScope,
  scopeOptions,
  widgetById,
  type SystemRole,
  type WidgetDefinition,
  type WidgetInstance,
} from "@/data/dashboard-widgets";

const ROLES: SystemRole[] = ["admin", "supervisor", "agent"];

const storageKey = (role: SystemRole) => `qd-dashboard-layout-${role}`;

function greetingFor(role: SystemRole) {
  const hour = new Date().getHours();
  const part = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const meta = roleMeta[role];
  return `${part}, ${meta.name}. ${meta.greeting}`;
}

function cloneLayout(widgets: WidgetInstance[]): WidgetInstance[] {
  return widgets.map((w) => ({
    ...w,
    size: { ...w.size },
    ...(w.config ? { config: { ...w.config } } : {}),
  }));
}

function freshLayout(role: SystemRole): WidgetInstance[] {
  return defaultLayouts[role].map((w) => ({ ...w, size: { ...w.size } }));
}

export function DashboardPage() {
  const isMobile = useIsMobile();

  const [role, setRole] = React.useState<SystemRole>("admin");
  const [widgets, setWidgets] = React.useState<WidgetInstance[]>(() => freshLayout("admin"));
  const [editing, setEditing] = React.useState(false);
  const [libraryOpen, setLibraryOpen] = React.useState(false);
  const [range, setRange] = React.useState(dateRanges[0]!);
  const [scope, setScope] = React.useState(scopeOptions.admin[0]!);
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const [overIndex, setOverIndex] = React.useState<number | null>(null);

  /** Snapshot taken when entering edit mode so "Cancel" can revert. */
  const snapshot = React.useRef<WidgetInstance[] | null>(null);

  const gridRef = React.useRef<HTMLDivElement>(null);
  const [columnWidth, setColumnWidth] = React.useState(96);

  const permissions = rolePermissions[role];
  const dataScope = roleScope[role];

  /* ------------------------------------------------- load persisted layout */
  const loadLayout = React.useCallback((next: SystemRole) => {
    try {
      const raw = window.localStorage.getItem(storageKey(next));
      if (raw) {
        const parsed = JSON.parse(raw) as WidgetInstance[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setWidgets(parsed.filter((w) => widgetById.has(w.widgetId)));
          return;
        }
      }
    } catch {
      /* corrupted layout — fall back to the role default */
    }
    setWidgets(freshLayout(next));
  }, []);

  React.useEffect(() => {
    loadLayout(role);
    setScope(scopeOptions[role][0]!);
    setEditing(false);
  }, [role, loadLayout]);

  /* ------------------------------------------------ measure a grid column */
  React.useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const measure = () => {
      const total = el.clientWidth;
      setColumnWidth(Math.max(24, (total - GRID_GAP * 11) / 12));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const visible = React.useMemo(
    () =>
      widgets
        .map((instance) => ({ instance, def: widgetById.get(instance.widgetId) }))
        .filter(
          (x): x is { instance: WidgetInstance; def: WidgetDefinition } =>
            !!x.def && canUseWidget(x.def, role, permissions),
        ),
    [widgets, role, permissions],
  );

  const activeIds = React.useMemo(() => new Set(widgets.map((w) => w.widgetId)), [widgets]);

  /* ----------------------------------------------------------- edit flow */
  const startEditing = () => {
    snapshot.current = cloneLayout(widgets);
    setEditing(true);
  };

  const save = () => {
    window.localStorage.setItem(storageKey(role), JSON.stringify(widgets));
    snapshot.current = null;
    setEditing(false);
    toast.success("Dashboard layout saved", { description: `Saved for your ${roleMeta[role].label} view.` });
  };

  const cancel = () => {
    if (snapshot.current) setWidgets(snapshot.current);
    snapshot.current = null;
    setEditing(false);
  };

  const resetLayout = () => {
    window.localStorage.removeItem(storageKey(role));
    setWidgets(freshLayout(role));
    snapshot.current = null;
    toast.info(`Restored the default ${roleMeta[role].label} dashboard`);
  };

  const toggleWidget = (def: WidgetDefinition) => {
    setWidgets((list) => {
      if (list.some((w) => w.widgetId === def.id)) {
        return list.filter((w) => w.widgetId !== def.id);
      }
      return [
        ...list,
        {
          instanceId: `${def.id}-${Math.random().toString(36).slice(2, 9)}`,
          widgetId: def.id,
          size: { ...def.defaultSize },
        },
      ];
    });
  };

  const update = (instanceId: string, patch: Partial<WidgetInstance>) =>
    setWidgets((list) => list.map((w) => (w.instanceId === instanceId ? { ...w, ...patch } : w)));

  const remove = (instanceId: string) =>
    setWidgets((list) => list.filter((w) => w.instanceId !== instanceId));

  const commitDrop = () => {
    if (dragIndex === null || overIndex === null || dragIndex === overIndex) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }
    const fromId = visible[dragIndex]?.instance.instanceId;
    const toId = visible[overIndex]?.instance.instanceId;
    setWidgets((list) => {
      const from = list.findIndex((w) => w.instanceId === fromId);
      const to = list.findIndex((w) => w.instanceId === toId);
      if (from < 0 || to < 0) return list;
      const next = [...list];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved!);
      return next;
    });
    setDragIndex(null);
    setOverIndex(null);
  };

  const exportDashboard = () => {
    const payload = JSON.stringify({ role, range, scope, widgets }, null, 2);
    const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `quality-dial-dashboard-${role}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Dashboard exported");
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      {/* --------------------------------------------------------- header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">{greetingFor(role)}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-[150px]" aria-label="Date range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dateRanges.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={scope} onValueChange={setScope}>
            <SelectTrigger className="w-[170px]" aria-label="Data scope">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {scopeOptions[role].map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {editing ? (
            <>
              <Button variant="outline" onClick={() => setLibraryOpen(true)}>
                <Plus className="mr-2 size-4" />
                New widgets
              </Button>
              <Button variant="ghost" onClick={cancel}>
                <X className="mr-2 size-4" />
                Cancel
              </Button>
              <Button onClick={save}>
                <Check className="mr-2 size-4" />
                Save
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={startEditing}>
              <Settings2 className="mr-2 size-4" />
              Customize
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Dashboard options">
                <MoreHorizontal className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuItem onClick={() => toast.success("Dashboard refreshed")}>
                <RefreshCw className="mr-2 size-4" /> Refresh dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={resetLayout}>
                <RotateCcw className="mr-2 size-4" /> Reset to default layout
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportDashboard}>
                <Download className="mr-2 size-4" /> Export dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLibraryOpen(true)}>
                <LayoutGrid className="mr-2 size-4" /> Widget library
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                Preview dashboard as
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup value={role} onValueChange={(v) => setRole(v as SystemRole)}>
                {ROLES.map((r) => (
                  <DropdownMenuRadioItem key={r} value={r}>
                    {roleMeta[r].label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {editing ? (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-4 py-3 text-sm">
          <Badge variant="secondary">Editing</Badge>
          <span className="text-muted-foreground">
            Drag widgets to rearrange, drag the bottom-right corner to resize, or remove them with the
            trash icon. Changes apply after you press Save.
          </span>
        </div>
      ) : null}

      {/* ----------------------------------------------------------- grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-12"
        style={{ gap: GRID_GAP, gridAutoRows: `${ROW_HEIGHT}px` }}
      >
        {visible.map(({ instance, def }, index) => (
          <WidgetCard
            key={instance.instanceId}
            def={def}
            instance={instance}
            scope={dataScope}
            editing={editing}
            isMobile={isMobile}
            columnWidth={columnWidth}
            dragging={dragIndex === index}
            dragOver={overIndex === index && dragIndex !== index}
            onRemove={() => remove(instance.instanceId)}
            onResize={(size) => update(instance.instanceId, { size })}
            onConfig={(config) => update(instance.instanceId, { config })}
            onDragStart={() => setDragIndex(index)}
            onDragEnter={() => setOverIndex(index)}
            onDragEnd={() => {
              setDragIndex(null);
              setOverIndex(null);
            }}
            onDrop={commitDrop}
          />
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="font-display text-lg font-semibold">Your dashboard is empty</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add widgets from the library to build your command center.
          </p>
          <Button
            className="mt-4"
            onClick={() => {
              if (!editing) startEditing();
              setLibraryOpen(true);
            }}
          >
            <Plus className="mr-2 size-4" /> Add widgets
          </Button>
        </div>
      ) : null}

      <WidgetLibraryModal
        open={libraryOpen}
        onOpenChange={(v) => {
          if (v && !editing) startEditing();
          setLibraryOpen(v);
        }}
        role={role}
        activeIds={activeIds}
        onToggle={toggleWidget}
      />
    </div>
  );
}
