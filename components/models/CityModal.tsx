"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import dynamic from "next/dynamic";

import useCityModal from "@/hook/useCityModal";
import Modal from "./Modal";
import Heading from "../Heading";
import CitySelect, { CitySelectValue } from "../inputs/CitySelect";

type Props = {};

function CityModal({}: Props) {
  const cityModal = useCityModal();
  const router = useRouter();
  const params = useSearchParams();
  const [location, setLocation] = useState<CitySelectValue>();

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    [location]
  );

  const onSubmit = useCallback(async () => {
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      locationValue: location?.value,
    };

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    cityModal.onClose();
    router.push(url);
  }, [location, router, params, cityModal]);

  const bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Where's your event?"
        subtitle="Find the perfect city for your event space"
      />
      <CitySelect
        value={location}
        onChange={(value) => setLocation(value as CitySelectValue)}
      />
      <hr />
      <Map center={location?.latlng} />
    </div>
  );

  return (
    <Modal
      isOpen={cityModal.isOpen}
      onClose={cityModal.onClose}
      onSubmit={onSubmit}
      title="Select City"
      actionLabel="Apply"
      body={bodyContent}
    />
  );
}

export default CityModal;
