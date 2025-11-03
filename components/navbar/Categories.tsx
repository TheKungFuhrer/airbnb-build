"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { 
  MdOutlinePhotoCamera,
  MdMeetingRoom,
  MdCelebration,
  MdTheaterComedy,
  MdStorefront,
  MdMovie,
} from "react-icons/md";
import { 
  HiUserGroup,
  HiAcademicCap,
} from "react-icons/hi";
import { 
  BsCalendarEvent,
  BsPalette,
} from "react-icons/bs";
import { 
  FaMicrophoneAlt,
  FaDumbbell,
} from "react-icons/fa";
import { 
  GiPartyPopper,
  GiFilmProjector,
} from "react-icons/gi";
import { IoDiamond } from "react-icons/io5";
import CategoryBox from "../CategoryBox";
import Container from "../Container";

export const categories = [
  {
    label: "Photoshoot",
    icon: MdOutlinePhotoCamera,
    description: "Perfect space for photography sessions and content creation",
  },
  {
    label: "Meeting",
    icon: MdMeetingRoom,
    description: "Professional meeting rooms for business gatherings",
  },
  {
    label: "Party",
    icon: GiPartyPopper,
    description: "Celebrate in style with private party spaces",
  },
  {
    label: "Workshop",
    icon: HiAcademicCap,
    description: "Educational workshops and training sessions",
  },
  {
    label: "Popup",
    icon: MdStorefront,
    description: "Temporary retail spaces for pop-up shops",
  },
  {
    label: "Film Production",
    icon: GiFilmProjector,
    description: "Professional filming and video production spaces",
  },
  {
    label: "Corporate Event",
    icon: HiUserGroup,
    description: "Large corporate events and conferences",
  },
  {
    label: "Music Recording",
    icon: FaMicrophoneAlt,
    description: "Soundproof studios for music and podcast recording",
  },
  {
    label: "Art Exhibition",
    icon: BsPalette,
    description: "Gallery spaces for showcasing artwork",
  },
  {
    label: "Fitness Class",
    icon: FaDumbbell,
    description: "Spaces for yoga, dance, and fitness classes",
  },
  {
    label: "Performance",
    icon: MdTheaterComedy,
    description: "Stages and venues for live performances",
  },
  {
    label: "Social Event",
    icon: BsCalendarEvent,
    description: "Versatile spaces for social gatherings",
  },
  {
    label: "Product Launch",
    icon: MdCelebration,
    description: "Launch your products in memorable spaces",
  },
  {
    label: "Content Studio",
    icon: MdMovie,
    description: "Equipped studios for content creators",
  },
  {
    label: "Luxury Event",
    icon: IoDiamond,
    description: "Premium spaces for high-end events",
  },
];

type Props = {};

function Categories({}: Props) {
  const params = useSearchParams();
  const category = params?.get("category");
  const pathname = usePathname();

  const isMainPage = pathname === "/";

  if (!isMainPage) {
    return null;
  }

  return (
    <Container>
      <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
        {categories.map((items, index) => (
          <CategoryBox
            key={index}
            icon={items.icon}
            label={items.label}
            selected={category === items.label}
          />
        ))}
      </div>
    </Container>
  );
}

export default Categories;
