'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import AccountOverview from '@/components/AccountOverview';
import BotStatus from '@/components/BotStatus';
import QuickTrade from '@/components/QuickTrade';
import TradesList from '@/components/TradesList';
import { forexApi } from '@/lib/api';
import { Account, Trade, Instrument, BotStatus as BotStatusType, TradeRequest } from '@/types';
import { AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const [account, setAccount] = useState<Account | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [instruments, setInstruments] = useState<Instrument[]>([
    { name: 'EUR_USD', displayName: 'EUR/USD', pipLocation: -4, type: 'CURRENCY' },
    { name: 'GBP_USD', displayName: 'GBP/USD', pipLocation: -4, type: 'CURRENCY' },
    { name: 'USD_JPY', displayName: 'USD/JPY', pipLocation: -2, type: 'CURRENCY' },
  ]);
  const [botStatus, setBotStatus] = useState<BotStatusType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const [accountData, tradesData] = await Promise.all([
        forexApi.getAccount().catch(() => null),
        forexApi.getTrades().catch(() => []),
      ]);

      if (accountData) setAccount(accountData);
      setTrades(tradesData);
    } catch (err) {
      setError('Failed to fetch data. Make sure the backend API is running.');
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBotStatus = async () => {
    try {
      const status = await forexApi.getBotStatus();
      setBotStatus(status);
    } catch (err) {
      console.error('Error fetching bot status:', err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchBotStatus();

    // Poll for updates every 10 seconds
    const interval = setInterval(() => {
      fetchData();
      fetchBotStatus();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleBuy = async (request: TradeRequest) => {
    try {
      await forexApi.executeBuy(request);
      await fetchData(); // Refresh data after trade
    } catch (err) {
      console.error('Error executing buy:', err);
      alert('Failed to execute buy order');
    }
  };

  const handleSell = async (request: TradeRequest) => {
    try {
      await forexApi.executeSell(request);
      await fetchData(); // Refresh data after trade
    } catch (err) {
      console.error('Error executing sell:', err);
      alert('Failed to execute sell order');
    }
  };

  const handleCloseTrade = async (tradeId: string) => {
    try {
      await forexApi.closeTrade(tradeId);
      await fetchData(); // Refresh data after closing trade
    } catch (err) {
      console.error('Error closing trade:', err);
      alert('Failed to close trade');
    }
  };

  const handleStartBot = async () => {
    try {
      await forexApi.startBot();
      await fetchBotStatus();
    } catch (err) {
      console.error('Error starting bot:', err);
      alert('Failed to start bot');
    }
  };

  const handleStopBot = async () => {
    try {
      await forexApi.stopBot();
      await fetchBotStatus();
    } catch (err) {
      console.error('Error stopping bot:', err);
      alert('Failed to stop bot');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
              <div>
                <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                  Connection Issue
                </p>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                  {error}
                </p>
                <p className="text-yellow-600 dark:text-yellow-400 text-xs mt-2">
                  The frontend is running in demo mode with sample data. Configure the backend API to see live data.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <AccountOverview account={account} isLoading={isLoading} />
          </div>
          <div>
            <BotStatus
              status={botStatus}
              isLoading={isLoading}
              onStart={handleStartBot}
              onStop={handleStopBot}
              onRefresh={fetchBotStatus}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TradesList
              trades={trades}
              isLoading={isLoading}
              onCloseTrade={handleCloseTrade}
            />
          </div>
          <div>
            <QuickTrade
              instruments={instruments}
              onBuy={handleBuy}
              onSell={handleSell}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
