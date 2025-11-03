import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

// Create availability schedule
export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { listingId, dayOfWeek, startTime, endTime, blockDate, isBlocked } =
    body;

  // Validate required fields
  if (!listingId) {
    return NextResponse.json(
      { error: "Listing ID is required" },
      { status: 400 }
    );
  }

  // Verify user owns the listing
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { userId: true },
  });

  if (!listing || listing.userId !== currentUser.id) {
    return NextResponse.json(
      { error: "Unauthorized - You don't own this listing" },
      { status: 403 }
    );
  }

  // Create availability record
  const availability = await prisma.availability.create({
    data: {
      listingId,
      dayOfWeek: dayOfWeek !== undefined ? parseInt(dayOfWeek, 10) : 0,
      startTime: startTime || "09:00",
      endTime: endTime || "22:00",
      blockDate: blockDate ? new Date(blockDate) : null,
      isBlocked: isBlocked || false,
    },
  });

  return NextResponse.json(availability);
}

// Get availability for a listing
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const listingId = searchParams.get("listingId");

  if (!listingId) {
    return NextResponse.json(
      { error: "Listing ID is required" },
      { status: 400 }
    );
  }

  const availability = await prisma.availability.findMany({
    where: {
      listingId,
    },
    orderBy: [
      { dayOfWeek: "asc" },
      { startTime: "asc" },
    ],
  });

  const safeAvailability = availability.map((avail) => ({
    ...avail,
    createdAt: avail.createdAt.toISOString(),
    blockDate: avail.blockDate?.toISOString() || null,
  }));

  return NextResponse.json(safeAvailability);
}
