import { NextResponse } from "next/server";
import { signRequest } from "@worldcoin/idkit/signing";

// GET /api/auth/rp-signature — generate RP context for IDKit v4
// Returns a signed rp_context object that the frontend passes to IDKitRequestWidget
export async function GET() {
  const signingKey = process.env.RP_SIGNING_KEY;
  const rpId = process.env.WORLD_RP_ID;
  // NOTE: "vote-on-task" is the registered World ID action name. Changing it requires
  // re-registering at developer.world.org. The user-facing copy has been updated to v3.
  const action = process.env.NEXT_PUBLIC_WORLD_ACTION ?? "vote-on-task";

  if (!signingKey) {
    return NextResponse.json({ error: "RP_SIGNING_KEY not configured" }, { status: 500 });
  }
  if (!rpId) {
    return NextResponse.json({ error: "WORLD_RP_ID not configured" }, { status: 500 });
  }

  try {
    // signRequest(action, signingKeyHex, ttl?) -> { sig, nonce, createdAt, expiresAt }
    const rpSig = signRequest(action, signingKey, 300);

    const rpContext = {
      rp_id: rpId,
      nonce: rpSig.nonce,
      created_at: rpSig.createdAt,
      expires_at: rpSig.expiresAt,
      signature: rpSig.sig,
    };

    return NextResponse.json({ rp_context: rpContext });
  } catch (error) {
    console.error("Failed to sign RP request:", error);
    return NextResponse.json(
      { error: "Failed to generate RP signature" },
      { status: 500 }
    );
  }
}
