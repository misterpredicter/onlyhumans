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
  const rpId = process.env.WORLD_RP_ID;
  if (!rpId) {
    throw new Error("WORLD_RP_ID environment variable not set");
  }

  const action = proof.action || process.env.NEXT_PUBLIC_WORLD_ACTION || "vote-on-task";
  const response = await fetch(
    `https://developer.world.org/api/v4/verify/${rpId}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        action,
        signal: proof.signal || "",
        responses: [
          {
            proof: proof.proof,
            merkle_root: proof.merkle_root,
            nullifier_hash: proof.nullifier_hash,
            verification_level: proof.verification_level,
          },
        ],
      }),
    }
  );

  const data = await response.json();

  // v4 API returns { responses: [{ success, nullifier_hash, ... }] }
  if (data.responses && data.responses.length > 0) {
    const r = data.responses[0];
    return {
      success: r.success ?? false,
      nullifier_hash: r.nullifier_hash ?? proof.nullifier_hash,
      detail: r.detail,
    };
  }

  return data as VerifyResult;
}
