"""
FastAPI server for the Forex Bot frontend.

This provides REST API endpoints for the Next.js frontend to consume.
Install required dependencies: pip install fastapi uvicorn

Run with: uvicorn api_server:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

app = FastAPI(title="Forex Bot API", version="0.1.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class TradeRequest(BaseModel):
    instrument: str
    units: int
    stopLoss: Optional[float] = None
    takeProfit: Optional[float] = None

class Account(BaseModel):
    id: str
    balance: float
    currency: str
    marginAvailable: float
    marginUsed: float
    openTradeCount: int
    unrealizedPL: float
    nav: float

class Trade(BaseModel):
    id: str
    instrument: str
    units: int
    price: float
    currentPrice: Optional[float] = None
    unrealizedPL: Optional[float] = None
    openTime: str
    state: str
    stopLoss: Optional[float] = None
    takeProfit: Optional[float] = None

class Instrument(BaseModel):
    name: str
    displayName: str
    pipLocation: int
    type: str

class Candle(BaseModel):
    time: str
    open: float
    high: float
    low: float
    close: float
    volume: int

class BotStatus(BaseModel):
    isRunning: bool
    lastUpdate: str
    activeStrategy: Optional[str] = None

# Initialize dependencies (uncomment when integrated with actual bot)
# from src.forex_bot.main import setup_dependencies
# deps = setup_dependencies()

@app.get("/")
async def root():
    return {
        "message": "Forex Bot API",
        "version": "0.1.0",
        "docs": "/docs"
    }

@app.get("/api/account", response_model=Account)
async def get_account():
    """Get account information"""
    # TODO: Implement with actual OANDA API call
    # account_repo = deps['account_repository']
    # account = account_repo.get_account()

    # Demo data for now
    return Account(
        id="001-001-0000000-001",
        balance=10000.00,
        currency="USD",
        marginAvailable=9500.00,
        marginUsed=500.00,
        openTradeCount=2,
        unrealizedPL=125.50,
        nav=10125.50
    )

@app.get("/api/trades", response_model=List[Trade])
async def get_trades():
    """Get all trades"""
    # TODO: Implement with actual trading service
    # trading_service = deps['trading_service']
    # trades = trading_service.get_all_trades()

    # Demo data for now
    return [
        Trade(
            id="1",
            instrument="EUR_USD",
            units=1000,
            price=1.0850,
            currentPrice=1.0865,
            unrealizedPL=15.00,
            openTime=datetime.now().isoformat(),
            state="OPEN",
            stopLoss=1.0800,
            takeProfit=1.0900
        ),
        Trade(
            id="2",
            instrument="GBP_USD",
            units=-500,
            price=1.2650,
            currentPrice=1.2640,
            unrealizedPL=5.00,
            openTime=datetime.now().isoformat(),
            state="OPEN"
        )
    ]

@app.post("/api/trades/buy")
async def execute_buy(request: TradeRequest):
    """Execute a buy order"""
    # TODO: Implement with actual trading service
    # trading_service = deps['trading_service']
    # trade_id = trading_service.execute_buy(
    #     instrument=request.instrument,
    #     units=request.units,
    #     stop_loss=request.stopLoss,
    #     take_profit=request.takeProfit
    # )

    return {"trade_id": "demo_buy_123", "message": "Buy order executed"}

@app.post("/api/trades/sell")
async def execute_sell(request: TradeRequest):
    """Execute a sell order"""
    # TODO: Implement with actual trading service
    # trading_service = deps['trading_service']
    # trade_id = trading_service.execute_sell(...)

    return {"trade_id": "demo_sell_456", "message": "Sell order executed"}

@app.post("/api/trades/{trade_id}/close")
async def close_trade(trade_id: str):
    """Close a specific trade"""
    # TODO: Implement with actual trading service
    # trading_service = deps['trading_service']
    # trading_service.close_trade(trade_id)

    return {"message": f"Trade {trade_id} closed"}

@app.get("/api/instruments", response_model=List[Instrument])
async def get_instruments():
    """Get available instruments"""
    # TODO: Implement with actual instrument repository
    # instrument_repo = deps['instrument_repository']
    # instruments = instrument_repo.get_all_instruments()

    return [
        Instrument(name="EUR_USD", displayName="EUR/USD", pipLocation=-4, type="CURRENCY"),
        Instrument(name="GBP_USD", displayName="GBP/USD", pipLocation=-4, type="CURRENCY"),
        Instrument(name="USD_JPY", displayName="USD/JPY", pipLocation=-2, type="CURRENCY"),
    ]

@app.get("/api/candles", response_model=List[Candle])
async def get_candles(instrument: str = "EUR_USD", granularity: str = "H1", count: int = 100):
    """Get historical candle data"""
    # TODO: Implement with actual candle repository
    # candle_repo = deps['candle_repository']
    # candles = candle_repo.get_candles(instrument, granularity, count)

    # Return empty for now - implement with actual data
    return []

@app.get("/api/bot/status", response_model=BotStatus)
async def get_bot_status():
    """Get bot running status"""
    # TODO: Implement with actual bot status tracking
    return BotStatus(
        isRunning=False,
        lastUpdate=datetime.now().isoformat(),
        activeStrategy=None
    )

@app.post("/api/bot/start")
async def start_bot():
    """Start the trading bot"""
    # TODO: Implement bot start logic
    return {"message": "Bot started"}

@app.post("/api/bot/stop")
async def stop_bot():
    """Stop the trading bot"""
    # TODO: Implement bot stop logic
    return {"message": "Bot stopped"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
