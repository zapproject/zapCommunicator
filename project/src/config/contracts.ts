export const zapContractConfig = {
  address: '0x6781a0f84c7e9e846dcb84a9a5bd49333067b104',
  abi: [{
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  }]
} as const;