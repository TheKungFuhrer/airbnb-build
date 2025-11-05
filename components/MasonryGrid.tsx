"use client";

import React, { ReactNode } from "react";
import Masonry from "react-masonry-css";

interface MasonryGridProps {
  children: ReactNode;
  columns?: number | { default: number; [key: number]: number };
  gap?: number;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({
  children,
  columns = {
    default: 2,
    640: 2,
    768: 3,
    1024: 3,
    1280: 4,
    1536: 4,
  },
  gap = 4,
}) => {
  // Convert gap to pixels (4 = 1rem = 16px)
  const gapPx = gap * 4;

  return (
    <Masonry
      breakpointCols={columns}
      className="flex w-full"
      columnClassName="masonry-grid-column"
      style={{
        marginLeft: `-${gapPx}px`,
      }}
    >
      {children}
    </Masonry>
  );
};

export default MasonryGrid;
