// x402 payment gate is implemented via withX402() in app/api/tasks/route.ts
// (withX402 is preferred over middleware for API routes — charges only after success)
//
// This middleware file is kept as a placeholder.
// To re-enable middleware-based gating, uncomment the paymentProxy approach below.

export function middleware() {
  // No-op — payment handled at route level via withX402
}

export const config = { matcher: [] };

// --- Alternative: paymentProxy approach (uncomment if needed) ---
// import { paymentProxy, x402ResourceServer } from "@x402/next";
// import { HTTPFacilitatorClient } from "@x402/core/server";
// import { registerExactEvmScheme } from "@x402/evm/exact/server";
// import { NextRequest } from "next/server";
//
// const facilitatorClient = new HTTPFacilitatorClient({ url: "https://facilitator.x402.org" });
// const server = new x402ResourceServer(facilitatorClient);
// registerExactEvmScheme(server);
//
// const proxy = paymentProxy(
//   {
//     "POST /api/tasks": {
//       accepts: {
//         scheme: "exact",
//         price: "$0.50",
//         network: "eip155:84532",
//         payTo: process.env.TREASURY_WALLET_ADDRESS!,
//       },
//       description: "Post judgment task",
//     },
//   },
//   server
// );
//
// export function middleware(req: NextRequest) {
//   return proxy(req);
// }
//
// export const config = { matcher: ["/api/tasks"] };
