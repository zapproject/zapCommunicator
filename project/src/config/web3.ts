import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { mainnet } from 'viem/chains';

const projectId = 'cc3a93abc2b58623abce64050188cf0f';

const metadata = {
  name: 'Zap Communicator',
  description: 'Web3-powered video communication',
  url: 'https://zap-communicator.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const configuredMainnet = {
  ...mainnet,
  rpcUrls: {
    ...mainnet.rpcUrls,
    default: {
      http: ['https://eth-mainnet.g.alchemy.com/v2/wgFy85jSxMJxXVwp3eKzUsUPPI2JeVki']
    },
    public: {
      http: ['https://eth-mainnet.g.alchemy.com/v2/wgFy85jSxMJxXVwp3eKzUsUPPI2JeVki']
    }
  }
};

const chains = [configuredMainnet];

export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: false
});

createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#A855F7',
    '--w3m-border-radius-master': '0.75rem'
  }
});