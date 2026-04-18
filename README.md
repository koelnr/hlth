# hlth

A next-gen healthcare management system built for modern clinics.

## Monorepo structure

```
apps/
  web/    Next.js 16 app (marketing + dashboard)
```

Managed with **pnpm workspaces** and **Turbo**.

## Prerequisites

- Node.js 20+
- pnpm

## Getting started

```bash
pnpm install
pnpm dev
```

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all apps |
| `pnpm format` | Prettier format all TS/TSX/MD files |

## Tech stack

- **Framework:** Next.js 16 (App Router)
- **Auth:** Clerk
- **Database:** Firebase Firestore (multi-tenant, scoped by `orgId`)
- **UI:** shadcn/ui + Tailwind CSS v4
- **Monorepo:** pnpm workspaces + Turbo

## Releases

Releases are automated via GitHub Actions. Pushing to `main` triggers `multi-semantic-release`, which bumps versions, generates CHANGELOGs, and creates tags. Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/).
