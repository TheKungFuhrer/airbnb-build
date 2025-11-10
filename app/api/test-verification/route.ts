import { NextResponse } from "next/server";
import {
  generateVerificationCode,
  storeVerificationCode,
  sendVerificationEmail,
  sendVerificationSMS,
} from "@/lib/verification";

/**
 * TEST ENDPOINT - Remove this in production!
 * This endpoint helps debug verification without creating new accounts
 * 
 * Usage:
 * POST /api/test-verification
 * Body: { "email": "test@example.com", "phone": "+1234567890" }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, phone } = body;

    const results: any = {
      timestamp: new Date().toISOString(),
      environment: {
        TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID ? "✅ Set" : "❌ Missing",
        TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN ? "✅ Set" : "❌ Missing",
        TWILIO_VERIFY_SERVICE_SID: process.env.TWILIO_VERIFY_SERVICE_SID ? "✅ Set" : "❌ Missing",
        SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? "✅ Set" : "❌ Missing",
      },
    };

    // Test email verification
    if (email) {
      console.log(`🧪 Testing email verification for: ${email}`);
      const emailCode = generateVerificationCode();
      results.email = {
        testEmail: email,
        generatedCode: emailCode,
      };

      try {
        await storeVerificationCode(email, emailCode, "email", "test-user-id");
        results.email.stored = "✅ Code stored in database";
        console.log(`✅ Code stored for ${email}: ${emailCode}`);
      } catch (error: any) {
        results.email.stored = `❌ Storage failed: ${error.message}`;
        console.error("Storage error:", error);
      }

      try {
        const sent = await sendVerificationEmail(email, emailCode);
        results.email.sent = sent ? "✅ Email sent via Twilio" : "❌ Email sending failed";
        console.log(`Email send result: ${sent}`);
      } catch (error: any) {
        results.email.sent = `❌ Send failed: ${error.message}`;
        console.error("Send error:", error);
      }
    }

    // Test SMS verification
    if (phone) {
      console.log(`🧪 Testing SMS verification for: ${phone}`);
      const phoneCode = generateVerificationCode();
      results.sms = {
        testPhone: phone,
        generatedCode: phoneCode,
      };

      try {
        await storeVerificationCode(phone, phoneCode, "phone", "test-user-id");
        results.sms.stored = "✅ Code stored in database";
        console.log(`✅ Code stored for ${phone}: ${phoneCode}`);
      } catch (error: any) {
        results.sms.stored = `❌ Storage failed: ${error.message}`;
        console.error("Storage error:", error);
      }

      try {
        const sent = await sendVerificationSMS(phone, phoneCode);
        results.sms.sent = sent ? "✅ SMS sent via Twilio" : "❌ SMS sending failed";
        console.log(`SMS send result: ${sent}`);
      } catch (error: any) {
        results.sms.sent = `❌ Send failed: ${error.message}`;
        console.error("Send error:", error);
      }
    }

    console.log("🧪 Test results:", JSON.stringify(results, null, 2));
    return NextResponse.json(results);
  } catch (error: any) {
    console.error("🧪 Test endpoint error:", error);
    return NextResponse.json(
      { 
        error: "Test failed", 
        message: error.message,
        stack: error.stack 
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check environment variables
export async function GET(request: Request) {
  return NextResponse.json({
    message: "Test endpoint active",
    environment: {
      TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID ? "✅ Set (length: " + process.env.TWILIO_ACCOUNT_SID.length + ")" : "❌ Missing",
      TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN ? "✅ Set (length: " + process.env.TWILIO_AUTH_TOKEN.length + ")" : "❌ Missing",
      TWILIO_VERIFY_SERVICE_SID: process.env.TWILIO_VERIFY_SERVICE_SID ? "✅ Set (length: " + process.env.TWILIO_VERIFY_SERVICE_SID.length + ")" : "❌ Missing",
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? "✅ Set (length: " + process.env.SENDGRID_API_KEY.length + ")" : "❌ Missing",
    },
    instructions: {
      POST: "Send { 'email': 'test@example.com' } or { 'phone': '+1234567890' } to test verification",
      note: "Remove this endpoint in production!"
    }
  });
}
