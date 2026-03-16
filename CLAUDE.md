# RaiseTheReward.com

The first crowdsourced reward platform for missing persons & unsolved crimes.
"GoFundMe for information" — families crowdfund reward pools; tips go to law enforcement; solver gets paid on verified resolution.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4
- **CMS**: Sanity (planned)
- **Deployment**: Vercel
- **Package Manager**: pnpm

## Project Structure

```
src/
  app/           # Next.js App Router pages & layouts
  components/    # Reusable React components
  lib/           # Utilities, helpers, API clients
  sanity/        # Sanity client config & schemas (when added)
```

## Commands

- `pnpm dev` — Start dev server
- `pnpm build` — Production build
- `pnpm lint` — Run ESLint
- `pnpm start` — Start production server

## Key Business Rules

- 4% platform fee on all donations
- Family never touches donated money
- Tips go directly to law enforcement (platform is not a proxy)
- Reward disbursed only on verified case resolution with official documentation
- All donations are irrevocable once committed

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in values.
