import prisma from "./prismadb";

/**
 * Generate a 4-digit verification code
 */
export function generateVerificationCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * Store verification code in database
 * @param identifier - email or phone number
 * @param code - 4-digit code
 * @param type - "email" or "phone"
 * @param userId - optional user ID
 */
export async function storeVerificationCode(
  identifier: string,
  code: string,
  type: "email" | "phone",
  userId?: string
) {
  // Code expires in 15 minutes
  const expires = new Date(Date.now() + 15 * 60 * 1000);

  // Delete any existing codes for this identifier
  await prisma.verificationToken.deleteMany({
    where: {
      identifier,
      type,
    },
  });

  // Create new verification token
  return await prisma.verificationToken.create({
    data: {
      identifier,
      token: code,
      type,
      userId,
      expires,
    },
  });
}

/**
 * Verify a code
 * @param identifier - email or phone number
 * @param code - 4-digit code to verify
 * @param type - "email" or "phone"
 */
export async function verifyCode(
  identifier: string,
  code: string,
  type: "email" | "phone"
): Promise<{ valid: boolean; expired?: boolean }> {
  const token = await prisma.verificationToken.findUnique({
    where: {
      identifier_type: {
        identifier,
        type,
      },
    },
  });

  if (!token) {
    return { valid: false };
  }

  // Check if expired
  if (token.expires < new Date()) {
    // Delete expired token
    await prisma.verificationToken.delete({
      where: {
        id: token.id,
      },
    });
    return { valid: false, expired: true };
  }

  // Check if code matches
  if (token.token !== code) {
    return { valid: false };
  }

  // Code is valid! Delete it (one-time use)
  await prisma.verificationToken.delete({
    where: {
      id: token.id,
    },
  });

  return { valid: true };
}

/**
 * Send verification email
 * This is a placeholder - you'll need to implement with your email service
 * Options: SendGrid, AWS SES, Resend, Mailgun, etc.
 */
export async function sendVerificationEmail(
  email: string,
  code: string
): Promise<boolean> {
  console.log(`📧 Sending verification email to ${email} with code: ${code}`);
  
  // TODO: Implement with your email service
  // Example with SendGrid:
  /*
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  const msg = {
    to: email,
    from: 'verify@omg-rentals.com',
    subject: 'Verify your OMG Rentals account',
    text: `Your verification code is: ${code}`,
    html: `<strong>Your verification code is: ${code}</strong>`,
  };
  
  await sgMail.send(msg);
  */
  
  // For development, just log it
  return true;
}

/**
 * Send verification SMS
 * This is a placeholder - you'll need to implement with your SMS service
 * Options: Twilio, AWS SNS, MessageBird, etc.
 */
export async function sendVerificationSMS(
  phoneNumber: string,
  code: string
): Promise<boolean> {
  console.log(`📱 Sending verification SMS to ${phoneNumber} with code: ${code}`);
  
  // TODO: Implement with your SMS service
  // Example with Twilio:
  /*
  const twilio = require('twilio');
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  
  await client.messages.create({
    body: `Your OMG Rentals verification code is: ${code}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber,
  });
  */
  
  // For development, just log it
  return true;
}
