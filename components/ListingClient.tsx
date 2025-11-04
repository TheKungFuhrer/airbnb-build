"use client";

import useLoginModel from "@/hook/useLoginModal";
import { SafeReservation, SafeUser, safeListing } from "@/types";
import axios from "axios";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Range } from "react-date-range";
import { toast } from "react-toastify";

import Container from "./Container";
import ListingHead from "./listing/ListingHead";
import ListingInfo from "./listing/ListingInfo";
import ListingReservation from "./listing/ListingReservation";
import { categories } from "./navbar/Categories";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

type Props = {
  reservations?: SafeReservation[];
  listing: safeListing & {
    user: SafeUser;
  };
  currentUser?: SafeUser | null;
};

function ListingClient({ reservations = [], listing, currentUser }: Props) {
  const router = useRouter();
  const loginModal = useLoginModel();

  const disableDates = useMemo(() => {
    let dates: Date[] = [];

    reservations.forEach((reservation) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startTime),
        end: new Date(reservation.endTime),
      });

      dates = [...dates, ...range];
    });

    return dates;
  }, [reservations]);

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.hourlyRate * listing.minimumHours);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);
  const [selectedHours, setSelectedHours] = useState(listing.minimumHours || 2);

  const onCreateReservation = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    setIsLoading(true);

    const startTime = dateRange.startDate;
    const endTime = new Date(dateRange.startDate?.getTime() || 0);
    endTime.setHours(endTime.getHours() + selectedHours);

    // Create Stripe checkout session
    axios
      .post("/api/create-checkout-session", {
        listingId: listing.id,
        listingTitle: listing.title,
        startTime,
        endTime,
        durationHours: selectedHours,
        hourlyRate: listing.hourlyRate,
        totalPrice,
        cleaningFee: listing.cleaningFee || 0,
        serviceFee: Math.round((selectedHours * listing.hourlyRate) * 0.1),
        eventType: listing.category,
        guestCount: listing.capacity,
      })
      .then((response) => {
        // Redirect to Stripe checkout
        if (response.data.url) {
          window.location.href = response.data.url;
        } else {
          throw new Error('No checkout URL returned');
        }
      })
      .catch((error) => {
        console.error('Checkout error:', error);
        toast.error(error.response?.data?.error || "Failed to create checkout session");
        setIsLoading(false);
      });
  }, [totalPrice, dateRange, listing, selectedHours, router, currentUser, loginModal]);

  useEffect(() => {
    if (selectedHours) {
      const subtotal = selectedHours * listing.hourlyRate;
      const cleaningFee = listing.cleaningFee || 0;
      const serviceFee = Math.round(subtotal * 0.1); // 10% service fee
      setTotalPrice(subtotal + cleaningFee + serviceFee);
    }
  }, [selectedHours, listing.hourlyRate, listing.cleaningFee]);

  const category = useMemo(() => {
    return categories.find((item) => item.label === listing.category);
  }, [listing.category]);

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <ListingHead
            title={listing.title}
            imageSrc={listing.imageSrc}
            locationValue={listing.locationValue}
            id={listing.id}
            currentUser={currentUser}
          />
          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
            <ListingInfo
              user={listing.user}
              category={category}
              description={listing.description}
              capacity={listing.capacity}
              roomCount={listing.roomCount}
              bathroomCount={listing.bathroomCount}
              squareFootage={listing.squareFootage}
              hourlyRate={listing.hourlyRate}
              minimumHours={listing.minimumHours}
              locationValue={listing.locationValue}
              instantBook={listing.instantBook}
              sameDayBooking={listing.sameDayBooking}
              wifiAvailable={listing.wifiAvailable}
              parking={listing.parking}
            />
            <div className="order-first mb-10 md:order-last md:col-span-3">
              <ListingReservation
                hourlyRate={listing.hourlyRate}
                minimumHours={listing.minimumHours}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabled={isLoading}
                disabledDates={disableDates}
                selectedHours={selectedHours}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default ListingClient;
