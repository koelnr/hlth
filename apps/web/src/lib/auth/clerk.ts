/**
 * Clerk server-side auth helpers.
 *
 * Use these in server components, server actions, and route handlers.
 * Never import in client components.
 *
 * All data operations must be scoped to an organization. Use
 * requireOrganization() as the entry point in any handler that touches
 * clinic data.
 */

import { auth } from "@clerk/nextjs/server";

// ─── Types ─────────────────────────────────────────────────────────────────

export type ViewerContext = {
  userId: string;
  orgId: string;
  /** Clerk role string, e.g. "org:admin". May be null for legacy sessions. */
  orgRole: string | null;
};

// ─── Helpers ───────────────────────────────────────────────────────────────

/**
 * Require that the request is authenticated.
 * Returns the Clerk userId. Throws a plain Error if not.
 *
 * Use in contexts where an organization is not required (e.g. onboarding).
 */
export async function requireAuth(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

/**
 * Require both authentication and an active organization context.
 * Returns a ViewerContext for scoping data operations.
 *
 * Use this as the first call in any server action or route handler
 * that reads or writes clinic data.
 *
 * Example:
 *   const viewer = await requireOrganization();
 *   const patients = await listPatientsForOrg(viewer.orgId);
 */
export async function requireOrganization(): Promise<ViewerContext> {
  const { userId, orgId, orgRole } = await auth();
  if (!userId) throw new Error("Unauthorized");
  if (!orgId) throw new Error("No active organization");
  return { userId, orgId, orgRole: orgRole ?? null };
}
