/**
 * Server-side World ID proof verification using the v4 API.
 *
 * IDKit v4 returns an IDKitResult object with this shape:
 *   { protocol_version: "3.0"|"4.0", nonce, action, responses: [...], environment }
 *
 * We forward this object as-is to the World ID v4 verify endpoint.
 * The endpoint accepts both v3 (legacy) and v4 proof formats.
 */

interface IDKitResultPayload {
  protocol_version: string;
  nonce: string;
  action?: string;
  session_id?: string;
  environment?: string;
  responses: Array<{
    identifier: string;
    signal_hash?: string;
    proof: string | string[];
    merkle_root?: string;
    nullifier?: string;
    nullifier_hash?: string;
    issuer_schema_id?: number;
    expires_at_min?: number;
    session_nullifier?: string[];
  }>;
}

interface VerifyResult {
  success: boolean;
  nullifier_hash?: string;
  detail?: string;
}

export async function verifyWorldIdProof(idkitResult: IDKitResultPayload): Promise<VerifyResult> {
  // Use RP ID for the v4 endpoint, fall back to APP ID for backward compat
  const rpId = process.env.WORLD_RP_ID;
  const appId = process.env.WORLD_APP_ID || process.env.NEXT_PUBLIC_WORLD_APP_ID;
  const verifyId = rpId || appId;

  if (!verifyId) {
    throw new Error("WORLD_RP_ID or WORLD_APP_ID environment variable not set");
  }

  // Forward the IDKit result directly to the v4 verify endpoint
  const response = await fetch(
    `https://developer.world.org/api/v4/verify/${verifyId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(idkitResult),
    }
  );

  const data = await response.json();

  if (response.ok && data.success !== false) {
    // Extract nullifier from the first response item
    const firstResult = data.results?.[0];
    const nullifier =
      firstResult?.nullifier ??
      idkitResult.responses?.[0]?.nullifier ??
      idkitResult.responses?.[0]?.nullifier_hash;

    return {
      success: true,
      nullifier_hash: nullifier,
    };
  }

  // Error response — extract details
  return {
    success: false,
    nullifier_hash: undefined,
    detail: data.detail ?? data.code ?? "Verification failed",
  };
}
