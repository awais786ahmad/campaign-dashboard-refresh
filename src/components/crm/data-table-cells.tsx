import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ColumnType, DataColumn, DataTableView } from "@/data/crm";

export const columnTypes: { id: ColumnType; label: string }[] = [
  { id: "Text", label: "Text" },
  { id: "Number", label: "Number" },
  { id: "Date", label: "Date" },
  { id: "Yes/No", label: "Boolean (Yes/No)" },
  { id: "Dropdown", label: "Dropdown" },
  { id: "Checkbox", label: "Checkbox" },
];

export const emptyView: DataTableView = {
  searchColumns: [],
  filterColumns: [],
  sortableColumns: [],
  defaultSort: null,
};

export const slug = (name: string, i: number | string) =>
  `${name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || "col"}_${i}`;

export const parseOptions = (raw: string) =>
  Array.from(new Set(raw.split(",").map((s) => s.trim()).filter(Boolean)));

/** Default value used when a column is created or its type changes. */
export const defaultFor = (type: ColumnType, options?: string[]) =>
  type === "Checkbox" ? "false" : type === "Yes/No" ? "No" : type === "Dropdown" ? (options?.[0] ?? "") : "";

/** Compare two raw cell values according to the column's data type. */
export function compareValues(type: ColumnType, a: string, b: string, options?: string[]) {
  if (type === "Number") return (parseFloat(a) || 0) - (parseFloat(b) || 0);
  if (type === "Date") return (Date.parse(a) || 0) - (Date.parse(b) || 0);
  if (type === "Checkbox") return Number(a === "true") - Number(b === "true");
  if (type === "Yes/No") return Number(a === "Yes") - Number(b === "Yes");
  if (type === "Dropdown" && options?.length) return options.indexOf(a) - options.indexOf(b);
  return a.localeCompare(b, undefined, { sensitivity: "base" });
}

export const sortLabels = (type: ColumnType): [string, string] =>
  type === "Number"
    ? ["Low → High", "High → Low"]
    : type === "Date"
      ? ["Oldest first", "Newest first"]
      : type === "Checkbox" || type === "Yes/No"
        ? ["No first", "Yes first"]
        : type === "Dropdown"
          ? ["Option order", "Reverse order"]
          : ["A → Z", "Z → A"];

export function CellEditor({
  column,
  value,
  onChange,
  onEnter,
  placeholder,
  className,
}: {
  column: DataColumn;
  value: string;
  onChange: (v: string) => void;
  onEnter?: () => void;
  placeholder?: string;
  className?: string;
}) {
  if (column.type === "Checkbox") {
    return (
      <div className="flex h-8 items-center px-2">
        <Checkbox
          checked={value === "true"}
          onCheckedChange={(v) => onChange(v === true ? "true" : "false")}
          aria-label={column.name}
        />
      </div>
    );
  }
  if (column.type === "Yes/No" || column.type === "Dropdown") {
    const opts = column.type === "Yes/No" ? ["Yes", "No"] : (column.options ?? []);
    return (
      <Select {...(value ? { value } : {})} onValueChange={onChange}>
        <SelectTrigger className={`h-8 ${className ?? ""}`} aria-label={column.name}>
          <SelectValue placeholder={placeholder ?? "Select"} />
        </SelectTrigger>
        <SelectContent>
          {opts.length ? (
            opts.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))
          ) : (
            <div className="px-2 py-1.5 text-xs text-muted-foreground">No options — add them in Edit table.</div>
          )}
        </SelectContent>
      </Select>
    );
  }
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
      placeholder={placeholder}
      type={column.type === "Number" ? "number" : column.type === "Date" ? "date" : "text"}
      className={`h-8 ${className ?? ""}`}
    />
  );
}

export type FilterValue = { text?: string; min?: string; max?: string; choice?: string };

export function matchesFilter(column: DataColumn, raw: string, f: FilterValue | undefined) {
  if (!f) return true;
  const v = raw ?? "";
  switch (column.type) {
    case "Number": {
      const n = parseFloat(v);
      if (f.min && !(n >= parseFloat(f.min))) return false;
      if (f.max && !(n <= parseFloat(f.max))) return false;
      return true;
    }
    case "Date": {
      if (f.min && !(v >= f.min)) return false;
      if (f.max && !(v && v <= f.max)) return false;
      return true;
    }
    case "Yes/No":
    case "Dropdown":
    case "Checkbox":
      return !f.choice || f.choice === "all" || v === f.choice;
    default:
      return !f.text || v.toLowerCase().includes(f.text.toLowerCase());
  }
}

export function FilterControl({
  column,
  value,
  onChange,
}: {
  column: DataColumn;
  value: FilterValue;
  onChange: (v: FilterValue) => void;
}) {
  if (column.type === "Number" || column.type === "Date") {
    const type = column.type === "Number" ? "number" : "date";
    return (
      <div className="flex items-center gap-1">
        <Input
          type={type}
          value={value.min ?? ""}
          onChange={(e) => onChange({ ...value, min: e.target.value })}
          placeholder="Min"
          className="h-8 w-28"
          aria-label={`${column.name} from`}
        />
        <span className="text-xs text-muted-foreground">–</span>
        <Input
          type={type}
          value={value.max ?? ""}
          onChange={(e) => onChange({ ...value, max: e.target.value })}
          placeholder="Max"
          className="h-8 w-28"
          aria-label={`${column.name} to`}
        />
      </div>
    );
  }
  if (column.type === "Text") {
    return (
      <Input
        value={value.text ?? ""}
        onChange={(e) => onChange({ text: e.target.value })}
        placeholder={`${column.name} contains…`}
        className="h-8 w-40"
      />
    );
  }
  const opts: { v: string; l: string }[] =
    column.type === "Checkbox"
      ? [
          { v: "true", l: "Checked" },
          { v: "false", l: "Unchecked" },
        ]
      : (column.type === "Yes/No" ? ["Yes", "No"] : (column.options ?? [])).map((o) => ({ v: o, l: o }));
  return (
    <Select value={value.choice ?? "all"} onValueChange={(v) => onChange({ choice: v })}>
      <SelectTrigger className="h-8 w-36" aria-label={`Filter ${column.name}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        {opts.map((o) => (
          <SelectItem key={o.v} value={o.v}>
            {o.l}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
