import * as React from "react";
import { Copy, Plus, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
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
import { permissionMatrix, roles as roleSeed, type Role } from "@/data/organization";

export function RolesSettings() {
  const [list, setList] = React.useState<Role[]>(roleSeed);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Role | null>(null);
  const [active, setActive] = React.useState<Role | null>(null);
  const [deleting, setDeleting] = React.useState<Role | null>(null);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [permissions, setPermissions] = React.useState<string[]>([]);

  const openCreate = () => {
    setEditing(null);
    setName("");
    setDescription("");
    setPermissions([]);
    setFormOpen(true);
  };

  const openEdit = (role: Role) => {
    setEditing(role);
    setName(role.name);
    setDescription(role.description);
    setPermissions(role.permissions);
    setFormOpen(true);
  };

  const toggle = (key: string) =>
    setPermissions((p) => (p.includes(key) ? p.filter((x) => x !== key) : [...p, key]));

  const toggleModule = (module: string, features: string[], on: boolean) => {
    const keys = features.map((f) => `${module}:${f}`);
    setPermissions((p) => (on ? Array.from(new Set([...p, ...keys])) : p.filter((k) => !keys.includes(k))));
  };

  const save = (asDraft: boolean) => {
    if (!name.trim()) {
      toast.error("Role name is required");
      return;
    }
    if (editing) {
      const next = { ...editing, name: name.trim(), description: description.trim(), permissions };
      setList((l) => l.map((r) => (r.id === editing.id ? next : r)));
      toast.success(`${next.name} updated`);
      return;
    }
    setList((l) => [
      ...l,
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        description: description.trim() || (asDraft ? "Draft role — permissions pending." : "Custom role."),
        system: false,
        createdAt: "just now",
        members: [],
        permissions,
      },
    ]);
  };

  const duplicate = (role: Role) => {
    setList((l) => [
      ...l,
      {
        ...role,
        id: crypto.randomUUID(),
        name: `${role.name} copy`,
        system: false,
        members: [],
        createdAt: "just now",
      },
    ]);
    toast.success(`${role.name} duplicated`);
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <SettingsHeader
        title="Roles & permissions"
        description="Control what each role can see and change across the workspace."
        actions={
          <Button onClick={openCreate}>
            <Plus className="mr-2 size-4" />
            Create role
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="size-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{role.name}</p>
                        <p className="max-w-md text-xs text-muted-foreground">{role.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        role.system
                          ? "border-border bg-muted text-muted-foreground"
                          : "border-primary/30 bg-primary/10 text-primary"
                      }
                    >
                      {role.system ? "System" : "Custom"}
                    </Badge>
                  </TableCell>
                  <TableCell>{role.members.length}</TableCell>
                  <TableCell>{role.permissions.length}</TableCell>
                  <TableCell className="text-muted-foreground">{role.createdAt}</TableCell>
                  <TableCell className="space-x-1 text-right">
                    <Button size="sm" variant="ghost" onClick={() => setActive(role)}>
                      View
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => openEdit(role)} disabled={role.system}>
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => duplicate(role)}>
                      <Copy className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeleting(role)}
                      disabled={role.system}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <RecordFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editing ? `Edit ${editing.name}` : "Create role"}
        description="Pick the exact modules and features this role can access."
        mode={editing ? "edit" : "create"}
        onSubmit={() => save(false)}
        {...(editing
          ? {}
          : {
              onSaveDraft: () => {
                save(true);
                toast.info("Role saved as draft");
              },
            })}
      >
        <div className="space-y-2">
          <Label htmlFor="role-name">Role name</Label>
          <Input id="role-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. QA Reviewer" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role-desc">Description</Label>
          <Textarea
            id="role-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What this role is meant to do"
          />
        </div>
        <div className="space-y-2">
          <Label>Permissions</Label>
          <ScrollArea className="h-64 rounded-xl border border-border p-3">
            <div className="space-y-4">
              {permissionMatrix.map((m) => {
                const keys = m.features.map((f) => `${m.module}:${f}`);
                const all = keys.every((k) => permissions.includes(k));
                return (
                  <div key={m.module}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{m.module}</p>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleModule(m.module, m.features, !all)}
                      >
                        {all ? "Clear all" : "Select all"}
                      </Button>
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {m.features.map((f) => {
                        const key = `${m.module}:${f}`;
                        return (
                          <label key={key} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Checkbox checked={permissions.includes(key)} onCheckedChange={() => toggle(key)} />
                            {f}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </RecordFormModal>

      <DetailDrawer
        open={!!active}
        onOpenChange={(v) => !v && setActive(null)}
        title={active?.name ?? ""}
        description={active?.description ?? ""}
      >
        {active ? (
          <div className="space-y-6 pt-2">
            <div className="rounded-xl border border-border bg-card px-4">
              <FieldRow label="Type" value={active.system ? "System role" : "Custom role"} />
              <FieldRow label="Created" value={active.createdAt} />
              <FieldRow label="Permissions" value={`${active.permissions.length} granted`} />
            </div>

            <section>
              <h3 className="mb-2 text-sm font-medium">Members ({active.members.length})</h3>
              <div className="flex flex-wrap gap-2">
                {active.members.length ? (
                  active.members.map((m) => (
                    <Badge key={m} variant="outline">
                      {m}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Nobody has this role yet.</p>
                )}
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-medium">Permission matrix</h3>
              {permissionMatrix.map((m) => (
                <div key={m.module} className="rounded-xl border border-border bg-card p-3">
                  <p className="text-sm font-medium">{m.module}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.features.map((f) => {
                      const granted = active.permissions.includes(`${m.module}:${f}`);
                      return (
                        <Badge
                          key={f}
                          variant="outline"
                          className={
                            granted
                              ? "border-primary/30 bg-primary/10 text-primary"
                              : "border-border bg-muted text-muted-foreground line-through"
                          }
                        >
                          {f}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              ))}
            </section>
          </div>
        ) : null}
      </DetailDrawer>

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title={`Delete ${deleting?.name ?? "role"}?`}
        description="Members with this role fall back to the Agent role. This cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (deleting) {
            setList((l) => l.filter((r) => r.id !== deleting.id));
            toast.error(`${deleting.name} deleted`);
          }
          setDeleting(null);
        }}
      />
    </div>
  );
}
