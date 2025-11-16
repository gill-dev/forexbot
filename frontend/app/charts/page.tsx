'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { forexApi } from '@/lib/api';
import { Candle, Instrument } from '@/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

export default function ChartsPage() {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInstrument, setSelectedInstrument] = useState('EUR_USD');
  const [selectedGranularity, setSelectedGranularity] = useState('H1');

  const instruments: Instrument[] = [
    { name: 'EUR_USD', displayName: 'EUR/USD', pipLocation: -4, type: 'CURRENCY' },
    { name: 'GBP_USD', displayName: 'GBP/USD', pipLocation: -4, type: 'CURRENCY' },
    { name: 'USD_JPY', displayName: 'USD/JPY', pipLocation: -2, type: 'CURRENCY' },
  ];

  const granularities = [
    { value: 'M5', label: '5 Minutes' },
    { value: 'M15', label: '15 Minutes' },
    { value: 'M30', label: '30 Minutes' },
    { value: 'H1', label: '1 Hour' },
    { value: 'H4', label: '4 Hours' },
    { value: 'D', label: 'Daily' },
  ];

  const fetchCandles = async () => {
    setIsLoading(true);
    try {
      const data = await forexApi.getCandles(selectedInstrument, selectedGranularity, 100);
      setCandles(data);
    } catch (err) {
      console.error('Error fetching candles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCandles();
  }, [selectedInstrument, selectedGranularity]);

  const chartData = candles.map((candle) => ({
    time: format(new Date(candle.time), 'MM/dd HH:mm'),
    price: candle.close,
    high: candle.high,
    low: candle.low,
    open: candle.open,
    close: candle.close,
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="card">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Price Charts
            </h1>

            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Instrument
                </label>
                <select
                  value={selectedInstrument}
                  onChange={(e) => setSelectedInstrument(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {instruments.map((inst) => (
                    <option key={inst.name} value={inst.name}>
                      {inst.displayName || inst.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Timeframe
                </label>
                <select
                  value={selectedGranularity}
                  onChange={(e) => setSelectedGranularity(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {granularities.map((gran) => (
                    <option key={gran.value} value={gran.value}>
                      {gran.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          ) : chartData.length === 0 ? (
            <div className="h-96 flex items-center justify-center text-gray-500">
              No chart data available. Make sure the backend API is configured.
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="time"
                    stroke="#9CA3AF"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    tick={{ fontSize: 12 }}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                      color: '#F3F4F6',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="close"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={false}
                    name="Close Price"
                  />
                  <Line
                    type="monotone"
                    dataKey="high"
                    stroke="#10B981"
                    strokeWidth={1}
                    dot={false}
                    name="High"
                    strokeDasharray="3 3"
                  />
                  <Line
                    type="monotone"
                    dataKey="low"
                    stroke="#EF4444"
                    strokeWidth={1}
                    dot={false}
                    name="Low"
                    strokeDasharray="3 3"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {candles.length > 0 && (
              <>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Latest Close</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {candles[candles.length - 1]?.close.toFixed(5)}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">High</p>
                  <p className="text-xl font-bold text-green-600">
                    {Math.max(...candles.map((c) => c.high)).toFixed(5)}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Low</p>
                  <p className="text-xl font-bold text-red-600">
                    {Math.min(...candles.map((c) => c.low)).toFixed(5)}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Data Points</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {candles.length}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
