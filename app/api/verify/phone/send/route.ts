import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { sendVerificationSMS } from "@/lib/verification";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!currentUser.phoneNumber) {
      return NextResponse.json(
        { error: "No phone number found. Please add a phone number first." },
        { status: 400 }
      );
    }

    // Validate phone number format (must start with +)
    if (!currentUser.phoneNumber.startsWith("+")) {
      return NextResponse.json(
        { error: "Phone number must include country code (e.g., +1234567890)" },
        { status: 400 }
      );
    }

    // Send verification via Twilio Verify
    const sent = await sendVerificationSMS(currentUser.phoneNumber);

    if (!sent) {
      return NextResponse.json(
        { error: "Failed to send verification code. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification code sent successfully",
    });
  } catch (error) {
    console.error("Error sending phone verification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
