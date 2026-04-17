"use server";

import { revalidatePath } from "next/cache";
import { requireOrganization } from "@/lib/auth/clerk";
import { createClinicProfile, updateClinicProfile } from "@/lib/data/clinics";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function saveClinicSettingsAction(formData: FormData): Promise<void> {
  const viewer = await requireOrganization();

  const name = (formData.get("name") as string)?.trim();
  if (!name) throw new Error("Clinic name is required");

  const specialty = (formData.get("specialty") as string)?.trim() || null;
  const phone = (formData.get("phone") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim() || null;
  const address = (formData.get("address") as string)?.trim() || null;
  const profileId = (formData.get("profileId") as string)?.trim();

  if (profileId) {
    await updateClinicProfile(profileId, viewer.orgId, { name, specialty, phone, email, address });
  } else {
    await createClinicProfile(viewer.orgId, {
      name,
      slug: slugify(name),
      specialty,
      phone,
      email,
      address,
    });
  }

  revalidatePath("/settings");
}
