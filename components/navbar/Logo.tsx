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
      className="cursor-pointer"
    >
      {/* Desktop Logo - Black version for light background */}
      <div className="hidden md:block relative h-12 w-40">
        <Image
          src="/logos/logo-light.png"
          alt="OMG Rentals"
          fill
          className="object-contain object-left"
          priority
        />
      </div>
      
      {/* Mobile Logo - Compact version */}
      <div className="md:hidden relative h-10 w-20">
        <Image
          src="/logos/logo-light.png"
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
