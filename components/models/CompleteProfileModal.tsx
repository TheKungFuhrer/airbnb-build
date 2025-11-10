"use client";

import useCompleteProfileModal from "@/hook/useCompleteProfileModal";
import useVerifyEmailModal from "@/hook/useVerifyEmailModal";
import axios from "axios";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Button from "../Button";
import Heading from "../Heading";
import Input from "../inputs/Input";
import Modal from "./Modal";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

type Props = {};

function CompleteProfileModal({}: Props) {
  const completeProfileModal = useCompleteProfileModal();
  const verifyEmailModal = useVerifyEmailModal();
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      companyName: "",
      jobTitle: "",
      phoneNumber: "",
      howDidYouHear: "",
      image: "",
    },
  });

  const image = watch("image");

  const handleUpload = useCallback(
    (result: any) => {
      setProfileImage(result.info.secure_url);
      setValue("image", result.info.secure_url, {
        shouldValidate: true,
      });
    },
    [setValue]
  );

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    // Validate profile image
    if (!profileImage) {
      toast.error("Please add a profile photo");
      setIsLoading(false);
      return;
    }

    // Add profile image to data
    const submitData = {
      ...data,
      image: profileImage,
    };

    axios
      .post("/api/profile/complete", submitData)
      .then((response) => {
        toast.success("Profile completed successfully!");
        completeProfileModal.onClose();
        verifyEmailModal.onOpen();
      })
      .catch((err: any) => {
        console.error(err);
        toast.error("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Complete your profile"
        subtitle="This helps build trust between guests and hosts"
        center
      />

      {/* Profile Photo Upload */}
      <div className="flex items-center gap-4">
        <div className="relative">
          {profileImage ? (
            <Image
              src={profileImage}
              alt="Profile"
              width={64}
              height={64}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
        <CldUploadWidget
          onUpload={handleUpload}
          uploadPreset="cptcecyi"
          options={{
            maxFiles: 1,
            sources: ['local', 'camera'],
          }}
        >
          {({ open }) => {
            return (
              <button
                type="button"
                onClick={() => open?.()}
                className="text-sm border border-neutral-300 px-4 py-2 rounded-md hover:bg-gray-50 transition"
                disabled={isLoading}
              >
                Add a profile photo <span className="text-red-500">*</span>
              </button>
            );
          }}
        </CldUploadWidget>
      </div>
      {errors.image && (
        <p className="text-red-500 text-sm -mt-2">Profile photo is required</p>
      )}

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="w-full relative">
          <input
            id="firstName"
            disabled={isLoading}
            {...register("firstName", { required: "First name is required" })}
            placeholder=" "
            className={`peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed pl-4 ${
              errors.firstName ? "border-red-500" : "border-neutral-300"
            } ${
              errors.firstName ? "focus:border-red-500" : "focus:border-black"
            }`}
          />
          <label
            className={`absolute text-md duration-150 transform -translate-y-3 top-5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${
              errors.firstName ? "text-red-500" : "text-zinc-400"
            }`}
          >
            First name <span className="text-red-500">*</span>
          </label>
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.firstName.message as string}
            </p>
          )}
        </div>
        <div className="w-full relative">
          <input
            id="lastName"
            disabled={isLoading}
            {...register("lastName", { required: "Last name is required" })}
            placeholder=" "
            className={`peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed pl-4 ${
              errors.lastName ? "border-red-500" : "border-neutral-300"
            } ${
              errors.lastName ? "focus:border-red-500" : "focus:border-black"
            }`}
          />
          <label
            className={`absolute text-md duration-150 transform -translate-y-3 top-5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${
              errors.lastName ? "text-red-500" : "text-zinc-400"
            }`}
          >
            Last name <span className="text-red-500">*</span>
          </label>
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.lastName.message as string}
            </p>
          )}
        </div>
      </div>

      {/* Optional Fields */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="companyName"
          label="Company name"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
        <Input
          id="jobTitle"
          label="Job title"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
      </div>

      {/* Phone Number */}
      <div>
        <div className="w-full relative">
          <div className="absolute left-4 top-5 flex items-center gap-2">
            <span className="text-gray-500">🇺🇸</span>
          </div>
          <input
            id="phoneNumber"
            type="tel"
            disabled={isLoading}
            {...register("phoneNumber")}
            placeholder=" "
            className="peer w-full p-4 pt-6 pl-14 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed border-neutral-300 focus:border-black"
          />
          <label className="absolute text-md duration-150 transform -translate-y-3 top-5 z-10 origin-[0] left-14 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 text-zinc-400">
            Phone number
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          We will only use your phone number for booking updates.
        </p>
      </div>

      {/* How did you hear about us */}
      <div>
        <label className="text-sm font-medium mb-2 block">
          How did you hear about us?
        </label>
        <select
          {...register("howDidYouHear")}
          disabled={isLoading}
          className="w-full p-4 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed border-neutral-300 focus:border-black"
        >
          <option value="">Select option</option>
          <option value="search_engine">Search Engine</option>
          <option value="social_media">Social Media</option>
          <option value="friend_referral">Friend Referral</option>
          <option value="advertisement">Advertisement</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={completeProfileModal.isOpen}
      title="Complete your profile"
      actionLabel="Complete profile"
      onClose={completeProfileModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
    />
  );
}

export default CompleteProfileModal;
