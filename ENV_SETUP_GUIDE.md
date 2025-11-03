# 🔐 Environment Variables Setup Guide - OMG Rentals

This guide will help you set up all necessary environment variables for your OMG Rentals event space marketplace.

## 📋 Quick Start Checklist

- [ ] MongoDB Database
- [ ] NextAuth Secret
- [ ] Cloudinary Account (for images)
- [ ] Google OAuth (optional)
- [ ] Facebook OAuth (optional)
- [ ] IP Lookup Key (optional)

---

## 1️⃣ MongoDB Database (REQUIRED)

**What it's for:** Stores all your data (users, listings, reservations, availability)

### Setup Steps:

1. **Go to MongoDB Atlas:** https://cloud.mongodb.com/
2. **Sign up/Login** for a free account
3. **Create a new cluster:**
   - Click "Build a Database"
   - Choose "FREE" (M0 Shared cluster)
   - Select a cloud provider and region (closest to you)
   - Click "Create"

4. **Create a database user:**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `omgrentals` (or anything you want)
   - Password: Generate a secure password (save it!)
   - User Privileges: "Atlas admin"
   - Click "Add User"

5. **Whitelist your IP:**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add your specific IP
   - Click "Confirm"

6. **Get your connection string:**
   - Go back to "Database" tab
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `test` with `omg-rentals` (database name)

**Example connection string:**
```
mongodb+srv://omgrentals:MySecurePassword123@cluster0.abc123.mongodb.net/omg-rentals?retryWrites=true&w=majority
```

**Add to .env:**
```bash
DATABASE_URL="your-connection-string-here"
```

---

## 2️⃣ NextAuth Secret (REQUIRED)

**What it's for:** Secures your authentication system

### Setup Steps:

**Option 1 - Generate online:**
1. Go to: https://generate-secret.vercel.app/32
2. Copy the generated secret

**Option 2 - Generate in terminal:**
```bash
openssl rand -base64 32
```

**Add to .env:**
```bash
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

💡 **For production**, change `NEXTAUTH_URL` to your actual domain.

---

## 3️⃣ Cloudinary (REQUIRED)

**What it's for:** Stores and serves event space images

### Setup Steps:

1. **Go to Cloudinary:** https://cloudinary.com/
2. **Sign up** for a free account (1GB storage, 25GB bandwidth/month)
3. **Go to Dashboard:** https://cloudinary.com/console
4. **Find your "Cloud Name"** at the top of the dashboard
5. **Optional - Create upload preset:**
   - Go to Settings → Upload
   - Scroll to "Upload presets"
   - Click "Add upload preset"
   - Preset name: `omg-rentals`
   - Signing Mode: "Unsigned"
   - Click "Save"

**Add to .env:**
```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
```

💡 The `NEXT_PUBLIC_` prefix makes it available in the browser.

---

## 4️⃣ Google OAuth (OPTIONAL)

**What it's for:** "Sign in with Google" button

### Setup Steps:

1. **Go to Google Cloud Console:** https://console.cloud.google.com/
2. **Create a new project:**
   - Click project dropdown at top
   - Click "New Project"
   - Name: "OMG Rentals"
   - Click "Create"

3. **Enable Google+ API:**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click and enable it

4. **Create OAuth credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "OMG Rentals Web"
   - Authorized redirect URIs:
     - Add: `http://localhost:3000/api/auth/callback/google`
     - For production: `https://yourdomain.com/api/auth/callback/google`
   - Click "Create"

5. **Copy credentials:**
   - Copy "Client ID"
   - Copy "Client Secret"

**Add to .env:**
```bash
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

---

## 5️⃣ Facebook OAuth (OPTIONAL)

**What it's for:** "Sign in with Facebook" button

### Setup Steps:

1. **Go to Facebook Developers:** https://developers.facebook.com/
2. **Create an app:**
   - Click "My Apps" → "Create App"
   - Use case: "Authenticate and request data from users"
   - Click "Next"
   - Name: "OMG Rentals"
   - Click "Create app"

3. **Add Facebook Login:**
   - In dashboard, click "Add Product"
   - Find "Facebook Login" and click "Set Up"
   - Choose "Web"
   - Site URL: `http://localhost:3000`

4. **Configure OAuth redirect:**
   - Go to "Facebook Login" → "Settings"
   - Valid OAuth Redirect URIs:
     - Add: `http://localhost:3000/api/auth/callback/facebook`
   - Click "Save Changes"

5. **Get credentials:**
   - Go to "Settings" → "Basic"
   - Copy "App ID"
   - Click "Show" on "App Secret" and copy it

**Add to .env:**
```bash
FACEBOOK_ID="your-facebook-app-id"
FACEBOOK_SECRET="your-facebook-app-secret"
```

---

## 6️⃣ IP Lookup API (OPTIONAL)

**What it's for:** Automatically detects user's country/location

### Setup Steps:

1. **Go to Extreme IP Lookup:** https://extreme-ip-lookup.com/
2. **Sign up** for free account (10,000 requests/month)
3. **Get your API key** from dashboard

**Add to .env:**
```bash
NEXT_PUBLIC_LOOKUP_KEY="your-api-key"
```

---

## ✅ Final .env File Example

```bash
# Database
DATABASE_URL="mongodb+srv://omgrentals:MyPass123@cluster0.abc.mongodb.net/omg-rentals?retryWrites=true&w=majority"

# Auth
NEXTAUTH_SECRET="randomly-generated-32-character-secret"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="123456789-abc.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abcdefg123456"

# Facebook OAuth
FACEBOOK_ID="1234567890"
FACEBOOK_SECRET="abcdef123456"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="omg-rentals-cloud"

# IP Lookup
NEXT_PUBLIC_LOOKUP_KEY="abc123xyz"
```

---

## 🚀 After Setup

Once you've filled in your `.env` file:

1. **Push your database schema:**
   ```bash
   cd /home/user/webapp
   npx prisma db push
   ```

2. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   ```
   http://localhost:3000
   ```

---

## 🔒 Security Notes

- ✅ `.env` is in `.gitignore` - it won't be committed to git
- ✅ Never share your `.env` file publicly
- ✅ Use different credentials for development and production
- ✅ For production, use environment variables in your hosting platform
- ✅ Rotate secrets regularly

---

## 🆘 Troubleshooting

### "DATABASE_URL not found"
- Make sure `.env` file is in the root directory (`/home/user/webapp/.env`)
- Check that there are no spaces around the `=` sign
- Make sure the connection string has no typos

### "Authentication error"
- Verify your NEXTAUTH_SECRET is set
- Check that redirect URIs match exactly in Google/Facebook consoles

### "Image upload fails"
- Verify your Cloudinary cloud name is correct
- Check if you need to create an upload preset
- Make sure the variable starts with `NEXT_PUBLIC_`

### "Can't connect to MongoDB"
- Check that your IP is whitelisted in MongoDB Atlas
- Verify username and password are correct in connection string
- Make sure you replaced `<password>` placeholder

---

## 📚 Resources

- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [NextAuth.js Docs](https://next-auth.js.org/)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Facebook OAuth Setup](https://developers.facebook.com/docs/facebook-login)

---

## ✨ What's Required vs Optional?

### ✅ Required (Minimum to run):
1. `DATABASE_URL` - MongoDB connection
2. `NEXTAUTH_SECRET` - Auth security
3. `NEXTAUTH_URL` - App URL
4. `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Image uploads

### 🔷 Optional (Enhanced features):
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - Google login
- `FACEBOOK_ID` & `FACEBOOK_SECRET` - Facebook login  
- `NEXT_PUBLIC_LOOKUP_KEY` - Auto-detect location

**You can start with just the required ones and add optional features later!**
