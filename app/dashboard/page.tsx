"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CreateOrgDialog from "@/components/create-org-dialog";

interface Organisation {
  organisationId: string;
  name: string;
  identifier: string;
  createdAt: string;
  license: {
    status: string;
    startDate: string;
    expiryDate: string;
  };
  verification: {
    sms: boolean;
    email: boolean;
  };
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "#34d399" },
  upcoming: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "#fbbf24" },
  expired: { bg: "bg-red-500/10", text: "text-red-400", dot: "#f87171" },
  deleted: { bg: "bg-zinc-500/10", text: "text-zinc-400", dot: "#a1a1aa" },
};

function StatusPill({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig.deleted;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${config.bg} ${config.text}`}>
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: config.dot, boxShadow: `0 0 6px ${config.dot}` }}
      />
      {status}
    </span>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [orgs, setOrgs] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchOrgs() {
    setLoading(true);
    const res = await fetch("/api/organisations");

    if (res.status === 401) {
      router.push("/login");
      return;
    }

    const data = await res.json();
    setOrgs(data?.data?.getOrganisations?.organisations || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchOrgs();
  }, []);

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#fafafa]">
      <div className="border-b border-[#262626] px-8 py-4 flex justify-between items-center sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#6366f1] flex items-center justify-center text-white text-xs font-bold">
            A
          </div>
          <span className="font-semibold text-sm">Admin Console</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-[#a1a1aa] hover:text-[#fafafa] text-sm transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Organisations</h1>
            <p className="text-sm text-[#a1a1aa] mt-1">
              {orgs.length} organisation{orgs.length !== 1 ? "s" : ""} onboarded
            </p>
          </div>
          <CreateOrgDialog onCreated={fetchOrgs} />
        </div>

        <div className="rounded-xl border border-[#262626] overflow-hidden bg-[#0f0f0f]">
          <Table>
            <TableHeader>
              <TableRow className="border-[#262626] hover:bg-transparent">
                <TableHead className="text-[#a1a1aa] text-xs font-medium uppercase tracking-wider">Name</TableHead>
                <TableHead className="text-[#a1a1aa] text-xs font-medium uppercase tracking-wider">Identifier</TableHead>
                <TableHead className="text-[#a1a1aa] text-xs font-medium uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-[#a1a1aa] text-xs font-medium uppercase tracking-wider">Start Date</TableHead>
                <TableHead className="text-[#a1a1aa] text-xs font-medium uppercase tracking-wider">Expiry</TableHead>
                <TableHead className="text-[#a1a1aa] text-xs font-medium uppercase tracking-wider">SMS</TableHead>
                <TableHead className="text-[#a1a1aa] text-xs font-medium uppercase tracking-wider">Email</TableHead>
                <TableHead className="text-[#a1a1aa] text-xs font-medium uppercase tracking-wider">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow className="border-[#262626]">
                  <TableCell colSpan={8} className="text-center text-[#a1a1aa] py-12">
                    Loading organisations...
                  </TableCell>
                </TableRow>
              ) : orgs.length === 0 ? (
                <TableRow className="border-[#262626]">
                  <TableCell colSpan={8} className="text-center py-16">
                    <p className="text-[#fafafa] font-medium text-sm">No organisations yet</p>
                    <p className="text-[#a1a1aa] text-sm mt-1">Add your first organisation to get started</p>
                  </TableCell>
                </TableRow>
              ) : (
                orgs.map((org) => (
                  <TableRow
                    key={org.organisationId}
                    className="border-[#262626] hover:bg-[#161616] transition-colors"
                  >
                    <TableCell className="font-medium text-sm">{org.name}</TableCell>
                    <TableCell className="text-[#a1a1aa] font-mono text-sm">{org.identifier}</TableCell>
                    <TableCell><StatusPill status={org.license.status} /></TableCell>
                    <TableCell className="text-[#a1a1aa] text-sm">{org.license.startDate}</TableCell>
                    <TableCell className="text-[#a1a1aa] text-sm">{org.license.expiryDate || "—"}</TableCell>
                    <TableCell className="text-sm">{org.verification.sms ? "✓" : "—"}</TableCell>
                    <TableCell className="text-sm">{org.verification.email ? "✓" : "—"}</TableCell>
                    <TableCell className="text-[#a1a1aa] text-sm">
                      {new Date(org.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}