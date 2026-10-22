import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDriveOAuthClient } from "@/lib/google-drive";
import { encryptToken } from "@/lib/crypto";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const code = req.nextUrl.searchParams.get("code");
  const weddingId = req.nextUrl.searchParams.get("state");
  if (!code || !weddingId) {
    return NextResponse.json({ error: "Missing code or state" }, { status: 400 });
  }

  const client = getDriveOAuthClient();
  const { tokens } = await client.getToken(code);
  if (!tokens.refresh_token) {
    return NextResponse.json(
      { error: "No refresh token returned — reconnect with prompt=consent" },
      { status: 400 },
    );
  }
  client.setCredentials(tokens);

  const drive = google.drive({ version: "v3", auth: client });
  const folder = await drive.files.create({
    requestBody: {
      name: `Evermint Guest Uploads`,
      mimeType: "application/vnd.google-apps.folder",
    },
    fields: "id",
  });

  await prisma.wedding.update({
    where: { id: weddingId },
    data: {
      driveFolderId: folder.data.id,
      driveRefreshToken: encryptToken(tokens.refresh_token),
    },
  });

  return NextResponse.redirect(new URL(`/dashboard/${weddingId}/media`, req.url));
}
