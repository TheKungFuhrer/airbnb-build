"use client";

import React from "react";

type Option = {
  value: string;
  label: string;
  description: string;
  details?: string;
};

type Props = {
  options: Option[];
  selectedValue: string;
  onChange: (value: string) => void;
  label: string;
  subtitle?: string;
};

function RadioCard({ options, selectedValue, onChange, label, subtitle }: Props) {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-neutral-800">{label}</h3>
      {subtitle && (
        <p className="text-sm text-neutral-500 mt-1 mb-4">{subtitle}</p>
      )}
      <div className="flex flex-col gap-3">
        {options.map((option) => {
          const isSelected = selectedValue === option.value;

          return (
            <div
              key={option.value}
              onClick={() => onChange(option.value)}
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
                ${
                  isSelected
                    ? "border-black bg-neutral-50"
                    : "border-neutral-200"
                }
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-semibold text-md">{option.label}</div>
                  <div className="text-sm text-neutral-600 mt-1">
                    {option.description}
                  </div>
                  {option.details && (
                    <div className="text-xs text-neutral-500 mt-2">
                      {option.details}
                    </div>
                  )}
                </div>
                <div
                  className={`
                    w-6
                    h-6
                    rounded-full
                    border-2
                    flex
                    items-center
                    justify-center
                    ml-4
                    flex-shrink-0
                    ${
                      isSelected
                        ? "border-black bg-black"
                        : "border-neutral-300"
                    }
                  `}
                >
                  {isSelected && (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RadioCard;
