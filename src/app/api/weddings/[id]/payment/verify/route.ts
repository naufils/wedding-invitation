import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
  }

  const expectedSignature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET ?? "")
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const isValid =
    expectedSignature.length === razorpay_signature.length &&
    timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(razorpay_signature));

  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const wedding = await prisma.wedding.update({
    where: { id },
    data: { paymentStatus: "paid", status: "published" },
  });

  return NextResponse.json({ id: wedding.id, status: wedding.status, subdomainSlug: wedding.subdomainSlug });
}
