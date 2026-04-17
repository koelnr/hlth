/**
 * Shared TypeScript model definitions for the hlth data layer.
 *
 * All application models live here. Import from this file in
 * repositories, server actions, and API route handlers.
 *
 * All entities are scoped by organizationId (= Clerk organization ID),
 * which is the multi-tenancy boundary for this application.
 */

// ─── Status types ─────────────────────────────────────────────────────────

export type AppointmentStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "no_show";

export type FollowUpStatus = "pending" | "completed" | "cancelled";

export type ClinicMemberRole = "owner" | "admin" | "staff" | "doctor";

// ─── Base ──────────────────────────────────────────────────────────────────

/**
 * Fields shared by every document in every collection.
 * id corresponds to the Firestore document ID.
 */
export type BaseRecord = {
  id: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
};

// ─── ClinicProfile ─────────────────────────────────────────────────────────

/**
 * One-to-one with a Clerk organization. Created the first time an org
 * owner completes onboarding. Acts as the clinic's settings document.
 */
export type ClinicProfile = BaseRecord & {
  name: string;
  slug: string;
  specialty: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
};

/**
 * organizationId is intentionally excluded from all Create inputs.
 * Repositories accept it as an explicit first parameter so the type system
 * prevents callers from supplying an arbitrary org value.
 */
export type CreateClinicProfileInput = Omit<
  ClinicProfile,
  "id" | "organizationId" | "createdAt" | "updatedAt"
>;

export type UpdateClinicProfileInput = Partial<
  Omit<ClinicProfile, "id" | "organizationId" | "createdAt" | "updatedAt">
>;

// ─── Patient ───────────────────────────────────────────────────────────────

export type Patient = BaseRecord & {
  firstName: string;
  lastName: string;
  /** Denormalized for display. Always `${firstName} ${lastName}`. */
  fullName: string;
  phone: string;
  email: string | null;
  /** ISO date string: YYYY-MM-DD */
  dateOfBirth: string | null;
  gender: string | null;
  notes: string | null;
  createdByUserId: string | null;
};

export type CreatePatientInput = Omit<
  Patient,
  "id" | "organizationId" | "fullName" | "createdAt" | "updatedAt"
>;

export type UpdatePatientInput = Partial<
  Omit<
    Patient,
    "id" | "organizationId" | "createdAt" | "updatedAt" | "createdByUserId"
  >
>;

// ─── Appointment ───────────────────────────────────────────────────────────

export type Appointment = BaseRecord & {
  patientId: string;
  /** Clerk user ID of the treating clinician. Optional for now. */
  clinicianUserId: string | null;
  scheduledAt: Date;
  durationMinutes: number;
  status: AppointmentStatus;
  reason: string | null;
  notes: string | null;
  createdByUserId: string;
};

export type CreateAppointmentInput = Omit<
  Appointment,
  "id" | "organizationId" | "createdAt" | "updatedAt"
>;

export type UpdateAppointmentInput = Partial<
  Omit<
    Appointment,
    "id" | "organizationId" | "createdAt" | "updatedAt" | "createdByUserId"
  >
>;

// ─── FollowUp ──────────────────────────────────────────────────────────────

export type FollowUp = BaseRecord & {
  patientId: string;
  /** Link back to the appointment that triggered this follow-up. Optional. */
  appointmentId: string | null;
  dueAt: Date;
  status: FollowUpStatus;
  note: string | null;
  createdByUserId: string;
};

export type CreateFollowUpInput = Omit<
  FollowUp,
  "id" | "organizationId" | "createdAt" | "updatedAt"
>;

export type UpdateFollowUpInput = Partial<
  Omit<
    FollowUp,
    "id" | "organizationId" | "createdAt" | "updatedAt" | "createdByUserId"
  >
>;

// ─── ClinicMembershipProfile ───────────────────────────────────────────────

/**
 * App-level profile for a Clerk org member. Created on first sign-in
 * within an org, or during staff invitation flow.
 *
 * Do not duplicate Clerk identity data here. Only store app-specific
 * role and display info.
 */
export type ClinicMembershipProfile = BaseRecord & {
  userId: string;
  displayName: string;
  role: ClinicMemberRole;
};

export type CreateClinicMembershipInput = Omit<
  ClinicMembershipProfile,
  "id" | "organizationId" | "createdAt" | "updatedAt"
>;

export type UpdateClinicMembershipInput = Partial<
  Pick<ClinicMembershipProfile, "displayName" | "role">
>;
