# hlth web

Next.js 16 app serving the marketing site and authenticated clinic dashboard.

## Routes

| Route | Description |
|---|---|
| `/` | Marketing landing page |
| `/sign-in`, `/sign-up` | Clerk auth pages |
| `/waitlist` | Waitlist capture |
| `/app` | Dashboard overview |
| `/patients` | Patient list, create, view, edit |
| `/appointments` | Appointment list, create, view, edit |
| `/follow-ups` | Follow-up list, create, view, edit |
| `/settings` | Clinic profile settings |

## Route groups

- `(marketing)/` — public pages, no auth required
- `(auth)/` — sign-in, sign-up, waitlist
- `(protected)/` — full dashboard, requires Clerk session

## Dev

```bash
pnpm dev        # from repo root, or:
cd apps/web && pnpm dev
```

## Key decisions

- **Auth:** Clerk (`@clerk/nextjs`) with route protection in `src/proxy.ts`. Public routes are explicitly listed; everything else requires auth.
- **Data:** Firebase Firestore via `firebase-admin` on the server. All collections are scoped by `orgId` for multi-tenancy. Client SDK available for future real-time use.
- **UI:** shadcn/ui (style: `radix-nova`) with Tailwind CSS v4. Components in `src/components/ui/`. Use `cn()` from `src/lib/utils.ts` for class merging.
- **Font:** Space Grotesk via `next/font/google`.
- **React Compiler:** Enabled — avoid manual `useMemo`/`useCallback` unless explicitly needed.

## Adding shadcn components

```bash
pnpm dlx shadcn@latest add <component>
```

Run from `apps/web/`. RSC is enabled, so components default to server-compatible unless `"use client"` is needed.
