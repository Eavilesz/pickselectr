# Pickselectr — Copilot Instructions

## What this app does

A photo selection tool for photographers. Clients receive a unique link to browse their event photos and select the ones they want delivered (digital files, album prints, etc.).

## Key concept: Products vs. Clients

- A **client** is a person (e.g. "Ana Martínez").
- A **product** is a specific event/delivery package for that client (e.g. Ana's quinceañera, Ana's photobooth session).
- One client can have **multiple products**. The admin dashboard lists products, not clients.

## Routing

- `/select/[slug]` — client-facing photo selection page
- `/admin` — products dashboard (lists all products)
- `/admin/products/[slug]` — product detail page (admin)
- The `slug` is the **shared identifier** between both routes. Never use the numeric `id` in URLs.

## Data model (`app/admin/types.ts`)

- `Client` — holds `slug`, `name`, `eventType`, `deadline`, `products[]`, progress counters (`digitalSelected`, `albumSelected`, `coverSelected`), and `isReady`
- `Product` — `type` (`"digital"` | `"album"`), `photoLimit`, optional `includesCover`
- `EventType` — `"wedding"` | `"birthday"` | `"photobooth"` | `"quinceañera"` | `"other"`
- Mock data lives in `app/admin/mock-data.ts`

## Stack

- Next.js App Router (see AGENTS.md — APIs may differ from training data)
- Tailwind CSS (dark theme: `neutral-950` background)
- TypeScript, pnpm

## Language

All UI strings are in **Spanish (es-MX)**. Dates formatted with `toLocaleDateString("es-MX")`.

## Selection System

Three-tier hierarchical selection for client photo delivery:

1. **Digital** — All available photos, client selects which to receive digitally
2. **Album** — Subset of Digital, photos to include in physical album
3. **Cover** — Exactly 2 photos from Album selection for album cover

**Selection Rules:**

- Album photos can ONLY be selected from Digital photos
- Cover photos can ONLY be selected from Album photos
- Removing from Digital cascades removal from Album and Cover
- Each mode filters gallery to show only eligible photos
- Cover has a hard limit of 2 photos maximum

**Mode Switching:**

- Navigation tabs switch between Digital/Album/Cover modes
- Count format: `selected/total` (e.g., "12/50")
- Gallery dynamically filters based on active mode

## Color System

Premium neutral palette for professional feel:

- **Digital**: Gray-400 (subtle silver)
- **Album**: Slate-500/400 (sophisticated blue-gray)
- **Cover**: Amber-700/600 (rich dark gold)

Colors are consistently applied to:

- Navigation tabs (active state background)
- Heart icons (selection controls)
- Selection indicator dots (top-right corner of photos)
- Focus rings and hover states

## UX Patterns

- **Heart icon click**: Select/unselect photo in current mode (color matches mode)
- **Image click**: Opens full-screen preview modal
- **Selection indicator**: Small square colored dot (top-right) shows highest selection level
- **Preview modal**: Can select/unselect from preview, shows current selection type
- **Photo filtering**: Each mode shows only photos eligible for that level
- **Loading states**: Spinner displays while preview images load

## Design Principles

- **Mobile-first**: 3-column grid on phones, expands on larger screens
- **No rounded corners**: Sharp, clean edges throughout
- **Premium aesthetic**: Minimalistic, sophisticated design
- **Dark theme**: Black background (`bg-black`)
- **Neutral palette**: Muted colors for professional feel
- **Touch-friendly**: Large tap targets, clear visual feedback

## Component Responsibilities

- `SelectionModeNav` — Tab navigation showing all three modes with selected/total counts
- `PhotoCard` — Individual photo with color-coded heart icon and selection indicator dot
- `ImagePreview` — Full-screen modal with image preview, selection control, and mode indicator
- `PhotoGallery` — Responsive grid layout with filtered photos based on current mode
- `SelectionButton` — Fixed bottom button to save all selections (shows digital count)

## Folder structure

```
app/
  admin/
    page.tsx              # Products dashboard
    layout.tsx            # Admin shell with nav
    types.ts              # Shared types + label maps
    mock-data.ts          # Mock product entries
    products/[slug]/
      page.tsx            # Product detail page
      CopyButton.tsx      # Client-side copy button
  page.tsx                # Client-facing selection page
components/
  PhotoGallery.tsx
  PhotoCard.tsx
  SelectionButton.tsx
  SelectionModeNav.tsx
  ImagePreview.tsx
```
