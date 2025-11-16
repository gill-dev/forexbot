export interface Account {
  id: string;
  balance: number;
  currency: string;
  marginAvailable: number;
  marginUsed: number;
  openTradeCount: number;
  unrealizedPL: number;
  nav: number;
}

export interface Trade {
  id: string;
  instrument: string;
  units: number;
  price: number;
  currentPrice?: number;
  unrealizedPL?: number;
  openTime: string;
  state: 'OPEN' | 'CLOSED' | 'PENDING';
  stopLoss?: number;
  takeProfit?: number;
}

export interface Instrument {
  name: string;
  displayName: string;
  pipLocation: number;
  type: string;
}

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TradeRequest {
  instrument: string;
  units: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface BotStatus {
  isRunning: boolean;
  lastUpdate: string;
  activeStrategy?: string;
}
