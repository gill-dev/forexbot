from dataclasses import dataclass
from typing import Optional
from datetime import datetime


@dataclass
class Trade:
    """Domain model representing a trade"""

    trade_id: Optional[str]
    instrument: str
    units: float
    direction: int  # 1 for BUY, -1 for SELL
    entry_price: Optional[float] = None
    stop_loss: Optional[float] = None
    take_profit: Optional[float] = None
    opened_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None
    profit_loss: Optional[float] = None
    status: str = 'PENDING'  # PENDING, OPEN, CLOSED

    @property
    def is_buy(self) -> bool:
        """Check if trade is a buy"""
        return self.direction > 0

    @property
    def is_sell(self) -> bool:
        """Check if trade is a sell"""
        return self.direction < 0

    def to_dict(self) -> dict:
        """Convert to dictionary"""
        return {
            'trade_id': self.trade_id,
            'instrument': self.instrument,
            'units': self.units,
            'direction': self.direction,
            'entry_price': self.entry_price,
            'stop_loss': self.stop_loss,
            'take_profit': self.take_profit,
            'opened_at': self.opened_at.isoformat() if self.opened_at else None,
            'closed_at': self.closed_at.isoformat() if self.closed_at else None,
            'profit_loss': self.profit_loss,
            'status': self.status
        }
