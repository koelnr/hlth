# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Run from the repo root unless noted otherwise.

```bash
# Development
pnpm dev              # Start all apps in dev mode (via turbo)
cd apps/web && pnpm dev  # Start only the web app

# Build
pnpm build            # Build all apps (via turbo)

# Lint & Format
pnpm lint             # Lint all apps (via turbo)
pnpm format           # Prettier format all TS/TSX/MD files

# Release
pnpm release          # Semantic release (runs on CI; do not run manually)
```

## Architecture

**Monorepo** managed with pnpm workspaces + Turbo. Currently one app: `apps/web`.

### `apps/web`

Next.js 16 app (App Router) serving both the marketing site and authenticated dashboard.

**Key technology choices:**
- **Auth:** Clerk (`@clerk/nextjs`) — handles sign-in/sign-up via `src/middleware.ts`. Public routes are explicitly listed in the middleware config; everything else requires auth.
- **UI:** shadcn/ui (style: `radix-nova`) with Tailwind CSS v4. Components live in `src/components/ui/`. The `cn()` utility from `src/lib/utils.ts` is used for conditional class merging everywhere.
- **Font:** Space Grotesk loaded via `next/font/google` in the root layout.
- **React Compiler:** Enabled in `next.config.ts` — avoid manual `useMemo`/`useCallback` unless there's a specific reason.

**Route structure:**
- `app/(marketing)/` — public marketing pages (home, etc.)
- `app/sign-in/` and `app/sign-up/` — Clerk catch-all auth routes
- `app/waitlist/` — waitlist capture page

**shadcn/ui:** Add new components via `pnpm dlx shadcn@latest add <component>` from `apps/web/`. RSC is enabled, so components default to server-compatible unless `"use client"` is needed.

## Release Process

Releases are fully automated via GitHub Actions (`.github/workflows/release.yml`). Pushing to `main` triggers `multi-semantic-release`, which bumps versions, generates CHANGELOGs, and tags releases. Commit messages must follow Conventional Commits — this determines the version bump type.
