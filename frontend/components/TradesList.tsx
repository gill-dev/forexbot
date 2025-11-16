'use client';

import { Trade } from '@/types';
import { formatCurrency, formatDate, getProfitColor, formatNumber } from '@/lib/utils';
import { X, TrendingUp, TrendingDown } from 'lucide-react';

interface TradesListProps {
  trades: Trade[];
  isLoading: boolean;
  onCloseTrade: (tradeId: string) => Promise<void>;
}

export default function TradesList({ trades, isLoading, onCloseTrade }: TradesListProps) {
  if (isLoading) {
    return (
      <div className="card animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const openTrades = trades.filter((t) => t.state === 'OPEN');

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Open Trades
        </h2>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {openTrades.length} active
        </span>
      </div>

      {openTrades.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No open trades
        </div>
      ) : (
        <div className="space-y-3">
          {openTrades.map((trade) => (
            <div
              key={trade.id}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {trade.units > 0 ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    )}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {trade.instrument}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {trade.units > 0 ? 'LONG' : 'SHORT'} {Math.abs(trade.units)} units
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Entry Price</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatNumber(trade.price, 5)}
                      </p>
                    </div>

                    {trade.currentPrice && (
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Current Price</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatNumber(trade.currentPrice, 5)}
                        </p>
                      </div>
                    )}

                    {trade.unrealizedPL !== undefined && (
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">P/L</p>
                        <p className={`font-bold ${getProfitColor(trade.unrealizedPL)}`}>
                          {formatCurrency(trade.unrealizedPL)}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Open Time</p>
                      <p className="font-medium text-gray-900 dark:text-white text-xs">
                        {formatDate(trade.openTime)}
                      </p>
                    </div>
                  </div>

                  {(trade.stopLoss || trade.takeProfit) && (
                    <div className="mt-2 flex space-x-4 text-xs text-gray-600 dark:text-gray-400">
                      {trade.stopLoss && (
                        <span>SL: {formatNumber(trade.stopLoss, 5)}</span>
                      )}
                      {trade.takeProfit && (
                        <span>TP: {formatNumber(trade.takeProfit, 5)}</span>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onCloseTrade(trade.id)}
                  className="ml-4 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  title="Close trade"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
