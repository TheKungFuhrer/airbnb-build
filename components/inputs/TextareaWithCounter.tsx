"use client";

import React from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

type Props = {
  id: string;
  label: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  maxLength?: number;
  minLength?: number;
  rows?: number;
  placeholder?: string;
  helperText?: string;
};

function TextareaWithCounter({
  id,
  label,
  value = "",
  disabled,
  required,
  register,
  errors,
  maxLength = 1000,
  minLength,
  rows = 4,
  placeholder,
  helperText,
}: Props) {
  const currentLength = value?.length || 0;
  const isOverLimit = currentLength > maxLength;
  const isUnderMin = minLength && currentLength < minLength && currentLength > 0;

  return (
    <div className="w-full relative">
      <label
        className={`
          text-md
          font-medium
          ${errors[id] ? "text-rose-500" : "text-neutral-700"}
        `}
      >
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      {helperText && (
        <p className="text-sm text-neutral-500 mt-1 mb-2">{helperText}</p>
      )}
      <textarea
        id={id}
        disabled={disabled}
        {...register(id, {
          required: required ? `${label} is required` : false,
          maxLength: {
            value: maxLength,
            message: `Maximum ${maxLength} characters allowed`,
          },
          minLength: minLength
            ? {
                value: minLength,
                message: `Minimum ${minLength} characters required`,
              }
            : undefined,
        })}
        placeholder={placeholder}
        rows={rows}
        className={`
          peer
          w-full
          p-4
          pt-6
          font-light
          bg-white
          border-2
          rounded-md
          outline-none
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          ${errors[id] ? "border-rose-500" : "border-neutral-300"}
          ${errors[id] ? "focus:border-rose-500" : "focus:border-black"}
          resize-none
        `}
      />
      <div className="flex justify-between items-center mt-2">
        <div>
          {errors[id] && (
            <p className="text-sm text-rose-500">
              {errors[id]?.message as string}
            </p>
          )}
          {isUnderMin && !errors[id] && (
            <p className="text-sm text-amber-500">
              At least {minLength} characters recommended
            </p>
          )}
        </div>
        <p
          className={`
            text-sm
            ${isOverLimit ? "text-rose-500" : "text-neutral-500"}
          `}
        >
          {currentLength} / {maxLength}
        </p>
      </div>
    </div>
  );
}

export default TextareaWithCounter;
