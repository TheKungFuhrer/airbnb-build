import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { verifyCode } from "@/lib/verification";

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

    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: "Verification code is required" },
        { status: 400 }
      );
    }

    // Verify the code using our utility function
    const result = await verifyCode(currentUser.phoneNumber, code, "phone");

    if (!result.valid) {
      if (result.expired) {
        return NextResponse.json(
          { error: "Verification code has expired. Please request a new code." },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Invalid verification code. Please try again." },
        { status: 400 }
      );
    }

    // Code is valid! Update user to mark phone as verified
    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        phoneVerified: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error verifying phone:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
