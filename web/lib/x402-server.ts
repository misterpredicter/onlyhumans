import { x402ResourceServer } from "@x402/next";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { registerExactEvmScheme } from "@x402/evm/exact/server";

let _server: ReturnType<typeof createServer> | null = null;

function createServer() {
  const facilitatorClient = new HTTPFacilitatorClient({
    url: "https://x402.org/facilitator",
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

export type Tier = "quick" | "reasoned" | "detailed";

export function getPaymentConfig(totalCost: number) {
  return {
    accepts: {
      scheme: "exact" as const,
      price: `$${totalCost.toFixed(2)}`,
      network: "eip155:84532" as `${string}:${string}`,
      payTo: process.env.TREASURY_WALLET_ADDRESS ?? "0x0000000000000000000000000000000000000000",
    },
    description: `Post judgment task — verified humans will evaluate your comparison`,
  };
}
