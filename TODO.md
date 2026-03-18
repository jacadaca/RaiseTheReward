# RaiseTheReward — Future TODOs

## Data Sources
- [ ] **NamUs sync script** — Their API changed (returns 404). Need to reverse-engineer their current internal API by inspecting network calls on namus.nij.ojp.gov. Alternatively, reach out to NamUs/NIJ directly for a data partnership since RTR is a legitimate missing persons platform.
- [ ] **Crime Stoppers** — No centralized API. Decentralized by region. Would need to scrape individual regional sites or partner with Crime Stoppers USA for data access.

## Infrastructure
- [ ] **Sanity Studio** — Set up the Sanity Studio for a visual CMS interface (alternative to the custom admin page)
- [ ] **Real authentication** — Add NextAuth.js or Clerk for user accounts and admin login (currently /admin is unprotected)
- [ ] **Stripe Connect** — Payment processing for actual donations
- [ ] **Custom domain** — Set up raisethereward.com on Vercel

## Features
- [ ] **Vanity URL suggestion form** — Let users suggest custom vanity URLs from case pages (API route is built, needs UI)
- [ ] **Admin: vanity slug editing** — Let admin click to edit vanity slugs inline in the table
- [ ] **Case search improvements** — Full-text search, filters by state/date range
- [ ] **Email notifications** — Alert families/admins when donations come in
- [ ] **Social sharing** — Open Graph meta tags per case for rich link previews
