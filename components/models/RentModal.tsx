"use client";

import useRentModal from "@/hook/useRentModal";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Heading from "../Heading";
import CategoryInput from "../inputs/CategoryInput";
import Counter from "../inputs/Counter";
import CitySelect from "../inputs/CitySelect";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import { categories } from "../navbar/Categories";
import Modal from "./Modal";

type Props = {};

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

function RentModal({}: Props) {
  const router = useRouter();
  const rentModel = useRentModal();
  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: "",
      location: null,
      capacity: 10,
      roomCount: 1,
      bathroomCount: 1,
      squareFootage: 500,
      imageSrc: "",
      hourlyRate: 50,
      minimumHours: 2,
      cleaningFee: 0,
      title: "",
      description: "",
      instantBook: false,
      sameDayBooking: true,
      wifiAvailable: true,
      parking: "",
    },
  });

  const category = watch("category");
  const location = watch("location");
  const capacity = watch("capacity");
  const roomCount = watch("roomCount");
  const bathroomCount = watch("bathroomCount");
  const squareFootage = watch("squareFootage");
  const imageSrc = watch("imageSrc");

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    [location]
  );

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.PRICE) {
      return onNext();
    }

    setIsLoading(true);

    axios
      .post("/api/listings", data)
      .then(() => {
        toast.success("Listing Created!");
        router.refresh();
        reset();
        setStep(STEPS.CATEGORY);
        rentModel.onClose();
      })
      .catch(() => {
        toast.error("Something Went Wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return "Create";
    }

    return "Next";
  }, [step]);

  const secondActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined;
    }

    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="What type of event space are you listing?"
        subtitle="Pick a category that best describes your space"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#FF5A5F]">
        {categories.map((item, index) => (
          <div key={index} className="col-span-1">
            <CategoryInput
              onClick={(category) => setCustomValue("category", category)}
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Where is your event space located?"
          subtitle="Select the city where your space is located"
        />
        <CitySelect
          value={location}
          onChange={(value) => setCustomValue("location", value)}
        />
        <Map center={location?.latlng} />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Share some basics about your space"
          subtitle="What's the capacity and size?"
        />
        <Counter
          title="Capacity"
          subtitle="Maximum number of guests/attendees"
          value={capacity}
          onChange={(value) => setCustomValue("capacity", value)}
        />
        <hr />
        <Counter
          title="Square Footage"
          subtitle="Approximate size of your space (sq ft)"
          value={squareFootage}
          onChange={(value) => setCustomValue("squareFootage", value)}
        />
        <hr />
        <Counter
          title="Rooms"
          subtitle="Number of separate areas (optional)"
          value={roomCount}
          onChange={(value) => setCustomValue("roomCount", value)}
        />
        <hr />
        <Counter
          title="Bathrooms"
          subtitle="How many bathrooms are available?"
          value={bathroomCount}
          onChange={(value) => setCustomValue("bathroomCount", value)}
        />
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add photos of your space"
          subtitle="Show event organizers what your space looks like!"
        />
        <ImageUpload
          onChange={(value) => setCustomValue("imageSrc", value)}
          value={imageSrc}
        />
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Describe your space"
          subtitle="Tell event organizers about your space"
        />
        <Input
          id="title"
          label="Title"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="description"
          label="Description"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  if (step == STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Set your hourly rate"
          subtitle="How much do you charge per hour?"
        />
        <Input
          id="hourlyRate"
          label="Hourly Rate"
          formatPrice
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="minimumHours"
          label="Minimum Hours"
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="cleaningFee"
          label="Cleaning Fee (optional)"
          formatPrice
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
      </div>
    );
  }

  return (
    <Modal
      disabled={isLoading}
      isOpen={rentModel.isOpen}
      title="List your event space!"
      actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)}
      secondaryActionLabel={secondActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      onClose={rentModel.onClose}
      body={bodyContent}
    />
  );
}

export default RentModal;
