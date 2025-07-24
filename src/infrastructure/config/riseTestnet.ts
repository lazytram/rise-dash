export const riseTestnet = {
  id: 11155931,
  name: "RISE Testnet",
  network: "rise-testnet",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://testnet.riselabs.xyz"] },
    public: { http: ["https://testnet.riselabs.xyz"] },
  },
  blockExplorers: {
    default: {
      name: "RiseScan",
      url: "https://explorer.testnet.riselabs.xyz",
    },
  },
  testnet: true,
};
