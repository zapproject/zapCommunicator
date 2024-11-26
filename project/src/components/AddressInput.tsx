import React from 'react';
import { isAddress } from 'viem';

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function AddressInput({ value, onChange, onSubmit }: AddressInputProps) {
  const [error, setError] = React.useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    onChange(address);
    
    if (address && !isAddress(address)) {
      setError('Please enter a valid Ethereum address');
    } else {
      setError('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isAddress(value)) {
      onSubmit();
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type="text"
          placeholder="Enter ETH address to call (0x...)"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full bg-white/5 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-purple-300 focus:outline-none focus:border-purple-500"
        />
      </div>
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
}