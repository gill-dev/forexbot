import requests
from typing import Dict, Any, Optional, Tuple, List
from datetime import datetime


class OandaClient:
    """Low-level HTTP client for OANDA API"""

    def __init__(self, api_key: str, account_id: str, base_url: str):
        self.api_key = api_key
        self.account_id = account_id
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        })

    def make_request(
        self,
        url: str,
        verb: str = 'get',
        code: int = 200,
        params: Optional[Dict] = None,
        data: Optional[Dict] = None,
        headers: Optional[Dict] = None
    ) -> Tuple[bool, Dict[str, Any]]:
        """Make HTTP request to OANDA API

        Args:
            url: Endpoint URL (relative to base_url)
            verb: HTTP method ('get', 'post', 'put')
            code: Expected status code
            params: Query parameters
            data: Request body data
            headers: Additional headers

        Returns:
            Tuple of (success: bool, response_data: dict)
        """
        full_url = f"{self.base_url}/{url}"

        try:
            response = None

            if verb == "get":
                response = self.session.get(full_url, params=params, data=data, headers=headers)
            elif verb == "post":
                response = self.session.post(full_url, params=params, json=data, headers=headers)
            elif verb == "put":
                response = self.session.put(full_url, params=params, json=data, headers=headers)

            if response is None:
                return False, {'error': 'verb not found'}

            if response.status_code == code:
                return True, response.json()
            else:
                return False, response.json()

        except Exception as error:
            return False, {'Exception': str(error)}

    def get_account_endpoint(self, endpoint: str, data_key: str) -> Optional[Any]:
        """Get data from account endpoint

        Args:
            endpoint: Account endpoint path
            data_key: Key to extract from response

        Returns:
            Extracted data or None if error
        """
        url = f"accounts/{self.account_id}/{endpoint}"
        ok, data = self.make_request(url)

        if ok and data_key in data:
            return data[data_key]
        else:
            print(f"ERROR get_account_endpoint({endpoint})", data)
            return None

    def get_account_summary(self) -> Optional[Dict[str, Any]]:
        """Get account summary"""
        return self.get_account_endpoint("summary", "account")

    def get_account_instruments(self) -> Optional[List[Dict[str, Any]]]:
        """Get all tradeable instruments for the account"""
        return self.get_account_endpoint("instruments", "instruments")

    def fetch_candles(
        self,
        pair: str,
        count: int = 10,
        granularity: str = "H1",
        price: str = "MBA",
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None
    ) -> Optional[List[Dict[str, Any]]]:
        """Fetch candle data from OANDA

        Args:
            pair: Currency pair (e.g., 'EUR_USD')
            count: Number of candles to fetch (if no dates provided)
            granularity: Timeframe (e.g., 'H1', 'M15')
            price: Price type ('M'=mid, 'B'=bid, 'A'=ask, 'MBA'=all)
            date_from: Start date
            date_to: End date

        Returns:
            List of candle dictionaries or None if error
        """
        url = f"instruments/{pair}/candles"
        params = {
            'granularity': granularity,
            'price': price
        }

        if date_from is not None and date_to is not None:
            date_format = "%Y-%m-%dT%H:%M:%SZ"
            params["from"] = datetime.strftime(date_from, date_format)
            params["to"] = datetime.strftime(date_to, date_format)
        else:
            params["count"] = count

        ok, data = self.make_request(url, params=params)

        if ok and 'candles' in data:
            return data['candles']
        else:
            print(f"ERROR fetch_candles() for {pair}", params, data)
            return None

    def place_order(
        self,
        instrument: str,
        units: float,
        stop_loss: Optional[float] = None,
        take_profit: Optional[float] = None
    ) -> Tuple[bool, Optional[Dict[str, Any]]]:
        """Place a market order

        Args:
            instrument: Currency pair
            units: Number of units (positive=buy, negative=sell)
            stop_loss: Stop loss price
            take_profit: Take profit price

        Returns:
            Tuple of (success: bool, response_data: dict or None)
        """
        url = f"accounts/{self.account_id}/orders"

        order_data = {
            "order": {
                "units": str(units),
                "instrument": instrument,
                "type": "MARKET",
            }
        }

        if stop_loss is not None:
            order_data['order']['stopLossOnFill'] = {"price": str(stop_loss)}

        if take_profit is not None:
            order_data['order']['takeProfitOnFill'] = {"price": str(take_profit)}

        ok, response = self.make_request(url, verb="post", data=order_data, code=201)

        if ok and 'orderFillTransaction' in response:
            return True, response['orderFillTransaction']
        else:
            print(f"ERROR placing order: {response}")
            return False, None

    def close_trade(self, trade_id: str) -> bool:
        """Close an open trade

        Args:
            trade_id: ID of trade to close

        Returns:
            True if successful, False otherwise
        """
        url = f"accounts/{self.account_id}/trades/{trade_id}/close"
        ok, _ = self.make_request(url, verb="put", code=200)

        if ok:
            print(f"Closed trade {trade_id}")
        else:
            print(f"Failed to close trade {trade_id}")

        return ok
