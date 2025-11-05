"use client";

import React, { ReactNode } from "react";
import Masonry from "react-masonry-css";

interface MasonryGridProps {
  children: ReactNode;
  columns?: {
    default: number;
    640?: number;  // sm
    768?: number;  // md
    1024?: number; // lg
    1280?: number; // xl
    1536?: number; // 2xl
  };
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
      columnClassName={`masonry-grid-column`}
      style={{
        marginLeft: `-${gapPx}px`,
      }}
    >
      {children}
    </Masonry>
  );
};

export default MasonryGrid;
