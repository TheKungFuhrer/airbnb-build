import prisma from "@/lib/prismadb";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, name, password } = body;

  const hashedPassword = await bcrypt.hash(password, 12);

  // If no name provided, use the part of email before @
  const userName = name || email.split('@')[0];

  const user = await prisma.user.create({
    data: {
      email,
      name: userName,
      hashedPassword,
    },
  });

  return NextResponse.json(user);
}
