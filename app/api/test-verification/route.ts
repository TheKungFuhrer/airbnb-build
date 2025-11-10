import { NextResponse } from "next/server";
import {
  sendVerificationEmail,
  sendVerificationSMS,
} from "@/lib/verification";

/**
 * TEST ENDPOINT - Remove this in production!
 * This endpoint helps debug Twilio Verify integration
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
      message: "Testing Twilio Verify integration",
      note: "Twilio generates and manages codes - you'll receive them via email/SMS",
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
      results.email = {
        testEmail: email,
        note: "Check your email inbox for the verification code from Twilio/SendGrid",
      };

      try {
        const sent = await sendVerificationEmail(email);
        results.email.result = sent ? "✅ Verification email sent via Twilio Verify" : "❌ Email sending failed";
        results.email.instructions = "Check your email for the code, then use POST /api/verify/email with the code";
        console.log(`Email send result: ${sent}`);
      } catch (error: any) {
        results.email.result = `❌ Send failed: ${error.message}`;
        results.email.error = error.message;
        console.error("Send error:", error);
      }
    }

    // Test SMS verification
    if (phone) {
      console.log(`🧪 Testing SMS verification for: ${phone}`);
      results.sms = {
        testPhone: phone,
        note: "Check your phone for the verification code from Twilio",
      };

      try {
        const sent = await sendVerificationSMS(phone);
        results.sms.result = sent ? "✅ Verification SMS sent via Twilio Verify" : "❌ SMS sending failed";
        results.sms.instructions = "Check your SMS for the code, then use POST /api/verify/phone with the code";
        console.log(`SMS send result: ${sent}`);
      } catch (error: any) {
        results.sms.result = `❌ Send failed: ${error.message}`;
        results.sms.error = error.message;
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
    message: "Twilio Verify test endpoint active",
    note: "Twilio Verify generates and manages verification codes automatically",
    environment: {
      TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID ? "✅ Set (length: " + process.env.TWILIO_ACCOUNT_SID.length + ")" : "❌ Missing",
      TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN ? "✅ Set (length: " + process.env.TWILIO_AUTH_TOKEN.length + ")" : "❌ Missing",
      TWILIO_VERIFY_SERVICE_SID: process.env.TWILIO_VERIFY_SERVICE_SID ? "✅ Set (length: " + process.env.TWILIO_VERIFY_SERVICE_SID.length + ")" : "❌ Missing",
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? "✅ Set (length: " + process.env.SENDGRID_API_KEY.length + ")" : "❌ Missing",
    },
    instructions: {
      POST: "Send { 'email': 'test@example.com' } or { 'phone': '+1234567890' } to test verification",
      note: "You'll receive the code via email/SMS. Check Twilio Console logs for details.",
      reminder: "Remove this endpoint in production!"
    }
  });
}
