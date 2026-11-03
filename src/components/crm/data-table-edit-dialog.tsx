import * as React from "react";
import { ArrowDownUp, Filter, Plus, Search, Settings2, Trash2 } from "lucide-react";
import { toast } from "sonner";

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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { crmCampaigns, type ColumnType, type DataColumn, type DataTable, type DataTableView } from "@/data/crm";
import { columnTypes, defaultFor, emptyView, parseOptions, slug, sortLabels } from "@/components/crm/data-table-cells";

type DraftCol = DataColumn & { optionsRaw: string };

export function DataTableEditDialog({
  table,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: {
  table: DataTable;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (next: DataTable) => void;
  onDelete: () => void;
}) {
  const [name, setName] = React.useState(table.name);
  const [campaign, setCampaign] = React.useState(table.campaign);
  const [cols, setCols] = React.useState<DraftCol[]>([]);
  const [view, setView] = React.useState<DataTableView>(emptyView);

  React.useEffect(() => {
    if (!open) return;
    setName(table.name);
    setCampaign(table.campaign);
    setCols(table.columns.map((c) => ({ ...c, optionsRaw: (c.options ?? []).join(", ") })));
    setView(table.view ?? emptyView);
  }, [open, table]);

  const patchCol = (id: string, patch: Partial<DraftCol>) =>
    setCols((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const toggle = (key: "searchColumns" | "filterColumns" | "sortableColumns", id: string, on: boolean) =>
    setView((v) => ({ ...v, [key]: on ? [...v[key], id] : v[key].filter((x) => x !== id) }));

  const named = cols.filter((c) => c.name.trim());

  const save = () => {
    if (!name.trim()) { toast.error("Table name is required"); return; }
    if (!named.length) { toast.error("Keep at least one named column"); return; }
    const ids = new Set(named.map((c) => c.id));
    const columns: DataColumn[] = named.map(({ optionsRaw, ...c }) => {
      const options = c.type === "Dropdown" ? parseOptions(optionsRaw) : undefined;
      const base: DataColumn = { id: c.id, name: c.name.trim(), type: c.type, defaultValue: c.defaultValue };
      return options ? { ...base, options } : base;
    });
    const keep = (arr: string[]) => arr.filter((id) => ids.has(id));
    const nextView: DataTableView = {
      searchColumns: keep(view.searchColumns),
      filterColumns: keep(view.filterColumns),
      sortableColumns: keep(view.sortableColumns),
      defaultSort: view.defaultSort && ids.has(view.defaultSort.columnId) ? view.defaultSort : null,
    };
    // Coerce values of columns whose type changed so cells stay valid.
    const rows = table.rows.map((r) => {
      const next: Record<string, string> = { id: r["id"]! };
      columns.forEach((c) => {
        const prev = table.columns.find((p) => p.id === c.id);
        let v = r[c.id] ?? c.defaultValue;
        if (prev && prev.type !== c.type) {
          if (c.type === "Checkbox") v = v === "Yes" || v === "true" ? "true" : "false";
          else if (c.type === "Yes/No") v = v === "true" || v === "Yes" ? "Yes" : "No";
          else if (c.type === "Number") v = isNaN(parseFloat(v)) ? "" : String(parseFloat(v));
        }
        if (c.type === "Dropdown" && v && !c.options?.includes(v)) v = c.options?.[0] ?? "";
        next[c.id] = v;
      });
      return next;
    });
    onSave({ ...table, name: name.trim(), campaign, columns, rows, view: nextView });
    onOpenChange(false);
    toast.success("Table updated");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-display">Edit table</DialogTitle>
          <DialogDescription>Manage columns, the search bar, filters and sorting for this table.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="columns" className="flex min-h-0 flex-1 flex-col">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="columns"><Settings2 className="mr-1.5 size-4" />Columns</TabsTrigger>
            <TabsTrigger value="search"><Search className="mr-1.5 size-4" />Search</TabsTrigger>
            <TabsTrigger value="filters"><Filter className="mr-1.5 size-4" />Filters</TabsTrigger>
            <TabsTrigger value="sorting"><ArrowDownUp className="mr-1.5 size-4" />Sorting</TabsTrigger>
          </TabsList>

          <div className="min-h-0 flex-1 overflow-y-auto pt-4 pr-1">
            <TabsContent value="columns" className="mt-0 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-dt-name">Table name</Label>
                  <Input id="edit-dt-name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Campaign</Label>
                  <Select value={campaign} onValueChange={setCampaign}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {crmCampaigns.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Columns</Label>
                {cols.map((c) => (
                  <div key={c.id} className="space-y-2 rounded-xl border border-border p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Input
                        value={c.name}
                        onChange={(e) => patchCol(c.id, { name: e.target.value })}
                        placeholder="Column name"
                        aria-label="Column name"
                        className="min-w-32 flex-1"
                      />
                      <Select
                        value={c.type}
                        onValueChange={(v) => {
                          const type = v as ColumnType;
                          patchCol(c.id, { type, defaultValue: defaultFor(type, parseOptions(c.optionsRaw)) });
                        }}
                      >
                        <SelectTrigger className="w-44" aria-label="Column type"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {columnTypes.map((t) => (
                            <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove ${c.name || "column"}`}
                        onClick={() => setCols((cs) => cs.filter((x) => x.id !== c.id))}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                    {c.type === "Dropdown" ? (
                      <Input
                        value={c.optionsRaw}
                        onChange={(e) => patchCol(c.id, { optionsRaw: e.target.value })}
                        placeholder="Dropdown values, comma separated — e.g. Hot, Warm, Cold"
                        aria-label="Dropdown values"
                      />
                    ) : null}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCols((cs) => [
                      ...cs,
                      { id: slug("column", crypto.randomUUID().slice(0, 6)), name: "", type: "Text", defaultValue: "", optionsRaw: "" },
                    ])
                  }
                >
                  <Plus className="mr-2 size-4" />
                  Add column
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="search" className="mt-0 space-y-3">
              <p className="text-sm text-muted-foreground">
                Pick the columns the table's search bar looks in. Matching is partial and ignores letter case.
              </p>
              <ColumnChecklist cols={named} selected={view.searchColumns} onToggle={(id, on) => toggle("searchColumns", id, on)} />
            </TabsContent>

            <TabsContent value="filters" className="mt-0 space-y-3">
              <p className="text-sm text-muted-foreground">
                Each selected column gets a filter above the table: text contains, number and date ranges, or a choice
                list for dropdowns, booleans and checkboxes.
              </p>
              <ColumnChecklist cols={named} selected={view.filterColumns} onToggle={(id, on) => toggle("filterColumns", id, on)} />
            </TabsContent>

            <TabsContent value="sorting" className="mt-0 space-y-4">
              <p className="text-sm text-muted-foreground">
                Sortable columns can be sorted by clicking their header. Sorting follows the column type — numbers by
                value, dates by time, text alphabetically.
              </p>
              <ColumnChecklist cols={named} selected={view.sortableColumns} onToggle={(id, on) => toggle("sortableColumns", id, on)} />
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Default sort</Label>
                  <Select
                    value={view.defaultSort?.columnId ?? "none"}
                    onValueChange={(v) =>
                      setView((s) => ({ ...s, defaultSort: v === "none" ? null : { columnId: v, dir: s.defaultSort?.dir ?? "asc" } }))
                    }
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No default sort</SelectItem>
                      {named.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {view.defaultSort ? (
                  <div className="space-y-2">
                    <Label>Direction</Label>
                    <Select
                      value={view.defaultSort.dir}
                      onValueChange={(v) =>
                        setView((s) => (s.defaultSort ? { ...s, defaultSort: { ...s.defaultSort, dir: v as "asc" | "desc" } } : s))
                      }
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(() => {
                          const col = named.find((c) => c.id === view.defaultSort?.columnId);
                          const [a, d] = sortLabels(col?.type ?? "Text");
                          return (
                            <>
                              <SelectItem value="asc">{a}</SelectItem>
                              <SelectItem value="desc">{d}</SelectItem>
                            </>
                          );
                        })()}
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="flex-row items-center justify-between gap-2 border-t border-border pt-4 sm:justify-between">
          <Button variant="ghost" className="text-destructive hover:text-destructive" onClick={onDelete}>
            <Trash2 className="mr-2 size-4" />
            Delete table
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={save}>Save changes</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ColumnChecklist({
  cols,
  selected,
  onToggle,
}: {
  cols: DataColumn[];
  selected: string[];
  onToggle: (id: string, on: boolean) => void;
}) {
  if (!cols.length) return <p className="text-sm text-muted-foreground">Add a column first.</p>;
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {cols.map((c) => (
        <label key={c.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted/50">
          <Checkbox checked={selected.includes(c.id)} onCheckedChange={(v) => onToggle(c.id, v === true)} />
          <span className="flex-1 font-medium">{c.name}</span>
          <span className="text-xs text-muted-foreground">{columnTypes.find((t) => t.id === c.type)?.label}</span>
        </label>
      ))}
    </div>
  );
}
