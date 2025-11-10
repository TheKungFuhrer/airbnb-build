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
 * Send verification email using Twilio Verify with SendGrid integration
 */
export async function sendVerificationEmail(
  email: string,
  code: string
): Promise<boolean> {
  try {
    // Use Twilio Verify API which is integrated with SendGrid
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

    if (!accountSid || !authToken || !serviceSid) {
      console.error("Missing Twilio credentials");
      console.log(`📧 [DEV MODE] Would send email to ${email} with code: ${code}`);
      return false;
    }

    const twilio = require("twilio");
    const client = twilio(accountSid, authToken);

    // Twilio Verify automatically sends the code using your SendGrid integration
    await client.verify.v2
      .services(serviceSid)
      .verifications.create({
        to: email,
        channel: "email",
        customCode: code,
      });

    console.log(`📧 Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    console.log(`📧 [FALLBACK] Logging code for ${email}: ${code}`);
    return false;
  }
}

/**
 * Send verification SMS using Twilio Verify
 */
export async function sendVerificationSMS(
  phoneNumber: string,
  code: string
): Promise<boolean> {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

    if (!accountSid || !authToken || !serviceSid) {
      console.error("Missing Twilio credentials");
      console.log(`📱 [DEV MODE] Would send SMS to ${phoneNumber} with code: ${code}`);
      return false;
    }

    const twilio = require("twilio");
    const client = twilio(accountSid, authToken);

    // Twilio Verify automatically sends the SMS
    await client.verify.v2
      .services(serviceSid)
      .verifications.create({
        to: phoneNumber,
        channel: "sms",
        customCode: code,
      });

    console.log(`📱 Verification SMS sent to ${phoneNumber}`);
    return true;
  } catch (error) {
    console.error("Error sending verification SMS:", error);
    console.log(`📱 [FALLBACK] Logging code for ${phoneNumber}: ${code}`);
    return false;
  }
}
