import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prismadb';
import Stripe from 'stripe';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Extract metadata from the session
      const {
        userId,
        listingId,
        startTime,
        endTime,
        durationHours,
        hourlyRate,
        totalPrice,
        cleaningFee,
        serviceFee,
        eventType,
        guestCount,
      } = session.metadata!;

      // Check if reservation already exists (prevent duplicates)
      const existingReservation = await prisma.reservation.findFirst({
        where: {
          userId,
          listingId,
          startTime: new Date(startTime),
        },
      });

      if (existingReservation) {
        console.log('Reservation already exists, skipping creation');
        return NextResponse.json({ received: true });
      }

      // Get listing to check instant book status
      const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        select: { instantBook: true },
      });

      // Create the reservation in the database
      await prisma.reservation.create({
        data: {
          userId,
          listingId,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          durationHours: parseInt(durationHours, 10),
          hourlyRate: parseInt(hourlyRate, 10),
          totalPrice: parseInt(totalPrice, 10),
          cleaningFee: parseInt(cleaningFee || '0', 10),
          serviceFee: parseInt(serviceFee || '0', 10),
          eventType,
          guestCount: parseInt(guestCount || '0', 10),
          status: listing?.instantBook ? 'confirmed' : 'pending',
          instantBooked: listing?.instantBook || false,
          stripeSessionId: session.id,
          stripePaymentIntentId: session.payment_intent as string,
        },
      });

      console.log('Reservation created successfully for session:', session.id);
    } catch (error: any) {
      console.error('Error creating reservation:', error);
      return NextResponse.json(
        { error: `Database Error: ${error.message}` },
        { status: 500 }
      );
    }
  }

  // Handle session expiration
  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('Checkout session expired:', session.id);
    // You could add logic here to notify the user or clean up
  }

  return NextResponse.json({ received: true });
}
