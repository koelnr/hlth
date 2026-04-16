import { UserButton } from "@clerk/nextjs";

interface AppHeaderProps {
  orgName?: string | null;
}

export function AppHeader({ orgName }: AppHeaderProps) {
  return (
    <header className="h-14 flex items-center justify-between px-4 md:px-6 border-b border-border bg-background shrink-0">
      <div>
        {/* Show brand on mobile (sidebar is hidden), org name on desktop */}
        <span className="font-semibold text-foreground text-sm md:hidden">
          hlth
        </span>
        {orgName && (
          <span className="text-sm text-muted-foreground hidden md:block">
            {orgName}
          </span>
        )}
      </div>
      <UserButton />
    </header>
  );
}
