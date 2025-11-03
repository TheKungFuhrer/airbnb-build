"use client";

import React from "react";
import { Range } from "react-date-range";
import Calendar from "../inputs/Calendar";
import Button from "../Button";

type Props = {
  hourlyRate: number;
  minimumHours: number;
  dateRange: Range;
  totalPrice: number;
  onChangeDate: (value: Range) => void;
  onSubmit: () => void;
  disabled?: boolean;
  disabledDates: Date[];
  selectedHours?: number;
};

function ListingReservation({
  hourlyRate,
  minimumHours,
  dateRange,
  totalPrice,
  onChangeDate,
  onSubmit,
  disabled,
  disabledDates,
  selectedHours = 2,
}: Props) {
  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden">
      <div className="flex flex-col gap-2 p-4">
        <div className="flex flex-row items-center gap-1">
          <p className="flex gap-1 text-2xl font-semibold">
            $ {hourlyRate} <p className="font-light text-neutral-600">/hour</p>
          </p>
        </div>
        <p className="text-sm text-neutral-500">
          Minimum {minimumHours} hours required
        </p>
      </div>
      <hr />
      <Calendar
        value={dateRange}
        disabledDates={disabledDates}
        onChange={(value) => onChangeDate(value.selection)}
      />
      <hr />
      <div className="p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">Booking Summary</p>
          <div className="flex justify-between text-sm">
            <p className="text-neutral-500">
              ${hourlyRate} × {selectedHours} hours
            </p>
            <p>${hourlyRate * selectedHours}</p>
          </div>
        </div>
        <Button disabled={disabled} label="Reserve" onClick={onSubmit} />
      </div>
      <hr />
      <div className="p-4 flex flex-row items-center justify-between font-semibold text-lg">
        <p>Total</p>
        <p> $ {totalPrice}</p>
      </div>
    </div>
  );
}

export default ListingReservation;
