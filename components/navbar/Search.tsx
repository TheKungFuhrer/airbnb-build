"use client";

import useCities from "@/hook/useCities";
import useSearchModal from "@/hook/useSearchModal";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { BiSearch } from "react-icons/bi";
import { guestTiers } from "@/components/inputs/GuestTierSelect";

type Props = {};

function Search({}: Props) {
  const searchModel = useSearchModal();
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
    <div
      onClick={searchModel.onOpen}
      className="border-[1px] w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-md transition cursor-pointer"
    >
      <div className="flex flex-row items-center justify-between">
        <div className="text-sm font-semibold px-6">{locationLabel}</div>
        <div className="hidden sm:block text-losm font-semibold px-6 border-x-[1px] flex-1 text-center">
          {durationLabel}
        </div>
        <div className="text-sm pl-6 pr-2 text-gray-600 flex flex-row items-center gap-3">
          <div className="hidden sm:block text-center">{guessLabel}</div>
          <div className="p-2 bg-rose-500 rounded-full text-white">
            <BiSearch size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
