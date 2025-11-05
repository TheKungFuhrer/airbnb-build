"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
};

function Container({ children }: Props) {
  return (
    <div className="max-w-[3200px] mx-auto xl:px-16 lg:px-12 md:px-8 sm:px-4 px-3">
      {children}
    </div>
  );
}

export default Container;
