"use client";

import { useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";

type Props = {};

function Logo({}: Props) {
  const router = useRouter();

  return (
    <div 
      onClick={() => router.push("/")} 
      className="cursor-pointer flex items-center"
    >
      {/* Desktop Logo - Optimized size for readability without overlap */}
      <div className="hidden md:block relative h-14 w-32">
        <Image
          src="/logos/logo-header.png"
          alt="OMG Rentals"
          fill
          className="object-contain object-left"
          priority
        />
      </div>
      
      {/* Mobile Logo - Compact but readable */}
      <div className="md:hidden relative h-11 w-24">
        <Image
          src="/logos/logo-header.png"
          alt="OMG Rentals"
          fill
          className="object-contain object-left"
          priority
        />
      </div>
    </div>
  );
}

export default Logo;
