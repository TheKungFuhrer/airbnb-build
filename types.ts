import { Listing, Reservation, User, Availability } from "@prisma/client";

export type safeListing = Omit<Listing, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type SafeReservation = Omit<
  Reservation,
  "createdAt" | "updatedAt" | "startTime" | "endTime" | "listing"
> & {
  createdAt: string;
  updatedAt: string;
  startTime: string;
  endTime: string;
  listing: safeListing;
};

export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

export type SafeAvailability = Omit<Availability, "createdAt" | "blockDate"> & {
  createdAt: string;
  blockDate: string | null;
};

// Event-specific type definitions
export type EventType =
  | "photoshoot"
  | "meeting"
  | "party"
  | "workshop"
  | "popup"
  | "film_production"
  | "other";

export type UserType =
  | "guest"
  | "host"
  | "photographer"
  | "event_planner"
  | "meeting_organizer";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type SpaceCategory =
  | "photoshoot"
  | "meeting"
  | "party"
  | "workshop"
  | "popup"
  | "film_production";

// Amenity types for event spaces
export interface SpaceAmenities {
  lighting: string[];
  equipment: string[];
  furniture: string[];
  amenities: string[];
}

// Hourly pricing breakdown
export interface PricingBreakdown {
  hourlyRate: number;
  hours: number;
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  total: number;
}
