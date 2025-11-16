# Forex Bot Frontend

A modern Next.js frontend for monitoring and controlling your forex trading bot. Built with TypeScript, Tailwind CSS, and React.

## Features

- **Real-time Dashboard** - Monitor account balance, open trades, and P/L
- **Trade Management** - Execute buy/sell orders and close positions
- **Interactive Charts** - Visualize price data with multiple timeframes
- **Bot Control** - Start/stop the trading bot from the UI
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Dark Mode Support** - Automatic theme switching based on system preferences

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Date Formatting:** date-fns

## Prerequisites

- Node.js 18+ and npm
- A running backend API (see Backend Setup below)

## Installation

1. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and set your API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Dashboard page
│   ├── trades/            # Trades history page
│   ├── charts/            # Charts page
│   ├── settings/          # Settings page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Navigation.tsx     # Main navigation
│   ├── AccountOverview.tsx
│   ├── BotStatus.tsx
│   ├── QuickTrade.tsx
│   └── TradesList.tsx
├── lib/                   # Utilities and API client
│   ├── api.ts            # API client
│   └── utils.ts          # Helper functions
├── types/                 # TypeScript definitions
│   └── index.ts
└── public/               # Static assets
```

## Backend Setup

This frontend requires a REST API backend. The Python forex bot needs to expose the following HTTP endpoints:

### Required API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/account` | Fetch account information |
| GET | `/api/trades` | List all trades |
| POST | `/api/trades/buy` | Execute buy order |
| POST | `/api/trades/sell` | Execute sell order |
| POST | `/api/trades/:id/close` | Close a specific trade |
| GET | `/api/instruments` | List available instruments |
| GET | `/api/candles` | Fetch historical candle data |
| GET | `/api/bot/status` | Get bot running status |
| POST | `/api/bot/start` | Start the trading bot |
| POST | `/api/bot/stop` | Stop the trading bot |

### Example Backend Implementation (FastAPI)

To add a REST API to the Python forex bot, you can use FastAPI:

```bash
pip install fastapi uvicorn
```

Create `api_server.py` in the root directory:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.forex_bot.main import setup_dependencies

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

deps = setup_dependencies()

@app.get("/api/account")
async def get_account():
    # Implement account fetching logic
    pass

@app.get("/api/trades")
async def get_trades():
    # Implement trades fetching logic
    pass

# ... implement other endpoints
```

Run the API server:

```bash
uvicorn api_server:app --reload --port 8000
```

## Pages

### Dashboard (`/`)
- Account overview with balance, NAV, and P/L
- Bot status and controls
- Open trades list
- Quick trade execution form

### Trades (`/trades`)
- Complete trade history
- Filter by status (All, Open, Closed)
- Detailed trade information

### Charts (`/charts`)
- Interactive price charts
- Multiple instruments (EUR/USD, GBP/USD, USD/JPY)
- Multiple timeframes (5m, 15m, 30m, 1h, 4h, Daily)
- High/Low/Close price visualization

### Settings (`/settings`)
- API configuration information
- Backend setup instructions
- Application information

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000/api` |

## Development

The frontend is designed to work independently with graceful error handling when the backend is unavailable. This allows you to:

1. Develop the frontend UI without a running backend
2. See helpful error messages when API calls fail
3. Test the UI with mock data

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

The easiest way to deploy this Next.js app is with [Vercel](https://vercel.com):

```bash
npm install -g vercel
vercel
```

### Deploy to Other Platforms

You can also deploy to:
- **Netlify** - `npm run build` and deploy the `.next` folder
- **AWS Amplify** - Connect your Git repository
- **Docker** - Use the included Dockerfile (if added)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Support

For issues and questions:
- Check the main project README
- Review the backend API documentation
- Open an issue on GitHub
