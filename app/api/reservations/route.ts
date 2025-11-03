import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();

  const {
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
    eventDetails,
    instantBooked,
  } = body;

  // Validate required fields for hourly bookings
  if (
    !listingId ||
    !startTime ||
    !endTime ||
    !durationHours ||
    !hourlyRate ||
    !totalPrice ||
    !eventType ||
    !guestCount
  ) {
    return NextResponse.error();
  }

  // Check for conflicting reservations
  const existingReservations = await prisma.reservation.findMany({
    where: {
      listingId,
      status: {
        in: ["pending", "confirmed"],
      },
      OR: [
        {
          startTime: { lte: new Date(startTime) },
          endTime: { gt: new Date(startTime) },
        },
        {
          startTime: { lt: new Date(endTime) },
          endTime: { gte: new Date(endTime) },
        },
        {
          startTime: { gte: new Date(startTime) },
          endTime: { lte: new Date(endTime) },
        },
      ],
    },
  });

  if (existingReservations.length > 0) {
    return NextResponse.json(
      { error: "Time slot is already booked" },
      { status: 409 }
    );
  }

  // Get listing to check turnaround time
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { turnaroundTime: true, instantBook: true },
  });

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  // Create reservation with hourly booking details
  const listingAndReservation = await prisma.listing.update({
    where: {
      id: listingId,
    },
    data: {
      reservations: {
        create: {
          userId: currentUser.id,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          durationHours: parseInt(durationHours, 10),
          hourlyRate: parseInt(hourlyRate, 10),
          totalPrice: parseInt(totalPrice, 10),
          cleaningFee: cleaningFee ? parseInt(cleaningFee, 10) : 0,
          serviceFee: serviceFee ? parseInt(serviceFee, 10) : 0,
          eventType,
          guestCount: parseInt(guestCount, 10),
          eventDetails: eventDetails || null,
          status: listing.instantBook || instantBooked ? "confirmed" : "pending",
          instantBooked: listing.instantBook || instantBooked || false,
        },
      },
    },
  });

  return NextResponse.json(listingAndReservation);
}
