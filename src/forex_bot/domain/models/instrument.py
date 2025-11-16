from dataclasses import dataclass
from typing import Dict, Any


@dataclass
class Instrument:
    """Domain model representing a trading instrument (currency pair)"""

    name: str
    ins_type: str
    display_name: str
    trade_units_precision: int
    pip_location: float
    margin_rate: float
    display_precision: int

    def __post_init__(self):
        """Convert pip_location to actual value"""
        if isinstance(self.pip_location, int):
            self.pip_location = pow(10, self.pip_location)
        if isinstance(self.margin_rate, str):
            self.margin_rate = float(self.margin_rate)

    @classmethod
    def from_api_object(cls, api_data: Dict[str, Any]) -> 'Instrument':
        """Create Instrument from OANDA API response"""
        return cls(
            name=api_data['name'],
            ins_type=api_data['type'],
            display_name=api_data['displayName'],
            trade_units_precision=api_data['tradeUnitsPrecision'],
            pip_location=api_data['pipLocation'],
            margin_rate=api_data['marginRate'],
            display_precision=api_data['displayPrecision']
        )

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Instrument':
        """Create Instrument from dictionary (for local storage)"""
        return cls(
            name=data['name'],
            ins_type=data['type'],
            display_name=data['displayName'],
            trade_units_precision=data['tradeUnitsPrecision'],
            pip_location=data['pipLocation'],
            margin_rate=data['marginRate'],
            display_precision=data['displayPrecision']
        )

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for serialization"""
        return {
            'name': self.name,
            'type': self.ins_type,
            'displayName': self.display_name,
            'tradeUnitsPrecision': self.trade_units_precision,
            'pipLocation': self.pip_location,
            'marginRate': self.margin_rate,
            'displayPrecision': self.display_precision
        }
