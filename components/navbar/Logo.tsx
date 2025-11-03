"use client";

import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

function Logo({}: Props) {
  const router = useRouter();

  return (
    <div 
      onClick={() => router.push("/")} 
      className="cursor-pointer"
    >
      <div className="hidden md:flex items-center gap-1">
        <span className="text-2xl font-bold text-rose-500">OMG</span>
        <span className="text-2xl font-light text-neutral-700">Rentals</span>
      </div>
      <div className="md:hidden flex items-center">
        <span className="text-xl font-bold text-rose-500">OMG</span>
      </div>
    </div>
  );
}

export default Logo;
