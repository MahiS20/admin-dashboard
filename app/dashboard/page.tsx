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
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Organisations</h1>
          <div className="flex gap-4">
            <CreateOrgDialog onCreated={fetchOrgs} />
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-white text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : (
          <div className="rounded-lg border border-slate-800 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-slate-900">
                  <TableHead className="text-slate-400">Name</TableHead>
                  <TableHead className="text-slate-400">Identifier</TableHead>
                  <TableHead className="text-slate-400">License Status</TableHead>
                  <TableHead className="text-slate-400">Start Date</TableHead>
                  <TableHead className="text-slate-400">Expiry Date</TableHead>
                  <TableHead className="text-slate-400">SMS</TableHead>
                  <TableHead className="text-slate-400">Email</TableHead>
                  <TableHead className="text-slate-400">Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orgs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-slate-400">
                      No organisations found
                    </TableCell>
                  </TableRow>
                ) : (
                  orgs.map((org) => (
                    <TableRow
                      key={org.organisationId}
                      className="border-slate-800 hover:bg-slate-900"
                    >
                      <TableCell>{org.name}</TableCell>
                      <TableCell className="text-slate-400">{org.identifier}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          org.license.status === "active"
                            ? "bg-green-900 text-green-300"
                            : org.license.status === "expired"
                            ? "bg-red-900 text-red-300"
                            : "bg-yellow-900 text-yellow-300"
                        }`}>
                          {org.license.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-400">{org.license.startDate}</TableCell>
                      <TableCell className="text-slate-400">{org.license.expiryDate || "—"}</TableCell>
                      <TableCell>{org.verification.sms ? "✓" : "✗"}</TableCell>
                      <TableCell>{org.verification.email ? "✓" : "✗"}</TableCell>
                      <TableCell className="text-slate-400">
                        {new Date(org.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}