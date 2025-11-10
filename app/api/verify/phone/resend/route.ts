import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { resendVerificationSMS } from "@/lib/verification";

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
        { error: "No phone number found" },
        { status: 400 }
      );
    }

    // Resend verification via Twilio Verify
    // Twilio handles rate limiting automatically
    const sent = await resendVerificationSMS(currentUser.phoneNumber);

    if (!sent) {
      return NextResponse.json(
        { error: "Failed to resend verification code" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification code resent",
    });
  } catch (error) {
    console.error("Error resending phone verification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
