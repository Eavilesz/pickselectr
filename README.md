# Picselectr

A photo selection tool for photographers. Clients receive a unique link to browse their event photos and choose which ones they want delivered — digital files, album prints, or cover photos.

## Features

### Client-facing

- **Unique selection link** — Each event gets a shareable `/select/[slug]` URL protected by a PIN
- **Three-tier photo selection** — Clients select photos at three levels:
  - **Digital** — All available photos; client picks which to receive digitally
  - **Album** — Subset of digital selections for inclusion in a physical album
  - **Cover** — Exactly 2 photos from album selections for the album cover
- **Cascading rules** — Removing a digital photo automatically removes it from album and cover
- **Full-screen preview** — Tap any photo to open a modal preview with selection controls
- **Mobile-first grid** — 3-column responsive layout optimized for touch

### Admin dashboard (`/events`)

- **Event management** — Create, view, and delete events for clients
- **Multiple event types** — Wedding, birthday, quinceañera, photobooth, and other
- **Photo uploads** — Upload photos per event directly from the dashboard (stored in Cloudflare R2)
- **Selected photos review** — View which photos a client has selected per tier (digital, album, cover)
- **Shareable links** — Copy the client selection URL with one click
- **PIN protection** — Each event link requires a PIN for client access
- **Deadline tracking** — Set a selection deadline per event

## Stack

- **Next.js** (App Router)
- **Supabase** — Auth, database, and row-level security
- **Cloudflare R2** — Photo storage
- **Tailwind CSS** — Dark theme (`neutral-950` background)
- **TypeScript**, **pnpm**
