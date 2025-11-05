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
      {/* Desktop Logo - Maximum size for full brand visibility */}
      <div className="hidden md:block relative h-24 w-64">
        <Image
          src="/logos/logo-header.png"
          alt="OMG Rentals"
          fill
          className="object-contain object-left"
          priority
        />
      </div>
      
      {/* Mobile Logo - Large enough to read "RENTALS" */}
      <div className="md:hidden relative h-16 w-44">
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
