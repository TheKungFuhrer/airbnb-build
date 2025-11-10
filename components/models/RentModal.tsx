"use client";

import useRentModal from "@/hook/useRentModal";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  MdWifi, MdAcUnit, MdLocalParking, MdElevator, MdWc, MdTableBar, MdChair, MdMic,
  MdVideocam, MdLightbulb, MdKitchen, MdRestaurant, MdLocalFireDepartment, MdKitchenOutlined,
  MdOutlineWbSunny, MdTheaters, MdMeetingRoom, MdBrush, MdFace, MdCheckroom,
  MdHomeWork, MdStorefront, MdBusiness, MdWarehouse, MdDeck, MdYard, MdHome,
  MdCelebration, MdCorporateFare, MdMusicNote, MdSpeaker,
} from "react-icons/md";
import { FaCamera, FaVideo, FaTheaterMasks, FaUsers, FaChalkboardTeacher } from "react-icons/fa";

import Heading from "../Heading";
import Input from "../inputs/Input";
import Modal from "./Modal";
import GooglePlacesInput from "../inputs/GooglePlacesInput";
import MultiSelectCard from "../inputs/MultiSelectCard";
import TextareaWithCounter from "../inputs/TextareaWithCounter";
import Counter from "../inputs/Counter";
import PhotoUploadGrid from "../inputs/PhotoUploadGrid";
import DayTimeSelector from "../inputs/DayTimeSelector";
import RadioCard from "../inputs/RadioCard";
import AmenityGrid from "../inputs/AmenityGrid";
import PhoneInput from "../inputs/PhoneInput";
import ImageUpload from "../inputs/ImageUpload";

enum STEPS {
  ADDRESS = 0,
  SPACE_TYPE = 1,
  ABOUT = 2,
  PHOTOS = 3,
  HOURS = 4,
  CANCELLATION = 5,
  PRICING = 6,
  POLICIES = 7,
  HOST_PROFILE = 8,
}

const SPACE_TYPES = [
  { value: "studio", label: "Studio", icon: MdHomeWork },
  { value: "gallery", label: "Gallery", icon: MdTheaters },
  { value: "loft", label: "Loft", icon: MdBusiness },
  { value: "warehouse", label: "Warehouse", icon: MdWarehouse },
  { value: "rooftop", label: "Rooftop", icon: MdDeck },
  { value: "garden", label: "Garden/Outdoor", icon: MdYard },
  { value: "house", label: "House", icon: MdHome },
  { value: "event_space", label: "Event Space", icon: MdCelebration },
  { value: "office", label: "Office", icon: MdCorporateFare },
  { value: "restaurant", label: "Restaurant/Bar", icon: MdRestaurant },
  { value: "theater", label: "Theater", icon: FaTheaterMasks },
  { value: "other", label: "Other", icon: MdStorefront },
];

const ACTIVITY_OPTIONS = [
  { value: "photo_shoots", label: "Photo Shoots", icon: FaCamera },
  { value: "film_video", label: "Film/Video Production", icon: FaVideo },
  { value: "events", label: "Events", icon: MdCelebration },
  { value: "meetings", label: "Meetings", icon: MdMeetingRoom },
  { value: "classes", label: "Classes/Workshops", icon: FaChalkboardTeacher },
  { value: "other", label: "Other", icon: FaUsers },
];

const CANCELLATION_OPTIONS = [
  {
    value: "flexible",
    label: "Flexible",
    description: "Full refund up to 24 hours before event",
    details: "Guests can cancel up to 24 hours before the event start time for a full refund.",
  },
  {
    value: "moderate",
    label: "Moderate",
    description: "Full refund up to 7 days before event",
    details: "Full refund for cancellations up to 7 days before the event. 50% refund for cancellations 3-7 days before.",
  },
  {
    value: "strict",
    label: "Strict",
    description: "50% refund up to 30 days before event",
    details: "50% refund for cancellations up to 30 days before the event. No refund for cancellations less than 30 days before.",
  },
];

const BASIC_AMENITIES = [
  { value: "wifi", label: "WiFi", icon: MdWifi },
  { value: "ac", label: "Air Conditioning", icon: MdAcUnit },
  { value: "heating", label: "Heating", icon: MdLocalFireDepartment },
  { value: "parking", label: "Parking", icon: MdLocalParking },
  { value: "elevator", label: "Elevator", icon: MdElevator },
  { value: "restrooms", label: "Restrooms", icon: MdWc },
];

const EQUIPMENT_AMENITIES = [
  { value: "tables", label: "Tables", icon: MdTableBar },
  { value: "chairs", label: "Chairs", icon: MdChair },
  { value: "sound_system", label: "Sound System", icon: MdSpeaker },
  { value: "projector", label: "Projector", icon: MdVideocam },
  { value: "microphone", label: "Microphone", icon: MdMic },
  { value: "lighting", label: "Lighting Equipment", icon: MdLightbulb },
];

const KITCHEN_AMENITIES = [
  { value: "kitchen_access", label: "Kitchen Access", icon: MdKitchen },
  { value: "refrigerator", label: "Refrigerator", icon: MdKitchenOutlined },
  { value: "stove", label: "Stove/Oven", icon: MdLocalFireDepartment },
  { value: "dishes", label: "Dishes/Utensils", icon: MdRestaurant },
];

const OTHER_AMENITIES = [
  { value: "natural_light", label: "Natural Light", icon: MdOutlineWbSunny },
  { value: "backdrop", label: "Backdrop", icon: MdTheaters },
  { value: "green_room", label: "Green Room", icon: MdMeetingRoom },
  { value: "makeup_area", label: "Makeup Area", icon: MdFace },
  { value: "hair_styling", label: "Hair Styling Area", icon: MdBrush },
  { value: "props", label: "Props Available", icon: MdCheckroom },
];

function RentModal() {
  const router = useRouter();
  const rentModal = useRentModal();
  const [step, setStep] = useState(STEPS.ADDRESS);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<FieldValues>({
    defaultValues: {
      addressData: null,
      spaceTypes: [],
      allowedActivities: [],
      squareFootage: 500,
      title: "",
      detailedDescription: "",
      capacity: 10,
      images: [],
      schedule: {
        monday: { enabled: true, startTime: "08:00", endTime: "22:00" },
        tuesday: { enabled: true, startTime: "08:00", endTime: "22:00" },
        wednesday: { enabled: true, startTime: "08:00", endTime: "22:00" },
        thursday: { enabled: true, startTime: "08:00", endTime: "22:00" },
        friday: { enabled: true, startTime: "08:00", endTime: "22:00" },
        saturday: { enabled: true, startTime: "08:00", endTime: "22:00" },
        sunday: { enabled: true, startTime: "08:00", endTime: "22:00" },
      },
      minimumBookingDuration: "2",
      advanceNotice: "1_day",
      cancellationPolicy: "moderate",
      hourlyRate: 50,
      halfDayRate: null,
      fullDayRate: null,
      cleaningFee: 0,
      amenities: [],
      smokingAllowed: false,
      petsAllowed: false,
      alcoholAllowed: true,
      childrenAllowed: true,
      additionalRules: "",
      requiresInsurance: false,
      hostImage: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      hostBio: "",
      languages: ["English"],
    },
  });

  const addressData = watch("addressData");
  const spaceTypes = watch("spaceTypes");
  const allowedActivities = watch("allowedActivities");
  const squareFootage = watch("squareFootage");
  const title = watch("title");
  const detailedDescription = watch("detailedDescription");
  const capacity = watch("capacity");
  const images = watch("images");
  const schedule = watch("schedule");
  const minimumBookingDuration = watch("minimumBookingDuration");
  const advanceNotice = watch("advanceNotice");
  const cancellationPolicy = watch("cancellationPolicy");
  const hourlyRate = watch("hourlyRate");
  const halfDayRate = watch("halfDayRate");
  const fullDayRate = watch("fullDayRate");
  const cleaningFee = watch("cleaningFee");
  const amenities = watch("amenities");
  const smokingAllowed = watch("smokingAllowed");
  const petsAllowed = watch("petsAllowed");
  const alcoholAllowed = watch("alcoholAllowed");
  const childrenAllowed = watch("childrenAllowed");
  const additionalRules = watch("additionalRules");
  const requiresInsurance = watch("requiresInsurance");
  const hostImage = watch("hostImage");
  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const phoneNumber = watch("phoneNumber");
  const hostBio = watch("hostBio");

  const Map = useMemo(() => dynamic(() => import("../Map"), { ssr: false }), [addressData]);

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
  };

  useMemo(() => {
    if (hourlyRate && !halfDayRate) {
      setCustomValue("halfDayRate", Math.round(hourlyRate * 4 * 0.9));
    }
    if (hourlyRate && !fullDayRate) {
      setCustomValue("fullDayRate", Math.round(hourlyRate * 8 * 0.85));
    }
  }, [hourlyRate]);

  const onBack = () => setStep((value) => value - 1);
  const onNext = () => setStep((value) => value + 1);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (step !== STEPS.HOST_PROFILE) {
      return onNext();
    }

    setIsLoading(true);

    try {
      const listingData = {
        title: data.title,
        description: data.detailedDescription,
        imageSrc: data.images[0] || "",
        images: data.images,
        spaceTypes: data.spaceTypes,
        squareFootage: parseInt(data.squareFootage),
        capacity: parseInt(data.capacity),
        allowedActivities: data.allowedActivities,
        address: data.addressData?.address,
        unit: data.addressData?.unit,
        city: data.addressData?.city,
        state: data.addressData?.state,
        zipCode: data.addressData?.zipCode,
        latitude: data.addressData?.latitude,
        longitude: data.addressData?.longitude,
        locationValue: `${data.addressData?.city}, ${data.addressData?.state}`,
        hourlyRate: parseInt(data.hourlyRate) * 100,
        halfDayRate: data.halfDayRate ? parseInt(data.halfDayRate) * 100 : null,
        fullDayRate: data.fullDayRate ? parseInt(data.fullDayRate) * 100 : null,
        cleaningFee: parseInt(data.cleaningFee || 0) * 100,
        minimumHours: parseInt(data.minimumBookingDuration),
        amenities: data.amenities,
        advanceNotice: data.advanceNotice,
        cancellationPolicy: data.cancellationPolicy,
        smokingAllowed: data.smokingAllowed,
        petsAllowed: data.petsAllowed,
        alcoholAllowed: data.alcoholAllowed,
        childrenAllowed: data.childrenAllowed,
        rules: data.additionalRules ? [data.additionalRules] : [],
        requiresInsurance: data.requiresInsurance,
        hostProfile: {
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          image: data.hostImage,
          bio: data.hostBio,
          languages: data.languages,
        },
        schedule: data.schedule,
      };

      await axios.post("/api/listings", listingData);
      toast.success("Listing Created!");
      router.refresh();
      reset();
      setStep(STEPS.ADDRESS);
      rentModal.onClose();
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const actionLabel = useMemo(() => step === STEPS.HOST_PROFILE ? "Create Listing" : "Next", [step]);
  const secondaryActionLabel = useMemo(() => step === STEPS.ADDRESS ? undefined : "Back", [step]);

  let bodyContent = (
    <div className="flex flex-col gap-6">
      <Heading title="Where is your space located?" subtitle="Enter the street address so guests can find you" />
      <GooglePlacesInput value={addressData} onChange={(value) => setCustomValue("addressData", value)} error={errors.addressData} />
      {addressData && (
        <Map center={[addressData.latitude, addressData.longitude]} draggable
          onLocationChange={(lat: number, lng: number) => {
            setCustomValue("addressData", { ...addressData, latitude: lat, longitude: lng });
          }}
        />
      )}
    </div>
  );

  if (step === STEPS.SPACE_TYPE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <MultiSelectCard label="What type of space is this?" subtitle="Select all that apply"
          options={SPACE_TYPES} selectedValues={spaceTypes}
          onChange={(values) => setCustomValue("spaceTypes", values)} columns={3} />
        <hr />
        <MultiSelectCard label="What activities are allowed in your space?" subtitle="Select all that apply"
          options={ACTIVITY_OPTIONS} selectedValues={allowedActivities}
          onChange={(values) => setCustomValue("allowedActivities", values)} columns={2} />
        <hr />
        <Counter title="Square Footage" subtitle="Approximate size of your space"
          value={squareFootage} onChange={(value) => setCustomValue("squareFootage", value)} />
      </div>
    );
  }

  if (step === STEPS.ABOUT) {
    bodyContent = (
      <div className="flex flex-col gap-6">
        <Heading title="Tell guests about your space" subtitle="A great title and description help your listing stand out" />
        <Input id="title" label="Space Title" disabled={isLoading} register={register} errors={errors} required />
        <TextareaWithCounter id="detailedDescription" label="Detailed Description" value={detailedDescription}
          disabled={isLoading} register={register} errors={errors} required minLength={50} maxLength={2000} rows={6}
          helperText="Describe what makes your space special, what it's best suited for, and any unique features." />
        <div className="grid grid-cols-1 gap-2">
          <label className="text-md font-medium text-neutral-700">Guest Capacity <span className="text-rose-500">*</span></label>
          <select value={capacity} onChange={(e) => setCustomValue("capacity", parseInt(e.target.value))}
            className="px-4 py-3 border-2 border-neutral-300 rounded-md focus:border-black outline-none transition">
            {[...Array(21)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}+ guests</option>)}
          </select>
        </div>
      </div>
    );
  }

  if (step === STEPS.PHOTOS) {
    bodyContent = (
      <div className="flex flex-col gap-6">
        <Heading title="Add photos of your space" subtitle="High-quality photos help your listing get noticed. Upload at least 5 photos." />
        <PhotoUploadGrid value={images} onChange={(value) => setCustomValue("images", value)} minPhotos={5} maxPhotos={50} />
      </div>
    );
  }

  if (step === STEPS.HOURS) {
    bodyContent = (
      <div className="flex flex-col gap-6">
        <Heading title="When is your space available?" subtitle="Set your regular hours for each day of the week" />
        <DayTimeSelector schedule={schedule} onChange={(value) => setCustomValue("schedule", value)} />
        <hr />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Minimum Booking Duration</label>
            <select value={minimumBookingDuration} onChange={(e) => setCustomValue("minimumBookingDuration", e.target.value)}
              className="w-full px-4 py-3 border-2 border-neutral-300 rounded-md focus:border-black outline-none transition">
              <option value="1">1 hour</option>
              <option value="2">2 hours</option>
              <option value="3">3 hours</option>
              <option value="4">4 hours (Half day)</option>
              <option value="8">8 hours (Full day)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Advance Notice Required</label>
            <select value={advanceNotice} onChange={(e) => setCustomValue("advanceNotice", e.target.value)}
              className="w-full px-4 py-3 border-2 border-neutral-300 rounded-md focus:border-black outline-none transition">
              <option value="same_day">Same day</option>
              <option value="1_day">1 day</option>
              <option value="2_days">2 days</option>
              <option value="3_days">3 days</option>
              <option value="1_week">1 week</option>
              <option value="2_weeks">2 weeks</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  if (step === STEPS.CANCELLATION) {
    bodyContent = (
      <div className="flex flex-col gap-6">
        <Heading title="Choose your cancellation policy" subtitle="This determines how flexible you are with cancellations" />
        <RadioCard label="Cancellation Policy" options={CANCELLATION_OPTIONS} selectedValue={cancellationPolicy}
          onChange={(value) => setCustomValue("cancellationPolicy", value)} />
      </div>
    );
  }

  if (step === STEPS.PRICING) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="Set your pricing" subtitle="You can always change this later" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input id="hourlyRate" label="Hourly Rate" formatPrice type="number" disabled={isLoading} register={register} errors={errors} required />
          <Input id="halfDayRate" label="Half-Day Rate (4 hrs)" formatPrice type="number" disabled={isLoading} register={register} errors={errors} />
          <Input id="fullDayRate" label="Full-Day Rate (8+ hrs)" formatPrice type="number" disabled={isLoading} register={register} errors={errors} />
        </div>
        <Input id="cleaningFee" label="Cleaning Fee (Optional)" formatPrice type="number" disabled={isLoading} register={register} errors={errors} />
        <hr />
        <div className="space-y-6">
          <Heading title="What amenities does your space have?" subtitle="Select all that apply" />
          <AmenityGrid title="Basic Amenities" amenities={BASIC_AMENITIES} selectedValues={amenities}
            onChange={(values) => setCustomValue("amenities", values)} columns={3} />
          <AmenityGrid title="Equipment" amenities={EQUIPMENT_AMENITIES} selectedValues={amenities}
            onChange={(values) => setCustomValue("amenities", values)} columns={3} />
          <AmenityGrid title="Kitchen" amenities={KITCHEN_AMENITIES} selectedValues={amenities}
            onChange={(values) => setCustomValue("amenities", values)} columns={2} />
          <AmenityGrid title="Other Features" amenities={OTHER_AMENITIES} selectedValues={amenities}
            onChange={(values) => setCustomValue("amenities", values)} columns={3} />
        </div>
      </div>
    );
  }

  if (step === STEPS.POLICIES) {
    bodyContent = (
      <div className="flex flex-col gap-6">
        <Heading title="Set your house rules" subtitle="Let guests know what's allowed in your space" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: "smokingAllowed", label: "Smoking Allowed?", value: smokingAllowed },
            { key: "petsAllowed", label: "Pets Allowed?", value: petsAllowed },
            { key: "alcoholAllowed", label: "Alcohol Allowed?", value: alcoholAllowed },
            { key: "childrenAllowed", label: "Children Allowed?", value: childrenAllowed },
          ].map((rule) => (
            <div key={rule.key} className="flex items-center justify-between p-4 border-2 border-neutral-200 rounded-lg">
              <label className="font-medium text-neutral-700">{rule.label}</label>
              <div className="flex gap-4">
                <button type="button" onClick={() => setCustomValue(rule.key, true)}
                  className={`px-4 py-2 rounded-md transition ${rule.value ? "bg-black text-white" : "bg-neutral-100 text-neutral-600"}`}>Yes</button>
                <button type="button" onClick={() => setCustomValue(rule.key, false)}
                  className={`px-4 py-2 rounded-md transition ${!rule.value ? "bg-black text-white" : "bg-neutral-100 text-neutral-600"}`}>No</button>
              </div>
            </div>
          ))}
        </div>
        <TextareaWithCounter id="additionalRules" label="Additional House Rules" value={additionalRules} disabled={isLoading}
          register={register} errors={errors} maxLength={500} rows={4} placeholder="Any other rules or requirements guests should know about..." />
        <div className="flex items-center gap-3 p-4 border-2 border-neutral-200 rounded-lg">
          <input type="checkbox" checked={requiresInsurance} onChange={(e) => setCustomValue("requiresInsurance", e.target.checked)}
            className="w-5 h-5 text-black border-neutral-300 rounded focus:ring-black cursor-pointer" />
          <label className="font-medium text-neutral-700">Require guests to have event insurance</label>
        </div>
      </div>
    );
  }

  if (step === STEPS.HOST_PROFILE) {
    bodyContent = (
      <div className="flex flex-col gap-6">
        <Heading title="Complete your host profile" subtitle="This information helps build trust with potential guests" />
        <div className="flex justify-center">
          <ImageUpload value={hostImage} onChange={(value) => setCustomValue("hostImage", value)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input id="firstName" label="First Name" disabled={isLoading} register={register} errors={errors} required />
          <Input id="lastName" label="Last Name" disabled={isLoading} register={register} errors={errors} required />
        </div>
        <PhoneInput id="phoneNumber" label="Phone Number" value={phoneNumber} disabled={isLoading} register={register} errors={errors} required
          onChange={(value) => setCustomValue("phoneNumber", value)} />
        <TextareaWithCounter id="hostBio" label="About You" value={hostBio} disabled={isLoading} register={register} errors={errors}
          required minLength={50} maxLength={500} rows={4} helperText="Tell guests about yourself and why you're excited to host them" />
      </div>
    );
  }

  return (
    <Modal disabled={isLoading} isOpen={rentModal.isOpen} title="List your event space" actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)} secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.ADDRESS ? undefined : onBack} onClose={rentModal.onClose} body={bodyContent} />
  );
}

export default RentModal;
