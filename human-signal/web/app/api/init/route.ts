import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db";

// GET /api/init — create database tables (idempotent)
// In production, requires ?key= matching INIT_SECRET env var.
// In dev, works without a key.
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    const key = req.nextUrl.searchParams.get("key");
    const secret = process.env.INIT_SECRET;
    if (!secret || key !== secret) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
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
