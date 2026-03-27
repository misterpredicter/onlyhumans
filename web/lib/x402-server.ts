import { x402ResourceServer } from "@x402/next";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { registerExactEvmScheme } from "@x402/evm/exact/server";

let _server: ReturnType<typeof createServer> | null = null;

function createServer() {
  const facilitatorClient = new HTTPFacilitatorClient({
    url: "https://facilitator.x402.org",
  });
  const server = new x402ResourceServer(facilitatorClient);
  registerExactEvmScheme(server);
  return server;
}

export function getX402Server() {
  if (!_server) {
    _server = createServer();
  }
  return _server;
}

// Tier pricing table
export const TIER_PRICES = {
  quick: "$0.50",
  reasoned: "$1.00",
  detailed: "$2.50",
} as const;

export const TIER_BOUNTIES = {
  quick: 0.08,
  reasoned: 0.20,
  detailed: 0.50,
} as const;

export type Tier = keyof typeof TIER_PRICES;

export function getTierPaymentConfig(tier: Tier) {
  return {
    accepts: {
      scheme: "exact" as const,
      price: TIER_PRICES[tier],
      network: "eip155:84532" as `${string}:${string}`,
      payTo: process.env.TREASURY_WALLET_ADDRESS ?? "0x0000000000000000000000000000000000000000",
    },
    description: `Post ${tier} judgment task — verified humans will evaluate your comparison`,
  };
}

// Backward compat: default quick tier
export const taskCreationPayment = getTierPaymentConfig("quick");
