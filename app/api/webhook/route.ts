import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
  typescript: true,
});

export async function POST(req: Request) {
  const body = await req.text(); // Get raw body for signature verification
  const signature = req.headers.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    // Verify the event came from real Stripe
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // Handle specific events
  switch (event.type) {
    // When a checkout is completed successfully
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutSessionCompleted(session);
      break;
    }
    // When a subscription is updated (e.g. cancelled, payment failed)
    // We can add more logic here later to handle cancellations.
    case "customer.subscription.deleted": {
       const subscription = event.data.object as Stripe.Subscription;
       await handleSubscriptionDeleted(subscription);
       break;
    }
    default:
      // console.log(`Unhandled event type ${event.type}`);
  }

  return new NextResponse(null, { status: 200 });
}

// --- HELPER FUNCTIONS ---

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId;
    if (!userId) {
        console.error("Missing userId in session metadata");
        return;
    }

    await connectDB();
    // Update user: set subscribed = true, save Stripe IDs
    await User.findByIdAndUpdate(userId, {
        isSubscribed: true,
        stripeCustomerId: session.customer as string,
        subscriptionId: session.subscription as string,
    });
    console.log(`✅ User ${userId} subscription activated!`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
     const userId = subscription.metadata?.userId;
     if (!userId) return;

     await connectDB();
     // Turn off access if they cancel
     await User.findByIdAndUpdate(userId, {
         isSubscribed: false,
         subscriptionId: null,
     });
     console.log(`❌ User ${userId} subscription deactivated.`);
}