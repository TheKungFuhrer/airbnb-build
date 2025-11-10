import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import {
  generateVerificationCode,
  storeVerificationCode,
  sendVerificationSMS,
} from "@/lib/verification";

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

    // Generate new verification code
    const phoneVerificationCode = generateVerificationCode();
    
    // Store verification code in database
    await storeVerificationCode(
      currentUser.phoneNumber,
      phoneVerificationCode,
      "phone",
      currentUser.id
    );

    // Send SMS with new code
    await sendVerificationSMS(currentUser.phoneNumber, phoneVerificationCode);

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
