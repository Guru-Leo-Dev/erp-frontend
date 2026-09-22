# Ledgerline ERP — Frontend

A responsive React (Vite) UI for the Ledgerline ERP backend: dashboard,
customers, vendors, items, stores, sales orders, purchase orders, shipping
and invoices. Includes a light/dark theme toggle (persisted, and defaults to
your OS preference).

## Requirements

- Node.js 18 or newer
- The **erp-backend** project running (see its README) — start that first.

## Setup

```bash
npm install
npm run dev
```

This starts the app at `http://localhost:5173`. In development, requests to
`/api/*` are proxied to `http://localhost:5000` (see `vite.config.js`), so
the backend must be running on port 5000 (its default).

## Configuration

Copy `.env.example` to `.env.local` if you need to point at a differently
hosted backend in production:

```
VITE_API_URL=/api
```

Leave it as `/api` for local development (it goes through the Vite proxy).
For a production build served separately from the API, set it to the full
API URL, e.g. `https://api.example.com/api`.

## Building for production

```bash
npm run build     # outputs static files to dist/
npm run preview   # serve the production build locally to sanity-check it
```

## Project layout

```
src/
  api/client.js                one small fetch wrapper + per-resource helpers
  context/ThemeContext.jsx     light/dark theme, persisted to localStorage
  components/
    layout/                    Sidebar, Topbar, Layout (responsive shell)
    common/                    Modal, ConfirmDialog, StatusBadge, icons,
                                EntityManager (generic list+form used by
                                Customers/Vendors/Stores/Items/Shipments),
                                LineItemsEditor (order line-item rows)
  pages/                       one file per module + Dashboard
  styles/                      theme.css (tokens) + global.css (everything else)
```

## Responsiveness & theme

- The sidebar becomes an off-canvas drawer (hamburger menu) below 768px;
  it's a fixed column above that.
- Tables scroll horizontally on narrow screens rather than clipping.
- Modals become bottom sheets on small screens, side drawers on larger ones.
- Toggle the theme from the sun/moon icon in the top bar — it's saved
  per-browser.
