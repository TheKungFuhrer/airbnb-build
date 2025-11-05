"use client";

import React, { ReactNode } from "react";

interface MasonryGridProps {
  children: ReactNode;
  columns?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    "2xl"?: number;
  };
  gap?: number;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({
  children,
  columns = {
    default: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 3,
    "2xl": 4,
  },
  gap = 4,
}) => {
  const childrenArray = React.Children.toArray(children);

  // Generate responsive column classes
  const getColumnClasses = () => {
    const classes = [`gap-${gap}`];
    
    if (columns.default) classes.push(`columns-${columns.default}`);
    if (columns.sm) classes.push(`sm:columns-${columns.sm}`);
    if (columns.md) classes.push(`md:columns-${columns.md}`);
    if (columns.lg) classes.push(`lg:columns-${columns.lg}`);
    if (columns.xl) classes.push(`xl:columns-${columns.xl}`);
    if (columns["2xl"]) classes.push(`2xl:columns-${columns["2xl"]}`);
    
    return classes.join(" ");
  };

  return (
    <div className={`w-full ${getColumnClasses()}`}>
      {childrenArray.map((child, index) => (
        <div
          key={index}
          className="break-inside-avoid mb-4"
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
