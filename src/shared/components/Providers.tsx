"use client";

import React, { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { http, createConfig } from "wagmi";
import { riseTestnet } from "wagmi/chains";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useLanguageStore } from "@/infrastructure/store/languageStore";
import { injected } from "wagmi/connectors";

export const config = createConfig({
  chains: [riseTestnet],
  connectors: [injected()],
  transports: {
    [riseTestnet.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  const locale = useLanguageStore((state) => state.locale);
  return (
    <WagmiProvider config={config}>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider locale={locale} initialChain={riseTestnet}>
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </SessionProvider>
    </WagmiProvider>
  );
}
