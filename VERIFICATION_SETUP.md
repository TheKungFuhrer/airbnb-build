# Email & SMS Verification Setup Guide

This guide will help you complete the setup of email and SMS verification for OMG Rentals.

## 🎯 Overview

The verification system uses:
- **Twilio Verify** for both email and SMS verification
- **SendGrid** for email delivery (integrated with Twilio)
- **4-digit codes** with 15-minute expiration
- **One-time use** codes (deleted after verification)

## 📋 Prerequisites Checklist

You've already provided:
- ✅ SendGrid API Key
- ✅ SendGrid Template ID
- ✅ Twilio Service SID (Verify)
- ✅ Email Integration SID

Still needed:
- ⚠️ Twilio Account SID
- ⚠️ Twilio Auth Token

## 🔧 Step 1: Database Migration

Run the Prisma migration to add the VerificationToken table and phoneVerified field:

```bash
# On your local machine (where you have DATABASE_URL in .env)
npx prisma db push
```

This will:
- Add the `VerificationToken` model to MongoDB
- Add `phoneVerified` field to User model
- Enable verification code storage and validation

## 🔑 Step 2: Add Environment Variables

Add these to your **Vercel Project Settings** → **Environment Variables**:

### Required Variables

```bash
# Twilio Credentials (find these in your Twilio Console Dashboard)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here

# Twilio Verify Service SID (you already have this)
TWILIO_VERIFY_SERVICE_SID=VAb92d5ad88163e663d333b7a2e0350fce

# SendGrid API Key (you already have this - add it to Vercel)
SENDGRID_API_KEY=your_sendgrid_api_key_here
```

### Finding Your Twilio Credentials

1. Go to [Twilio Console Dashboard](https://console.twilio.com/)
2. You'll see:
   - **Account SID** - starts with "AC"
   - **Auth Token** - click "show" to reveal it

## 📧 Step 3: Configure SendGrid Template (Optional)

You have a SendGrid template ID: `d-5ef3a02be9fb4d6f932b4cad7377ffc0`

If you want to use a custom branded email template instead of the default Twilio/SendGrid email:

### Option A: Use Twilio's Default Email (Current Implementation)
The current code uses Twilio Verify's built-in email format. This is the **simplest** option and works out of the box.

### Option B: Use Custom SendGrid Template (Advanced)
To use your custom template, we'd need to modify the code to use SendGrid's API directly instead of Twilio Verify's email channel. Let me know if you want this!

## 🚀 Step 4: Deploy to Vercel

After adding the environment variables:

1. **Redeploy your Vercel project** (or it will auto-deploy on next push)
2. The new environment variables will be available
3. Verification emails and SMS will start working!

## 🧪 Step 5: Test the Flow

1. **Register a new account** with email and password
2. **Complete profile** with:
   - Profile photo (required)
   - First and last name (required)
   - Phone number (optional - if provided, SMS verification will be triggered)
3. **Email verification modal** appears with 4-digit code input
4. Check your email for the verification code
5. Enter the code to verify email
6. **Phone verification modal** appears (if you provided a phone number)
7. Check your SMS for the verification code
8. Enter the code to verify phone

## 🔍 Testing Checklist

- [ ] Email verification code received
- [ ] Email code successfully validates
- [ ] SMS verification code received (if phone provided)
- [ ] SMS code successfully validates
- [ ] Invalid code shows error message
- [ ] Expired code shows expired message (wait 15 minutes)
- [ ] Resend code functionality works for email
- [ ] Resend code functionality works for SMS
- [ ] User can skip phone verification if no phone provided

## 🐛 Troubleshooting

### No email received?
1. Check spam/junk folder
2. Verify `TWILIO_VERIFY_SERVICE_SID` is correct
3. Check Twilio Console → Verify → Logs for errors
4. Ensure SendGrid integration is active in Twilio

### No SMS received?
1. Verify phone number format: `+1234567890` (include country code)
2. Check Twilio Console → Verify → Logs for errors
3. Ensure you have SMS credits in Twilio

### Environment variables not working?
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Make sure variables are set for **all environments** (Production, Preview, Development)
3. **Redeploy** after adding variables - they only apply to new deployments

### Database errors?
1. Make sure you ran `npx prisma db push` locally
2. Check that your `DATABASE_URL` is correct in Vercel
3. Verify MongoDB Atlas is accessible

## 📊 Monitoring

Check verification activity:
- **Twilio Console** → Verify → Service → Logs
- **SendGrid Dashboard** → Activity Feed
- **Vercel Logs** → Function logs show verification attempts

## 💰 Cost Considerations

- **SendGrid**: Free tier includes 100 emails/day
- **Twilio Verify**: 
  - Email: $0.05 per verification
  - SMS: $0.05 per verification (US)
  - See [Twilio Verify Pricing](https://www.twilio.com/verify/pricing)

## 🎨 Customization Options

### Want a custom email template?
Let me know and I can update the code to use your SendGrid template directly:
- Template ID: `d-5ef3a02be9fb4d6f932b4cad7377ffc0`
- Will include your branding and design
- Requires switching from Twilio Verify email to SendGrid API

### Want to customize the SMS message?
Currently: "Your verification code is: 1234"
We can customize this message through Twilio Verify settings or by using Twilio Messaging API directly.

## ✅ Next Steps After Setup

Once verification is working:

1. **Update Terms & Conditions** link in RegisterModal
2. **Update Privacy Policy** link in RegisterModal
3. **Test with real users** in production
4. **Monitor verification success rates** in Twilio Console
5. **Set up alerts** for failed verifications

## 🆘 Need Help?

If you encounter any issues:
1. Check the Vercel function logs
2. Check Twilio Console logs
3. Let me know the specific error message

---

**Status**: ✅ Code is ready, just needs environment variables and database migration!
