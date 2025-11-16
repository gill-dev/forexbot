'use client';

import { Account } from '@/types';
import { formatCurrency, getProfitColor } from '@/lib/utils';
import { Wallet, TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface AccountOverviewProps {
  account: Account | null;
  isLoading: boolean;
}

export default function AccountOverview({ account, isLoading }: AccountOverviewProps) {
  if (isLoading) {
    return (
      <div className="card animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="card">
        <p className="text-center text-gray-500">No account data available</p>
      </div>
    );
  }

  const stats = [
    {
      label: 'Balance',
      value: formatCurrency(account.balance, account.currency),
      icon: Wallet,
      color: 'text-blue-600',
    },
    {
      label: 'NAV',
      value: formatCurrency(account.nav, account.currency),
      icon: Activity,
      color: 'text-purple-600',
    },
    {
      label: 'Unrealized P/L',
      value: formatCurrency(account.unrealizedPL, account.currency),
      icon: account.unrealizedPL >= 0 ? TrendingUp : TrendingDown,
      color: getProfitColor(account.unrealizedPL),
    },
    {
      label: 'Open Trades',
      value: account.openTradeCount.toString(),
      icon: Activity,
      color: 'text-gray-600',
    },
  ];

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Account Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </span>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Margin Available</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatCurrency(account.marginAvailable, account.currency)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Margin Used</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatCurrency(account.marginUsed, account.currency)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
