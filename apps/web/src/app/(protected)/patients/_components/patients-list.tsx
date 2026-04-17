"use client";

import * as React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { EmptyState } from "@/components/app/empty-state";
import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";

export interface PatientListItem {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  createdAtDisplay: string;
}

function PatientRow({ patient }: { patient: PatientListItem }) {
  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
      <td className="px-4 py-3">
        <Link
          href={`/patients/${patient.id}`}
          className="text-sm font-medium text-foreground hover:text-primary hover:underline underline-offset-2"
        >
          {patient.fullName}
        </Link>
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        <p className="text-sm text-muted-foreground">{patient.email ?? "—"}</p>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <p className="text-sm text-muted-foreground">{patient.phone}</p>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-muted-foreground">{patient.createdAtDisplay}</p>
      </td>
      <td className="px-4 py-3 text-right">
        <Link
          href={`/patients/${patient.id}`}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          aria-label={`View ${patient.fullName}`}
        >
          →
        </Link>
      </td>
    </tr>
  );
}

interface PatientsListProps {
  patients: PatientListItem[];
}

export function PatientsList({ patients }: PatientsListProps) {
  const [query, setQuery] = React.useState("");

  const filtered = query.trim()
    ? patients.filter((p) =>
        p.fullName.toLowerCase().includes(query.trim().toLowerCase()) ||
        p.phone.includes(query.trim())
      )
    : patients;

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search patients…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {patients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No patients yet"
          description="Add your first patient to begin tracking their care and appointments."
          action={
            <Button asChild size="sm">
              <Link href="/patients/new">
                <Plus className="h-4 w-4 mr-1.5" />
                Add Patient
              </Link>
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No patients found"
          description={`No patients match "${query}". Try a different search.`}
        />
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Added
                </th>
                <th className="px-4 py-3 w-8" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((patient) => (
                <PatientRow key={patient.id} patient={patient} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
