# Mortgage Industry News Monitor

A full-stack application that monitors and aggregates mortgage industry news from multiple sources, with AI-powered summarization using Claude Haiku.

## Features

- **Automated News Aggregation**: Fetches articles from major mortgage industry news sources via RSS feeds
- **AI-Powered Summaries**: Uses Claude Haiku API to generate concise 2-3 sentence summaries of each article
- **Advanced Filtering**: Filter articles by source, date range, and keywords
- **Scheduled Updates**: Automatic daily fetching at 8 AM EST and weekly cleanup of old articles
- **Clean UI**: Modern, responsive React interface with card-based article display
- **Persistent Storage**: Articles stored in Replit DB with 90-day retention

## Tech Stack

### Backend
- Node.js with Express
- Replit DB for data storage
- RSS Parser for feed ingestion
- Anthropic Claude Haiku API for summarization
- node-cron for scheduled tasks
- Cheerio for HTML parsing

### Frontend
- React 19 with Vite
- Axios for API communication
- date-fns for date formatting
- CSS3 for styling

## Project Structure

```
/
├── server/              # Backend Express server
│   ├── index.js        # Main server file with API routes
│   ├── db.js           # Replit DB configuration and helpers
│   ├── rssFetcher.js   # RSS feed fetching logic
│   ├── claudeSummarizer.js  # Claude API integration
│   ├── scheduler.js    # Cron job configuration
│   ├── sources.json    # News source configuration
│   └── package.json
│
├── client/             # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx    # Main view
│   │   │   ├── ArticleCard.jsx  # Article display
│   │   │   └── FilterBar.jsx    # Filter controls
│   │   ├── services/
│   │   │   └── api.js          # API service layer
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Anthropic API key (get one at https://console.anthropic.com/)

### Deploying on Replit (Recommended)

If you're running this application on Replit, use **Replit Secrets** for secure API key storage:

1. **Add your Anthropic API key to Replit Secrets**:
   - Click the **Secrets** tool (lock icon) in the left sidebar
   - Add a new secret:
     - **Key**: `ANTHROPIC_API_KEY`
     - **Value**: Your Anthropic API key from https://console.anthropic.com/
   - Click "Add Secret"

2. **Optional - Set custom port** (if needed):
   - Add another secret with **Key**: `PORT` and **Value**: `3001`
   - The application defaults to 3001, so this is optional

3. **Start the servers**:
   - Backend: `cd server && npm start`
   - Frontend: `cd client && npm run dev`

Replit automatically injects secrets as environment variables - no `.env` file needed!

### Backend Setup (Local Development)

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_actual_api_key_here
   PORT=3001
   ```

5. Start the backend server:
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

The server will start on http://localhost:3001

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` if needed (default should work for local development):
   ```
   VITE_API_URL=http://localhost:3001
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at http://localhost:5173

## API Endpoints

### GET /api/articles
Fetch stored articles with optional filters.

Query parameters:
- `source` - Filter by news source name
- `startDate` - Filter by start date (ISO format)
- `endDate` - Filter by end date (ISO format)
- `keyword` - Search in title and summary

Example:
```bash
curl "http://localhost:3001/api/articles?source=HousingWire&keyword=rates"
```

### POST /api/refresh
Manually trigger article fetch from all configured sources.

Example:
```bash
curl -X POST http://localhost:3001/api/refresh
```

### GET /api/sources
Get list of configured news sources.

Example:
```bash
curl http://localhost:3001/api/sources
```

## News Sources

The application currently monitors these mortgage industry news sources:

1. **HousingWire** - https://www.housingwire.com/
2. **National Mortgage News** - https://www.nationalmortgagenews.com/
3. **Mortgage News Daily** - https://www.mortgagenewsdaily.com/
4. **FinTech Magazine** - https://fintechmagazine.com/

To add or modify sources, edit `server/sources.json`.

## Scheduled Tasks

The application runs two automated tasks:

1. **Daily News Fetch**: Runs every day at 8:00 AM EST
   - Fetches latest articles from all configured sources
   - Generates AI summaries for each article
   - Stores articles in the database

2. **Weekly Cleanup**: Runs every Sunday at midnight EST
   - Removes articles older than 90 days
   - Helps maintain database size

## Usage

1. **View Articles**: The dashboard displays all fetched articles with their AI-generated summaries

2. **Filter Articles**: Use the filter bar to:
   - Select a specific news source
   - Search by keyword
   - Filter by date range

3. **Refresh Articles**: Click the "Refresh Articles" button to manually fetch the latest news

4. **Read Full Articles**: Click on any article title or "Read Full Article" link to view the original source

## Development

### Building for Production

Frontend:
```bash
cd client
npm run build
```

The build output will be in `client/dist/`.

### Environment Variables

**Server (.env)**:
- `ANTHROPIC_API_KEY` - Required for AI summarization
- `PORT` - Server port (default: 3001)

**Client (.env)**:
- `VITE_API_URL` - Backend API URL

## Troubleshooting

### Backend won't start
- **On Replit**: Ensure `ANTHROPIC_API_KEY` is set in Replit Secrets (lock icon in sidebar)
- **Local development**: Ensure `ANTHROPIC_API_KEY` is set in `server/.env`
- Check that port 3001 is available
- Verify all dependencies are installed

### Frontend can't connect to backend
- Ensure backend is running on port 3001
- Check `VITE_API_URL` in `client/.env`
- Verify CORS is enabled on the backend

### No articles showing
- Click "Refresh Articles" to manually fetch news
- Check backend console for any RSS fetching errors
- Verify RSS feed URLs in `server/sources.json` are accessible

## License

ISC
