from dataclasses import dataclass
from datetime import datetime
from typing import Dict, Any, Optional


@dataclass
class Candle:
    """Domain model representing a price candle/bar"""

    time: datetime
    volume: int
    mid_open: float
    mid_high: float
    mid_low: float
    mid_close: float
    bid_open: Optional[float] = None
    bid_high: Optional[float] = None
    bid_low: Optional[float] = None
    bid_close: Optional[float] = None
    ask_open: Optional[float] = None
    ask_high: Optional[float] = None
    ask_low: Optional[float] = None
    ask_close: Optional[float] = None

    @classmethod
    def from_oanda_dict(cls, api_data: Dict[str, Any]) -> 'Candle':
        """Create Candle from OANDA API response"""
        from dateutil import parser

        candle_dict = {
            'time': parser.parse(api_data['time']),
            'volume': api_data['volume'],
            'mid_open': float(api_data['mid']['o']),
            'mid_high': float(api_data['mid']['h']),
            'mid_low': float(api_data['mid']['l']),
            'mid_close': float(api_data['mid']['c'])
        }

        # Add bid prices if available
        if 'bid' in api_data:
            candle_dict['bid_open'] = float(api_data['bid']['o'])
            candle_dict['bid_high'] = float(api_data['bid']['h'])
            candle_dict['bid_low'] = float(api_data['bid']['l'])
            candle_dict['bid_close'] = float(api_data['bid']['c'])

        # Add ask prices if available
        if 'ask' in api_data:
            candle_dict['ask_open'] = float(api_data['ask']['o'])
            candle_dict['ask_high'] = float(api_data['ask']['h'])
            candle_dict['ask_low'] = float(api_data['ask']['l'])
            candle_dict['ask_close'] = float(api_data['ask']['c'])

        return cls(**candle_dict)

    @classmethod
    def from_dataframe_row(cls, row: Any) -> 'Candle':
        """Create Candle from pandas DataFrame row"""
        return cls(
            time=row['time'],
            volume=int(row['volume']),
            mid_open=float(row['mid_o']),
            mid_high=float(row['mid_h']),
            mid_low=float(row['mid_l']),
            mid_close=float(row['mid_c']),
            bid_open=float(row['bid_o']) if 'bid_o' in row else None,
            bid_high=float(row['bid_h']) if 'bid_h' in row else None,
            bid_low=float(row['bid_l']) if 'bid_l' in row else None,
            bid_close=float(row['bid_c']) if 'bid_c' in row else None,
            ask_open=float(row['ask_o']) if 'ask_o' in row else None,
            ask_high=float(row['ask_h']) if 'ask_h' in row else None,
            ask_low=float(row['ask_l']) if 'ask_l' in row else None,
            ask_close=float(row['ask_c']) if 'ask_c' in row else None,
        )

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for DataFrame"""
        result = {
            'time': self.time,
            'volume': self.volume,
            'mid_o': self.mid_open,
            'mid_h': self.mid_high,
            'mid_l': self.mid_low,
            'mid_c': self.mid_close,
        }

        if self.bid_open is not None:
            result.update({
                'bid_o': self.bid_open,
                'bid_h': self.bid_high,
                'bid_l': self.bid_low,
                'bid_c': self.bid_close,
            })

        if self.ask_open is not None:
            result.update({
                'ask_o': self.ask_open,
                'ask_h': self.ask_high,
                'ask_l': self.ask_low,
                'ask_c': self.ask_close,
            })

        return result
