import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Generate new verification code
    const emailVerificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    
    // TODO: Store verification code in database
    // TODO: Send verification email with new code

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
