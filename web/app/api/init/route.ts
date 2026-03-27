import { NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db";

// Dev-only endpoint: GET /api/init to create tables
// Remove or protect before production
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  try {
    await initializeDatabase();
    return NextResponse.json({ success: true, message: "Database initialized" });
  } catch (error) {
    console.error("DB init error:", error);
    return NextResponse.json(
      { error: "Failed to initialize database", detail: String(error) },
      { status: 500 }
    );
  }
}
