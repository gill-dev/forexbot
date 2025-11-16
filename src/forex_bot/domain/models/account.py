from dataclasses import dataclass
from typing import Dict, Any


@dataclass
class Account:
    """Domain model representing a trading account"""

    account_id: str
    balance: float
    currency: str
    unrealized_pl: float = 0.0
    margin_used: float = 0.0
    margin_available: float = 0.0
    open_trade_count: int = 0

    @classmethod
    def from_api_object(cls, api_data: Dict[str, Any]) -> 'Account':
        """Create Account from OANDA API response"""
        return cls(
            account_id=api_data['id'],
            balance=float(api_data.get('balance', 0)),
            currency=api_data.get('currency', 'USD'),
            unrealized_pl=float(api_data.get('unrealizedPL', 0)),
            margin_used=float(api_data.get('marginUsed', 0)),
            margin_available=float(api_data.get('marginAvailable', 0)),
            open_trade_count=int(api_data.get('openTradeCount', 0))
        )

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        return {
            'account_id': self.account_id,
            'balance': self.balance,
            'currency': self.currency,
            'unrealized_pl': self.unrealized_pl,
            'margin_used': self.margin_used,
            'margin_available': self.margin_available,
            'open_trade_count': self.open_trade_count
        }
