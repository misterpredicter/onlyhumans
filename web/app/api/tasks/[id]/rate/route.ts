import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// POST /api/tasks/:id/rate
// Two operations distinguished by `type`:
//   type: "feedback" — requester rates a voter's feedback (1-5 stars)
//   type: "creator"  — voter rates the task creator (1=up, -1=down)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await req.json();
    const { type } = body;

    if (type === "feedback") {
      // Requester rates a specific vote's feedback
      const { vote_id, rating } = body;

      if (!vote_id || typeof rating !== "number" || rating < 1 || rating > 5) {
        return NextResponse.json(
          { error: "vote_id and rating (1-5) required" },
          { status: 400 }
        );
      }

      // Verify the vote belongs to this task
      const { rows: votes } = await sql`
        SELECT nullifier_hash FROM votes WHERE id = ${vote_id} AND task_id = ${id}
      `;
      if (votes.length === 0) {
        return NextResponse.json({ error: "Vote not found" }, { status: 404 });
      }

      await sql`
        UPDATE votes SET feedback_rating = ${rating} WHERE id = ${vote_id}
      `;

      // Update voter's reputation: recalculate avg_rating
      const voterNullifier = votes[0].nullifier_hash;
      await sql`
        UPDATE reputation SET
          avg_rating = (
            SELECT COALESCE(AVG(feedback_rating), 0)
            FROM votes
            WHERE nullifier_hash = ${voterNullifier}
              AND feedback_rating IS NOT NULL
          ),
          badge = CASE
            WHEN total_votes >= 50 AND (
              SELECT COALESCE(AVG(feedback_rating), 0) FROM votes
              WHERE nullifier_hash = ${voterNullifier} AND feedback_rating IS NOT NULL
            ) >= 4.5 THEN 'platinum'
            WHEN total_votes >= 20 AND (
              SELECT COALESCE(AVG(feedback_rating), 0) FROM votes
              WHERE nullifier_hash = ${voterNullifier} AND feedback_rating IS NOT NULL
            ) >= 4.0 THEN 'gold'
            WHEN total_votes >= 10 AND (
              SELECT COALESCE(AVG(feedback_rating), 0) FROM votes
              WHERE nullifier_hash = ${voterNullifier} AND feedback_rating IS NOT NULL
            ) >= 3.5 THEN 'silver'
            WHEN total_votes >= 5 THEN 'bronze'
            ELSE badge
          END
        WHERE nullifier_hash = ${voterNullifier}
      `;

      return NextResponse.json({ success: true, type: "feedback", vote_id, rating });
    }

    if (type === "creator") {
      // Voter rates the task creator (thumbs up/down)
      const { nullifier_hash, rating } = body;

      if (!nullifier_hash || (rating !== 1 && rating !== -1)) {
        return NextResponse.json(
          { error: "nullifier_hash and rating (1 or -1) required" },
          { status: 400 }
        );
      }

      // Check voter actually voted on this task
      const { rows: votes } = await sql`
        SELECT id FROM votes
        WHERE task_id = ${id} AND nullifier_hash = ${nullifier_hash}
          AND creator_rating IS NULL
      `;
      if (votes.length === 0) {
        return NextResponse.json(
          { error: "Vote not found or already rated" },
          { status: 404 }
        );
      }

      // Record rating on the vote
      await sql`
        UPDATE votes SET creator_rating = ${rating}
        WHERE task_id = ${id} AND nullifier_hash = ${nullifier_hash}
      `;

      // Update creator rating counts on task
      if (rating === 1) {
        await sql`UPDATE tasks SET creator_rating_up = creator_rating_up + 1 WHERE id = ${id}`;
      } else {
        await sql`UPDATE tasks SET creator_rating_down = creator_rating_down + 1 WHERE id = ${id}`;
      }

      return NextResponse.json({ success: true, type: "creator", rating });
    }

    return NextResponse.json(
      { error: "type must be 'feedback' or 'creator'" },
      { status: 400 }
    );
  } catch (error) {
    console.error(`POST /api/tasks/${id}/rate error:`, error);
    return NextResponse.json({ error: "Failed to submit rating" }, { status: 500 });
  }
}
