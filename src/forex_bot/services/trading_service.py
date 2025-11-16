from typing import Optional
from src.forex_bot.domain.models.trade import Trade
from src.forex_bot.domain.repositories.trade_repository import TradeRepository
from src.forex_bot.domain.repositories.instrument_repository import InstrumentRepository


class TradingService:
    """Business logic for trade execution"""

    # Trade direction constants
    BUY = 1
    SELL = -1
    NONE = 0

    def __init__(
        self,
        trade_repo: TradeRepository,
        instrument_repo: InstrumentRepository
    ):
        self.trade_repo = trade_repo
        self.instrument_repo = instrument_repo

    def execute_trade(
        self,
        instrument: str,
        units: float,
        direction: int,
        stop_loss: Optional[float] = None,
        take_profit: Optional[float] = None
    ) -> Optional[str]:
        """Execute a trade

        Args:
            instrument: Currency pair (e.g., 'EUR_USD')
            units: Number of units to trade
            direction: BUY (1) or SELL (-1)
            stop_loss: Optional stop loss price
            take_profit: Optional take profit price

        Returns:
            Trade ID if successful, None otherwise
        """
        # Validate instrument
        inst = self.instrument_repo.get_by_name(instrument)
        if inst is None:
            print(f"ERROR: Instrument {instrument} not found")
            return None

        # Validate direction
        if direction not in [self.BUY, self.SELL]:
            print(f"ERROR: Invalid direction {direction}, must be BUY(1) or SELL(-1)")
            return None

        # Create trade object
        trade = Trade(
            trade_id=None,
            instrument=instrument,
            units=units,
            direction=direction,
            stop_loss=stop_loss,
            take_profit=take_profit
        )

        # Execute trade via repository
        trade_id = self.trade_repo.place_trade(trade)

        if trade_id:
            direction_str = "BUY" if direction == self.BUY else "SELL"
            print(f"✓ Trade executed: {direction_str} {units} {instrument} (ID: {trade_id})")
        else:
            print(f"✗ Failed to execute trade")

        return trade_id

    def close_trade(self, trade_id: str) -> bool:
        """Close an open trade

        Args:
            trade_id: ID of trade to close

        Returns:
            True if successful, False otherwise
        """
        success = self.trade_repo.close_trade(trade_id)

        if success:
            print(f"✓ Trade {trade_id} closed successfully")
        else:
            print(f"✗ Failed to close trade {trade_id}")

        return success

    def execute_buy(
        self,
        instrument: str,
        units: float,
        stop_loss: Optional[float] = None,
        take_profit: Optional[float] = None
    ) -> Optional[str]:
        """Convenience method for executing a buy trade"""
        return self.execute_trade(instrument, units, self.BUY, stop_loss, take_profit)

    def execute_sell(
        self,
        instrument: str,
        units: float,
        stop_loss: Optional[float] = None,
        take_profit: Optional[float] = None
    ) -> Optional[str]:
        """Convenience method for executing a sell trade"""
        return self.execute_trade(instrument, units, self.SELL, stop_loss, take_profit)
