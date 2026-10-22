import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDriveOAuthClient, DRIVE_SCOPES } from "@/lib/google-drive";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const weddingId = req.nextUrl.searchParams.get("weddingId");
  if (!weddingId) {
    return NextResponse.json({ error: "Missing weddingId" }, { status: 400 });
  }

  const client = getDriveOAuthClient();
  const url = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: DRIVE_SCOPES,
    state: weddingId,
  });

  return NextResponse.redirect(url);
}
