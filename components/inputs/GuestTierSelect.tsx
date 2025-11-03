"use client";

import React from "react";

export interface GuestTier {
  value: number;
  label: string;
  description: string;
  range: string;
}

export const guestTiers: GuestTier[] = [
  {
    value: 6,
    label: "Private Affair",
    description: "Intimate setting for small groups",
    range: "1-6 guests"
  },
  {
    value: 24,
    label: "Intimate Gathering",
    description: "Perfect for close friends and family",
    range: "7-24 guests"
  },
  {
    value: 49,
    label: "Social Soirée",
    description: "Comfortable mid-sized event",
    range: "25-49 guests"
  },
  {
    value: 99,
    label: "Signature Event",
    description: "Large-scale celebration",
    range: "50-99 guests"
  },
  {
    value: 999,
    label: "Grand Affair",
    description: "Spectacular large gathering",
    range: "100+ guests"
  }
];

type Props = {
  value?: number;
  onChange: (value: number) => void;
};

function GuestTierSelect({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="font-medium text-lg">Guest Count</div>
        <div className="font-light text-gray-600 text-sm">
          Select the expected size of your event
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {guestTiers.map((tier) => (
          <div
            key={tier.value}
            onClick={() => onChange(tier.value)}
            className={`
              relative cursor-pointer rounded-lg border-2 p-4 transition-all
              ${
                value === tier.value
                  ? "border-rose-500 bg-rose-50"
                  : "border-neutral-200 hover:border-neutral-400"
              }
            `}
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-base">{tier.label}</div>
                <div className="text-xs text-neutral-500 font-medium">
                  {tier.range}
                </div>
              </div>
              <div className="text-sm text-neutral-600">{tier.description}</div>
            </div>
            {value === tier.value && (
              <div className="absolute top-4 right-4">
                <div className="h-5 w-5 rounded-full bg-rose-500 flex items-center justify-center">
                  <svg
                    className="h-3 w-3 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GuestTierSelect;
