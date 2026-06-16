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

    console.log("Submitting:", {
      name,
      identifier,
      verification: { sms, email },
      license: { startDate, expiryDate: expiryDate || undefined },
    });

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

      console.log("Response status:", res.status);
      const text = await res.text();
      console.log("Response text:", text);

      if (!text) {
        setError("Empty response from server");
        setLoading(false);
        return;
      }

      const data = JSON.parse(text);

      if (data.errors) {
        setError(data.errors[0].message);
      } else {
        setOpen(false);
        onCreated();
      }
    } catch (err) {
      console.log("Error:", err);
      setError("Something went wrong");
    }

    setLoading(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          + Add Organisation
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle>Create Organisation</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-slate-300">Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Organisation name"
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-slate-300">Identifier</Label>
            <Input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. techcorp"
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-slate-300">Verification</Label>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={sms}
                  onCheckedChange={(v) => setSms(v as boolean)}
                />
                <Label className="text-slate-300">SMS</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={email}
                  onCheckedChange={(v) => setEmail(v as boolean)}
                />
                <Label className="text-slate-300">Email</Label>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-slate-300">License Start Date</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-slate-300">License Expiry Date (optional)</Label>
            <Input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Creating..." : "Create Organisation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}