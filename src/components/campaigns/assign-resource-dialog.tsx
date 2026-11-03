import * as React from "react";
import { Plus, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export type AssignOption = {
  id: string;
  name: string;
  description?: string;
  meta?: string;
};

/**
 * Reusable multi-select picker used by the campaign tabs to assign segments,
 * scripts, templates, data tables and automations from the shared libraries.
 */
export function AssignResourceDialog({
  open,
  onOpenChange,
  title,
  description,
  options,
  assigned,
  createLabel,
  onCreate,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description: string;
  options: AssignOption[];
  assigned: string[];
  createLabel?: string;
  onCreate?: () => void;
  onSave: (names: string[]) => void;
}) {
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<string[]>(assigned);

  React.useEffect(() => {
    if (open) {
      setSelected(assigned);
      setQuery("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const filtered = options.filter((o) =>
    `${o.name} ${o.description ?? ""}`.toLowerCase().includes(query.toLowerCase()),
  );

  const toggle = (name: string) =>
    setSelected((s) => (s.includes(name) ? s.filter((x) => x !== name) : [...s, name]));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-45 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search library"
              className="pl-9"
            />
          </div>
          {createLabel && onCreate ? (
            <Button variant="outline" size="sm" onClick={onCreate}>
              <Plus className="mr-2 size-3.5" />
              {createLabel}
            </Button>
          ) : null}
        </div>

        <ScrollArea className="max-h-[46vh]">
          <div className="space-y-2 pr-3">
            {filtered.map((option) => (
              <label
                key={option.id}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors",
                  selected.includes(option.name)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40",
                )}
              >
                <Checkbox
                  checked={selected.includes(option.name)}
                  onCheckedChange={() => toggle(option.name)}
                  aria-label={`Select ${option.name}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium">{option.name}</span>
                    {option.meta ? (
                      <Badge variant="outline" className="shrink-0 font-normal">
                        {option.meta}
                      </Badge>
                    ) : null}
                  </div>
                  {option.description ? (
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  ) : null}
                </div>
              </label>
            ))}
            {filtered.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Nothing matches your search.
              </p>
            ) : null}
          </div>
        </ScrollArea>

        <DialogFooter className="items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            {selected.length} selected of {options.length}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onSave(selected);
                onOpenChange(false);
              }}
            >
              Save selection
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
