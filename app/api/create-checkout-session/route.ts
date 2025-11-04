import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import getCurrentUser from '@/app/actions/getCurrentUser';

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || !currentUser.email) {
      return NextResponse.json(
        { error: 'You must be logged in to make a booking' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      listingId,
      listingTitle,
      startTime,
      endTime,
      durationHours,
      hourlyRate,
      totalPrice,
      cleaningFee,
      serviceFee,
      eventType,
      guestCount,
    } = body;

    // Validate required fields
    if (
      !listingId ||
      !listingTitle ||
      !startTime ||
      !endTime ||
      !durationHours ||
      !hourlyRate ||
      !totalPrice
    ) {
      return NextResponse.json(
        { error: 'Missing required booking information' },
        { status: 400 }
      );
    }

    // Get the base URL for redirects
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: listingTitle,
              description: `${eventType || 'Event'} - ${durationHours} hours`,
            },
            unit_amount: Math.round(totalPrice * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/listings/${listingId}`,
      customer_email: currentUser.email,
      metadata: {
        userId: currentUser.id,
        listingId,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        durationHours: durationHours.toString(),
        hourlyRate: hourlyRate.toString(),
        totalPrice: totalPrice.toString(),
        cleaningFee: (cleaningFee || 0).toString(),
        serviceFee: (serviceFee || 0).toString(),
        eventType: eventType || '',
        guestCount: (guestCount || 0).toString(),
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
