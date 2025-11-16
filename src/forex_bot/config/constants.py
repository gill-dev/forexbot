"""Trading constants and enums"""

# Trade directions
BUY = 1
SELL = -1
NONE = 0

# Candle counts per API request
CANDLE_COUNT = 3000

# Granularity increments (in minutes)
GRANULARITY_INCREMENTS = {
    'M1': 1,
    'M5': 5,
    'M15': 15,
    'M30': 30,
    'H1': 60,
    'H2': 120,
    'H4': 240,
    'H8': 480,
    'H12': 720,
    'D': 1440,
    'W': 10080,
    'M': 43200
}
