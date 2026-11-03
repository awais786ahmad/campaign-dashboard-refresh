import * as React from "react";
import { Search, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog, DetailDrawer, RecordFormModal } from "@/components/dashboard/crud";
import { FieldRow, SettingsHeader } from "@/components/settings/settings-header";
import {
  campaignPool,
  members as memberSeed,
  roleNames,
  teams,
  type Member,
} from "@/data/organization";

const statusTone: Record<Member["status"], string> = {
  Active: "border-primary/30 bg-primary/10 text-primary",
  Invited: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Deactivated: "border-border bg-muted text-muted-foreground",
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

const emptyForm = { name: "", email: "", role: roleNames[2]!, team: "Unassigned", campaign: "none" };

export function MembersSettings() {
  const [list, setList] = React.useState<Member[]>(memberSeed);
  const [query, setQuery] = React.useState("");
  const [role, setRole] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [active, setActive] = React.useState<Member | null>(null);
  const [removing, setRemoving] = React.useState<Member | null>(null);
  const [form, setForm] = React.useState(emptyForm);

  const filtered = list.filter(
    (m) =>
      (role === "all" || m.role === role) &&
      (status === "all" || m.status === status) &&
      (m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.email.toLowerCase().includes(query.toLowerCase())),
  );

  const invite = (invited: boolean) => {
    if (!form.name.trim() || !form.email.includes("@")) {
      toast.error("Enter a name and a valid email");
      return;
    }
    setList((l) => [
      {
        id: crypto.randomUUID(),
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        team: form.team,
        campaign: form.campaign === "none" ? null : form.campaign,
        status: invited ? "Invited" : "Deactivated",
        createdAt: "just now",
        lastLogin: "—",
        phone: "—",
        jobTitle: form.role,
        performance: { calls: 0, talkTime: "0h", conversion: 0, csat: 0 },
      },
      ...l,
    ]);
    setForm(emptyForm);
  };

  const update = (member: Member, patch: Partial<Member>) => {
    const next = { ...member, ...patch };
    setList((l) => l.map((m) => (m.id === member.id ? next : m)));
    setActive((a) => (a && a.id === member.id ? next : a));
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <SettingsHeader
        title="Members"
        description="Everyone with access to this workspace, their role, team and campaign."
        actions={
          <Button onClick={() => setInviteOpen(true)}>
            <UserPlus className="mr-2 size-4" />
            Invite member
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[16rem] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email"
            className="pl-9"
          />
        </div>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {roleNames.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Invited">Invited</SelectItem>
            <SelectItem value="Deactivated">Deactivated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="text-xs">{initials(m.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{m.role}</TableCell>
                  <TableCell>{m.team}</TableCell>
                  <TableCell>{m.campaign ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusTone[m.status]}>
                      {m.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{m.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" onClick={() => setActive(m)}>
                      View
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setRemoving(m)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!filtered.length ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    No members match these filters.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <RecordFormModal
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        title="Invite member"
        description="They receive an email invite and appear as Invited until they accept."
        mode="create"
        submitLabel="Send invite"
        onSubmit={() => invite(true)}
        onSaveDraft={() => {
          invite(false);
          toast.info("Invite saved as draft");
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="member-name">Full name</Label>
            <Input
              id="member-name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="member-email">Email</Label>
            <Input
              id="member-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roleNames.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Team</Label>
            <Select value={form.team} onValueChange={(v) => setForm((f) => ({ ...f, team: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Unassigned">Unassigned</SelectItem>
                {teams.map((t) => (
                  <SelectItem key={t.id} value={t.name}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Campaign</Label>
            <Select value={form.campaign} onValueChange={(v) => setForm((f) => ({ ...f, campaign: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No campaign</SelectItem>
                {campaignPool.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </RecordFormModal>

      <DetailDrawer
        open={!!active}
        onOpenChange={(v) => !v && setActive(null)}
        activity={active ? { entityType: "Member", entityId: active.id, record: active.name } : null}
        title={active?.name ?? ""}
        description={active?.jobTitle ?? ""}
      >
        {active ? (
          <div className="space-y-6 pt-2">
            <div className="rounded-xl border border-border bg-card px-4">
              <FieldRow label="Email" value={active.email} />
              <FieldRow label="Phone" value={active.phone} />
              <FieldRow label="Status" value={<Badge variant="outline" className={statusTone[active.status]}>{active.status}</Badge>} />
              <FieldRow label="Joined" value={active.createdAt} />
              <FieldRow label="Last login" value={active.lastLogin} />
            </div>

            <section className="space-y-3">
              <h3 className="text-sm font-medium">Assignment</h3>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={active.role} onValueChange={(v) => update(active, { role: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roleNames.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Team</Label>
                <Select value={active.team} onValueChange={(v) => update(active, { team: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unassigned">Unassigned</SelectItem>
                    {teams.map((t) => (
                      <SelectItem key={t.id} value={t.name}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-sm font-medium">Performance</h3>
              <div className="grid grid-cols-2 gap-3">
                <Stat label="Calls" value={active.performance.calls.toLocaleString()} />
                <Stat label="Talk time" value={active.performance.talkTime} />
                <Stat label="Conversion" value={`${active.performance.conversion}%`} />
                <Stat label="CSAT" value={`${active.performance.csat}/5`} />
              </div>
            </section>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  update(active, { status: active.status === "Deactivated" ? "Active" : "Deactivated" })
                }
              >
                {active.status === "Deactivated" ? "Reactivate" : "Deactivate"}
              </Button>
              <Button variant="ghost" onClick={() => toast.success("Password reset link sent")}>
                Send password reset
              </Button>
            </div>
          </div>
        ) : null}
      </DetailDrawer>

      <ConfirmDialog
        open={!!removing}
        onOpenChange={(v) => !v && setRemoving(null)}
        title={`Remove ${removing?.name ?? "member"}?`}
        description="They immediately lose access to this workspace. This cannot be undone."
        confirmLabel="Remove"
        destructive
        onConfirm={() => {
          if (removing) {
            setList((l) => l.filter((m) => m.id !== removing.id));
            toast.error(`${removing.name} removed`);
          }
          setRemoving(null);
        }}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-lg font-semibold">{value}</p>
    </div>
  );
}
