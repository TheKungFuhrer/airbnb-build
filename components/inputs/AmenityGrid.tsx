"use client";

import React from "react";
import { IconType } from "react-icons";

type Amenity = {
  value: string;
  label: string;
  icon?: IconType;
};

type Props = {
  amenities: Amenity[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  title: string;
  columns?: number;
};

function AmenityGrid({
  amenities,
  selectedValues,
  onChange,
  title,
  columns = 2,
}: Props) {
  const toggleAmenity = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className="w-full">
      <h4 className="font-semibold text-md text-neutral-700 mb-3">{title}</h4>
      <div className={`grid ${gridCols[columns as keyof typeof gridCols]} gap-3`}>
        {amenities.map((amenity) => {
          const isSelected = selectedValues.includes(amenity.value);
          const Icon = amenity.icon;

          return (
            <div
              key={amenity.value}
              onClick={() => toggleAmenity(amenity.value)}
              className={`
                flex
                items-center
                gap-3
                p-3
                rounded-lg
                border-2
                cursor-pointer
                transition
                hover:border-neutral-400
                ${
                  isSelected
                    ? "border-black bg-neutral-50"
                    : "border-neutral-200 bg-white"
                }
              `}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {}}
                className="w-5 h-5 text-black border-neutral-300 rounded focus:ring-black pointer-events-none"
              />
              {Icon && <Icon size={20} className="text-neutral-600 flex-shrink-0" />}
              <span className="text-sm font-medium text-neutral-700">
                {amenity.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AmenityGrid;
