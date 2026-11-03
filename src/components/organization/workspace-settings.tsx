import * as React from "react";
import { Building2, CreditCard, Download, Pencil, X } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/dashboard/crud";
import { FieldRow, SettingsHeader } from "@/components/settings/settings-header";
import {
  companySizes,
  industries,
  subscription,
  weekDays,
  workspaceLimits,
  workspaceSeed,
  workspaceTimezones,
  type WorkspaceData,
} from "@/data/organization";

export function WorkspaceSettings() {
  const [data, setData] = React.useState<WorkspaceData>(workspaceSeed);
  const [draft, setDraft] = React.useState<WorkspaceData>(workspaceSeed);
  const [editing, setEditing] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);

  const set = <K extends keyof WorkspaceData>(key: K, value: WorkspaceData[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const startEdit = () => {
    setDraft(data);
    setEditing(true);
  };

  const save = () => {
    if (!draft.companyName.trim()) {
      toast.error("Company name is required");
      return;
    }
    setData(draft);
    setEditing(false);
    toast.success("Workspace updated");
  };

  const toggleDay = (day: string) =>
    set(
      "workingDays",
      draft.workingDays.includes(day)
        ? draft.workingDays.filter((d) => d !== day)
        : [...draft.workingDays, day],
    );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <SettingsHeader
        title="Workspace"
        description="Company profile, working hours, usage and billing for this workspace."
        actions={
          editing ? (
            <>
              <Button variant="ghost" onClick={() => setEditing(false)}>
                <X className="mr-2 size-4" />
                Cancel
              </Button>
              <Button onClick={() => setConfirming(true)}>Save changes</Button>
            </>
          ) : (
            <Button onClick={startEdit}>
              <Pencil className="mr-2 size-4" />
              Edit workspace
            </Button>
          )
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-display">Basic information</CardTitle>
            <CardDescription>How your company appears across Quality Dial.</CardDescription>
          </CardHeader>
          <CardContent>
            {editing ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Company name">
                  <Input value={draft.companyName} onChange={(e) => set("companyName", e.target.value)} />
                </Field>
                <Field label="Legal name">
                  <Input value={draft.legalName} onChange={(e) => set("legalName", e.target.value)} />
                </Field>
                <Field label="Website">
                  <Input value={draft.website} onChange={(e) => set("website", e.target.value)} />
                </Field>
                <Field label="Industry">
                  <Select value={draft.industry} onValueChange={(v) => set("industry", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((i) => (
                        <SelectItem key={i} value={i}>
                          {i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Company size">
                  <Select value={draft.size} onValueChange={(v) => set("size", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {companySizes.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Support email">
                  <Input value={draft.supportEmail} onChange={(e) => set("supportEmail", e.target.value)} />
                </Field>
                <Field label="Phone">
                  <Input value={draft.phone} onChange={(e) => set("phone", e.target.value)} />
                </Field>
                <Field label="Address">
                  <Input value={draft.addressLine} onChange={(e) => set("addressLine", e.target.value)} />
                </Field>
              </div>
            ) : (
              <div className="grid gap-x-10 sm:grid-cols-2">
                <div>
                  <FieldRow label="Company name" value={data.companyName} />
                  <FieldRow label="Legal name" value={data.legalName} />
                  <FieldRow label="Website" value={data.website} />
                  <FieldRow label="Industry" value={data.industry} />
                </div>
                <div>
                  <FieldRow label="Company size" value={data.size} />
                  <FieldRow label="Support email" value={data.supportEmail} />
                  <FieldRow label="Phone" value={data.phone} />
                  <FieldRow label="Address" value={data.addressLine} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display">Workspace status</CardTitle>
            <CardDescription>Identity and current state.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-muted">
                <Building2 className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">{data.companyName}</p>
                <p className="text-xs text-muted-foreground">{data.industry}</p>
              </div>
            </div>
            <FieldRow
              label="Status"
              value={
                <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                  {data.status}
                </Badge>
              }
            />
            <FieldRow label="Workspace ID" value="wsp_qd_8241" />
            <FieldRow label="Created" value="01 Jan 2026" />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-display">Work details</CardTitle>
            <CardDescription>Timezone, week start and business hours used for scheduling.</CardDescription>
          </CardHeader>
          <CardContent>
            {editing ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Timezone">
                  <Select value={draft.timezone} onValueChange={(v) => set("timezone", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {workspaceTimezones.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Week starts on">
                  <Select value={draft.weekStart} onValueChange={(v) => set("weekStart", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Monday", "Sunday", "Saturday"].map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Business hours start">
                  <Input
                    type="time"
                    value={draft.businessHoursStart}
                    onChange={(e) => set("businessHoursStart", e.target.value)}
                  />
                </Field>
                <Field label="Business hours end">
                  <Input
                    type="time"
                    value={draft.businessHoursEnd}
                    onChange={(e) => set("businessHoursEnd", e.target.value)}
                  />
                </Field>
                <div className="sm:col-span-2 space-y-2">
                  <Label>Working days</Label>
                  <div className="flex flex-wrap gap-2">
                    {weekDays.map((d) => {
                      const on = draft.workingDays.includes(d);
                      return (
                        <Button
                          key={d}
                          type="button"
                          size="sm"
                          variant={on ? "default" : "outline"}
                          onClick={() => toggleDay(d)}
                        >
                          {d}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-x-10 sm:grid-cols-2">
                <div>
                  <FieldRow label="Timezone" value={data.timezone} />
                  <FieldRow label="Week starts on" value={data.weekStart} />
                </div>
                <div>
                  <FieldRow
                    label="Business hours"
                    value={`${data.businessHoursStart} – ${data.businessHoursEnd}`}
                  />
                  <FieldRow label="Working days" value={data.workingDays.join(", ")} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display">Usage</CardTitle>
            <CardDescription>Current billing period consumption.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {workspaceLimits.map((l) => (
              <div key={l.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{l.label}</span>
                  <span className="font-medium">
                    {l.used.toLocaleString()}
                    {l.unit} / {l.total.toLocaleString()}
                    {l.unit}
                  </span>
                </div>
                <Progress value={(l.used / l.total) * 100} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-display">Billing &amp; subscription</CardTitle>
            <CardDescription>Plan, payment method and recent invoices.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                <CreditCard className="size-4 text-muted-foreground" />
                <p className="font-display font-semibold">{subscription.plan} plan</p>
              </div>
              <p className="mt-2 text-2xl font-semibold">{subscription.price}</p>
              <FieldRow label="Billing cycle" value={subscription.billingCycle} />
              <FieldRow label="Renews" value={subscription.renews} />
              <FieldRow label="Payment method" value={subscription.paymentMethod} />
              <Button variant="outline" className="mt-4 w-full" onClick={() => toast.info("Plan change coming soon")}>
                Change plan
              </Button>
            </div>
            <div className="lg:col-span-2">
              <p className="mb-2 text-sm font-medium">Invoices</p>
              <div className="rounded-xl border border-border">
                {subscription.invoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between border-b border-border/60 p-3 text-sm last:border-0"
                  >
                    <span className="font-medium">{inv.id}</span>
                    <span className="text-muted-foreground">{inv.date}</span>
                    <span>{inv.amount}</span>
                    <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                      {inv.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toast.success(`Downloading ${inv.id}`)}
                    >
                      <Download className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="Save workspace changes?"
        description="These settings apply to everyone in the workspace."
        confirmLabel="Save"
        onConfirm={() => {
          setConfirming(false);
          save();
        }}
      />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
