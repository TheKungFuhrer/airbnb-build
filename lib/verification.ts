/**
 * Twilio Verify Integration
 * 
 * This module uses Twilio Verify API to handle email and SMS verification.
 * Twilio manages code generation, storage, expiration, and delivery.
 * 
 * Benefits:
 * - No need to store codes in our database
 * - Automatic retry logic and rate limiting
 * - Built-in expiration handling (10 minutes default)
 * - Unified logging in Twilio Console
 * - SendGrid integration for email delivery
 */

/**
 * Initialize Twilio Verify client
 */
function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

  if (!accountSid || !authToken || !serviceSid) {
    throw new Error("Missing Twilio Verify credentials");
  }

  const twilio = require("twilio");
  return {
    client: twilio(accountSid, authToken),
    serviceSid,
  };
}

/**
 * Send verification email using Twilio Verify
 * Twilio generates the code and sends it via SendGrid
 * 
 * @param email - Email address to send verification to
 * @returns Promise<boolean> - True if sent successfully
 */
export async function sendVerificationEmail(email: string): Promise<boolean> {
  try {
    const { client, serviceSid } = getTwilioClient();

    // Twilio Verify generates and sends the code
    const verification = await client.verify.v2
      .services(serviceSid)
      .verifications.create({
        to: email,
        channel: "email",
      });

    console.log(`📧 Verification email sent to ${email}`);
    console.log(`   Status: ${verification.status}`);
    console.log(`   SID: ${verification.sid}`);
    
    return verification.status === "pending";
  } catch (error: any) {
    console.error("Error sending verification email:", error);
    console.error(`   Error code: ${error.code}`);
    console.error(`   Error message: ${error.message}`);
    return false;
  }
}

/**
 * Send verification SMS using Twilio Verify
 * Twilio generates the code and sends it via SMS
 * 
 * @param phoneNumber - Phone number to send verification to (must include country code, e.g., +1234567890)
 * @returns Promise<boolean> - True if sent successfully
 */
export async function sendVerificationSMS(phoneNumber: string): Promise<boolean> {
  try {
    const { client, serviceSid } = getTwilioClient();

    // Twilio Verify generates and sends the code
    const verification = await client.verify.v2
      .services(serviceSid)
      .verifications.create({
        to: phoneNumber,
        channel: "sms",
      });

    console.log(`📱 Verification SMS sent to ${phoneNumber}`);
    console.log(`   Status: ${verification.status}`);
    console.log(`   SID: ${verification.sid}`);
    
    return verification.status === "pending";
  } catch (error: any) {
    console.error("Error sending verification SMS:", error);
    console.error(`   Error code: ${error.code}`);
    console.error(`   Error message: ${error.message}`);
    return false;
  }
}

/**
 * Verify a code submitted by the user
 * Checks the code against Twilio Verify's system
 * 
 * @param identifier - Email or phone number
 * @param code - The verification code entered by user
 * @param type - "email" or "phone" (for logging purposes)
 * @returns Promise with validation result
 */
export async function verifyCode(
  identifier: string,
  code: string,
  type: "email" | "phone"
): Promise<{ valid: boolean; expired?: boolean; error?: string }> {
  try {
    const { client, serviceSid } = getTwilioClient();

    // Check the code against Twilio Verify
    const verificationCheck = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({
        to: identifier,
        code: code,
      });

    console.log(`🔍 Verification check for ${identifier}`);
    console.log(`   Status: ${verificationCheck.status}`);
    console.log(`   Valid: ${verificationCheck.valid}`);

    if (verificationCheck.status === "approved") {
      return { valid: true };
    } else {
      return { 
        valid: false, 
        error: "Invalid verification code" 
      };
    }
  } catch (error: any) {
    console.error(`Error verifying ${type} code:`, error);
    console.error(`   Error code: ${error.code}`);
    console.error(`   Error message: ${error.message}`);

    // Check if the error is due to expired verification
    if (error.code === 60202 || error.code === 60203) {
      return { 
        valid: false, 
        expired: true,
        error: "Verification code has expired" 
      };
    }

    // Check if max attempts exceeded
    if (error.code === 60202) {
      return {
        valid: false,
        error: "Too many failed attempts. Please request a new code."
      };
    }

    return { 
      valid: false, 
      error: error.message || "Verification failed" 
    };
  }
}

/**
 * Resend verification email
 * Cancels any pending verifications and sends a new one
 * 
 * @param email - Email address
 * @returns Promise<boolean> - True if sent successfully
 */
export async function resendVerificationEmail(email: string): Promise<boolean> {
  // Twilio Verify automatically handles rate limiting
  // Just send a new verification
  return sendVerificationEmail(email);
}

/**
 * Resend verification SMS
 * Cancels any pending verifications and sends a new one
 * 
 * @param phoneNumber - Phone number with country code
 * @returns Promise<boolean> - True if sent successfully
 */
export async function resendVerificationSMS(phoneNumber: string): Promise<boolean> {
  // Twilio Verify automatically handles rate limiting
  // Just send a new verification
  return sendVerificationSMS(phoneNumber);
}
