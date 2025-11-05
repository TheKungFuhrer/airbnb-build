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
      {/* Desktop Logo - Large and prominent square logo */}
      <div className="hidden md:block relative h-20 w-56">
        <Image
          src="/logos/logo-header.png"
          alt="OMG Rentals"
          fill
          className="object-contain object-left"
          priority
        />
      </div>
      
      {/* Mobile Logo - Proportionally larger */}
      <div className="md:hidden relative h-14 w-40">
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
