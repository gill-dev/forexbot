'use client';

import Navigation from '@/components/Navigation';
import { Settings as SettingsIcon, Database, Key } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <SettingsIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Settings
            </h1>
          </div>

          <div className="space-y-6">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Key className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  API Configuration
                </h2>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> API configuration is managed through environment variables.
                  To configure the backend connection, create a <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">.env.local</code> file in the frontend directory.
                </p>
                <div className="mt-3">
                  <p className="text-xs text-blue-700 dark:text-blue-300 font-mono">
                    NEXT_PUBLIC_API_URL=http://localhost:8000/api
                  </p>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Database className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Backend Setup
                </h2>
              </div>
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <p>
                  This frontend requires a REST API backend to function properly. The Python forex bot
                  needs to expose HTTP endpoints for the frontend to consume.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="font-semibold mb-2">Required API Endpoints:</p>
                  <ul className="space-y-1 text-xs font-mono">
                    <li>• GET /api/account - Fetch account information</li>
                    <li>• GET /api/trades - List all trades</li>
                    <li>• POST /api/trades/buy - Execute buy order</li>
                    <li>• POST /api/trades/sell - Execute sell order</li>
                    <li>• POST /api/trades/:id/close - Close a trade</li>
                    <li>• GET /api/instruments - List available instruments</li>
                    <li>• GET /api/candles - Fetch historical candle data</li>
                    <li>• GET /api/bot/status - Get bot status</li>
                    <li>• POST /api/bot/start - Start the bot</li>
                    <li>• POST /api/bot/stop - Stop the bot</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                About
              </h2>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">Version</dt>
                    <dd className="text-gray-900 dark:text-white font-medium">0.1.0</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">Framework</dt>
                    <dd className="text-gray-900 dark:text-white font-medium">Next.js 15</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">Build</dt>
                    <dd className="text-gray-900 dark:text-white font-medium">Development</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
