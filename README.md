# 🚨 Community Alerts

Crowdsourced incident reporting with real-time alerts. Built with **Next.js**, **FastAPI**, and **Supabase**.

## Project Structure

```
emergency-response-hack/
├── README.md
├── supabase/
│   └── schema.sql            # Run in Supabase SQL Editor
├── backend/
│   ├── .env                  # Backend env vars
│   ├── requirements.txt
│   └── main.py               # FastAPI server
└── frontend/
    ├── .env.local             # Frontend env vars
    ├── package.json
    ├── tsconfig.json
    ├── next.config.js
    └── src/
        ├── lib/
        │   ├── supabase.ts    # Supabase client
        │   └── api.ts         # API helper
        ├── components/
        │   └── AuthGate.tsx   # Auth wrapper
        └── app/
            ├── layout.tsx
            ├── globals.css
            ├── page.tsx               # Home
            ├── map/page.tsx           # Map with pins
            ├── report/page.tsx        # Create report
            ├── alerts/page.tsx        # Real-time alerts
            ├── settings/page.tsx      # User settings
            └── admin/analytics/page.tsx  # Admin dashboard
```

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** and paste + run the contents of `supabase/schema.sql`.
3. In **Project Settings → API**, copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`
4. In **Database → Replication**, ensure the `alerts` table is in the `supabase_realtime` publication (the SQL does this automatically).

### 2. Backend (FastAPI)

```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
```

Edit `backend/.env`:

```
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
VOTE_THRESHOLD=5
```

Run:

```bash
uvicorn main:app --reload --port 8000
```

API available at `http://localhost:8000`. Docs at `http://localhost:8000/docs`.

### 3. Frontend (Next.js)

```bash
cd frontend
npm install
```

Edit `frontend/.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

Run:

```bash
npm run dev
```

App available at `http://localhost:3000`.

### 4. Make yourself admin (optional)

In the Supabase SQL Editor:

```sql
UPDATE profiles SET role = 'admin' WHERE id = 'YOUR_USER_UUID';
```

## How It Works

1. **Sign up / Sign in** – Supabase Auth (email + password).
2. **Create a report** on `/report` with type, title, description and location.
3. **View the map** at `/map` – click pins to see details and upvote.
4. **When a report reaches 5 upvotes**, the backend automatically creates an **alert**.
5. **Alerts page** (`/alerts`) receives new alerts **in real-time** via Supabase Realtime – a toast notification appears and the alert prepends to the list.
6. **Settings** (`/settings`) lets you configure your personal vote threshold.
7. **Admin analytics** (`/admin/analytics`) shows alerts-per-report and estimated users alerted.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/me` | Current user profile |
| PUT | `/me/threshold` | Update notification threshold |
| GET | `/reports` | List all reports (with vote counts) |
| POST | `/reports` | Create a new report |
| POST | `/reports/{id}/upvote` | Upvote a report |
| GET | `/alerts` | List all alerts |
| GET | `/admin/analytics` | Admin analytics dashboard data |

## Environment Variables

| Variable | Where | Description |
|----------|-------|-------------|
| `SUPABASE_URL` | backend `.env` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | backend `.env` | Service role key (full access) |
| `VOTE_THRESHOLD` | backend `.env` | Upvotes needed to trigger alert (default 5) |
| `NEXT_PUBLIC_SUPABASE_URL` | frontend `.env.local` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | frontend `.env.local` | Supabase anon key |
| `NEXT_PUBLIC_API_BASE` | frontend `.env.local` | FastAPI URL (default http://localhost:8000) |