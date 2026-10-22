import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { razorpay, PRICE_PAISE } from "@/lib/razorpay";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const wedding = await prisma.wedding.findUnique({ where: { id } });
  if (!wedding) {
    return NextResponse.json({ error: "Wedding not found" }, { status: 404 });
  }

  const order = await razorpay.orders.create({
    amount: PRICE_PAISE,
    currency: "INR",
    receipt: wedding.id,
    notes: { weddingId: wedding.id },
  });

  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
}
