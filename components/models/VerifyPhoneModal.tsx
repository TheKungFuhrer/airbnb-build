"use client";

import useVerifyPhoneModal from "@/hook/useVerifyPhoneModal";
import axios from "axios";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Button from "../Button";
import Heading from "../Heading";
import Modal from "./Modal";

type Props = {};

function VerifyPhoneModal({}: Props) {
  const verifyPhoneModal = useVerifyPhoneModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      code: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios
      .post("/api/verify/phone", { code: data.code })
      .then(() => {
        toast.success("Phone number verified successfully!");
        verifyPhoneModal.onClose();
        reset();
      })
      .catch((err: any) => {
        console.error(err);
        toast.error("Invalid verification code");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleResendCode = () => {
    setIsLoading(true);
    axios
      .post("/api/verify/phone/resend")
      .then(() => {
        toast.success("Verification code resent!");
      })
      .catch((err: any) => {
        console.error(err);
        toast.error("Failed to resend code");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Verify your phone number"
        subtitle="Please check your text messages and enter the 6 digit code below"
        center
      />

      {/* Verification Code Input */}
      <div className="w-full relative">
        <input
          id="code"
          type="text"
          maxLength={6}
          disabled={isLoading}
          {...register("code", {
            required: "Verification code is required",
            pattern: {
              value: /^\d{6}$/,
              message: "Please enter a valid 6-digit code",
            },
          })}
          placeholder="XXXXXX"
          className={`peer w-full p-4 text-center text-2xl tracking-widest font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed ${
            errors.code ? "border-red-500" : "border-neutral-300"
          } ${errors.code ? "focus:border-red-500" : "focus:border-black"}`}
        />
      </div>
      {errors.code && (
        <p className="text-red-500 text-sm text-center -mt-2">
          {errors.code.message as string}
        </p>
      )}

      {/* Help Text */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Didn&apos;t get a text? It can take a few minutes.
        </p>
        <button
          type="button"
          onClick={handleResendCode}
          disabled={isLoading}
          className="text-purple-600 hover:underline text-sm mt-2 font-medium"
        >
          Resend code
        </button>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={verifyPhoneModal.isOpen}
      title=""
      actionLabel="Verify"
      onClose={verifyPhoneModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
    />
  );
}

export default VerifyPhoneModal;
