import axios from 'axios';
import { Account, Trade, Instrument, Candle, TradeRequest, BotStatus } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const forexApi = {
  // Account endpoints
  async getAccount(): Promise<Account> {
    const response = await api.get<Account>('/account');
    return response.data;
  },

  // Trade endpoints
  async getTrades(): Promise<Trade[]> {
    const response = await api.get<Trade[]>('/trades');
    return response.data;
  },

  async getTradeById(id: string): Promise<Trade> {
    const response = await api.get<Trade>(`/trades/${id}`);
    return response.data;
  },

  async executeBuy(request: TradeRequest): Promise<{ trade_id: string }> {
    const response = await api.post('/trades/buy', request);
    return response.data;
  },

  async executeSell(request: TradeRequest): Promise<{ trade_id: string }> {
    const response = await api.post('/trades/sell', request);
    return response.data;
  },

  async closeTrade(tradeId: string): Promise<void> {
    await api.post(`/trades/${tradeId}/close`);
  },

  // Instrument endpoints
  async getInstruments(): Promise<Instrument[]> {
    const response = await api.get<Instrument[]>('/instruments');
    return response.data;
  },

  // Candle/Chart data endpoints
  async getCandles(
    instrument: string,
    granularity: string = 'H1',
    count: number = 100
  ): Promise<Candle[]> {
    const response = await api.get<Candle[]>('/candles', {
      params: { instrument, granularity, count },
    });
    return response.data;
  },

  // Bot status endpoints
  async getBotStatus(): Promise<BotStatus> {
    const response = await api.get<BotStatus>('/bot/status');
    return response.data;
  },

  async startBot(): Promise<void> {
    await api.post('/bot/start');
  },

  async stopBot(): Promise<void> {
    await api.post('/bot/stop');
  },
};
