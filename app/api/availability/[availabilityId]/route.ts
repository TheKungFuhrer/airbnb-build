import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/lib/prismadb";

interface IParams {
  availabilityId?: string;
}

// Delete availability schedule
export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { availabilityId } = params;

  if (!availabilityId || typeof availabilityId !== "string") {
    throw new Error("Invalid Availability ID");
  }

  // Get availability record with listing info
  const availability = await prisma.availability.findUnique({
    where: { id: availabilityId },
    include: {
      listing: {
        select: { userId: true },
      },
    },
  });

  if (!availability) {
    return NextResponse.json(
      { error: "Availability record not found" },
      { status: 404 }
    );
  }

  // Verify user owns the listing
  if (availability.listing.userId !== currentUser.id) {
    return NextResponse.json(
      { error: "Unauthorized - You don't own this listing" },
      { status: 403 }
    );
  }

  // Delete availability record
  const deleted = await prisma.availability.delete({
    where: {
      id: availabilityId,
    },
  });

  return NextResponse.json(deleted);
}

// Update availability schedule
export async function PATCH(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { availabilityId } = params;

  if (!availabilityId || typeof availabilityId !== "string") {
    throw new Error("Invalid Availability ID");
  }

  const body = await request.json();
  const { dayOfWeek, startTime, endTime, blockDate, isBlocked } = body;

  // Get availability record with listing info
  const availability = await prisma.availability.findUnique({
    where: { id: availabilityId },
    include: {
      listing: {
        select: { userId: true },
      },
    },
  });

  if (!availability) {
    return NextResponse.json(
      { error: "Availability record not found" },
      { status: 404 }
    );
  }

  // Verify user owns the listing
  if (availability.listing.userId !== currentUser.id) {
    return NextResponse.json(
      { error: "Unauthorized - You don't own this listing" },
      { status: 403 }
    );
  }

  // Update availability record
  const updated = await prisma.availability.update({
    where: {
      id: availabilityId,
    },
    data: {
      ...(dayOfWeek !== undefined && { dayOfWeek: parseInt(dayOfWeek, 10) }),
      ...(startTime && { startTime }),
      ...(endTime && { endTime }),
      ...(blockDate !== undefined && {
        blockDate: blockDate ? new Date(blockDate) : null,
      }),
      ...(isBlocked !== undefined && { isBlocked }),
    },
  });

  return NextResponse.json(updated);
}
