# RaiseTheReward — Dev Environment Setup

Follow these steps to get the project running on a new machine.

---

## 1. Install prerequisites

### Node.js (v22+)

The project uses Next.js 16, which requires Node.js 22 or later.

**macOS (recommended — using nvm):**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# restart your terminal, then:
nvm install 22
nvm use 22
node --version   # should show v22.x.x
```

Or with Homebrew:

```bash
brew install node@22
```

### pnpm (package manager)

```bash
corepack enable
corepack prepare pnpm@latest --activate
pnpm --version
```

Or install directly:

```bash
npm install -g pnpm
```

### Git

macOS ships with Git, but you can get a newer version:

```bash
brew install git
```

---

## 2. Clone the repository

```bash
git clone https://github.com/jacadaca/RaiseTheReward.git
cd RaiseTheReward
```

---

## 3. Install dependencies

```bash
pnpm install
```

This reads `package.json` and installs everything (Next.js 16, React 19, Tailwind CSS v4, TypeScript, etc.).

---

## 4. Set up environment variables

```bash
cp .env.local.example .env.local
```

The defaults work for local development. The file should contain:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=do2znx2e
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 5. Download case images (optional)

Case images live in `public/cases/`. They aren't committed to Git (too large). To download them from public law enforcement sources:

```bash
bash scripts/download-images.sh
```

Some images (NCMEC, Crime Stoppers cases) may need to be saved manually — the script will tell you which ones. The site works without images; it shows colored initials as a fallback.

---

## 6. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The site hot-reloads as you edit files.

---

## 7. Other useful commands

| Command | What it does |
|---|---|
| `pnpm build` | Production build (catches TypeScript errors) |
| `pnpm lint` | Run ESLint |
| `pnpm start` | Serve the production build locally |

---

## 8. Vercel deployment

The project auto-deploys from GitHub. Every push to `main` triggers a new deployment.

If you want to preview deployments from your laptop:

```bash
npm install -g vercel
vercel login          # authenticate with your Vercel account
vercel                # deploy a preview
vercel --prod         # deploy to production
```

The Vercel project is already linked to the GitHub repo, so you typically just push and it deploys automatically.

---

## 9. Project structure (quick reference)

```
src/
  app/              Next.js App Router — pages & layouts
    page.tsx          Homepage
    cases/page.tsx    Browse all cases
    case/[id]/        Individual case page + donate flow
    submit/           Start a Reward form
    how-it-works/     How it works page
    claim/            Tipster claim form
    removal-request/  Case removal request form
  components/       Reusable components (Nav, Footer, CaseCard)
  lib/
    cases.ts          Case data (will move to Sanity later)
scripts/
  download-images.sh  Fetches case photos from LE databases
public/
  cases/              Local case images (not in Git)
```

---

## 10. Tech stack summary

- **Next.js 16** (App Router) + **TypeScript**
- **React 19**
- **Tailwind CSS v4** (using `@tailwindcss/postcss`)
- **pnpm** for package management
- **Vercel** for hosting (auto-deploy from GitHub)
- **Sanity** CMS planned (client packages installed, not yet wired up)

---

## Troubleshooting

**`pnpm: command not found`** — Run `corepack enable` first, or install with `npm install -g pnpm`.

**Node version errors** — Make sure you're on Node 22+. Run `node --version` to check.

**Images not showing** — Run `bash scripts/download-images.sh` or the site gracefully falls back to colored initials.

**Build fails** — Run `pnpm build` to see TypeScript errors. Fix them before pushing.
