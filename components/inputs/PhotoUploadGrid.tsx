"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { TbPhotoPlus } from "react-icons/tb";
import { MdClose, MdDragIndicator } from "react-icons/md";

type Props = {
  value: string[];
  onChange: (value: string[]) => void;
  minPhotos?: number;
  maxPhotos?: number;
};

declare global {
  var cloudinary: any;
}

function PhotoUploadGrid({ value = [], onChange, minPhotos = 5, maxPhotos = 50 }: Props) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleUpload = useCallback(
    (result: any) => {
      if (value.length < maxPhotos) {
        onChange([...value, result.info.secure_url]);
      }
    },
    [onChange, value, maxPhotos]
  );

  const handleDelete = useCallback(
    (index: number) => {
      const newPhotos = value.filter((_, i) => i !== index);
      onChange(newPhotos);
    },
    [value, onChange]
  );

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newPhotos = [...value];
    const draggedPhoto = newPhotos[draggedIndex];
    newPhotos.splice(draggedIndex, 1);
    newPhotos.splice(index, 0, draggedPhoto);

    onChange(newPhotos);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const isMinimumMet = value.length >= minPhotos;
  const canAddMore = value.length < maxPhotos;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-neutral-600">
            {value.length} of {maxPhotos} photos
          </p>
          {!isMinimumMet && (
            <p className="text-sm text-amber-600">
              Minimum {minPhotos} photos required ({minPhotos - value.length} more needed)
            </p>
          )}
        </div>
        {value.length > 0 && (
          <p className="text-xs text-neutral-500">Drag to reorder</p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {value.map((photo, index) => (
          <div
            key={`${photo}-${index}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`
              relative
              aspect-square
              rounded-lg
              overflow-hidden
              border-2
              ${draggedIndex === index ? "border-black" : "border-neutral-200"}
              cursor-move
              group
            `}
          >
            <Image
              src={photo}
              alt={`Photo ${index + 1}`}
              fill
              className="object-cover"
            />

            {/* Cover badge for first photo */}
            {index === 0 && (
              <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-md font-medium">
                Cover
              </div>
            )}

            {/* Drag indicator */}
            <div className="absolute top-2 right-2 bg-white/90 rounded-md p-1 opacity-0 group-hover:opacity-100 transition">
              <MdDragIndicator size={20} className="text-neutral-700" />
            </div>

            {/* Delete button */}
            <button
              onClick={() => handleDelete(index)}
              className="absolute bottom-2 right-2 bg-rose-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-rose-600"
            >
              <MdClose size={16} />
            </button>
          </div>
        ))}

        {/* Upload button */}
        {canAddMore && (
          <CldUploadWidget
            onSuccess={handleUpload}
            uploadPreset="pghsfmlk"
            options={{
              maxFiles: 1,
              clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
              maxImageFileSize: 5000000, // 5MB
              minImageWidth: 1024,
              minImageHeight: 683,
            }}
          >
            {({ open }) => {
              return (
                <div
                  onClick={() => open?.()}
                  className="
                    relative
                    aspect-square
                    rounded-lg
                    border-2
                    border-dashed
                    border-neutral-300
                    flex
                    flex-col
                    items-center
                    justify-center
                    gap-2
                    cursor-pointer
                    hover:border-neutral-400
                    transition
                    bg-neutral-50
                  "
                >
                  <TbPhotoPlus size={40} className="text-neutral-400" />
                  <p className="text-sm text-neutral-500 font-medium">
                    Add Photo
                  </p>
                </div>
              );
            }}
          </CldUploadWidget>
        )}
      </div>

      <div className="mt-4 text-sm text-neutral-500">
        <p>• First photo will be your listing's cover image</p>
        <p>• Drag photos to reorder them</p>
        <p>• Minimum resolution: 1024 x 683 pixels</p>
        <p>• Maximum file size: 5MB per photo</p>
      </div>
    </div>
  );
}

export default PhotoUploadGrid;
