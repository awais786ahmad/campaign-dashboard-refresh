import * as React from "react";
import type { ReactNode } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog, DetailDrawer, RecordFormModal } from "@/components/dashboard/crud";
import { toast } from "sonner";

export function PageShell({
  title,
  description,
  entity,
  children,
}: {
  title: string;
  description: string;
  entity: string;
  children?: ReactNode;
}) {
  const [createOpen, setCreateOpen] = React.useState(false);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [name, setName] = React.useState("");

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 size-4" />
          New {entity}
        </Button>
      </div>

      {children ?? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="font-display">No {entity}s yet</CardTitle>
            <CardDescription>
              This module is wired into the app shell. Records will use the shared create modal,
              detail drawer, and confirmation dialogs.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setDetailOpen(true)}>
              Preview detail drawer
            </Button>
            <Button variant="outline" onClick={() => setDeleteOpen(true)}>
              Preview delete confirmation
            </Button>
          </CardContent>
        </Card>
      )}

      <RecordFormModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        title={`New ${entity}`}
        description={`Create a ${entity} in this workspace.`}
        mode="create"
        onSubmit={() => toast.success(`${title}: ${entity} created`)}
        onSaveDraft={() => toast.info(`${entity} saved as draft`)}
      >
        <div className="space-y-2">
          <Label htmlFor="record-name">Name</Label>
          <Input
            id="record-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`${entity} name`}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="record-notes">Notes</Label>
          <Textarea id="record-notes" placeholder="Optional context for your team" />
        </div>
      </RecordFormModal>

      <DetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title={`${entity} details`}
        description="Details always open in a right drawer."
      >
        <div className="space-y-4 pt-2 text-sm">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-muted-foreground">Module</p>
            <p className="mt-1 font-medium">{title}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-muted-foreground">Status</p>
            <p className="mt-1 font-medium">Ready for module content</p>
          </div>
        </div>
      </DetailDrawer>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete this ${entity}?`}
        description="This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => toast.error(`${entity} deleted`)}
      />
    </div>
  );
}
