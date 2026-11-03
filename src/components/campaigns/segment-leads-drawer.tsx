import * as React from "react";
import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DetailDrawer } from "@/components/dashboard/crud";
import { leadSeed, leadStatuses } from "@/data/crm";
import type { CampaignSegment } from "@/data/campaigns";

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}

export function SegmentLeadsDrawer({
  segment,
  onOpenChange,
}: {
  segment: CampaignSegment | null;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<string>("All Leads");
  const [selected, setSelected] = React.useState<string[]>([]);

  const leads = leadSeed.filter((l) => {
    const matchesQuery = l.name.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "All Leads" || l.status === status;
    return matchesQuery && matchesStatus;
  });

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <DetailDrawer
      open={Boolean(segment)}
      onOpenChange={onOpenChange}
      title={segment?.name ?? "Segment"}
      description={segment?.description ?? ""}
      footer={
        <p className="text-sm text-muted-foreground">
          {selected.length} lead{selected.length === 1 ? "" : "s"} selected
        </p>
      }
    >
      {segment ? (
        <div className="space-y-5 pt-2">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Metric label="Total leads" value={segment.totalLeads.toLocaleString()} />
            <Metric label="Contacted" value={segment.contacted} />
            <Metric label="Interested" value={segment.interested} />
            <Metric label="Follow-up" value={segment.followUp} />
            <Metric label="Qualified" value={segment.qualified} />
            <Metric label="Converted" value={segment.converted} />
            <Metric label="Rejected" value={segment.rejected} />
            <Metric
              label="Contact rate"
              value={`${Math.round((segment.contacted / segment.totalLeads) * 100)}%`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-45 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search leads"
                className="pl-9"
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {leadStatuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10" />
                  <TableHead>Lead</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last contacted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <Checkbox
                        checked={selected.includes(lead.id)}
                        onCheckedChange={() => toggle(lead.id)}
                        aria-label={`Select ${lead.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-xs text-muted-foreground">{lead.phone}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {lead.lastContacted}
                    </TableCell>
                  </TableRow>
                ))}
                {leads.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-10 text-center text-sm text-muted-foreground"
                    >
                      No leads match your filters.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : null}
    </DetailDrawer>
  );
}
