import React from 'react';
import { useWalletConnection } from '../hooks/useWalletConnection';

export function ZapBalance() {
  const { balance, hasEnoughZap, isBalanceError, isConnected } = useWalletConnection();

  if (!isConnected) return null;

  if (isBalanceError) {
    return (
      <div className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300">
        <p className="text-sm">Error loading balance</p>
      </div>
    );
  }

  return (
    <div className={`px-4 py-2 rounded-lg ${hasEnoughZap ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
      <p className="text-sm font-medium">
        {balance} ZAP
      </p>
      {!hasEnoughZap && (
        <p className="text-xs">Need 1000 ZAP to connect</p>
      )}
    </div>
  );
}