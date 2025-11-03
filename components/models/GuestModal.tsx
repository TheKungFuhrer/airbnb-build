"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

import useGuestModal from "@/hook/useGuestModal";
import Modal from "./Modal";
import GuestTierSelect from "../inputs/GuestTierSelect";

type Props = {};

function GuestModal({}: Props) {
  const guestModal = useGuestModal();
  const router = useRouter();
  const params = useSearchParams();
  const [guestCount, setGuestCount] = useState<number>();

  const onSubmit = useCallback(async () => {
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      guestCount,
    };

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    guestModal.onClose();
    router.push(url);
  }, [guestCount, router, params, guestModal]);

  const bodyContent = (
    <div className="flex flex-col gap-8">
      <GuestTierSelect
        value={guestCount}
        onChange={(value) => setGuestCount(value)}
      />
    </div>
  );

  return (
    <Modal
      isOpen={guestModal.isOpen}
      onClose={guestModal.onClose}
      onSubmit={onSubmit}
      title="Select Guest Count"
      actionLabel="Apply"
      body={bodyContent}
    />
  );
}

export default GuestModal;
