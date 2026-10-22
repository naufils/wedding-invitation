import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function PUT(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });

  const buffer = await req.arrayBuffer();
  
  const filePath = path.join(process.cwd(), "public", "uploads", key);
  const dirPath = path.dirname(filePath);
  
  await fs.mkdir(dirPath, { recursive: true });
  await fs.writeFile(filePath, Buffer.from(buffer));

  return NextResponse.json({ success: true });
}
