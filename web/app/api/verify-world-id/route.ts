import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyWorldIdProof } from "@/lib/world-id";

// POST /api/verify-world-id — verify IDKit v4 proof, store nullifier, return verified status
export async function POST(req: NextRequest) {
  try {
    const idkitResult = await req.json();

    const { success, nullifier_hash, detail } = await verifyWorldIdProof(idkitResult);

    if (!success || !nullifier_hash) {
      return NextResponse.json(
        { verified: false, error: detail ?? "Verification failed" },
        { status: 400 }
      );
    }

    // Upsert worker record — create if new, no-op if already exists
    await sql`
      INSERT INTO workers (nullifier_hash, verified_at)
      VALUES (${nullifier_hash}, NOW())
      ON CONFLICT (nullifier_hash) DO NOTHING
    `;

    return NextResponse.json({ verified: true, nullifier_hash });
  } catch (error) {
    console.error("POST /api/verify-world-id error:", error);
    return NextResponse.json(
      { verified: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
