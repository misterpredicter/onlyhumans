import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET /api/stats — aggregate platform numbers for homepage
export async function GET() {
  if (process.env.DEMO_MODE !== "true") {
    return NextResponse.json({ task_count: 0, vote_count: 0, total_usdc: 0 });
  }

  try {
    const { rows } = await sql`
      SELECT
        COUNT(DISTINCT t.id)::int                           AS task_count,
        COALESCE(SUM(v.count), 0)::int                     AS vote_count,
        COALESCE(SUM(t.bounty_per_vote * v.count), 0)      AS total_usdc
      FROM tasks t
      LEFT JOIN (
        SELECT task_id, COUNT(*)::int AS count FROM votes GROUP BY task_id
      ) v ON v.task_id = t.id
    `;
    const row = rows[0] ?? { task_count: 0, vote_count: 0, total_usdc: 0 };
    return NextResponse.json({
      task_count: row.task_count,
      vote_count: row.vote_count,
      total_usdc: parseFloat(row.total_usdc ?? 0),
    }, {
      headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
    });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json({ task_count: 0, vote_count: 0, total_usdc: 0 });
  }
}
