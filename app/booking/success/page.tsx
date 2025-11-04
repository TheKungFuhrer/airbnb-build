"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { toast } from "react-toastify";

export default function BookingSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id");
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // Give webhook a moment to process
      setTimeout(() => {
        setIsProcessing(false);
        toast.success("Payment successful! Your booking is confirmed.");
      }, 2000);
    } else {
      setIsProcessing(false);
    }
  }, [sessionId]);

  return (
    <Container>
      <div className="max-w-2xl mx-auto mt-20 mb-20">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-500 mx-auto mb-4"></div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Processing your booking...
              </h1>
              <p className="text-gray-600">
                Please wait while we confirm your reservation.
              </p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Booking Confirmed!
              </h1>
              <p className="text-gray-600 mb-2">
                Your payment was successful and your booking has been confirmed.
              </p>
              <p className="text-gray-600 mb-8">
                You'll receive a confirmation email shortly with all the details.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  label="View My Trips"
                  onClick={() => router.push("/trips")}
                />
                <Button
                  label="Back to Home"
                  onClick={() => router.push("/")}
                  outline
                />
              </div>

              {sessionId && (
                <p className="text-xs text-gray-400 mt-8">
                  Session ID: {sessionId}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
