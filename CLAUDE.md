# Mortgage Intelligence Hub

AI-powered news aggregation and insights platform for mortgage industry product leaders.

## Application Overview

**Purpose:** Aggregate RSS feeds from mortgage and product management sources, generate AI-powered strategic insights using Claude, and provide an archive of historical insights.

**Target User:** Product Manager at Freedom Mortgage responsible for digital mortgage experience.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│                   React + Vite (client/)                     │
├─────────────────────────────────────────────────────────────┤
│                        Backend                               │
│                   Express.js (server/)                       │
├─────────────────────────────────────────────────────────────┤
│                        Database                              │
│                      PostgreSQL                              │
│         ┌─────────────────┬─────────────────────┐           │
│         │    articles     │  insights_archive   │           │
│         └─────────────────┴─────────────────────┘           │
├─────────────────────────────────────────────────────────────┤
│                          AI                                  │
│              Claude Sonnet 4.5 (Anthropic API)              │
└─────────────────────────────────────────────────────────────┘
```

## Key Files

### Server
| File | Purpose |
|------|---------|
| `server/sources.json` | RSS feed configuration (sources, categories, URLs) |
| `server/rssFetcher.js` | Fetches and parses RSS feeds |
| `server/insightsGenerator.js` | Claude AI prompt and insights generation |
| `server/scheduler.js` | Cron job for daily 8am EST refresh |
| `server/db.js` | Database operations, caching, archive functions |
| `server/index.js` | Express API routes |

### Client
| File | Purpose |
|------|---------|
| `client/src/components/Dashboard.jsx` | Main UI with tabs, filters, article list |
| `client/src/components/InsightsSummary.jsx` | Displays AI-generated insights (TL;DR, themes, actions) |
| `client/src/components/InsightsArchive.jsx` | Browse historical insights by date/category |
| `client/src/components/ArticleCard.jsx` | Individual article display |
| `client/src/services/api.js` | API client functions |

## Database Schema

### `articles` table
Stores fetched RSS articles (cleaned after 90 days)
- `id`, `title`, `link`, `source`, `category`, `summary`, `original_content`, `image_url`, `pub_date`

### `insights_archive` table
Stores generated AI insights for persistent caching
- `id`, `category`, `tldr` (JSONB), `recommended_actions` (JSONB), `themes` (JSONB), `article_count`, `date_range_start`, `date_range_end`, `generated_at`

## Caching Strategy

```
Request for insights
    │
    ▼
┌─────────────────────────────┐
│  1. In-memory cache         │  ← Fast (milliseconds)
└─────────────────────────────┘
    │ miss
    ▼
┌─────────────────────────────┐
│  2. Database archive        │  ← Survives server restarts
│     (within 24 hours)       │
└─────────────────────────────┘
    │ miss
    ▼
┌─────────────────────────────┐
│  3. Claude API call         │  ← Only if no recent cache
│     Archive to database     │
└─────────────────────────────┘
```

- **24-hour TTL**: Limits API calls to 1/day per category
- **Persistent caching**: Database archive survives server restarts
- **1-hour dedup**: Prevents duplicate archives within same hour

## RSS Sources

### Mortgage Category
- HousingWire, Redfin News, Rob Chrisman Commentary, National Mortgage News, MBA Newslink

### Product Management Category
- Lenny's Newsletter, SVPG Articles, Product Talk, Lenny's Podcast (YouTube), How I AI Podcast, Supra Insider

**Note:** Some sources have paywalls (National Mortgage News, HousingWire, Lenny's Newsletter). Insights are generated from available RSS summaries only.

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/articles` | Fetch stored articles with filters |
| POST | `/api/refresh` | Manually trigger RSS fetch |
| GET | `/api/sources` | List configured sources |
| GET | `/api/categories` | List unique categories |
| POST | `/api/insights` | Generate AI insights (with caching) |
| GET | `/api/insights/archive` | Browse archived insights |
| GET | `/api/insights/archive/:id` | Get specific archived insight |
| GET | `/api/insights/search?q=` | Search archived insights |

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `ANTHROPIC_API_KEY` | Claude API authentication |
| `PORT` | Server port (default: 3001) |

## Skills

When asked to iterate on UI/design, do multiple design passes, or refine visual components, read and follow `.claude/skills/design-iterator/SKILL.md`.
