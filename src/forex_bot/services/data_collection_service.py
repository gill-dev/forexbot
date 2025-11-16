from datetime import datetime, timedelta
from typing import List
from src.forex_bot.domain.repositories.candle_repository import CandleRepository
from src.forex_bot.domain.repositories.instrument_repository import InstrumentRepository


class DataCollectionService:
    """Business logic for collecting market data"""

    # Number of candles to fetch per API request
    CANDLE_COUNT = 3000

    # Time increments per granularity (in minutes)
    INCREMENTS = {
        'M5': 5 * CANDLE_COUNT,
        'M15': 15 * CANDLE_COUNT,
        'H1': 60 * CANDLE_COUNT,
        'H2': 120 * CANDLE_COUNT,
        'H4': 240 * CANDLE_COUNT,
        'D': 1440 * CANDLE_COUNT
    }

    def __init__(
        self,
        candle_repo: CandleRepository,
        instrument_repo: InstrumentRepository
    ):
        self.candle_repo = candle_repo
        self.instrument_repo = instrument_repo

    def collect_data_for_pair(
        self,
        pair: str,
        granularity: str,
        date_from: datetime,
        date_to: datetime
    ) -> bool:
        """Collect data for a single currency pair

        Args:
            pair: Currency pair (e.g., 'EUR_USD')
            granularity: Timeframe (e.g., 'H1', 'M15')
            date_from: Start date
            date_to: End date

        Returns:
            True if successful, False otherwise
        """
        # Check if instrument exists
        if not self.instrument_repo.exists(pair):
            print(f"Instrument {pair} not found, skipping...")
            return False

        print(f"Collecting {pair} {granularity}...")

        # Get time increment for this granularity
        time_step_minutes = self.INCREMENTS.get(granularity)
        if time_step_minutes is None:
            print(f"Unknown granularity: {granularity}")
            return False

        # Collect data in chunks
        from_date = date_from
        all_candles = []

        while from_date < date_to:
            to_date = from_date + timedelta(minutes=time_step_minutes)
            if to_date > date_to:
                to_date = date_to

            # Fetch candles for this chunk
            candles = self.candle_repo.get_candles(
                pair=pair,
                granularity=granularity,
                date_from=from_date,
                date_to=to_date
            )

            if candles:
                all_candles.extend(candles)
                print(f"  Fetched {len(candles)} candles from {from_date} to {to_date}")

            from_date = to_date

        if all_candles:
            # Save all collected candles
            self.candle_repo.save_candles(all_candles, pair, granularity)
            print(f"✓ Collected {len(all_candles)} candles for {pair} {granularity}")
            return True
        else:
            print(f"✗ No data collected for {pair} {granularity}")
            return False

    def collect_data_for_pairs(
        self,
        currency_codes: List[str],
        granularities: List[str],
        date_from: datetime,
        date_to: datetime
    ) -> None:
        """Collect data for multiple currency pairs

        Args:
            currency_codes: List of currency codes (e.g., ['EUR', 'USD', 'GBP'])
            granularities: List of timeframes (e.g., ['H1', 'H4'])
            date_from: Start date
            date_to: End date
        """
        print(f"\nStarting data collection from {date_from} to {date_to}")
        print(f"Currencies: {', '.join(currency_codes)}")
        print(f"Granularities: {', '.join(granularities)}\n")

        # Generate all currency pairs
        pairs = []
        for curr1 in currency_codes:
            for curr2 in currency_codes:
                if curr1 == curr2:
                    continue

                pair = f"{curr1}_{curr2}"

                # Check if instrument exists
                if self.instrument_repo.exists(pair):
                    pairs.append(pair)

        print(f"Found {len(pairs)} tradeable pairs\n")

        # Collect data for each pair and granularity
        total = len(pairs) * len(granularities)
        completed = 0

        for pair in pairs:
            for granularity in granularities:
                self.collect_data_for_pair(pair, granularity, date_from, date_to)
                completed += 1
                print(f"Progress: {completed}/{total}\n")

        print(f"✓ Data collection completed!")
