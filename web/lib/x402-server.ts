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
  const payTo = process.env.TREASURY_WALLET_ADDRESS;
  if (!payTo) {
    throw new Error("TREASURY_WALLET_ADDRESS not set — cannot configure x402 payments");
  }
  return {
    accepts: {
      scheme: "exact" as const,
      price: `$${totalCost.toFixed(2)}`,
      network: "eip155:84532" as `${string}:${string}`,
      payTo: payTo as `0x${string}`,
    },
    description: `Post OnlyHumans opportunity — verified humans will evaluate your comparison`,
  };
}
