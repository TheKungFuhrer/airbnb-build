"use client";

import usePhoneInputModal from "@/hook/usePhoneInputModal";
import useVerifyPhoneModal from "@/hook/useVerifyPhoneModal";
import axios from "axios";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Heading from "../Heading";
import Modal from "./Modal";

type Props = {
  onPhoneUpdated?: () => void;
};

// Common country calling codes
const COUNTRY_CODES = [
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+1", country: "Canada", flag: "🇨🇦" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
];

function PhoneInputModal({ onPhoneUpdated }: Props) {
  const phoneInputModal = usePhoneInputModal();
  const verifyPhoneModal = useVerifyPhoneModal();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+1");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      phoneNumber: "",
    },
  });

  const phoneNumber = watch("phoneNumber");
  const isPhoneValid = phoneNumber && phoneNumber.length >= 7;

  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    (data) => {
      if (!isPhoneValid) {
        toast.error("Please enter a valid phone number");
        return;
      }

      setIsLoading(true);

      const fullPhoneNumber = `${selectedCountryCode}${data.phoneNumber}`;

      // First, save the phone number
      axios
        .put("/api/profile/update", { phoneNumber: fullPhoneNumber })
        .then(() => {
          // Then send verification SMS
          return axios.post("/api/verify/phone/send");
        })
        .then(() => {
          toast.success("Verification code sent to your phone!");
          phoneInputModal.onClose();
          reset();
          if (onPhoneUpdated) {
            onPhoneUpdated(); // Refresh parent to show new phone
          }
          // Open verification modal
          setTimeout(() => {
            verifyPhoneModal.onOpen();
          }, 300);
        })
        .catch((err: any) => {
          console.error(err);
          toast.error(
            err.response?.data?.error || "Failed to send verification code"
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [
      isPhoneValid,
      selectedCountryCode,
      phoneInputModal,
      verifyPhoneModal,
      reset,
      onPhoneUpdated,
    ]
  );

  const handleClose = useCallback(() => {
    phoneInputModal.onClose();
    reset();
  }, [phoneInputModal, reset]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Phone number"
        subtitle="Receive inbox notifications and updates."
        center
      />

      {/* Country Code Selector and Phone Input */}
      <div className="flex gap-2">
        {/* Country Code Dropdown */}
        <div className="relative w-32">
          <select
            value={selectedCountryCode}
            onChange={(e) => setSelectedCountryCode(e.target.value)}
            disabled={isLoading}
            className="w-full p-4 border-2 rounded-md outline-none transition border-neutral-300 focus:border-black appearance-none disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {COUNTRY_CODES.map((country, index) => (
              <option
                key={`${country.code}-${index}`}
                value={country.code}
              >
                {country.flag} {country.code}
              </option>
            ))}
          </select>
        </div>

        {/* Phone Number Input */}
        <div className="flex-1">
          <input
            id="phoneNumber"
            type="tel"
            disabled={isLoading}
            {...register("phoneNumber", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{7,15}$/,
                message: "Please enter a valid phone number (7-15 digits)",
              },
            })}
            placeholder="Phone number"
            className={`w-full p-4 border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed ${
              errors.phoneNumber ? "border-red-500" : "border-neutral-300"
            } ${
              errors.phoneNumber ? "focus:border-red-500" : "focus:border-black"
            }`}
          />
        </div>
      </div>

      {errors.phoneNumber && (
        <p className="text-red-500 text-sm -mt-2">
          {errors.phoneNumber.message as string}
        </p>
      )}

      {/* Help Text */}
      <div className="text-sm text-gray-600">
        <p>
          We&apos;ll send you a text message to verify your phone number.
          Standard message and data rates apply.
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading || !isPhoneValid}
      isOpen={phoneInputModal.isOpen}
      title=""
      actionLabel="Verify Number"
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
    />
  );
}

export default PhoneInputModal;
