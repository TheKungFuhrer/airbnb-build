import ClientOnly from "@/components/ClientOnly";
import Footer from "@/components/Footer";
import ToastContainerBar from "@/components/ToastContainerBar";
import LoginModal from "@/components/models/LoginModal";
import RegisterModal from "@/components/models/RegisterModal";
import RentModal from "@/components/models/RentModal";
import CityModal from "@/components/models/CityModal";
import DateModal from "@/components/models/DateModal";
import GuestModal from "@/components/models/GuestModal";
import CompleteProfileModal from "@/components/models/CompleteProfileModal";
import VerifyEmailModal from "@/components/models/VerifyEmailModal";
import VerifyPhoneModal from "@/components/models/VerifyPhoneModal";
import PhoneInputModal from "@/components/models/PhoneInputModal";
import Navbar from "@/components/navbar/Navbar";
import { Nunito } from "next/font/google";
import "../styles/globals.css";
import getCurrentUser from "./actions/getCurrentUser";

export const metadata = {
  title: "OMG Rentals - Hourly Event Space Marketplace",
  description: "Book unique event spaces by the hour for photoshoots, meetings, parties, and more",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

const font = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={`${font.variable} font-sans`}>
        <ClientOnly>
          <ToastContainerBar />
          <CityModal />
          <DateModal />
          <GuestModal />
          <RegisterModal />
          <LoginModal />
          <RentModal />
          <CompleteProfileModal />
          <VerifyEmailModal />
          <VerifyPhoneModal />
          <PhoneInputModal />
          <Navbar currentUser={currentUser} />
        </ClientOnly>
        <div className="pb-20 pt-28">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
