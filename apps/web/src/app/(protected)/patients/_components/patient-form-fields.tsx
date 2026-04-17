import type { Patient } from "@/lib/data/models";

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

interface PatientFormFieldsProps {
  defaultValues?: Pick<
    Patient,
    "firstName" | "lastName" | "phone" | "email" | "dateOfBirth" | "gender" | "notes"
  > | null;
}

export function PatientFormFields({ defaultValues }: PatientFormFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="First name"
          name="firstName"
          required
          placeholder="Jane"
          defaultValue={defaultValues?.firstName}
        />
        <Field
          label="Last name"
          name="lastName"
          required
          placeholder="Smith"
          defaultValue={defaultValues?.lastName}
        />
      </div>

      <Field
        label="Phone"
        name="phone"
        type="tel"
        required
        placeholder="+1 (555) 000-0000"
        defaultValue={defaultValues?.phone}
      />

      <Field
        label="Email"
        name="email"
        type="email"
        placeholder="jane@example.com"
        defaultValue={defaultValues?.email}
      />

      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Date of birth"
          name="dateOfBirth"
          type="date"
          defaultValue={defaultValues?.dateOfBirth}
        />
        <div className="space-y-1.5">
          <label htmlFor="gender" className="text-sm font-medium text-foreground">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            defaultValue={defaultValues?.gender ?? ""}
            className={INPUT_CLASS}
          >
            <option value="">Select…</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="notes" className="text-sm font-medium text-foreground">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          placeholder="Any relevant clinical or administrative notes…"
          defaultValue={defaultValues?.notes ?? ""}
          className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>
    </>
  );
}
