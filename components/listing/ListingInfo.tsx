"use client";

import useCountries from "@/hook/useCountries";
import { SafeUser } from "@/types";
import dynamic from "next/dynamic";
import React from "react";
import { IconType } from "react-icons";
import Avatar from "../Avatar";
import ListingCategory from "./ListingCategory";
import Offers from "../Offers";

const Map = dynamic(() => import("../Map"), {
  ssr: false,
});

type Props = {
  user: SafeUser;
  description: string;
  capacity: number;
  roomCount?: number | null;
  bathroomCount: number;
  squareFootage?: number | null;
  hourlyRate: number;
  minimumHours: number;
  category:
    | {
        icon: IconType;
        label: string;
        description: string;
      }
    | undefined;
  locationValue: string;
  instantBook?: boolean;
  sameDayBooking?: boolean;
  wifiAvailable?: boolean;
  parking?: string | null;
};

function ListingInfo({
  user,
  description,
  capacity,
  roomCount,
  bathroomCount,
  squareFootage,
  hourlyRate,
  minimumHours,
  category,
  locationValue,
  instantBook,
  sameDayBooking,
  wifiAvailable,
  parking,
}: Props) {
  const { getByValue } = useCountries();
  const coordinates = getByValue(locationValue)?.latlng;

  return (
    <div className="col-span-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className=" text-xl font-semibold flex flex-row items-center gap-2">
          <div>Space hosted by {user?.name}</div>
          <Avatar src={user?.image} userName={user?.name} />
        </div>
        <div className="flex flex-row items-center gap-4 font-light text-neutral-500">
          <p>Up to {capacity} guests</p>
          {squareFootage && <p>{squareFootage} sq ft</p>}
          {roomCount && roomCount > 0 && <p>{roomCount} rooms</p>}
          <p>{bathroomCount} bathrooms</p>
        </div>
        <div className="flex flex-row items-center gap-4 font-semibold text-rose-500 mt-2">
          <p>${hourlyRate}/hour</p>
          <span className="text-neutral-500 font-light">
            ({minimumHours}h minimum)
          </span>
        </div>
      </div>
      <hr />
      {category && (
        <ListingCategory
          icon={category.icon}
          label={category?.label}
          description={category?.description}
        />
      )}
      <hr />
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          {instantBook && (
            <div className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <div>
                <p className="font-semibold">Instant Book</p>
                <p className="text-sm text-neutral-500">Book without approval</p>
              </div>
            </div>
          )}
          {sameDayBooking && (
            <div className="flex items-center gap-2">
              <span className="text-lg">📅</span>
              <div>
                <p className="font-semibold">Same-Day Booking</p>
                <p className="text-sm text-neutral-500">Available today</p>
              </div>
            </div>
          )}
          {wifiAvailable && (
            <div className="flex items-center gap-2">
              <span className="text-lg">📶</span>
              <div>
                <p className="font-semibold">WiFi Available</p>
                <p className="text-sm text-neutral-500">High-speed internet</p>
              </div>
            </div>
          )}
          {parking && (
            <div className="flex items-center gap-2">
              <span className="text-lg">🅿️</span>
              <div>
                <p className="font-semibold">Parking</p>
                <p className="text-sm text-neutral-500 capitalize">{parking}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <hr />
      <p className="text-lg font-light text-neutral-500">{description}</p>
      <hr />
      <Offers />
      <hr />
      <p className="text-xl font-semibold">{`Where you’ll be`}</p>
      <Map center={coordinates} locationValue={locationValue} />
    </div>
  );
}

export default ListingInfo;
