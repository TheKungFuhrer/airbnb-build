"use client";

import React from "react";
import { IconType } from "react-icons";

type Option = {
  label: string;
  value: string;
  icon?: IconType;
  description?: string;
};

type Props = {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  label: string;
  subtitle?: string;
  columns?: number;
};

function MultiSelectCard({
  options,
  selectedValues,
  onChange,
  label,
  subtitle,
  columns = 2,
}: Props) {
  const toggleSelection = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-neutral-800">{label}</h3>
      {subtitle && (
        <p className="text-sm text-neutral-500 mt-1 mb-4">{subtitle}</p>
      )}
      <div
        className={`grid ${
          gridCols[columns as keyof typeof gridCols]
        } gap-3 max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#FF5A5F]`}
      >
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          const Icon = option.icon;

          return (
            <div
              key={option.value}
              onClick={() => toggleSelection(option.value)}
              className={`
                relative
                rounded-xl
                border-2
                p-4
                flex
                flex-col
                gap-2
                hover:border-black
                transition
                cursor-pointer
                ${isSelected ? "border-black bg-neutral-50" : "border-neutral-200"}
              `}
            >
              {Icon && <Icon size={24} className="text-neutral-600" />}
              <div className="font-semibold text-md">{option.label}</div>
              {option.description && (
                <div className="text-sm text-neutral-500">
                  {option.description}
                </div>
              )}
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MultiSelectCard;
