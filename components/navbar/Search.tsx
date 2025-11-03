"use client";

import useCities from "@/hook/useCities";
import useCityModal from "@/hook/useCityModal";
import useDateModal from "@/hook/useDateModal";
import useGuestModal from "@/hook/useGuestModal";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { BiSearch } from "react-icons/bi";
import { guestTiers } from "@/components/inputs/GuestTierSelect";

type Props = {};

function Search({}: Props) {
  const cityModal = useCityModal();
  const dateModal = useDateModal();
  const guestModal = useGuestModal();
  const params = useSearchParams();
  const { getByValue } = useCities();

  const locationValue = params?.get("locationValue");
  const startDate = params?.get("startDate");
  const guestCount = params?.get("guestCount");

  const locationLabel = useMemo(() => {
    if (locationValue) {
      return getByValue(locationValue as string)?.label;
    }

    return "Any City";
  }, [getByValue, locationValue]);

  const durationLabel = useMemo(() => {
    if (startDate) {
      const date = new Date(startDate as string);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined 
      });
    }

    return "Any Date";
  }, [startDate]);

  const guessLabel = useMemo(() => {
    if (guestCount) {
      const tier = guestTiers.find(t => t.value === Number(guestCount));
      return tier ? tier.label : `${guestCount} Guests`;
    }

    return "Add Guests";
  }, [guestCount]);

  return (
    <div className="border-[1px] w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-md transition">
      <div className="flex flex-row items-center justify-between">
        {/* City Filter */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            cityModal.onOpen();
          }}
          className="text-sm font-semibold px-6 cursor-pointer hover:bg-gray-100 rounded-full py-2 transition"
        >
          {locationLabel}
        </div>

        {/* Date Filter */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            dateModal.onOpen();
          }}
          className="hidden sm:block text-sm font-semibold px-6 border-x-[1px] flex-1 text-center cursor-pointer hover:bg-gray-100 py-2 transition"
        >
          {durationLabel}
        </div>

        {/* Guest Filter */}
        <div className="text-sm pl-6 pr-2 text-gray-600 flex flex-row items-center gap-3">
          <div 
            onClick={(e) => {
              e.stopPropagation();
              guestModal.onOpen();
            }}
            className="hidden sm:block text-center cursor-pointer hover:bg-gray-100 rounded-full px-4 py-2 transition"
          >
            {guessLabel}
          </div>
          <div className="p-2 bg-rose-500 rounded-full text-white">
            <BiSearch size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
