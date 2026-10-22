import Razorpay from "razorpay";
import { APP_PRICE_INR } from "@/config/app";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "placeholder_secret",
});

export const PRICE_PAISE = APP_PRICE_INR * 100;
