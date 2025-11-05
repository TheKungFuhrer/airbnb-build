"use client";

import useCities from "@/hook/useCities";
import useCountries from "@/hook/useCountries";
import { SafeUser, safeListing } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import HeartButton from "../HeartButton";

type Props = {
  data: safeListing;
  currentUser?: SafeUser | null;
  index?: number;
};

function PostCard({ data, currentUser, index = 0 }: Props) {
  const router = useRouter();
  const { getByValue: getCityByValue } = useCities();
  const { getByValue: getCountryByValue } = useCountries();

  // Try cities first, fall back to countries for backwards compatibility
  const location = getCityByValue(data.locationValue) || getCountryByValue(data.locationValue);

  // Generate random heights for masonry effect (between 250px and 450px)
  const heights = [250, 280, 320, 350, 380, 420, 450];
  const randomHeight = heights[index % heights.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1],
      }}
      onClick={() => router.push(`/listings/${data.id}`)}
      className="relative cursor-pointer group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
      style={{ height: `${randomHeight}px` }}
    >
      {/* Image */}
      <div className="w-full h-full relative">
        <Image
          fill
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          src={data.imageSrc}
          alt={data.title}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Heart Button */}
        <div className="absolute top-3 right-3 z-10">
          <HeartButton listingId={data.id} currentUser={currentUser} />
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-bold text-lg mb-1 line-clamp-2 drop-shadow-lg">
            {data.title}
          </h3>
          <p className="text-sm opacity-90 mb-2">
            {location?.region}, {location?.label}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-xl">${data.hourlyRate}</span>
            <span className="text-sm opacity-90">/hr</span>
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
    </motion.div>
  );
}

export default PostCard;
