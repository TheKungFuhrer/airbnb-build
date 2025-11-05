"use client";

import useCities from "@/hook/useCities";
import useCountries from "@/hook/useCountries";
import { SafeUser, safeListing } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
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

  // Generate varied aspect ratios for natural Pinterest-style masonry
  // Using a deterministic pattern based on index for consistency
  const aspectRatio = useMemo(() => {
    const ratios = [
      { width: 3, height: 4 },   // Portrait
      { width: 4, height: 3 },   // Landscape
      { width: 1, height: 1 },   // Square
      { width: 3, height: 5 },   // Tall portrait
      { width: 4, height: 5 },   // Slightly tall
      { width: 5, height: 4 },   // Slightly wide
      { width: 16, height: 9 },  // Widescreen
    ];
    return ratios[index % ratios.length];
  }, [index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.03,
        ease: [0.4, 0, 0.2, 1],
      }}
      onClick={() => router.push(`/listings/${data.id}`)}
      className="relative cursor-pointer group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 w-full"
    >
      {/* Image with natural aspect ratio */}
      <div 
        className="w-full relative"
        style={{ paddingBottom: `${(aspectRatio.height / aspectRatio.width) * 100}%` }}
      >
        <div className="absolute inset-0">
          <Image
            fill
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            src={data.imageSrc}
            alt={data.title}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          {/* Heart Button */}
          <div className="absolute top-3 right-3 z-10">
            <HeartButton listingId={data.id} currentUser={currentUser} />
          </div>

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-bold text-base mb-1 line-clamp-2 drop-shadow-lg">
              {data.title}
            </h3>
            <p className="text-xs opacity-90 mb-2">
              {location?.region}, {location?.label}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-lg">${data.hourlyRate}</span>
              <span className="text-xs opacity-90">/hr</span>
            </div>
          </div>

          {/* Hover effect overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
      </div>
    </motion.div>
  );
}

export default PostCard;
