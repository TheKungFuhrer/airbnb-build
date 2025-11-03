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
    title,
    description,
    imageSrc,
    images,
    category,
    roomCount,
    bathroomCount,
    capacity,
    squareFootage,
    location,
    address,
    floor,
    accessInstructions,
    hourlyRate,
    minimumHours,
    cleaningFee,
    amenities,
    lighting,
    equipment,
    furniture,
    instantBook,
    sameDayBooking,
    turnaroundTime,
    rules,
    allowedActivities,
    parking,
    accessibility,
    wifiAvailable,
    kitchenAvailable,
    outdoorSpace,
  } = body;

  // Validate required fields for event spaces
  if (!title || !description || !imageSrc || !category || !capacity || !hourlyRate) {
    return NextResponse.error();
  }

  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      imageSrc,
      images: images || [],
      category,
      roomCount: roomCount || null,
      bathroomCount: bathroomCount || 1,
      capacity: parseInt(capacity, 10),
      squareFootage: squareFootage ? parseInt(squareFootage, 10) : null,
      locationValue: location.value,
      address: address || null,
      floor: floor || null,
      accessInstructions: accessInstructions || null,
      hourlyRate: parseInt(hourlyRate, 10),
      minimumHours: minimumHours ? parseInt(minimumHours, 10) : 2,
      cleaningFee: cleaningFee ? parseInt(cleaningFee, 10) : 0,
      amenities: amenities || [],
      lighting: lighting || [],
      equipment: equipment || [],
      furniture: furniture || [],
      instantBook: instantBook || false,
      sameDayBooking: sameDayBooking !== false, // Default to true
      turnaroundTime: turnaroundTime ? parseInt(turnaroundTime, 10) : 2,
      rules: rules || [],
      allowedActivities: allowedActivities || [],
      parking: parking || null,
      accessibility: accessibility || false,
      wifiAvailable: wifiAvailable !== false, // Default to true
      kitchenAvailable: kitchenAvailable || false,
      outdoorSpace: outdoorSpace || false,
      userId: currentUser.id,
    },
  });

  return NextResponse.json(listing);
}
