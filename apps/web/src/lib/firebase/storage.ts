/**
 * Firebase Storage helpers.
 *
 * SERVER-ONLY. Use getAdminStorage() for server-side operations.
 *
 * File path convention:
 *   organizations/{organizationId}/patients/{patientId}/documents/{filename}
 *   organizations/{organizationId}/shared/{filename}
 *
 * All paths are scoped under an organizationId prefix so that Storage
 * security rules can enforce per-org access with a single prefix check.
 */

import { getAdminStorage } from "./admin";

export function getStorageBucket() {
  return getAdminStorage().bucket();
}

// ─── Path builders ─────────────────────────────────────────────────────────

export const storagePaths = {
  patientDocument: (
    organizationId: string,
    patientId: string,
    filename: string
  ) => `organizations/${organizationId}/patients/${patientId}/documents/${filename}`,

  orgShared: (organizationId: string, filename: string) =>
    `organizations/${organizationId}/shared/${filename}`,
};

// ─── Helpers ───────────────────────────────────────────────────────────────

/**
 * Generate a signed URL for a private file.
 * Expires in 1 hour by default.
 */
export async function getSignedUrl(
  filePath: string,
  expiresInMs = 60 * 60 * 1000
): Promise<string> {
  const bucket = getStorageBucket();
  const file = bucket.file(filePath);
  const [url] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + expiresInMs,
  });
  return url;
}

/**
 * Delete a file from storage.
 */
export async function deleteFile(filePath: string): Promise<void> {
  const bucket = getStorageBucket();
  await bucket.file(filePath).delete();
}
