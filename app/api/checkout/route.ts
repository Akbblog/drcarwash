import { auth } from "@/auth";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/db";
import Car from "@/lib/models/Car";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
  typescript: true,
});

export async function POST(req: Request) {
  try {
    // 1. Auth Check
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Get User's Car Count
    await connectDB();
    const carCount = await Car.countDocuments({ userId: session.user.id });

    if (carCount === 0) {
        return NextResponse.json({ message: "Please add at least one car before subscribing." }, { status: 400 });
    }

    // 3. Prepare Line Items (The Bill)
    const line_items = [];

    // First car = Base Price ($249)
    const basePriceId = process.env.STRIPE_PRICE_ID;
    if (!basePriceId) throw new Error("Missing STRIPE_PRICE_ID");

    line_items.push({
        price: basePriceId,
        quantity: 1,
    });

    // Extra cars = Add-on Price ($100 each)
    if (carCount > 1) {
        const addonPriceId = process.env.STRIPE_ADDON_PRICE_ID;
        // If you haven't created the addon price yet, this will just ignore extra cars for now.
        if (addonPriceId) {
             line_items.push({
                price: addonPriceId,
                quantity: carCount - 1, // e.g., 3 cars total = 1 base + 2 addons
            });
        }
    }

    // 4. Create Stripe Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: line_items,
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?canceled=true`,
      customer_email: session.user.email!,
      metadata: {
        userId: session.user.id,
        carCount: carCount.toString(), // Useful for tracking
      },
      subscription_data: {
        metadata: {
            userId: session.user.id, // Keep userId on the subscription too for easy webhook lookup
        }
      }
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("[STRIPE_ERROR]", error);
    return new NextResponse("Internal Error: " + error.message, { status: 500 });
  }
}