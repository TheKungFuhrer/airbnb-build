"use client";

import useLoginModel from "@/hook/useLoginModal";
import useRegisterModal from "@/hook/useRegisterModal";
import useCompleteProfileModal from "@/hook/useCompleteProfileModal";
import axios from "axios";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { AiFillFacebook } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";

import { signIn } from "next-auth/react";
import Button from "../Button";
import Heading from "../Heading";
import Input from "../inputs/Input";
import Modal from "./Modal";

type Props = {};

function RegisterModal({}: Props) {
  const registerModel = useRegisterModal();
  const loginModel = useLoginModel();
  const completeProfileModal = useCompleteProfileModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
      optOutMarketing: false,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios
      .post("/api/register", data)
      .then(() => {
        toast.success("Account created successfully!");
        registerModel.onClose();
        completeProfileModal.onOpen();
      })
      .catch((err: any) => toast.error("Something Went Wrong"))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const toggle = useCallback(() => {
    loginModel.onOpen();
    registerModel.onClose();
  }, [loginModel, registerModel]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Welcome to OMG Rentals"
        subtitle="Create an Account!"
        center
      />
      <Input
        id="email"
        label="Email Address"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <div>
        <div className="w-full relative">
          <input
            id="password"
            type="password"
            disabled={isLoading}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Your password needs to be at least 8 characters long and include a number and a special character such as !@#$%^&*."
              },
              validate: (value) => {
                if (!/\d/.test(value)) {
                  return "Your password needs to be at least 8 characters long and include a number and a special character such as !@#$%^&*.";
                }
                if (!/[!@#$%^&*]/.test(value)) {
                  return "Your password needs to be at least 8 characters long and include a number and a special character such as !@#$%^&*.";
                }
                return true;
              }
            })}
            placeholder=" "
            className={`peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed pl-4 ${
              errors.password ? "border-red-500" : "border-neutral-300"
            } ${
              errors.password ? "focus:border-red-500" : "focus:border-black"
            }`}
          />
          <label
            className={`absolute text-md duration-150 transform -translate-y-3 top-5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${
              errors.password ? "text-red-500" : "text-zinc-400"
            }`}
          >
            Password
          </label>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">
            {errors.password.message as string}
          </p>
        )}
      </div>
      
      {/* Legal Agreement Text */}
      <div className="text-xs text-neutral-500 text-center mt-2">
        By clicking Sign Up, you agree to OMG Rentals&apos;s{" "}
        <a
          href="https://omg-rentals.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-800 hover:underline font-medium"
        >
          Terms & Conditions
        </a>{" "}
        and{" "}
        <a
          href="https://omg-rentals.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-800 hover:underline font-medium"
        >
          Privacy Policy
        </a>
        .
      </div>

      {/* Marketing Email Opt-out */}
      <div className="text-xs text-neutral-500 mt-2">
        OMG Rentals will send you deals, inspiration, and marketing emails. You can opt out at any time from your account settings.
      </div>

      <div className="flex items-start gap-2 mt-1">
        <input
          id="optOutMarketing"
          type="checkbox"
          disabled={isLoading}
          {...register("optOutMarketing")}
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-rose-500 focus:ring-rose-500 cursor-pointer"
        />
        <label
          htmlFor="optOutMarketing"
          className="text-xs text-neutral-700 cursor-pointer select-none"
        >
          I don&apos;t want to receive marketing emails from OMG Rentals.
        </label>
      </div>
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => signIn("google")}
      />
      <Button
        outline
        label="Continue with Facebook"
        icon={AiFillFacebook}
        onClick={() => signIn("facebook")}
        isColor
      />
      <div className="text-neutral-500 text-center mt-4 font-light">
        <div>
          Already have an account?{" "}
          <span
            onClick={toggle}
            className="text-neutral-800 cursor-pointer hover:underline"
          >
            Log in
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModel.isOpen}
      title="Register"
      actionLabel="Continue"
      onClose={registerModel.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
}

export default RegisterModal;
