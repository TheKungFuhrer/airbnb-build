"use client";

import React from "react";
import { Calendar } from "react-date-range";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

type Props = {
  value: Date;
  onChange: (value: Date) => void;
  disabledDates?: Date[];
};

function SingleDateCalendar({ value, onChange, disabledDates }: Props) {
  return (
    <Calendar
      color="#262626"
      date={value}
      onChange={onChange}
      minDate={new Date()}
      disabledDates={disabledDates}
    />
  );
}

export default SingleDateCalendar;
