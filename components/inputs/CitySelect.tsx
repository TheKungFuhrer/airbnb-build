"use client";

import useCities from "@/hook/useCities";
import Select from "react-select";
import { HiLocationMarker } from "react-icons/hi";

export type CitySelectValue = {
  label: string;
  state: string;
  latlng: number[];
  region: string;
  value: string;
};

type Props = {
  value?: CitySelectValue;
  onChange: (value: CitySelectValue) => void;
};

function CitySelect({ value, onChange }: Props) {
  const { getAll } = useCities();

  return (
    <div>
      <Select
        placeholder="Any City"
        isClearable
        options={getAll()}
        value={value}
        onChange={(value) => onChange(value as CitySelectValue)}
        formatOptionLabel={(option: any) => (
          <div className="flex flex-row items-center gap-3">
            <div className="text-brand-black">
              <HiLocationMarker size={20} />
            </div>
            <div>
              {option.label},
              <span className="text-neutral-500 ml-1">{option.state}</span>
            </div>
          </div>
        )}
        classNames={{
          control: () => "p-3 border-2",
          input: () => "text-lg",
          option: () => "text-lg",
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary: "black",
            primary25: "#ffe4e6",
          },
        })}
      />
    </div>
  );
}

export default CitySelect;
