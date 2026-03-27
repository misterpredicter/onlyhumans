import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

// GET /api/auth/rp-signature — IDKit RP signing flow
// IDKit calls this to get a server-signed signal for the ZKP
// This prevents replay attacks by binding the proof to a server-generated nonce
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const signal = searchParams.get("signal") ?? "0x0000000000000000000000000000000000000000000000000000000000000000";

  const signingKey = process.env.RP_SIGNING_KEY;
  if (!signingKey) {
    return NextResponse.json({ error: "RP_SIGNING_KEY not configured" }, { status: 500 });
  }

  // HMAC-SHA256 the signal with our signing key
  const signature = createHmac("sha256", signingKey)
    .update(signal)
    .digest("hex");

  return NextResponse.json({
    signal,
    signature: `0x${signature}`,
  });
}
