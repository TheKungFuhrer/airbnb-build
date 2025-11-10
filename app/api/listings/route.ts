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
    spaceTypes,
    squareFootage,
    capacity,
    allowedActivities,
    address,
    unit,
    city,
    state,
    zipCode,
    latitude,
    longitude,
    locationValue,
    hourlyRate,
    halfDayRate,
    fullDayRate,
    minimumHours,
    cleaningFee,
    amenities,
    advanceNotice,
    cancellationPolicy,
    smokingAllowed,
    petsAllowed,
    alcoholAllowed,
    childrenAllowed,
    rules,
    requiresInsurance,
    hostProfile,
    schedule,
  } = body;

  // Validate required fields
  if (!title || !description || !imageSrc || !capacity || !hourlyRate) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (!address || !city || !state) {
    return NextResponse.json(
      { error: "Complete address is required" },
      { status: 400 }
    );
  }

  if (!spaceTypes || spaceTypes.length === 0) {
    return NextResponse.json(
      { error: "At least one space type is required" },
      { status: 400 }
    );
  }

  if (!images || images.length < 5) {
    return NextResponse.json(
      { error: "At least 5 photos are required" },
      { status: 400 }
    );
  }

  try {
    // Update user profile with host information if provided
    if (hostProfile) {
      await prisma.user.update({
        where: { id: currentUser.id },
        data: {
          firstName: hostProfile.firstName,
          lastName: hostProfile.lastName,
          phoneNumber: hostProfile.phoneNumber,
          image: hostProfile.image,
          bio: hostProfile.bio,
          languages: hostProfile.languages || ["English"],
        },
      });
    }

    // Create the listing
    const listing = await prisma.listing.create({
      data: {
        // Basic info
        title,
        description,
        imageSrc,
        images: images || [],
        category: spaceTypes[0] || "event_space", // Use first space type as primary category

        // Space details
        spaceTypes: spaceTypes || [],
        squareFootage: squareFootage ? parseInt(squareFootage, 10) : null,
        capacity: parseInt(capacity, 10),
        bathroomCount: 1, // Default value, can be enhanced later
        allowedActivities: allowedActivities || [],

        // Location - complete address data
        locationValue: locationValue || `${city}, ${state}`,
        address,
        unit: unit || null,
        city,
        state,
        zipCode,
        latitude: latitude || null,
        longitude: longitude || null,

        // Pricing - hourly model with day rates
        hourlyRate: parseInt(hourlyRate, 10),
        halfDayRate: halfDayRate ? parseInt(halfDayRate, 10) : null,
        fullDayRate: fullDayRate ? parseInt(fullDayRate, 10) : null,
        minimumHours: minimumHours ? parseInt(minimumHours, 10) : 2,
        cleaningFee: cleaningFee ? parseInt(cleaningFee, 10) : 0,

        // Amenities
        amenities: amenities || [],

        // Availability settings
        advanceNotice: advanceNotice || "1_day",
        sameDayBooking: advanceNotice === "same_day",

        // Policies
        cancellationPolicy: cancellationPolicy || "moderate",
        smokingAllowed: smokingAllowed || false,
        petsAllowed: petsAllowed || false,
        alcoholAllowed: alcoholAllowed !== false,
        childrenAllowed: childrenAllowed !== false,
        rules: rules || [],
        requiresInsurance: requiresInsurance || false,

        // Additional features
        instantBook: false,
        turnaroundTime: 2,
        wifiAvailable: amenities?.includes("wifi") || false,
        kitchenAvailable: amenities?.includes("kitchen_access") || false,
        parking: amenities?.includes("parking") ? "available" : null,
        accessibility: amenities?.includes("elevator") || false,
        outdoorSpace: spaceTypes?.includes("garden") || spaceTypes?.includes("rooftop") || false,

        userId: currentUser.id,
      },
    });

    // Create availability schedule entries for each enabled day
    if (schedule) {
      const availabilityEntries = [];
      const dayMapping: { [key: string]: number } = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
      };

      for (const [day, config] of Object.entries(schedule)) {
        if ((config as any).enabled) {
          availabilityEntries.push({
            listingId: listing.id,
            dayOfWeek: dayMapping[day],
            startTime: (config as any).startTime,
            endTime: (config as any).endTime,
            isBlocked: false,
          });
        }
      }

      if (availabilityEntries.length > 0) {
        await prisma.availability.createMany({
          data: availabilityEntries,
        });
      }
    }

    return NextResponse.json(listing);
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}
