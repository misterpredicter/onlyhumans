import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await sql`
      SELECT
        nullifier_hash,
        verified_at,
        total_earned
      FROM workers
      ORDER BY verified_at DESC
      LIMIT 200
    `;

    return NextResponse.json({
      contributors: result.rows,
      count: result.rows.length,
    });
  } catch {
    return NextResponse.json({ contributors: [], count: 0 });
  }
}
