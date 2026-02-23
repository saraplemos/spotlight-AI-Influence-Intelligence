# Spotlight AI Influence Intelligence

Property-level AI visibility reports for Spotlight Communications clients.

## Setup

```bash
npm install
npm run dev
```

## Deploy

Connect to Vercel. Auto-detects as Vite. No additional config needed.

## Adding a new property

Edit the constants at the top of `src/PropertyReport.jsx`:
- `PROPERTY` — name, location, category, period
- `VISIBILITY_SCORE` — overall score out of 100
- `PLATFORM_SCORES` — per-platform scores and cited status
- `QUERIES` — query results per platform
- `GAPS` — identified gaps
- `RECOMMENDATIONS` — PR actions with timeframes
