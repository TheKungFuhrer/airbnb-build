"use client";

import React, { useEffect, useRef, useState } from "react";
import { FieldErrors } from "react-hook-form";

type PlaceData = {
  address: string;
  unit?: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  fullAddress: string;
};

type Props = {
  value?: PlaceData | null;
  onChange: (value: PlaceData | null) => void;
  error?: FieldErrors;
};

function GooglePlacesInput({ value, onChange, error }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [unit, setUnit] = useState(value?.unit || "");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if Google Maps API is already loaded
    if (typeof window !== "undefined" && (window as any).google) {
      setIsLoaded(true);
      initAutocomplete();
    } else {
      // Load Google Maps API
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsLoaded(true);
        initAutocomplete();
      };
      document.head.appendChild(script);
    }
  }, []);

  const initAutocomplete = () => {
    if (!inputRef.current || !(window as any).google) return;

    const autocomplete = new (window as any).google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["address"],
        componentRestrictions: { country: "us" },
        fields: ["address_components", "geometry", "formatted_address"],
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.address_components) {
        return;
      }

      const addressComponents = place.address_components;
      let streetNumber = "";
      let route = "";
      let city = "";
      let state = "";
      let zipCode = "";

      addressComponents.forEach((component: any) => {
        const types = component.types;

        if (types.includes("street_number")) {
          streetNumber = component.long_name;
        }
        if (types.includes("route")) {
          route = component.long_name;
        }
        if (types.includes("locality")) {
          city = component.long_name;
        }
        if (types.includes("administrative_area_level_1")) {
          state = component.short_name;
        }
        if (types.includes("postal_code")) {
          zipCode = component.long_name;
        }
      });

      const address = `${streetNumber} ${route}`.trim();
      const latitude = place.geometry.location.lat();
      const longitude = place.geometry.location.lng();

      onChange({
        address,
        city,
        state,
        zipCode,
        latitude,
        longitude,
        fullAddress: place.formatted_address,
      });
    });
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUnit = e.target.value;
    setUnit(newUnit);
    if (value) {
      onChange({ ...value, unit: newUnit });
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter street address"
          defaultValue={value?.address || ""}
          className={`
            w-full
            p-4
            font-light
            bg-white
            border-2
            rounded-md
            outline-none
            transition
            ${error ? "border-rose-500" : "border-neutral-300"}
            ${error ? "focus:border-rose-500" : "focus:border-black"}
          `}
        />
        <label className="absolute text-md -top-3 left-4 bg-white px-1 text-zinc-400">
          Street Address <span className="text-rose-500">*</span>
        </label>
        {error && (
          <p className="text-sm text-rose-500 mt-1">Address is required</p>
        )}
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Apt, Suite, Floor (optional)"
          value={unit}
          onChange={handleUnitChange}
          className="
            w-full
            p-4
            font-light
            bg-white
            border-2
            border-neutral-300
            rounded-md
            outline-none
            transition
            focus:border-black
          "
        />
        <label className="absolute text-md -top-3 left-4 bg-white px-1 text-zinc-400">
          Unit / Apartment
        </label>
      </div>

      {value && (
        <div className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-md">
          <p>
            <span className="font-medium">City:</span> {value.city}
          </p>
          <p>
            <span className="font-medium">State:</span> {value.state}
          </p>
          <p>
            <span className="font-medium">ZIP:</span> {value.zipCode}
          </p>
        </div>
      )}

      {!isLoaded && (
        <p className="text-sm text-neutral-400">Loading address search...</p>
      )}
    </div>
  );
}

export default GooglePlacesInput;
