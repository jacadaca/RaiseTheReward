# Sanity CMS Integration

This directory will hold Sanity configuration when you're ready to add it.

## Setup (when ready)

1. Create a Sanity project at https://www.sanity.io/manage
2. Install: `pnpm add next-sanity @sanity/image-url`
3. Add your project ID and dataset to `.env.local`
4. Define schemas in `src/sanity/schemas/`
5. Configure the client in `src/sanity/client.ts`
