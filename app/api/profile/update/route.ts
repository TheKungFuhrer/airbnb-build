import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function PUT(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, image, phoneNumber, companyName, jobTitle, emailPreferences } = body;

    // Check if phone number has changed
    const phoneChanged = phoneNumber !== undefined && phoneNumber !== currentUser.phoneNumber;

    // Prepare update data
    const updateData: any = {
      name,
      image,
      businessName: companyName || null,
      jobTitle: jobTitle || null,
    };

    // If phone number is provided or being cleared
    if (phoneNumber !== undefined) {
      updateData.phoneNumber = phoneNumber || null;
      
      // If phone number changed or cleared, remove verification
      if (phoneChanged || phoneNumber === null) {
        updateData.phoneVerified = null;
        console.log(`📞 Phone number changed for user ${currentUser.id}. Clearing verification status.`);
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: updateData,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
