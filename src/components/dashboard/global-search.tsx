import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { Clock, Search } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { searchableEntries } from "@/config/dashboard-nav";

const recentSearches = [
  "Priya Raman",
  "Q3 renewal outreach",
  "Missed calls yesterday",
  "AI agent Nova",
];

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const groups = React.useMemo(() => {
    const map = new Map<string, typeof searchableEntries>();
    for (const entry of searchableEntries) {
      map.set(entry.group, [...(map.get(entry.group) ?? []), entry]);
    }
    return [...map.entries()];
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 w-full max-w-md items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted"
      >
        <Search className="size-4" />
        <span className="truncate">Search leads, campaigns, settings…</span>
        <kbd className="ml-auto hidden rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] sm:block">
          ⌘K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search across Quality Dial…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Recent searches">
            {recentSearches.map((item) => (
              <CommandItem key={item} value={item} onSelect={() => setOpen(false)}>
                <Clock className="mr-2 size-4 text-muted-foreground" />
                {item}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          {groups.map(([group, entries]) => (
            <CommandGroup key={group} heading={group}>
              {entries.map((entry) => (
                <CommandItem
                  key={String(entry.to)}
                  value={`${group} ${entry.label}`}
                  onSelect={() => {
                    setOpen(false);
                    void navigate({ to: entry.to ?? "/dashboard" });
                  }}
                >
                  <Search className="mr-2 size-4 text-muted-foreground" />
                  {entry.label}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
