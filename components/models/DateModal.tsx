"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatISO } from "date-fns";
import qs from "query-string";

import useDateModal from "@/hook/useDateModal";
import Modal from "./Modal";
import Heading from "../Heading";
import SingleDateCalendar from "../inputs/SingleDateCalendar";

type Props = {};

function DateModal({}: Props) {
  const dateModal = useDateModal();
  const router = useRouter();
  const params = useSearchParams();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const onSubmit = useCallback(async () => {
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
    };

    if (selectedDate) {
      updatedQuery.startDate = formatISO(selectedDate);
    }

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    dateModal.onClose();
    router.push(url);
  }, [selectedDate, router, params, dateModal]);

  const bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="When is your event?"
        subtitle="Select the date for your event"
      />
      <SingleDateCalendar
        onChange={(value) => setSelectedDate(value)}
        value={selectedDate}
      />
    </div>
  );

  return (
    <Modal
      isOpen={dateModal.isOpen}
      onClose={dateModal.onClose}
      onSubmit={onSubmit}
      title="Select Date"
      actionLabel="Apply"
      body={bodyContent}
    />
  );
}

export default DateModal;
