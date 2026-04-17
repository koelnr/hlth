import type { Patient, AppointmentStatus } from "@/lib/data/models";

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

const STATUS_OPTIONS: { value: AppointmentStatus; label: string }[] = [
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no_show", label: "No show" },
];

export interface AppointmentFormDefaultValues {
  patientId?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  durationMinutes?: number;
  status?: AppointmentStatus;
  reason?: string | null;
  notes?: string | null;
}

interface AppointmentFormFieldsProps {
  patients: Patient[];
  defaultValues?: AppointmentFormDefaultValues | null;
  /** Show status select — true on edit, false on create. */
  showStatus?: boolean;
}

export function AppointmentFormFields({
  patients,
  defaultValues,
  showStatus = false,
}: AppointmentFormFieldsProps) {
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
          defaultValue={defaultValues?.patientId ?? ""}
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

      {/* Date + Time */}
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Date"
          name="scheduledDate"
          type="date"
          required
          defaultValue={defaultValues?.scheduledDate}
        />
        <Field
          label="Time"
          name="scheduledTime"
          type="time"
          required
          defaultValue={defaultValues?.scheduledTime}
        />
      </div>

      {/* Duration */}
      <div className="space-y-1.5">
        <label htmlFor="durationMinutes" className="text-sm font-medium text-foreground">
          Duration <span className="text-destructive">*</span>
        </label>
        <select
          id="durationMinutes"
          name="durationMinutes"
          required
          defaultValue={String(defaultValues?.durationMinutes ?? 30)}
          className={INPUT_CLASS}
        >
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
          <option value="45">45 minutes</option>
          <option value="60">60 minutes</option>
          <option value="90">90 minutes</option>
        </select>
      </div>

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
            defaultValue={defaultValues?.status ?? "scheduled"}
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

      <Field
        label="Reason for visit"
        name="reason"
        placeholder="e.g. Annual checkup, follow-up…"
        defaultValue={defaultValues?.reason}
      />

      <div className="space-y-1.5">
        <label htmlFor="notes" className="text-sm font-medium text-foreground">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="Any additional notes…"
          defaultValue={defaultValues?.notes ?? ""}
          className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>
    </>
  );
}
