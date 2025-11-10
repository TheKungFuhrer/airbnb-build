# Debugging Verification Issues 🔍

## Quick Diagnosis

You mentioned emails aren't being sent and Twilio logs show nothing. Here are the most likely causes:

## 🚨 Most Common Issues

### 1. Environment Variables Not Loaded in Vercel ⚠️ (Most Likely)

**Symptom**: No errors, but nothing happens
**Cause**: Vercel environment variables aren't applied to the deployment

**Solution**:
1. Go to Vercel → Your Project → Settings → Environment Variables
2. Verify ALL 4 variables are set:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_VERIFY_SERVICE_SID`
   - `SENDGRID_API_KEY`
3. **Important**: Make sure they're checked for "Production" AND "Preview"
4. **Critical**: After adding/changing env vars, you MUST redeploy!
   - Go to Deployments tab
   - Click "..." on latest deployment → Redeploy
   - Or push a new commit

**How to verify**: Use the test endpoint (PR #13):
```bash
curl https://your-domain.vercel.app/api/test-verification
```

If it shows "❌ Missing" for any variable, they're not loaded!

---

### 2. Twilio Verify Service Not Configured for Email 📧

**Symptom**: SMS works but email doesn't
**Cause**: Twilio Verify service doesn't have email channel enabled

**Solution**:
1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to: **Verify** → **Services**
3. Click on your service (VAb92d5ad88163e663d333b7a2e0350fce)
4. Check **Email Integration** section:
   - Should show SendGrid as integrated
   - Status should be "Active"
   - If not, click "Add Email Integration" and connect SendGrid

---

### 3. SendGrid Integration Not Active in Twilio

**Symptom**: Twilio API succeeds but no email sent
**Cause**: SendGrid integration exists but isn't active/verified

**Solution**:
1. In Twilio Console → Verify → Your Service
2. Go to **Email Integration** tab
3. Verify:
   - ✅ Integration Status: Active
   - ✅ SendGrid API Key: Connected
   - ✅ From Email: Set and verified
4. If "From Email" isn't verified:
   - Go to SendGrid Dashboard
   - Navigate to Settings → Sender Authentication
   - Verify your sender email address

---

### 4. Incorrect Twilio Credentials

**Symptom**: API errors in logs
**Cause**: Wrong Account SID or Auth Token

**Solution**:
1. Go to [Twilio Console Dashboard](https://console.twilio.com/)
2. You'll see at the top:
   - **Account SID**: Starts with "AC..." (34 characters)
   - **Auth Token**: Click "Show" to reveal (32 characters)
3. Compare with your Vercel environment variables
4. If different, update in Vercel and redeploy

---

### 5. Wrong Service SID

**Symptom**: Error like "Service not found"
**Cause**: Using wrong Verify Service SID

**Solution**:
1. Go to Twilio Console → Verify → Services
2. Click on your service
3. Copy the Service SID (should be: VAb92d5ad88163e663d333b7a2e0350fce)
4. Verify it matches `TWILIO_VERIFY_SERVICE_SID` in Vercel
5. If different, update and redeploy

---

## 🧪 Using the Test Endpoint (PR #13)

After merging PR #13, you can test without creating accounts:

### Step 1: Check Environment Variables
```bash
# Replace with your actual domain
curl https://your-app.vercel.app/api/test-verification
```

**Expected Response**:
```json
{
  "message": "Test endpoint active",
  "environment": {
    "TWILIO_ACCOUNT_SID": "✅ Set (length: 34)",
    "TWILIO_AUTH_TOKEN": "✅ Set (length: 32)",
    "TWILIO_VERIFY_SERVICE_SID": "✅ Set (length: 34)",
    "SENDGRID_API_KEY": "✅ Set (length: 69)"
  }
}
```

If you see "❌ Missing" for any → Environment variables aren't loaded!

---

### Step 2: Test Email Sending
```bash
curl -X POST https://your-app.vercel.app/api/test-verification \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com"}'
```

**Expected Response**:
```json
{
  "timestamp": "2025-11-10T...",
  "environment": {
    "TWILIO_ACCOUNT_SID": "✅ Set",
    "TWILIO_AUTH_TOKEN": "✅ Set",
    "TWILIO_VERIFY_SERVICE_SID": "✅ Set",
    "SENDGRID_API_KEY": "✅ Set"
  },
  "email": {
    "testEmail": "your-email@example.com",
    "generatedCode": "1234",
    "stored": "✅ Code stored in database",
    "sent": "✅ Email sent via Twilio"
  }
}
```

**If you see errors**:
- Check the error message in the response
- Check Vercel Function Logs
- Check Twilio Console → Verify → Logs

---

### Step 3: Test SMS Sending
```bash
curl -X POST https://your-app.vercel.app/api/test-verification \
  -H "Content-Type: application/json" \
  -d '{"phone":"+1234567890"}'
```

(Include country code with the + sign)

---

## 📱 Testing the Real Flow (Faster Method)

Instead of creating new accounts each time:

### Option 1: Use Test Endpoint (Recommended)
- See above - test without any account creation
- Get the code in the response
- Test email delivery directly

### Option 2: Check Verification Codes in Database
Use MongoDB Compass or Atlas UI to view the `VerificationToken` collection:
```javascript
// Find codes for your email
db.VerificationToken.find({ identifier: "your@email.com" })
```

You'll see the 4-digit code that was generated!

### Option 3: Console Logs
Check Vercel Function Logs:
1. Go to Vercel Dashboard → Your Project → Logs
2. Filter by "/api/profile/complete"
3. Look for console.log output showing generated codes

---

## 🔍 Checking Twilio Logs

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to: **Monitor** → **Logs** → **Verify**
3. Or directly: **Verify** → **Services** → Your Service → **Logs**
4. Look for recent verification attempts
5. Check for errors or warnings

**If you see nothing in logs** → API calls aren't reaching Twilio (env vars issue)

---

## 🎯 Step-by-Step Debugging Process

### Step 1: Verify Environment Variables
```bash
curl https://your-app.vercel.app/api/test-verification
```
- [ ] All 4 variables show "✅ Set"
- [ ] Lengths look correct (34, 32, 34, 69 chars)

If not → Update Vercel env vars and **redeploy**!

---

### Step 2: Test Email Sending
```bash
curl -X POST https://your-app.vercel.app/api/test-verification \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com"}'
```
- [ ] Environment shows all "✅ Set"
- [ ] Code generated (4 digits)
- [ ] Code stored in database
- [ ] Email sent via Twilio

If storage fails → Database issue (check DATABASE_URL)
If send fails → Check error message, verify Twilio/SendGrid config

---

### Step 3: Check Email Inbox
- [ ] Email received
- [ ] Code in email matches generated code
- [ ] Email from SendGrid/Twilio

If no email → Check spam, verify SendGrid integration in Twilio

---

### Step 4: Check Twilio Console
- [ ] Verification attempt appears in logs
- [ ] Status is "approved" or "pending"
- [ ] No error messages

If nothing in logs → API calls not reaching Twilio (env vars issue)

---

## 🆘 Still Not Working?

After trying the above, if it still doesn't work, share:

1. **Test endpoint GET response** (shows env var status)
2. **Test endpoint POST response** (shows detailed error)
3. **Vercel function logs** (from Vercel dashboard)
4. **Twilio Console logs** (screenshot if possible)
5. **Screenshot of Vercel environment variables** (show they're set, not the values)

With this info, I can pinpoint the exact issue!

---

## 💡 Pro Tips

### Faster Testing
- Use the test endpoint instead of creating accounts
- Keep Twilio Console logs open in another tab
- Use Vercel's real-time function logs

### Common Gotchas
- ⚠️ Environment variables require redeploy to take effect
- ⚠️ Phone numbers must include country code (+1 for US)
- ⚠️ Email "From" address must be verified in SendGrid
- ⚠️ Twilio Verify service must have email channel enabled

### Production Checklist
- [ ] Remove test endpoint after debugging
- [ ] Verify all environment variables are set
- [ ] Test with real email addresses
- [ ] Test with real phone numbers
- [ ] Check spam folder for emails
- [ ] Monitor Twilio usage/costs

---

**Most likely issue**: Environment variables not loaded. Merge PR #13, check the test endpoint, and let me know what it shows! 🚀
