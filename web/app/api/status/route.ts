import { NextResponse } from "next/server";
import {
  CONTRIBUTOR_SHARE,
  ECONOMICS,
  PLATFORM_FUND,
  PRICING_GUIDE,
} from "@/lib/economics";
import { sql } from "@/lib/db";

// GET /api/status — lightweight operational snapshot for agent developers
export async function GET() {
  try {
    const [{ rows: taskRows }, { rows: workerRows }] = await Promise.all([
      sql`
        SELECT
          COUNT(*) FILTER (WHERE status = 'open')::int AS tasks_active,
          COUNT(*) FILTER (WHERE status = 'closed')::int AS tasks_completed,
          ROUND(
            COALESCE(
              AVG(EXTRACT(EPOCH FROM (closed_at - created_at)))
              FILTER (WHERE status = 'closed' AND closed_at IS NOT NULL),
              0
            )
          )::int AS avg_response_time_seconds
        FROM tasks
      `,
      sql`
        SELECT COUNT(*)::int AS verified_workers_available
        FROM workers
      `,
    ]);

    const taskRow = taskRows[0] ?? {};
    const workerRow = workerRows[0] ?? {};

    return NextResponse.json(
      {
        status: "operational",
        tasks_active: taskRow.tasks_active ?? 0,
        tasks_completed: taskRow.tasks_completed ?? 0,
        avg_response_time_seconds: taskRow.avg_response_time_seconds ?? 0,
        verified_workers_available: workerRow.verified_workers_available ?? 0,
        pricing: PRICING_GUIDE,
        economics: {
          contributor_share: `${Math.round(CONTRIBUTOR_SHARE * 100)}%`,
          platform_fund: `${Math.round(PLATFORM_FUND * 100)}%`,
          founder: `${Math.round(ECONOMICS.FOUNDER * 100)}%`,
        },
      },
      {
        headers: { "Cache-Control": "no-store, max-age=0" },
      }
    );
  } catch (error) {
    console.error("GET /api/status error:", error);
    return NextResponse.json(
      { error: "Failed to load status" },
      { status: 500 }
    );
  }
}
