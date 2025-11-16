'use client';

import { useState } from 'react';
import { TradeRequest, Instrument } from '@/types';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface QuickTradeProps {
  instruments: Instrument[];
  onBuy: (request: TradeRequest) => Promise<void>;
  onSell: (request: TradeRequest) => Promise<void>;
}

export default function QuickTrade({ instruments, onBuy, onSell }: QuickTradeProps) {
  const [formData, setFormData] = useState<TradeRequest>({
    instrument: 'EUR_USD',
    units: 1000,
    stopLoss: undefined,
    takeProfit: undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (action: 'buy' | 'sell') => {
    setIsSubmitting(true);
    try {
      if (action === 'buy') {
        await onBuy(formData);
      } else {
        await onSell(formData);
      }
      // Reset form after successful trade
      setFormData({
        ...formData,
        stopLoss: undefined,
        takeProfit: undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Quick Trade
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Instrument
          </label>
          <select
            value={formData.instrument}
            onChange={(e) => setFormData({ ...formData, instrument: e.target.value })}
            className="input"
          >
            {instruments.map((inst) => (
              <option key={inst.name} value={inst.name}>
                {inst.displayName || inst.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Units
          </label>
          <input
            type="number"
            value={formData.units}
            onChange={(e) =>
              setFormData({ ...formData, units: parseInt(e.target.value) || 0 })
            }
            className="input"
            min="1"
            step="100"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stop Loss (Optional)
            </label>
            <input
              type="number"
              value={formData.stopLoss || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stopLoss: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
              className="input"
              step="0.0001"
              placeholder="0.0000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Take Profit (Optional)
            </label>
            <input
              type="number"
              value={formData.takeProfit || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  takeProfit: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
              className="input"
              step="0.0001"
              placeholder="0.0000"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <button
            onClick={() => handleSubmit('buy')}
            disabled={isSubmitting}
            className="btn btn-success flex items-center justify-center space-x-2"
          >
            <ArrowUpCircle className="h-5 w-5" />
            <span>Buy</span>
          </button>

          <button
            onClick={() => handleSubmit('sell')}
            disabled={isSubmitting}
            className="btn btn-danger flex items-center justify-center space-x-2"
          >
            <ArrowDownCircle className="h-5 w-5" />
            <span>Sell</span>
          </button>
        </div>
      </div>
    </div>
  );
}
