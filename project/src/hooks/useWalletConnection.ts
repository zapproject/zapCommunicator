import { useAccount, useBalance } from 'wagmi';
import { zapContractConfig } from '../config/contracts';

const REQUIRED_BALANCE = 1000n * 10n ** 18n;

export function useWalletConnection() {
  const { address, isConnected } = useAccount();
  
  const { data: tokenData, isError: isBalanceError } = useBalance({
    address,
    token: zapContractConfig.address,
    watch: true,
    enabled: !!address,
  });

  const balance = tokenData?.value ?? 0n;
  const hasEnoughZap = balance >= REQUIRED_BALANCE;
  const formattedBalance = tokenData ? Number(tokenData.formatted).toFixed(2) : '0';

  return {
    address,
    isConnected,
    balance: formattedBalance,
    hasEnoughZap,
    isBalanceError
  };
}