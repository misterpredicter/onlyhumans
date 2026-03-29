import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient, http, parseUnits } from "viem";
import { baseSepolia } from "viem/chains";

// USDC contract on Base Sepolia
const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as const;

// Minimal ERC-20 transfer ABI (simpler than EIP-3009, same demo effect)
const ERC20_TRANSFER_ABI = [
  {
    name: "transfer",
    type: "function" as const,
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
] as const;

export async function payWorker(
  workerWallet: `0x${string}`,
  amountUSDC: number
): Promise<string> {
  const privateKey = process.env.TREASURY_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("TREASURY_PRIVATE_KEY not set");
  }

  const account = privateKeyToAccount(privateKey as `0x${string}`);
  const client = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(),
  });

  // USDC has 6 decimals
  const amountMicro = parseUnits(amountUSDC.toString(), 6);

  const txHash = await client.writeContract({
    address: USDC_ADDRESS,
    abi: ERC20_TRANSFER_ABI,
    functionName: "transfer",
    args: [workerWallet, amountMicro],
  });

  return txHash;
}
