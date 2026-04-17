import Link from "next/link";
import { requireOrganization } from "@/lib/auth/clerk";
import { listAppointmentsForOrg } from "@/lib/data/appointments";
import { listPatientsForOrg } from "@/lib/data/patients";
import { PageShell } from "@/components/app/page-shell";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AppointmentsList } from "./_components/appointments-list";
import type { AppointmentListItem } from "./_components/appointments-list";

export default async function AppointmentsPage() {
  const viewer = await requireOrganization();

  let appointments: AppointmentListItem[] = [];

  try {
    const [appts, patients] = await Promise.all([
      listAppointmentsForOrg(viewer.orgId),
      listPatientsForOrg(viewer.orgId),
    ]);
    const patientNames = new Map(patients.map((p) => [p.id, p.fullName]));
    appointments = appts.map((appt) => ({
      id: appt.id,
      patientId: appt.patientId,
      patientName:
        patientNames.get(appt.patientId) ?? `Patient …${appt.patientId.slice(-6)}`,
      dateDisplay: appt.scheduledAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      timeDisplay: appt.scheduledAt.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      durationMinutes: appt.durationMinutes,
      reason: appt.reason,
      status: appt.status,
    }));
  } catch {
    // Firebase not yet configured — render empty state below
  }

  return (
    <PageShell
      title="Appointments"
      description="View and manage scheduled appointments"
      actions={
        <Button asChild size="sm">
          <Link href="/appointments/new">
            <Plus className="h-4 w-4 mr-1.5" />
            New appointment
          </Link>
        </Button>
      }
    >
      <AppointmentsList appointments={appointments} />
    </PageShell>
  );
}
