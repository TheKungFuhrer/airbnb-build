"use client";

import Container from "@/components/Container";
import Heading from "@/components/Heading";
import { SafeUser } from "@/types";
import axios from "axios";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type Props = {
  currentUser: SafeUser | null;
};

function ProfileClient({ currentUser }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(currentUser?.image || "");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FieldValues>({
    defaultValues: {
      firstName: currentUser?.name?.split(" ")[0] || "",
      lastName: currentUser?.name?.split(" ")[1] || "",
      email: currentUser?.email || "",
      phoneNumber: "",
      companyName: "",
      jobTitle: "",
    },
  });

  const handleUpload = useCallback(
    (result: any) => {
      setProfileImage(result.info.secure_url);
      setValue("image", result.info.secure_url);
    },
    [setValue]
  );

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    const submitData = {
      ...data,
      image: profileImage,
      name: `${data.firstName} ${data.lastName}`,
    };

    axios
      .put("/api/profile/update", submitData)
      .then(() => {
        toast.success("Profile updated successfully!");
        router.refresh();
      })
      .catch((err: any) => {
        console.error(err);
        toast.error("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Heading title="Account" subtitle="" />
          <button
            onClick={() => router.push("/profile/view")}
            className="px-4 py-2 border border-neutral-300 rounded-md hover:bg-gray-50 transition"
          >
            View Profile
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Profile Photo */}
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-gray-400"
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
                <CldUploadWidget
                  onUpload={handleUpload}
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "cptcecyi"}
                  options={{
                    maxFiles: 1,
                  }}
                >
                  {({ open }) => {
                    return (
                      <button
                        type="button"
                        onClick={() => open?.()}
                        className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 border border-gray-300 hover:bg-gray-50 transition"
                        disabled={isLoading}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </button>
                    );
                  }}
                </CldUploadWidget>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  First name
                </label>
                <input
                  {...register("firstName", { required: true })}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border-2 rounded-md outline-none transition border-neutral-300 focus:border-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Last name
                </label>
                <input
                  {...register("lastName", { required: true })}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border-2 rounded-md outline-none transition border-neutral-300 focus:border-black"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Phone number
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <span className="text-gray-500">🇺🇸</span>
                </div>
                <input
                  {...register("phoneNumber")}
                  type="tel"
                  disabled={isLoading}
                  placeholder="Add phone number"
                  className="w-full pl-14 pr-4 py-3 border-2 rounded-md outline-none transition border-neutral-300 focus:border-black"
                />
              </div>
              <p className="text-xs text-yellow-800 bg-yellow-50 border border-yellow-200 rounded p-3 mt-2 flex items-start gap-2">
                <span className="text-lg">ℹ️</span>
                <span>Add your number and never miss an update</span>
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <input
                  {...register("email")}
                  disabled={true}
                  className="w-full px-4 py-3 border-2 rounded-md outline-none bg-gray-50 border-neutral-300"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                  ✓
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Organization
                </label>
                <input
                  {...register("companyName")}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border-2 rounded-md outline-none transition border-neutral-300 focus:border-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Job title
                </label>
                <input
                  {...register("jobTitle")}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border-2 rounded-md outline-none transition border-neutral-300 focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="mb-6 pb-6 border-b">
            <h3 className="text-xl font-semibold mb-4">Notifications</h3>
            <div>
              <label className="block text-sm font-medium mb-3">
                Email preferences
              </label>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  {...register("emailPreferences")}
                  className="mt-1 h-4 w-4 rounded border-gray-300"
                />
                <label className="text-sm text-gray-700">
                  Send me exclusive deals, inspiration, news, and community
                  updates via email
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto px-8 py-3 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </Container>
  );
}

export default ProfileClient;
