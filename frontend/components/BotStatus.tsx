'use client';

import { useState } from 'react';
import { BotStatus as BotStatusType } from '@/types';
import { formatDate } from '@/lib/utils';
import { Power, PowerOff, RefreshCw } from 'lucide-react';

interface BotStatusProps {
  status: BotStatusType | null;
  isLoading: boolean;
  onStart: () => Promise<void>;
  onStop: () => Promise<void>;
  onRefresh: () => void;
}

export default function BotStatus({
  status,
  isLoading,
  onStart,
  onStop,
  onRefresh,
}: BotStatusProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStart = async () => {
    setIsUpdating(true);
    try {
      await onStart();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStop = async () => {
    setIsUpdating(true);
    try {
      await onStop();
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="card animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bot Status
        </h2>
        <button
          onClick={onRefresh}
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          title="Refresh status"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-3 h-3 rounded-full ${
                status?.isRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`}
            ></div>
            <span className="text-lg font-medium text-gray-900 dark:text-white">
              {status?.isRunning ? 'Running' : 'Stopped'}
            </span>
          </div>

          <button
            onClick={status?.isRunning ? handleStop : handleStart}
            disabled={isUpdating}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
              status?.isRunning
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {status?.isRunning ? (
              <>
                <PowerOff className="h-4 w-4" />
                <span>Stop Bot</span>
              </>
            ) : (
              <>
                <Power className="h-4 w-4" />
                <span>Start Bot</span>
              </>
            )}
          </button>
        </div>

        {status?.activeStrategy && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Strategy</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {status.activeStrategy}
            </p>
          </div>
        )}

        {status?.lastUpdate && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Last updated: {formatDate(status.lastUpdate)}
          </div>
        )}
      </div>
    </div>
  );
}
