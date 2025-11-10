import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import {
  sendVerificationEmail,
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
        phoneNumber: phoneNumber || null,
        businessName: companyName || null,
      },
    });

    // Send email verification via Twilio Verify
    // Twilio generates and manages the code
    const emailSent = await sendVerificationEmail(currentUser.email!);
    
    if (!emailSent) {
      console.error("Failed to send email verification");
      // Don't block profile completion, but log the error
    }

    // If phone number provided, send SMS verification via Twilio Verify
    let hasPhoneNumber = false;
    if (phoneNumber) {
      hasPhoneNumber = true;
      const smsSent = await sendVerificationSMS(phoneNumber);
      
      if (!smsSent) {
        console.error("Failed to send SMS verification");
        // Don't block profile completion, but log the error
      }
    }

    return NextResponse.json({
      ...updatedUser,
      hasPhoneNumber,
    });
  } catch (error) {
    console.error("Error completing profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
