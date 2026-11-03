import * as React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Plus, Search, Table2, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfirmDialog, RecordFormModal } from "@/components/dashboard/crud";
import { SettingsHeader } from "@/components/settings/settings-header";
import { crmCampaigns, dataTableSeed, type ColumnType, type DataColumn, type DataTable } from "@/data/crm";
import {
  CellEditor,
  FilterControl,
  columnTypes,
  compareValues,
  defaultFor,
  emptyView,
  matchesFilter,
  parseOptions,
  slug,
  type FilterValue,
} from "@/components/crm/data-table-cells";
import { DataTableEditDialog } from "@/components/crm/data-table-edit-dialog";

type DraftColumn = { name: string; type: ColumnType; defaultValue: string; optionsRaw: string };

const emptyTableForm = {
  name: "",
  campaign: crmCampaigns[0]!,
  columns: [{ name: "", type: "Text" as ColumnType, defaultValue: "", optionsRaw: "" }] as DraftColumn[],
};

export function DataTablesPage() {
  const [tables, setTables] = React.useState<DataTable[]>(dataTableSeed);
  const [activeId, setActiveId] = React.useState<string>(dataTableSeed[0]?.id ?? "");
  const [formOpen, setFormOpen] = React.useState(false);
  const [form, setForm] = React.useState(emptyTableForm);
  const [deletingRow, setDeletingRow] = React.useState<{ tableId: string; rowId: string } | null>(null);
  const [deletingTable, setDeletingTable] = React.useState<DataTable | null>(null);
  const [editOpen, setEditOpen] = React.useState(false);
  const [newRow, setNewRow] = React.useState<Record<string, string>>({});
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState<Record<string, FilterValue>>({});
  const [sort, setSort] = React.useState<{ columnId: string; dir: "asc" | "desc" } | null>(null);
  const [addingCol, setAddingCol] = React.useState<string | null>(null);

  const active = tables.find((t) => t.id === activeId) ?? null;
  const view = active?.view ?? emptyView;

  const seedRow = (table: DataTable) => {
    const seed: Record<string, string> = {};
    table.columns.forEach((c) => (seed[c.id] = c.defaultValue));
    setNewRow(seed);
  };

  React.useEffect(() => {
    if (!active) return;
    seedRow(active);
    setSearch("");
    setFilters({});
    setSort(active.view?.defaultSort ?? null);
    setAddingCol(null);
  }, [activeId]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateActive = (fn: (t: DataTable) => DataTable) =>
    setTables((ts) => ts.map((t) => (t.id === activeId ? fn(t) : t)));

  const addRow = () => {
    if (!active) return;
    const hasValue = active.columns.some((c) => {
      const v = (newRow[c.id] ?? "").trim();
      return v && v !== c.defaultValue;
    }) || active.columns.some((c) => (newRow[c.id] ?? "").trim() && c.type === "Text");
    if (!hasValue) {
      toast.error("Fill at least one cell before adding the row");
      return;
    }
    const row = { id: crypto.randomUUID(), ...newRow };
    updateActive((t) => ({ ...t, rows: [...t.rows, row] }));
    seedRow(active);
    toast.success("Row added");
  };

  const editCell = (rowId: string, colId: string, value: string) =>
    updateActive((t) => ({ ...t, rows: t.rows.map((r) => (r["id"] === rowId ? { ...r, [colId]: value } : r)) }));

  const commitNewColumn = () => {
    const name = (addingCol ?? "").trim();
    if (!active || !name) {
      setAddingCol(null);
      return;
    }
    const col: DataColumn = { id: slug(name, crypto.randomUUID().slice(0, 6)), name, type: "Text", defaultValue: "" };
    updateActive((t) => ({ ...t, columns: [...t.columns, col], rows: t.rows.map((r) => ({ ...r, [col.id]: "" })) }));
    setNewRow((r) => ({ ...r, [col.id]: "" }));
    setAddingCol(null);
    toast.success(`Column "${name}" added`, { description: "Change its type in Edit table." });
  };

  const updateColumn = (i: number, patch: Partial<DraftColumn>) =>
    setForm((f) => ({ ...f, columns: f.columns.map((c, idx) => (idx === i ? { ...c, ...patch } : c)) }));

  const createTable = () => {
    const name = form.name.trim();
    const cols = form.columns.filter((c) => c.name.trim());
    if (!name || !cols.length) {
      toast.error("A table needs a name and at least one column");
      return;
    }
    const badDropdown = cols.find((c) => c.type === "Dropdown" && !parseOptions(c.optionsRaw).length);
    if (badDropdown) {
      toast.error(`Add at least one value to the "${badDropdown.name}" dropdown`);
      return;
    }
    const columns: DataColumn[] = cols.map((c, i) => {
      const base: DataColumn = { id: slug(c.name, i), name: c.name.trim(), type: c.type, defaultValue: c.defaultValue };
      return c.type === "Dropdown" ? { ...base, options: parseOptions(c.optionsRaw) } : base;
    });
    const table: DataTable = {
      id: crypto.randomUUID(),
      name,
      campaign: form.campaign,
      createdAt: "Today",
      columns,
      rows: [],
      view: { ...emptyView, searchColumns: columns.filter((c) => c.type === "Text").map((c) => c.id) },
    };
    setTables((ts) => [table, ...ts]);
    setActiveId(table.id);
    setForm(emptyTableForm);
    toast.success("Table created");
  };

  /* ---------------------------------------------- derived rows */
  const visibleRows = React.useMemo(() => {
    if (!active) return [];
    const q = search.trim().toLowerCase();
    let rows = active.rows.filter((r) => {
      if (q && view.searchColumns.length && !view.searchColumns.some((id) => (r[id] ?? "").toLowerCase().includes(q)))
        return false;
      return active.columns.every((c) => !view.filterColumns.includes(c.id) || matchesFilter(c, r[c.id] ?? "", filters[c.id]));
    });
    if (sort) {
      const col = active.columns.find((c) => c.id === sort.columnId);
      if (col) {
        rows = [...rows].sort((a, b) => {
          const d = compareValues(col.type, a[col.id] ?? "", b[col.id] ?? "", col.options);
          return sort.dir === "asc" ? d : -d;
        });
      }
    }
    return rows;
  }, [active, search, filters, sort, view]);

  const filterCols = active ? active.columns.filter((c) => view.filterColumns.includes(c.id)) : [];
  const searchNames = active
    ? active.columns.filter((c) => view.searchColumns.includes(c.id)).map((c) => c.name)
    : [];
  const hasActiveQuery =
    !!search.trim() || Object.values(filters).some((f) => f.text || f.min || f.max || (f.choice && f.choice !== "all"));

  const cycleSort = (c: DataColumn) => {
    if (!view.sortableColumns.includes(c.id)) return;
    setSort((s) => (s?.columnId !== c.id ? { columnId: c.id, dir: "asc" } : s.dir === "asc" ? { columnId: c.id, dir: "desc" } : null));
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <SettingsHeader
        title="Data tables"
        description="Spreadsheet-style datasets your campaigns and AI agents can read from."
      />

      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <Card className="h-fit">
          <CardContent className="space-y-1 p-3">
            <Button
              className="mb-2 w-full justify-start"
              variant="outline"
              onClick={() => {
                setForm(emptyTableForm);
                setFormOpen(true);
              }}
            >
              <Plus className="mr-2 size-4" />
              Create new table
            </Button>
            {tables.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveId(t.id)}
                className={`flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  t.id === activeId ? "bg-accent-soft text-foreground" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Table2 className="mt-0.5 size-4 shrink-0" />
                <span className="min-w-0">
                  <span className="block truncate font-medium">{t.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{t.rows.length} rows</span>
                </span>
              </button>
            ))}
          </CardContent>
        </Card>

        {active ? (
          <Card className="min-w-0">
            <CardContent className="p-0">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
                <div>
                  <h2 className="text-base font-medium">{active.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    Created {active.createdAt} · {active.columns.length} columns
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{active.campaign}</Badge>
                  <Button variant="ghost" size="icon" aria-label="Edit table" onClick={() => setEditOpen(true)}>
                    <Pencil className="size-4" />
                  </Button>
                </div>
              </div>

              {searchNames.length || filterCols.length ? (
                <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
                  {searchNames.length ? (
                    <div className="relative w-full sm:w-64">
                      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={`Search ${searchNames.join(", ")}`}
                        className="h-8 pl-9"
                        aria-label="Search table"
                      />
                    </div>
                  ) : null}
                  {filterCols.map((c) => (
                    <div key={c.id} className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">{c.name}</span>
                      <FilterControl
                        column={c}
                        value={filters[c.id] ?? {}}
                        onChange={(v) => setFilters((f) => ({ ...f, [c.id]: v }))}
                      />
                    </div>
                  ))}
                  {hasActiveQuery ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearch("");
                        setFilters({});
                      }}
                    >
                      <X className="mr-1 size-4" />
                      Clear
                    </Button>
                  ) : null}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {visibleRows.length} of {active.rows.length} rows
                  </span>
                </div>
              ) : null}

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12" />
                      {active.columns.map((c) => {
                        const sortable = view.sortableColumns.includes(c.id);
                        const dir = sort?.columnId === c.id ? sort.dir : null;
                        return (
                          <TableHead key={c.id} className="min-w-40">
                            {sortable ? (
                              <button
                                type="button"
                                onClick={() => cycleSort(c)}
                                className="inline-flex items-center gap-1 hover:text-foreground"
                                aria-label={`Sort by ${c.name}`}
                              >
                                {c.name}
                                {dir === "asc" ? (
                                  <ArrowUp className="size-3.5" />
                                ) : dir === "desc" ? (
                                  <ArrowDown className="size-3.5" />
                                ) : (
                                  <ArrowUpDown className="size-3.5 opacity-50" />
                                )}
                              </button>
                            ) : (
                              c.name
                            )}
                            <span className="ml-2 text-xs font-normal text-muted-foreground">{c.type}</span>
                          </TableHead>
                        );
                      })}
                      <TableHead className={addingCol !== null ? "min-w-44" : "w-12"}>
                        {addingCol !== null ? (
                          <Input
                            autoFocus
                            value={addingCol}
                            onChange={(e) => setAddingCol(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") commitNewColumn();
                              if (e.key === "Escape") setAddingCol(null);
                            }}
                            onBlur={commitNewColumn}
                            placeholder="Column name ↵"
                            className="h-8"
                            aria-label="New column name"
                          />
                        ) : (
                          <Button size="icon" variant="ghost" aria-label="Add column" onClick={() => setAddingCol("")}>
                            <Plus className="size-4" />
                          </Button>
                        )}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-muted/40">
                      <TableCell>
                        <Button size="icon" variant="ghost" aria-label="Add row" onClick={addRow}>
                          <Plus className="size-4" />
                        </Button>
                      </TableCell>
                      {active.columns.map((c) => (
                        <TableCell key={c.id}>
                          <CellEditor
                            column={c}
                            value={newRow[c.id] ?? ""}
                            onChange={(v) => setNewRow((r) => ({ ...r, [c.id]: v }))}
                            onEnter={addRow}
                            placeholder={c.name}
                            className="border-transparent bg-background"
                          />
                        </TableCell>
                      ))}
                      <TableCell />
                    </TableRow>
                    {visibleRows.map((row) => (
                      <TableRow key={row["id"]}>
                        <TableCell className="text-xs text-muted-foreground">•</TableCell>
                        {active.columns.map((c) => (
                          <TableCell key={c.id}>
                            <CellEditor
                              column={c}
                              value={row[c.id] ?? ""}
                              onChange={(v) => editCell(row["id"]!, c.id, v)}
                              className="border-transparent bg-transparent hover:border-border focus:border-ring"
                            />
                          </TableCell>
                        ))}
                        <TableCell>
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label="Delete row"
                            onClick={() => setDeletingRow({ tableId: active.id, rowId: row["id"]! })}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!visibleRows.length ? (
                      <TableRow>
                        <TableCell
                          colSpan={active.columns.length + 2}
                          className="py-10 text-center text-sm text-muted-foreground"
                        >
                          {active.rows.length
                            ? "No rows match your search or filters."
                            : "No rows yet — fill the row above and press the plus button."}
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-16 text-center text-sm text-muted-foreground">
              Create a table to get started.
            </CardContent>
          </Card>
        )}
      </div>

      <RecordFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        title="New data table"
        description="Define the columns, their data type and an optional default value."
        mode="create"
        onSubmit={createTable}
        onSaveDraft={() => toast.info("Table saved as draft")}
      >
        <div className="space-y-2">
          <Label htmlFor="dt-name">Table name</Label>
          <Input id="dt-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>Campaign</Label>
          <Select value={form.campaign} onValueChange={(v) => setForm((f) => ({ ...f, campaign: v }))}>
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
        <div className="space-y-3">
          <Label>Columns</Label>
          {form.columns.map((c, i) => {
            const draftCol: DataColumn = {
              id: `draft-${i}`,
              name: "Default",
              type: c.type,
              defaultValue: c.defaultValue,
              options: parseOptions(c.optionsRaw),
            };
            return (
              <div key={i} className="space-y-2 rounded-xl border border-border p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    value={c.name}
                    onChange={(e) => updateColumn(i, { name: e.target.value })}
                    placeholder="Column name"
                    className="min-w-32 flex-1"
                  />
                  <Select
                    value={c.type}
                    onValueChange={(v) => {
                      const type = v as ColumnType;
                      updateColumn(i, { type, defaultValue: defaultFor(type, parseOptions(c.optionsRaw)) });
                    }}
                  >
                    <SelectTrigger className="w-44" aria-label="Column type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {columnTypes.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Remove column"
                    onClick={() => setForm((f) => ({ ...f, columns: f.columns.filter((_, idx) => idx !== i) }))}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
                {c.type === "Dropdown" ? (
                  <Input
                    value={c.optionsRaw}
                    onChange={(e) => {
                      const opts = parseOptions(e.target.value);
                      updateColumn(i, {
                        optionsRaw: e.target.value,
                        defaultValue: opts.includes(c.defaultValue) ? c.defaultValue : (opts[0] ?? ""),
                      });
                    }}
                    placeholder="Dropdown values, comma separated — e.g. Hot, Warm, Cold"
                    aria-label="Dropdown values"
                  />
                ) : null}
                <div className="flex items-center gap-2">
                  <span className="w-16 text-xs text-muted-foreground">Default</span>
                  <div className="w-48">
                    <CellEditor
                      column={draftCol}
                      value={c.defaultValue}
                      onChange={(v) => updateColumn(i, { defaultValue: v })}
                      placeholder="Optional"
                    />
                  </div>
                </div>
              </div>
            );
          })}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setForm((f) => ({ ...f, columns: [...f.columns, { name: "", type: "Text", defaultValue: "", optionsRaw: "" }] }))
            }
          >
            <Plus className="mr-2 size-4" />
            Add column
          </Button>
        </div>
      </RecordFormModal>

      {active ? (
        <DataTableEditDialog
          table={active}
          open={editOpen}
          onOpenChange={setEditOpen}
          onSave={(next) => {
            updateActive(() => next);
            seedRow(next);
            setFilters({});
            setSort(next.view?.defaultSort ?? null);
          }}
          onDelete={() => {
            setEditOpen(false);
            setDeletingTable(active);
          }}
        />
      ) : null}

      <ConfirmDialog
        open={!!deletingRow}
        onOpenChange={(v) => !v && setDeletingRow(null)}
        title="Delete this row?"
        description="The row will be removed from the table."
        confirmLabel="Delete row"
        destructive
        onConfirm={() => {
          setTables((ts) =>
            ts.map((t) =>
              t.id === deletingRow?.tableId ? { ...t, rows: t.rows.filter((r) => r["id"] !== deletingRow.rowId) } : t,
            ),
          );
          setDeletingRow(null);
          toast.success("Row deleted");
        }}
      />

      <ConfirmDialog
        open={!!deletingTable}
        onOpenChange={(v) => !v && setDeletingTable(null)}
        title={`Delete "${deletingTable?.name}"?`}
        description="All rows in this table will be permanently removed."
        confirmLabel="Delete table"
        destructive
        onConfirm={() => {
          const rest = tables.filter((t) => t.id !== deletingTable?.id);
          setTables(rest);
          setActiveId(rest[0]?.id ?? "");
          setDeletingTable(null);
          toast.success("Table deleted");
        }}
      />
    </div>
  );
}
