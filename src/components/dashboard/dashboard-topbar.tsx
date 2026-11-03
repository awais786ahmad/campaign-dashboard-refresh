import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  CircleUser,
  HelpCircle,
  LogOut,
  Moon,
  PanelLeftOpen,
  Phone,
  Settings,
  Sun,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { findBreadcrumbs } from "@/config/dashboard-nav";
import { GlobalSearch } from "@/components/dashboard/global-search";
import { NotificationsMenu } from "@/components/dashboard/notifications-menu";
import { DialerDrawer } from "@/components/dashboard/dialer-drawer";
import { useShell } from "@/components/dashboard/shell-context";

export function DashboardTopbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const crumbs = findBreadcrumbs(pathname);
  const { sidebarPinned, setSidebarPinned, theme, toggleTheme } = useShell();
  const [dialerOpen, setDialerOpen] = React.useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur md:px-6">
        {!sidebarPinned ? (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Expand sidebar"
            onClick={() => setSidebarPinned(true)}
          >
            <PanelLeftOpen className="size-5" />
          </Button>
        ) : null}

        <nav aria-label="Breadcrumb" className="hidden min-w-0 shrink-0 items-center gap-2 sm:flex">
          {crumbs.map((crumb, i) => (
            <span key={`${crumb.label}-${i}`} className="flex items-center gap-2">
              {i > 0 ? <span className="text-muted-foreground/60">/</span> : null}
              {crumb.to ? (
                <Link
                  to={crumb.to}
                  className="truncate text-sm font-medium text-foreground hover:text-primary"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="truncate text-sm text-muted-foreground">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        <div className="flex flex-1 justify-start pl-2 md:pl-6">
          <GlobalSearch />
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open dialer"
            onClick={() => setDialerOpen(true)}
          >
            <Phone className="size-5" />
          </Button>

          <NotificationsMenu />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Account menu"
                className="ml-1 rounded-full ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <Avatar className="size-9">
                  <AvatarFallback className="bg-primary text-primary-foreground">AA</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col">
                <span>Awais Ahmad</span>
                <span className="text-xs font-normal text-muted-foreground">
                  awais@qualitydial.com
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings/profile">
                  <CircleUser className="mr-2 size-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/organization/workspace">
                  <Settings className="mr-2 size-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/contact">
                  <HelpCircle className="mr-2 size-4" />
                  Help & support
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={toggleTheme}>
                {theme === "dark" ? (
                  <Sun className="mr-2 size-4" />
                ) : (
                  <Moon className="mr-2 size-4" />
                )}
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/auth/login">
                  <LogOut className="mr-2 size-4" />
                  Sign out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <DialerDrawer open={dialerOpen} onOpenChange={setDialerOpen} />
    </>
  );
}
