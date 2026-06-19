"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  onCreated: () => void;
}

export default function CreateOrgDialog({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [sms, setSms] = useState(false);
  const [email, setEmail] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  async function handleSubmit() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/organisations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          identifier,
          verification: { sms, email },
          license: { startDate, expiryDate: expiryDate || undefined },
        }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      if (data?.errors) {
        setError(data.errors[0].message);
      } else {
        setOpen(false);
        onCreated();
        setName("");
        setIdentifier("");
        setSms(false);
        setEmail(false);
        setStartDate("");
        setExpiryDate("");
      }
    } catch {
      setError("Something went wrong");
    }

    setLoading(false);
  }

  const inputClass =
    "bg-[#0a0a0a] border-[#262626] text-[#fafafa] h-10 placeholder:text-[#525252] focus-visible:ring-[#6366f1] focus-visible:ring-1";
  const labelClass = "text-[#a1a1aa] text-xs font-medium";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium">
          + Add Organisation
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#141414] border-[#262626] text-[#fafafa] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#fafafa]">Create Organisation</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className={labelClass}>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Organisation name"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className={labelClass}>Identifier</Label>
            <Input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. techcorp"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className={labelClass}>Verification</Label>
            <div className="flex gap-5 mt-1">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={sms}
                  onCheckedChange={(v) => setSms(v as boolean)}
                  className="border-[#262626] data-[state=checked]:bg-[#6366f1] data-[state=checked]:border-[#6366f1]"
                />
                <Label className="text-[#a1a1aa] text-sm">SMS</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={email}
                  onCheckedChange={(v) => setEmail(v as boolean)}
                  className="border-[#262626] data-[state=checked]:bg-[#6366f1] data-[state=checked]:border-[#6366f1]"
                />
                <Label className="text-[#a1a1aa] text-sm">Email</Label>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className={labelClass}>Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className={labelClass}>Expiry (optional)</Label>
              <Input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
              {error}
            </p>
          )}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium mt-1"
          >
            {loading ? "Creating..." : "Create Organisation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}