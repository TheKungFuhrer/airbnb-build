import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
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

    const body = await request.json();
    const {
      firstName,
      lastName,
      companyName,
      jobTitle,
      phoneNumber,
      howDidYouHear,
      image,
    } = body;

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "First name and last name are required" },
        { status: 400 }
      );
    }

    if (!image) {
      return NextResponse.json(
        { error: "Profile photo is required" },
        { status: 400 }
      );
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: `${firstName} ${lastName}`,
        image,
        // Store additional fields in a JSON field or create separate fields
        // For now, we'll just update the basic fields
      },
    });

    // Generate verification code for email
    const emailVerificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    
    // TODO: Store verification code in database
    // TODO: Send verification email with code

    // If phone number provided, generate verification code for phone
    if (phoneNumber) {
      const phoneVerificationCode = Math.floor(1000 + Math.random() * 9000).toString();
      // TODO: Store verification code in database
      // TODO: Send SMS with code
    }

    return NextResponse.json({
      ...updatedUser,
      hasPhoneNumber: !!phoneNumber,
    });
  } catch (error) {
    console.error("Error completing profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
