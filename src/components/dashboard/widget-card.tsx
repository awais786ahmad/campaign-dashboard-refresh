import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, GripVertical, MoreHorizontal, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { WidgetBody } from "@/components/dashboard/widget-renderers";
import {
  heightOptions,
  resolveData,
  resolveTitle,
  sizeLabel,
  widthOptions,
  type DataScope,
  type WidgetDefinition,
  type WidgetHeight,
  type WidgetInstance,
  type WidgetWidth,
} from "@/data/dashboard-widgets";
import { cn } from "@/lib/utils";

export const ROW_HEIGHT = 72;
export const GRID_GAP = 16;

export function WidgetCard({
  def,
  instance,
  scope,
  editing,
  isMobile,
  dragging,
  dragOver,
  onRemove,
  onResize,
  onConfig,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onDrop,
  columnWidth,
}: {
  def: WidgetDefinition;
  instance: WidgetInstance;
  scope: DataScope;
  editing: boolean;
  isMobile: boolean;
  dragging: boolean;
  dragOver: boolean;
  onRemove: () => void;
  onResize: (size: { w: WidgetWidth; h: WidgetHeight }) => void;
  onConfig: (config: NonNullable<WidgetInstance["config"]>) => void;
  onDragStart: () => void;
  onDragEnter: () => void;
  onDragEnd: () => void;
  onDrop: () => void;
  columnWidth: number;
}) {
  const navigate = useNavigate();
  const data = resolveData(def, scope);
  const title = instance.config?.title ?? resolveTitle(def, scope);
  const w = isMobile ? 12 : instance.size.w;

  const openLink = () => {
    if (!def.link) return;
    const opts = { to: def.link.to, ...(def.link.search ? { search: def.link.search } : {}) };
    navigate(opts as unknown as Parameters<typeof navigate>[0]);
  };

  /* ---- pointer based resize handle (snaps to grid units) ---- */
  const startResize = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = instance.size.w;
    const startH = instance.size.h;
    const move = (ev: PointerEvent) => {
      const dCols = Math.round((ev.clientX - startX) / Math.max(1, columnWidth + GRID_GAP));
      const dRows = Math.round((ev.clientY - startY) / (ROW_HEIGHT + GRID_GAP));
      const targetW = Math.max(def.minSize.w, Math.min(12, startW + dCols));
      const targetH = Math.max(def.minSize.h, Math.min(6, startH + dRows));
      const snapW = widthOptions.reduce((best, o) => (Math.abs(o - targetW) < Math.abs(best - targetW) ? o : best), widthOptions[0]!);
      const snapH = heightOptions.reduce((best, o) => (Math.abs(o - targetH) < Math.abs(best - targetH) ? o : best), heightOptions[0]!);
      if (snapW !== instance.size.w || snapH !== instance.size.h) onResize({ w: snapW, h: snapH });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  return (
    <section
      aria-label={title}
      draggable={editing}
      onDragStart={(e) => {
        if (!editing) return;
        e.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnter={(e) => {
        if (!editing) return;
        e.preventDefault();
        onDragEnter();
      }}
      onDragOver={(e) => editing && e.preventDefault()}
      onDrop={(e) => {
        if (!editing) return;
        e.preventDefault();
        onDrop();
      }}
      onDragEnd={onDragEnd}
      style={{ gridColumn: `span ${w} / span ${w}`, gridRow: `span ${instance.size.h} / span ${instance.size.h}` }}
      className={cn(
        "group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-[box-shadow,transform,opacity]",
        editing && "cursor-grab border-dashed border-primary/40 ring-1 ring-primary/10 active:cursor-grabbing",
        dragging && "opacity-40",
        dragOver && "ring-2 ring-primary",
      )}
    >
      <header className="flex items-center gap-2 px-4 pt-3 pb-2">
        {editing ? <GripVertical className="size-4 shrink-0 text-muted-foreground" /> : null}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-medium">{title}</h3>
        </div>
        {editing ? (
          <>
            <Badge variant="outline" className="hidden text-[10px] sm:inline-flex">
              {sizeLabel[instance.size.w]}
            </Badge>
            <Button variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-destructive" aria-label={`Remove ${title}`} onClick={onRemove}>
              <Trash2 className="size-4" />
            </Button>
          </>
        ) : (
          <>
            {def.link ? (
              <Button variant="ghost" size="icon" className="size-7 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100" aria-label={def.link.label} onClick={openLink}>
                <ArrowUpRight className="size-4" />
              </Button>
            ) : null}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-7 text-muted-foreground" aria-label={`${title} options`}>
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">{def.description}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {def.actions.map((a, i) => (
                  <DropdownMenuItem key={a} onClick={i === 0 && def.link ? openLink : () => toast.info(a)}>
                    {a}
                  </DropdownMenuItem>
                ))}
                {data.kind === "series" ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Chart type</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup
                          value={instance.config?.chart ?? data.defaultChart ?? "area"}
                          onValueChange={(v) => onConfig({ ...instance.config, chart: v as "area" | "bar" | "line" })}
                        >
                          <DropdownMenuRadioItem value="area">Area</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="line">Line</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="bar">Bar</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </>
                ) : null}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toast.success(`${title} refreshed`)}>
                  <RefreshCw className="mr-2 size-4" /> Refresh
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </header>

      <div className={cn("min-h-0 flex-1 overflow-auto px-4 pb-4", editing && "pointer-events-none select-none")}>
        <WidgetBody data={data} def={def} instance={instance} />
      </div>

      {editing && !isMobile ? (
        <button
          type="button"
          aria-label={`Resize ${title}`}
          onPointerDown={startResize}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          className="absolute right-1 bottom-1 size-5 cursor-nwse-resize rounded-sm text-muted-foreground hover:text-primary"
        >
          <svg viewBox="0 0 20 20" className="size-5 fill-current" aria-hidden>
            <circle cx="15" cy="15" r="1.5" />
            <circle cx="10" cy="15" r="1.5" />
            <circle cx="15" cy="10" r="1.5" />
          </svg>
        </button>
      ) : null}
    </section>
  );
}
