import { NextRequest, NextResponse } from "next/server";
import { getTaskResults } from "@/lib/task-results";

// GET /api/tasks/:id — Task details + structured results for humans and agents
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const response = await getTaskResults(id);

    if (!response) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(response, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    console.error(`GET /api/tasks/${id} error:`, error);
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 });
  }
}
