import prisma from "@/lib/prismadb";

export interface IListingsParams {
  userId?: string;
  capacity?: number;
  guestCount?: number; // Guest count from search filters (maps to capacity)
  roomCount?: number;
  bathroomCount?: number;
  startTime?: string; // Changed from startDate to startTime
  endTime?: string; // Changed from endDate to endTime
  locationValue?: string;
  category?: string;
  // Event-specific filters
  amenities?: string[];
  lighting?: string[];
  equipment?: string[];
  furniture?: string[];
  instantBook?: boolean;
  sameDayBooking?: boolean;
  minHourlyRate?: number;
  maxHourlyRate?: number;
  parking?: string;
  accessibility?: boolean;
  wifiAvailable?: boolean;
  kitchenAvailable?: boolean;
  outdoorSpace?: boolean;
}

export default async function getListings(params: IListingsParams) {
  try {
    const {
      userId,
      roomCount,
      capacity,
      guestCount,
      bathroomCount,
      locationValue,
      startTime,
      endTime,
      category,
      amenities,
      lighting,
      equipment,
      furniture,
      instantBook,
      sameDayBooking,
      minHourlyRate,
      maxHourlyRate,
      parking,
      accessibility,
      wifiAvailable,
      kitchenAvailable,
      outdoorSpace,
    } = params;

    let query: any = {};

    if (userId) {
      query.userId = userId;
    }

    if (category) {
      query.category = category;
    }

    if (roomCount) {
      query.roomCount = {
        gte: +roomCount,
      };
    }

    // Filter by capacity - use guestCount from search or capacity parameter
    // The listing must have capacity >= selected guest count
    const minCapacity = guestCount || capacity;
    if (minCapacity) {
      query.capacity = {
        gte: +minCapacity,
      };
    }

    if (bathroomCount) {
      query.bathroomCount = {
        gte: +bathroomCount,
      };
    }

    if (locationValue) {
      query.locationValue = locationValue;
    }

    // Event-specific amenity filters
    if (amenities && amenities.length > 0) {
      query.amenities = {
        hasSome: amenities,
      };
    }

    if (lighting && lighting.length > 0) {
      query.lighting = {
        hasSome: lighting,
      };
    }

    if (equipment && equipment.length > 0) {
      query.equipment = {
        hasSome: equipment,
      };
    }

    if (furniture && furniture.length > 0) {
      query.furniture = {
        hasSome: furniture,
      };
    }

    // Booking feature filters
    if (instantBook !== undefined) {
      query.instantBook = instantBook;
    }

    if (sameDayBooking !== undefined) {
      query.sameDayBooking = sameDayBooking;
    }

    // Hourly rate filters
    if (minHourlyRate || maxHourlyRate) {
      query.hourlyRate = {};
      if (minHourlyRate) {
        query.hourlyRate.gte = +minHourlyRate;
      }
      if (maxHourlyRate) {
        query.hourlyRate.lte = +maxHourlyRate;
      }
    }

    // Additional feature filters
    if (parking) {
      query.parking = parking;
    }

    if (accessibility !== undefined) {
      query.accessibility = accessibility;
    }

    if (wifiAvailable !== undefined) {
      query.wifiAvailable = wifiAvailable;
    }

    if (kitchenAvailable !== undefined) {
      query.kitchenAvailable = kitchenAvailable;
    }

    if (outdoorSpace !== undefined) {
      query.outdoorSpace = outdoorSpace;
    }

    // Hourly availability check - exclude spaces with conflicting reservations
    if (startTime && endTime) {
      query.NOT = {
        reservations: {
          some: {
            status: {
              in: ["pending", "confirmed"],
            },
            OR: [
              {
                // Existing reservation overlaps with requested start time
                startTime: { lte: new Date(startTime) },
                endTime: { gt: new Date(startTime) },
              },
              {
                // Existing reservation overlaps with requested end time
                startTime: { lt: new Date(endTime) },
                endTime: { gte: new Date(endTime) },
              },
              {
                // Existing reservation is completely within requested time
                startTime: { gte: new Date(startTime) },
                endTime: { lte: new Date(endTime) },
              },
            ],
          },
        },
      };
    }

    const listing = await prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeListings = listing.map((list) => ({
      ...list,
      createdAt: list.createdAt.toISOString(),
      updatedAt: list.updatedAt.toISOString(),
    }));

    return safeListings;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
