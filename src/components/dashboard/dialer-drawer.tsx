import * as React from "react";
import { Delete, Phone, PhoneOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useRightDrawerRegistration } from "@/components/dashboard/shell-context";

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

export function DialerDrawer({
  open,
  onOpenChange,
  initialNumber,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Optional number to prefill when the drawer opens (e.g. "Call back" from the Inbox). */
  initialNumber?: string | undefined;
}) {
  const [number, setNumber] = React.useState(initialNumber ?? "");
  const [inCall, setInCall] = React.useState(false);
  useRightDrawerRegistration(open);

  React.useEffect(() => {
    if (open && initialNumber) setNumber(initialNumber);
  }, [open, initialNumber]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Dialer</SheetTitle>
          <SheetDescription>Place an outbound call from your workspace number.</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-6">
          <div className="flex items-center gap-2">
            <Input
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="+1 415 555 0134"
              className="h-12 text-center font-display text-lg tracking-wider"
            />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Delete last digit"
              onClick={() => setNumber((n) => n.slice(0, -1))}
            >
              <Delete className="size-4" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {keys.map((key) => (
              <Button
                key={key}
                variant="secondary"
                className="h-14 font-display text-lg"
                onClick={() => setNumber((n) => n + key)}
              >
                {key}
              </Button>
            ))}
          </div>

          {inCall ? (
            <Button
              variant="destructive"
              className="h-12 w-full"
              onClick={() => setInCall(false)}
            >
              <PhoneOff className="mr-2 size-4" />
              End call
            </Button>
          ) : (
            <Button
              className="h-12 w-full"
              disabled={!number}
              onClick={() => setInCall(true)}
            >
              <Phone className="mr-2 size-4" />
              Call
            </Button>
          )}

          <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
            {inCall
              ? `Connected to ${number} · recording and live transcription active.`
              : "Recent: Priya Raman · Daniel Okafor · Northwind Retail"}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
