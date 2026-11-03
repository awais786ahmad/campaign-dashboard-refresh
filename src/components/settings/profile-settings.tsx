import * as React from "react";
import {
  Building2,
  CalendarCheck,
  Check,
  KeyRound,
  Mail,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog, RecordFormModal } from "@/components/dashboard/crud";
import { SettingsHeader, FieldRow } from "@/components/settings/settings-header";
import { apiTokens as tokenSeed, profileMeta, profileSeed, type ProfileData } from "@/data/settings";

const timezones = [
  "Asia/Karachi (UTC+5)",
  "Europe/London (UTC+1)",
  "America/New_York (UTC-4)",
  "Asia/Dubai (UTC+4)",
];
const languages = ["English (US)", "English (UK)", "Urdu", "Arabic", "German"];
const teams = ["Revenue — Outbound", "Revenue — Inbound", "Customer Success", "Support"];

export function ProfileSettings() {
  const [data, setData] = React.useState<ProfileData>(profileSeed);
  const [draft, setDraft] = React.useState<ProfileData>(profileSeed);
  const [editing, setEditing] = React.useState(false);
  const [confirmSave, setConfirmSave] = React.useState(false);
  const [passwordOpen, setPasswordOpen] = React.useState(false);
  const [tokenOpen, setTokenOpen] = React.useState(false);
  const [tokens, setTokens] = React.useState(tokenSeed);
  const [revoking, setRevoking] = React.useState<string | null>(null);
  const [tokenName, setTokenName] = React.useState("");

  const initials = data.fullName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  const set = <K extends keyof ProfileData>(key: K, value: ProfileData[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  function startEdit() {
    setDraft(data);
    setEditing(true);
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <SettingsHeader
        title="User profile"
        description="Your personal account, security and preferences. Changes apply only to you."
        actions={
          editing ? (
            <>
              <Button variant="ghost" onClick={() => setEditing(false)}>
                <X className="mr-2 size-4" />
                Cancel
              </Button>
              <Button onClick={() => setConfirmSave(true)}>
                <Check className="mr-2 size-4" />
                Save changes
              </Button>
            </>
          ) : (
            <Button onClick={startEdit}>
              <Pencil className="mr-2 size-4" />
              Edit profile
            </Button>
          )
        }
      />

      <Card className="overflow-hidden">
        <div className="h-20 w-full bg-[image:var(--gradient-ink)]" />
        <CardContent className="-mt-10 flex flex-wrap items-end gap-5 pb-6">
          <div className="relative">
            <Avatar className="size-20 ring-4 ring-card">
              <AvatarFallback className="bg-primary-soft text-lg font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            {editing ? (
              <Button
                size="icon"
                variant="secondary"
                className="absolute -right-1 -bottom-1 size-8 rounded-full"
                onClick={() => toast.info("Choose a new profile picture")}
                aria-label="Upload profile picture"
              >
                <Upload className="size-3.5" />
              </Button>
            ) : null}
          </div>
          <div className="flex-1">
            <h2 className="font-display text-xl font-semibold tracking-tight">{data.fullName}</h2>
            <p className="text-sm text-muted-foreground">
              {data.jobTitle} · {data.team}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-success/15 text-success-foreground" variant="secondary">
              {profileMeta.accountStatus}
            </Badge>
            <Badge variant="outline">Last login {profileMeta.lastLogin}</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Personal information</CardTitle>
              <CardDescription>How teammates and customers see you.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" editing={editing} value={data.fullName}>
                <Input value={draft.fullName} onChange={(e) => set("fullName", e.target.value)} />
              </Field>
              <Field label="Email" editing={editing} value={data.email}>
                <Input type="email" value={draft.email} onChange={(e) => set("email", e.target.value)} />
              </Field>
              <Field label="Phone number" editing={editing} value={data.phone}>
                <Input value={draft.phone} onChange={(e) => set("phone", e.target.value)} />
              </Field>
              <Field label="Job title" editing={editing} value={data.jobTitle}>
                <Input value={draft.jobTitle} onChange={(e) => set("jobTitle", e.target.value)} />
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display">Job & team</CardTitle>
              <CardDescription>Where you sit in the organisation.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Team" editing={editing} value={data.team}>
                <PickerField value={draft.team} options={teams} onChange={(v) => set("team", v)} />
              </Field>
              <Field label="Reporting manager" editing={false} value="Sana Iqbal" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display">Preferences</CardTitle>
              <CardDescription>Locale and how we notify you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Timezone" editing={editing} value={data.timezone}>
                  <PickerField value={draft.timezone} options={timezones} onChange={(v) => set("timezone", v)} />
                </Field>
                <Field label="Language" editing={editing} value={data.language}>
                  <PickerField value={draft.language} options={languages} onChange={(v) => set("language", v)} />
                </Field>
              </div>
              <Separator />
              <div className="space-y-1">
                {(
                  [
                    ["calls", "Call activity", "Missed calls, voicemails and callbacks"],
                    ["campaigns", "Campaign updates", "Start, finish and goal milestones"],
                    ["mentions", "Mentions & assignments", "When someone tags or assigns you"],
                    ["digest", "Weekly digest", "A Monday summary of your pipeline"],
                  ] as const
                ).map(([key, label, hint]) => (
                  <div key={key} className="flex items-center justify-between gap-4 py-2">
                    <div>
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-xs text-muted-foreground">{hint}</p>
                    </div>
                    <Switch
                      checked={editing ? draft.notifications[key] : data.notifications[key]}
                      disabled={!editing}
                      onCheckedChange={(v) =>
                        set("notifications", { ...draft.notifications, [key]: v })
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display">Security</CardTitle>
              <CardDescription>Password, 2FA and personal API tokens.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border p-4">
                <div className="flex items-start gap-3">
                  <KeyRound className="mt-0.5 size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Password</p>
                    <p className="text-xs text-muted-foreground">Last changed 3 months ago</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setPasswordOpen(true)}>
                  Change password
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Two-factor authentication</p>
                    <p className="text-xs text-muted-foreground">Authenticator app · TOTP</p>
                  </div>
                </div>
                <Switch
                  checked={editing ? draft.twoFactor : data.twoFactor}
                  disabled={!editing}
                  onCheckedChange={(v) => set("twoFactor", v)}
                />
              </div>

              <div className="rounded-xl border border-border">
                <div className="flex items-center justify-between gap-4 border-b border-border p-4">
                  <p className="text-sm font-medium">API tokens</p>
                  <Button variant="outline" size="sm" onClick={() => setTokenOpen(true)}>
                    <Plus className="mr-2 size-3.5" />
                    New token
                  </Button>
                </div>
                {tokens.length === 0 ? (
                  <p className="p-4 text-sm text-muted-foreground">No tokens yet.</p>
                ) : (
                  tokens.map((t) => (
                    <div
                      key={t.id}
                      className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 p-4 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium">{t.name}</p>
                        <p className="font-mono text-xs text-muted-foreground">{t.prefix}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-muted-foreground">Used {t.lastUsed}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Revoke ${t.name}`}
                          onClick={() => setRevoking(t.id)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Assignments</CardTitle>
              <CardDescription>What you are responsible for.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <FieldRow label="Team" value={profileMeta.assignedTeam} />
              <FieldRow
                label="Campaigns"
                value={
                  <span className="flex flex-wrap justify-end gap-1">
                    {profileMeta.assignedCampaigns.map((c) => (
                      <Badge key={c} variant="secondary">
                        {c}
                      </Badge>
                    ))}
                  </span>
                }
              />
              <FieldRow
                label="AI agents"
                value={
                  <span className="flex flex-wrap justify-end gap-1">
                    {profileMeta.assignedAgents.map((a) => (
                      <Badge key={a} variant="outline">
                        {a}
                      </Badge>
                    ))}
                  </span>
                }
              />
              <FieldRow label="Last login" value={profileMeta.lastLogin} />
              <FieldRow label="Account status" value={profileMeta.accountStatus} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display">Connected accounts</CardTitle>
              <CardDescription>Calendar and mailbox used for scheduling.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ConnectionRow
                icon={<CalendarCheck className="size-4" />}
                title={data.calendar.provider}
                subtitle={data.calendar.account}
                connected={data.calendar.connected}
                onToggle={() =>
                  setData((d) => ({
                    ...d,
                    calendar: { ...d.calendar, connected: !d.calendar.connected },
                  }))
                }
              />
              <ConnectionRow
                icon={<Mail className="size-4" />}
                title={data.mailbox.provider}
                subtitle={data.mailbox.account}
                connected={data.mailbox.connected}
                onToggle={() =>
                  setData((d) => ({
                    ...d,
                    mailbox: { ...d.mailbox, connected: !d.mailbox.connected },
                  }))
                }
              />
              <div className="flex items-start gap-3 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                <Building2 className="mt-0.5 size-4" />
                Workspace-wide integrations live in Organization settings.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirmSave}
        onOpenChange={setConfirmSave}
        title="Save these changes?"
        description="Your profile will be updated across the workspace."
        confirmLabel="Save"
        onConfirm={() => {
          setData(draft);
          setEditing(false);
          setConfirmSave(false);
          toast.success("Profile updated");
        }}
      />

      <RecordFormModal
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
        title="Change password"
        description="You will stay signed in on this device."
        mode="edit"
        submitLabel="Update password"
        onSubmit={() => toast.success("Password updated")}
      >
        <div className="space-y-2">
          <Label htmlFor="current-password">Current password</Label>
          <Input id="current-password" type="password" placeholder="••••••••" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-password">New password</Label>
          <Input id="new-password" type="password" placeholder="At least 12 characters" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm new password</Label>
          <Input id="confirm-password" type="password" placeholder="Repeat new password" />
        </div>
      </RecordFormModal>

      <RecordFormModal
        open={tokenOpen}
        onOpenChange={setTokenOpen}
        title="New API token"
        description="Tokens inherit your permissions. Copy it once — we never show it again."
        mode="create"
        onSaveDraft={() => toast.info("Token request saved as draft")}
        onSubmit={() => {
          if (!tokenName.trim()) {
            toast.error("Give the token a name");
            return;
          }
          setTokens((list) => [
            {
              id: crypto.randomUUID(),
              name: tokenName.trim(),
              prefix: "qd_live_new…",
              created: "Just now",
              lastUsed: "Never",
            },
            ...list,
          ]);
          setTokenName("");
          toast.success("API token created");
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="token-name">Token name</Label>
          <Input
            id="token-name"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            placeholder="e.g. Reporting export"
          />
        </div>
      </RecordFormModal>

      <ConfirmDialog
        open={revoking !== null}
        onOpenChange={(v) => !v && setRevoking(null)}
        title="Revoke this token?"
        description="Any integration using it will stop working immediately."
        confirmLabel="Revoke"
        destructive
        onConfirm={() => {
          setTokens((list) => list.filter((t) => t.id !== revoking));
          setRevoking(null);
          toast.error("API token revoked");
        }}
      />
    </div>
  );
}

function Field({
  label,
  value,
  editing,
  children,
}: {
  label: string;
  value: string;
  editing: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs tracking-wide text-muted-foreground uppercase">{label}</Label>
      {editing && children ? children : <p className="text-sm font-medium">{value}</p>}
    </div>
  );
}

function PickerField({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ConnectionRow({
  icon,
  title,
  subtitle,
  connected,
  onToggle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  connected: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-muted-foreground">{icon}</span>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{connected ? subtitle : "Not connected"}</p>
        </div>
      </div>
      <Button variant={connected ? "ghost" : "outline"} size="sm" onClick={onToggle}>
        {connected ? "Disconnect" : "Connect"}
      </Button>
    </div>
  );
}
