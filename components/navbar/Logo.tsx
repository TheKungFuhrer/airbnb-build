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
      {/* Desktop Logo */}
      <div className="hidden md:block relative h-12 w-48">
        <Image
          src="/logos/logo-header.png"
          alt="OMG Rentals"
          fill
          className="object-contain object-left"
          priority
        />
      </div>
      
      {/* Mobile Logo - Compact version */}
      <div className="md:hidden relative h-10 w-24">
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
