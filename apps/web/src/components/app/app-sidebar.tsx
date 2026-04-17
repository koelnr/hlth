"use client";

import { brand } from "@/content/landing";
import { cn } from "@/lib/utils";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { Calendar, ClipboardList, LayoutDashboard, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/patients", label: "Patients", icon: Users },
  { href: "/appointments", label: "Appointments", icon: Calendar },
  { href: "/follow-ups", label: "Follow-ups", icon: ClipboardList },
] as const;

interface AppSidebarProps {
  hasOrg: boolean;
}

export function AppSidebar({ hasOrg }: AppSidebarProps) {
  const pathname = usePathname();

  function navLink(href: string, label: string, Icon: typeof Settings) {
    const isActive =
      href === "/app" ? pathname === "/app" : pathname.startsWith(href);
    return (
      <Link
        key={href}
        href={href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
        )}
      >
        <Icon
          className={cn(
            "h-4 w-4 shrink-0",
            isActive ? "text-sidebar-primary" : "text-muted-foreground",
          )}
        />
        {label}
      </Link>
    );
  }

  return (
    <aside className="flex flex-col w-64 h-full bg-sidebar border-r border-sidebar-border">
      {/* Brand */}
      <div className="h-14 flex items-center px-5 border-b border-sidebar-border shrink-0">
        <span className="font-semibold text-sidebar-foreground tracking-tight text-sm">
          {brand.name}
        </span>
      </div>

      {/* Org context */}
      {hasOrg && (
        <div className="px-4 py-3 border-b border-sidebar-border shrink-0">
          <p className="ml-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            Clinic
          </p>
          <OrganizationSwitcher />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => navLink(item.href, item.label, item.icon))}
      </nav>

      {/* Bottom nav — settings */}
      <div className="px-3 pb-4 border-t border-sidebar-border pt-3 shrink-0">
        {navLink("/settings", "Settings", Settings)}
      </div>
    </aside>
  );
}
