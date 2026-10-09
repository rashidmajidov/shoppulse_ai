# ShopPulse AI - Automated TikTok Trend Analysis & Ad Script Pipeline

A lightweight, automated Node.js & TypeScript pipeline that extracts trending TikTok videos, transcribes their audio with OpenAI Whisper, deconstructs viral hooks using GPT-4o, and caches marketing-ready ad scripts in PostgreSQL / Supabase — **without expensive video rendering or frame-by-frame processing**.

---

## 🏗️ Pipeline Architecture

```
[Target Hashtags]
       │
       ▼
┌──────────────────────────────────────────────┐
│  STEP 1: Trend Data Extraction (Apify API)   │
│  - Fetches top posts for #TikTokMadeMeBuyIt  │
│  - Extracts metrics (views, shares, likes)   │
│  - NO heavy video downloads or local storage │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│  STEP 2: Audio Transcription (Whisper API)   │
│  - Streams audio directly to Whisper API     │
│  - Extracts full spoken transcript text      │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│  STEP 3: Trend & Hook Analysis (GPT-4o)      │
│  - Custom Virality Score (1-100) calculation │
│  - Deconstructs 0-3s Hook, Problem & CTA     │
│  - Generates reusable e-com ad templates     │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│  STEP 4: Output & Caching (Supabase / PG)    │
│  - Upserts trend records into 'trends' table │
│  - Exposes REST API (/api/trends) for UI     │
└──────────────────────────────────────────────┘
```

---

## 🛠️ Setup Instructions

### 1. Database Setup (Supabase / PostgreSQL)
1. Open your [Supabase Dashboard](https://supabase.com).
2. Go to **SQL Editor** -> **New Query**.
3. Copy and run the contents of [`backend/schema.sql`](./schema.sql).
4. This creates the `trends` table with indexes and RLS policies.

### 2. Environment Variables
Your `backend/.env` file is already pre-configured with your keys:
- `APIFY_API_TOKEN` & `APIFY_ACTOR_ID`
- `OPENAI_API_KEY`
- `SUPABASE_URL` & `SUPABASE_SERVICE_ROLE_KEY`
- `PORT=5000`

### 3. Install Dependencies
In the `backend` folder, run:
```bash
cd backend
npm install
```

### 4. Run the Pipeline

#### Option A: Run Standalone CLI Script
```bash
npm run pipeline:run
```
Or with custom hashtags:
```bash
npx tsx src/pipeline/runStandalone.ts TikTokMadeMeBuyIt AmazonFinds TechGadgets
```

#### Option B: Start REST API Server
```bash
npm run dev
```
Server starts on `http://localhost:5000`.

---

## 📡 REST API Reference

### 1. Get Trends
`GET /api/trends`
Query parameters:
- `category` (e.g. `Tech & Gadgets`, `Beauty & Skincare`)
- `platform` (e.g. `tiktok`)
- `search` (keyword search in title, hook, caption)
- `minVirality` (e.g. `80`)
- `limit` (default: `20`)
- `offset` (default: `0`)

### 2. Get Single Trend
`GET /api/trends/:id`

### 3. Trigger Pipeline on Demand
`POST /api/pipeline/run`
Body (JSON):
```json
{
  "hashtags": ["TikTokMadeMeBuyIt", "ViralProducts"],
  "maxPosts": 5,
  "minViews": 50000
}
```

### 4. Health Check
`GET /api/health`
