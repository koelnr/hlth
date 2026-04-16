/**
 * getViewerContext — non-throwing variant of requireOrganization().
 *
 * Returns null if the user is not authenticated or has no active org.
 * Use in server components that need to conditionally render based on
 * auth state without throwing (e.g. layouts, nav, conditional UI).
 *
 * For server actions and route handlers that must be authenticated,
 * use requireOrganization() from ./clerk.ts instead.
 */

import { auth } from "@clerk/nextjs/server";
import type { ViewerContext } from "./clerk";

export async function getViewerContext(): Promise<ViewerContext | null> {
  const { userId, orgId, orgRole } = await auth();
  if (!userId || !orgId) return null;
  return { userId, orgId, orgRole: orgRole ?? null };
}
