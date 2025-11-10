import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import {
  generateVerificationCode,
  storeVerificationCode,
  sendVerificationEmail,
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

    if (!currentUser.email) {
      return NextResponse.json(
        { error: "No email address found" },
        { status: 400 }
      );
    }

    // Generate new verification code
    const emailVerificationCode = generateVerificationCode();
    
    // Store verification code in database
    await storeVerificationCode(
      currentUser.email,
      emailVerificationCode,
      "email",
      currentUser.id
    );

    // Send verification email with new code
    await sendVerificationEmail(currentUser.email, emailVerificationCode);

    return NextResponse.json({
      success: true,
      message: "Verification code resent",
    });
  } catch (error) {
    console.error("Error resending email verification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
