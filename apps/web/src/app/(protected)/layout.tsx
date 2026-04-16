import { auth, clerkClient } from "@clerk/nextjs/server";
import { AppSidebar } from "@/components/app/app-sidebar";
import { AppHeader } from "@/components/app/app-header";
import { MobileNav } from "@/components/app/mobile-nav";

export default async function ProtectedLayout({ children }: LayoutProps<"/">) {
  const { orgId } = await auth();
  const client = await clerkClient();
  const org = await client.organizations.getOrganization({
    organizationId: orgId ?? "",
  });

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden md:flex shrink-0">
        <AppSidebar orgName={org.name ?? null} />
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0">
        <AppHeader orgName={org.name ?? null} />
        {/* pb-16 clears the mobile bottom nav */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">{children}</main>
      </div>

      {/* Mobile bottom navigation */}
      <MobileNav />
    </div>
  );
}
