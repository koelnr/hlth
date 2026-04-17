"use client";

import * as React from "react";
import type { FollowUpStatus } from "@/lib/data/models";

const INPUT_CLASS =
  "w-full px-3 py-2 text-sm border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string | null;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
        className={INPUT_CLASS}
      />
    </div>
  );
}

const STATUS_OPTIONS: { value: FollowUpStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

// Serializable types — no Date objects, safe to pass across RSC→client boundary.
export interface PatientOption {
  id: string;
  fullName: string;
}

export interface AppointmentOption {
  id: string;
  patientId: string;
  /** Pre-formatted display label (date + any extra info). */
  label: string;
}

export interface FollowUpFormDefaultValues {
  patientId?: string;
  dueDate?: string;
  appointmentId?: string | null;
  note?: string | null;
  status?: FollowUpStatus;
}

interface FollowUpFormFieldsProps {
  patients: PatientOption[];
  appointmentOptions?: AppointmentOption[];
  defaultValues?: FollowUpFormDefaultValues | null;
  /** Show the status select — true on edit, false on create. */
  showStatus?: boolean;
}

export function FollowUpFormFields({
  patients,
  appointmentOptions = [],
  defaultValues,
  showStatus = false,
}: FollowUpFormFieldsProps) {
  const [selectedPatientId, setSelectedPatientId] = React.useState(
    defaultValues?.patientId ?? ""
  );
  const [selectedApptId, setSelectedApptId] = React.useState(
    defaultValues?.appointmentId ?? ""
  );

  const visibleAppts = selectedPatientId
    ? appointmentOptions.filter((a) => a.patientId === selectedPatientId)
    : appointmentOptions;

  function handlePatientChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newPatientId = e.target.value;
    setSelectedPatientId(newPatientId);
    // Clear appointment if it doesn't belong to the newly selected patient.
    const stillValid = appointmentOptions.some(
      (a) => a.id === selectedApptId && a.patientId === newPatientId
    );
    if (!stillValid) setSelectedApptId("");
  }

  return (
    <>
      {/* Patient */}
      <div className="space-y-1.5">
        <label htmlFor="patientId" className="text-sm font-medium text-foreground">
          Patient <span className="text-destructive">*</span>
        </label>
        <select
          id="patientId"
          name="patientId"
          required
          value={selectedPatientId}
          onChange={handlePatientChange}
          className={INPUT_CLASS}
        >
          <option value="">Select patient…</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.fullName}
            </option>
          ))}
        </select>
      </div>

      {/* Due date */}
      <Field
        label="Due date"
        name="dueDate"
        type="date"
        required
        defaultValue={defaultValues?.dueDate}
      />

      {/* Linked appointment (optional) — filtered to selected patient */}
      {appointmentOptions.length > 0 && (
        <div className="space-y-1.5">
          <label htmlFor="appointmentId" className="text-sm font-medium text-foreground">
            Linked appointment{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <select
            id="appointmentId"
            name="appointmentId"
            value={selectedApptId ?? ""}
            onChange={(e) => setSelectedApptId(e.target.value)}
            className={INPUT_CLASS}
          >
            <option value="">None</option>
            {visibleAppts.map((appt) => (
              <option key={appt.id} value={appt.id}>
                {appt.label}
              </option>
            ))}
          </select>
          {selectedPatientId && visibleAppts.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No appointments found for this patient.
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Only appointments for the selected patient are shown.
            </p>
          )}
        </div>
      )}

      {/* Status — only shown on edit */}
      {showStatus && (
        <div className="space-y-1.5">
          <label htmlFor="status" className="text-sm font-medium text-foreground">
            Status <span className="text-destructive">*</span>
          </label>
          <select
            id="status"
            name="status"
            required
            defaultValue={defaultValues?.status ?? "pending"}
            className={INPUT_CLASS}
          >
            {STATUS_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Note */}
      <div className="space-y-1.5">
        <label htmlFor="note" className="text-sm font-medium text-foreground">
          Note{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          placeholder="What should be followed up on?"
          defaultValue={defaultValues?.note ?? ""}
          className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>
    </>
  );
}
