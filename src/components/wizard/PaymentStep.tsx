"use client";

import { useState } from "react";
import Script from "next/script";
import { APP_PRICE_INR } from "@/config/app";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

export function PaymentStep({
  weddingId,
  subdomainSlug,
  onPublished,
}: {
  weddingId: string;
  subdomainSlug: string;
  onPublished: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");
  const [scriptReady, setScriptReady] = useState(false);

  async function handlePay() {
    setStatus("processing");
    try {
      const orderRes = await fetch(`/api/weddings/${weddingId}/payment/order`, { method: "POST" });
      if (!orderRes.ok) throw new Error("order failed");
      const order = await orderRes.json();

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "Evermint",
        description: "One-time invitation publish",
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch(`/api/weddings/${weddingId}/payment/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          if (verifyRes.ok) {
            onPublished();
          } else {
            setStatus("error");
          }
        },
        modal: {
          ondismiss: () => setStatus("idle"),
        },
      });
      razorpay.open();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-md text-center">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onReady={() => setScriptReady(true)}
      />
      <h2 className="mb-2 font-serif text-2xl">Publish Your Invitation</h2>
      <p className="mb-6 text-sm text-neutral-600">
        One-time payment, unlocks everything. Your site goes live at{" "}
        <span className="font-medium">{subdomainSlug}.wedding-app.example.com</span> immediately
        after payment.
      </p>
      <button
        type="button"
        onClick={handlePay}
        disabled={!scriptReady || status === "processing"}
        className="rounded bg-[#b8860b] px-6 py-3 text-white disabled:opacity-50"
      >
        {status === "processing" ? "Processing…" : `Pay ₹${APP_PRICE_INR}`}
      </button>
      {status === "error" && (
        <p className="mt-3 text-sm text-red-600">Payment failed or could not be verified. Try again.</p>
      )}
    </div>
  );
}
