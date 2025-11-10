import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import {
  generateVerificationCode,
  storeVerificationCode,
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

    // Generate and send email verification code
    const emailVerificationCode = generateVerificationCode();
    await storeVerificationCode(
      currentUser.email!,
      emailVerificationCode,
      "email",
      currentUser.id
    );
    await sendVerificationEmail(currentUser.email!, emailVerificationCode);

    // If phone number provided, generate and send SMS verification code
    let hasPhoneNumber = false;
    if (phoneNumber) {
      hasPhoneNumber = true;
      const phoneVerificationCode = generateVerificationCode();
      await storeVerificationCode(
        phoneNumber,
        phoneVerificationCode,
        "phone",
        currentUser.id
      );
      await sendVerificationSMS(phoneNumber, phoneVerificationCode);
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
