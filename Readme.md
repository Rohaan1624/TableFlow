# TableFlow

> Free, open source restaurant management software. Tables, orders, kitchen display, menu, and inventory — without paying $300/month for Toast or Square.

![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-in%20development-orange)
![Stack](https://img.shields.io/badge/stack-React%20%2B%20Supabase-green)

---

## Features

- **Floor map** — drag and drop table layout, real time status by color
- **Order taking** — tap a table, add items, send to kitchen instantly
- **Kitchen display** — live order queue with timers and alerts
- **Menu management** — categories, items, photos, toggle availability
- **Inventory tracking** — stock levels, low stock alerts, movement log
- **Staff & PIN login** — role based access, no password needed during service
- **Reports** — daily revenue, best sellers, busiest hours
- **QR menu** — public read-only menu page for any phone

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Floor Canvas | react-konva |
| Backend | Supabase (PostgreSQL + Realtime + Auth + Storage) |
| Hosting | Vercel |
| Payments (later) | Stripe |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A free [Supabase](https://supabase.com) account

### Setup

```bash
git clone https://github.com/yourusername/tableflow.git
cd tableflow
npm install
cp .env.example .env
```

Add your Supabase credentials to `.env`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Paste the schema from `/supabase/migrations/initialize.sql` into your Supabase SQL editor and run it.

```bash
npm run dev
```

Visit `http://localhost:5173` and create your restaurant.

---

## Roadmap

- [x] Table layout editor
- [ ] Schema and Supabase setup
- [ ] Auth and restaurant registration
- [ ] Menu management
- [ ] Live floor and order taking
- [ ] Kitchen display
- [ ] Staff and PIN login
- [ ] Reports
- [ ] QR menu page
- [ ] Stripe billing
- [ ] Public launch

---

## License

MIT — free to use, self-host, and modify.

---

Built by [CimaTech](https://github.com/Rohaan1624)