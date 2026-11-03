import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { cn } from "@/lib/utils";
import { dashboardNav, type NavItem } from "@/config/dashboard-nav";
import { useShell } from "@/components/dashboard/shell-context";

export const RAIL_WIDTH = "4.5rem";
export const PANEL_WIDTH = "17rem";

function activeGroupId(pathname: string) {
  return dashboardNav.find((item) => item.children?.some((c) => pathname.startsWith(String(c.to))))
    ?.id;
}

export function DashboardSidebar() {
  const { sidebarPinned, setSidebarPinned } = useShell();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [hovered, setHovered] = React.useState(false);
  const [openGroup, setOpenGroup] = React.useState<string | undefined>(() =>
    activeGroupId(pathname),
  );

  React.useEffect(() => {
    const group = activeGroupId(pathname);
    if (group) setOpenGroup(group);
  }, [pathname]);

  const expanded = sidebarPinned || hovered;
  const floating = !sidebarPinned && hovered;

  return (
    <aside
      onMouseEnter={() => !sidebarPinned && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: expanded ? PANEL_WIDTH : RAIL_WIDTH }}
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col overflow-hidden bg-sidebar text-sidebar-foreground",
        "border-r border-sidebar-border transition-[width,box-shadow] duration-300 ease-out",
        floating && "shadow-[var(--shadow-lift)]",
      )}
    >
      <div className="flex h-16 shrink-0 items-center gap-2 px-4">
        <Link to="/dashboard" aria-label="Quality Dial dashboard" className="flex items-center">
          <span className="relative flex size-9 shrink-0 items-center justify-center rounded-xl bg-[image:var(--gradient-ink)] ring-1 ring-sidebar-border">
            <span className="size-3.5 rounded-full bg-[image:var(--gradient-accent)]" />
          </span>
        </Link>
        <span
          className={cn(
            "font-display text-[1.02rem] font-semibold tracking-tight whitespace-nowrap transition-opacity duration-200",
            expanded ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          Quality Dial
        </span>
        <button
          type="button"
          onClick={() => {
            setSidebarPinned(!sidebarPinned);
            setHovered(false);
          }}
          aria-label={sidebarPinned ? "Collapse sidebar" : "Expand sidebar"}
          className={cn(
            "ml-auto grid size-8 shrink-0 place-items-center rounded-lg text-sidebar-foreground/70 transition",
            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            expanded ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          {sidebarPinned ? (
            <PanelLeftClose className="size-4" />
          ) : (
            <PanelLeftOpen className="size-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-x-hidden overflow-y-auto px-3 pb-6">
        {dashboardNav.map((item) =>
          item.children ? (
            <NavGroup
              key={item.id}
              item={item}
              expanded={expanded}
              pathname={pathname}
              open={expanded && openGroup === item.id}
              onToggle={() => setOpenGroup(openGroup === item.id ? undefined : item.id)}
            />
          ) : (
            <NavLeaf key={item.id} item={item} expanded={expanded} pathname={pathname} />
          ),
        )}
      </nav>
    </aside>
  );
}

function rowClasses(active: boolean) {
  return cn(
    "flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
    active
      ? "bg-sidebar-accent text-sidebar-accent-foreground"
      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
  );
}

function NavLeaf({
  item,
  expanded,
  pathname,
}: {
  item: NavItem;
  expanded: boolean;
  pathname: string;
}) {
  const active = pathname === item.to;
  return (
    <Link to={item.to ?? "/dashboard"} className={rowClasses(active)} title={expanded ? undefined : item.label}>
      <item.icon className="size-5 shrink-0" />
      <span
        className={cn(
          "truncate whitespace-nowrap transition-opacity duration-200",
          expanded ? "opacity-100" : "opacity-0",
        )}
      >
        {item.label}
      </span>
      {active ? (
        <span className="ml-auto size-1.5 shrink-0 rounded-full bg-sidebar-primary" />
      ) : null}
    </Link>
  );
}

function NavGroup({
  item,
  expanded,
  pathname,
  open,
  onToggle,
}: {
  item: NavItem;
  expanded: boolean;
  pathname: string;
  open: boolean;
  onToggle: () => void;
}) {
  const groupActive = item.children!.some((c) => pathname === c.to);
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className={rowClasses(groupActive)}
        title={expanded ? undefined : item.label}
      >
        <item.icon className="size-5 shrink-0" />
        <span
          className={cn(
            "truncate whitespace-nowrap transition-opacity duration-200",
            expanded ? "opacity-100" : "opacity-0",
          )}
        >
          {item.label}
        </span>
        <ChevronDown
          className={cn(
            "ml-auto size-4 shrink-0 transition-transform duration-300",
            open && "rotate-180",
            expanded ? "opacity-70" : "opacity-0",
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="mt-1 ml-6 space-y-0.5 border-l border-sidebar-border pl-3">
            {item.children!.map((child) => {
              const active = pathname === child.to;
              return (
                <Link
                  key={String(child.to)}
                  to={child.to ?? "/dashboard"}
                  className={cn(
                    "block truncate rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  )}
                >
                  {child.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
