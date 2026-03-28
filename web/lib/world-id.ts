interface WorldIdProof {
  proof: string;
  merkle_root: string;
  nullifier_hash: string;
  verification_level: string;
  signal?: string;
  action?: string;
}

interface VerifyResult {
  success: boolean;
  nullifier_hash?: string;
  detail?: string;
}

export async function verifyWorldIdProof(proof: WorldIdProof): Promise<VerifyResult> {
  const appId = process.env.WORLD_APP_ID || process.env.NEXT_PUBLIC_WORLD_APP_ID;
  if (!appId) {
    throw new Error("WORLD_APP_ID environment variable not set");
  }

  const action = proof.action || process.env.NEXT_PUBLIC_WORLD_ACTION || "vote-on-task";
  const response = await fetch(
    `https://developer.worldcoin.org/api/v2/verify/${appId}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        action,
        signal: proof.signal || "",
        proof: proof.proof,
        merkle_root: proof.merkle_root,
        nullifier_hash: proof.nullifier_hash,
        verification_level: proof.verification_level,
      }),
    }
  );

  const data = await response.json();

  // v2 API returns { success: true, nullifier_hash, action, ... }
  return {
    success: data.success ?? false,
    nullifier_hash: data.nullifier_hash ?? proof.nullifier_hash,
    detail: data.detail ?? data.code,
  };
}
