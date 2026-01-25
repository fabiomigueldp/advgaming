/**
 * Stripe Webhook Handler
 * POST /api/stripe/webhook
 * 
 * Handles Stripe webhook events, particularly checkout.session.completed
 * for digital product delivery.
 */
import type { APIRoute } from 'astro';
import Stripe from 'stripe';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const stripeSecretKey = import.meta.env.STRIPE_SECRET_KEY;
  const webhookSecret = import.meta.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey) {
    return new Response(
      JSON.stringify({ error: 'Stripe not configured' }),
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16',
  });

  const signature = request.headers.get('stripe-signature');
  
  if (!signature) {
    return new Response(
      JSON.stringify({ error: 'Missing signature' }),
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const body = await request.text();
    
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // For testing without webhook secret
      event = JSON.parse(body) as Stripe.Event;
      console.warn('Webhook secret not configured - event signature not verified');
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response(
      JSON.stringify({ error: 'Invalid signature' }),
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Get customer email
      const customerEmail = session.customer_details?.email;
      const productSlug = session.metadata?.productSlug;
      const lang = session.metadata?.lang || 'pt';
      
      console.log('Checkout completed:', {
        sessionId: session.id,
        customerEmail,
        productSlug,
        amountTotal: session.amount_total,
      });

      // TODO: Implement email delivery with download link
      // This would typically:
      // 1. Generate a secure, time-limited download token
      // 2. Send an email with the download link using Postmark/Mailgun
      // 3. Store the purchase record in a database
      
      // For now, log the successful purchase
      // In production, integrate with your email provider:
      /*
      if (customerEmail && import.meta.env.POSTMARK_API_KEY) {
        await sendPurchaseEmail({
          to: customerEmail,
          productSlug,
          sessionId: session.id,
          downloadUrl: generateSecureDownloadUrl(productSlug, session.id),
        });
      }
      */

      break;
    }
    
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment failed:', paymentIntent.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new Response(
    JSON.stringify({ received: true }),
    { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};

/**
 * TODO: Implement secure download URL generation
 * This should create a time-limited, signed URL for file downloads
 * 
 * Example implementation:
 * function generateSecureDownloadUrl(productSlug: string, sessionId: string): string {
 *   const token = crypto.randomBytes(32).toString('hex');
 *   const expires = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
 *   // Store token with expiration and product info
 *   // Return URL like: /api/download?token=xxx
 *   return `${baseUrl}/api/download?token=${token}`;
 * }
 */
