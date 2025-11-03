# 🚀 OMG Rentals - Vercel Deployment Guide

## Quick Deployment (Recommended - 5 Minutes)

### Option 1: Deploy via Vercel Dashboard (Easiest!)

1. **Go to Vercel**
   - Visit: https://vercel.com/
   - Click "Sign Up" or "Log In" (use your GitHub account for easy integration)

2. **Import Your GitHub Repository**
   - Click "Add New..." → "Project"
   - Click "Import Git Repository"
   - Find and select: `TheKungFuhrer/airbnb-build`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)

4. **Add Environment Variables** (Click "Environment Variables")
   Add these exactly as shown:

   ```
   DATABASE_URL
   mongodb+srv://dylan:6FRn00PDBKqrGUYe@omgrentals.4bbxhlv.mongodb.net/omg-rentals?retryWrites=true&w=majority&appName=OMGRentals

   NEXTAUTH_SECRET
   tfJuxwuf5H8DEGgVSyGtBsp/ODWYcV3pmCWr49zOFNA=

   NEXTAUTH_URL
   https://omg-rentals.vercel.app

   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
   dvdn37uta
   ```

5. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes for build and deployment
   - You'll get a live URL like: `https://omg-rentals.vercel.app`

---

### Option 2: Deploy via Vercel CLI (Advanced)

```bash
# 1. Install Vercel CLI globally (if not already installed)
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy (from project directory)
cd /home/user/webapp
vercel

# 4. Follow prompts:
# - Set up and deploy: Y
# - Which scope: [your-account]
# - Link to existing project: N
# - Project name: omg-rentals
# - Directory: ./
# - Override settings: N

# 5. Set environment variables
vercel env add DATABASE_URL production
# Paste: mongodb+srv://dylan:6FRn00PDBKqrGUYe@omgrentals.4bbxhlv.mongodb.net/omg-rentals?retryWrites=true&w=majority&appName=OMGRentals

vercel env add NEXTAUTH_SECRET production
# Paste: tfJuxwuf5H8DEGgVSyGtBsp/ODWYcV3pmCWr49zOFNA=

vercel env add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME production
# Paste: dvdn37uta

# 6. Deploy to production
vercel --prod
```

---

## ✅ Post-Deployment Checklist

Once deployed:

1. **Update NEXTAUTH_URL**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Update `NEXTAUTH_URL` to your actual Vercel URL
   - Example: `https://omg-rentals.vercel.app` or your custom domain
   - Redeploy for changes to take effect

2. **Test Your App**
   - Visit your Vercel URL
   - Test homepage loads with all 50 listings
   - Try creating an account
   - Test image uploads with Cloudinary
   - Test creating a new listing

3. **Optional: Add Custom Domain**
   - In Vercel dashboard: Settings → Domains
   - Add your custom domain (e.g., `omgrentals.com`)
   - Update DNS records as instructed by Vercel
   - Update `NEXTAUTH_URL` to use your custom domain

---

## 🔧 Troubleshooting

### Build Errors
- **Error**: "Module not found"
  - Solution: Run `npm install` locally and commit `package-lock.json`

- **Error**: "Environment variable not set"
  - Solution: Double-check all environment variables in Vercel dashboard

### Runtime Errors
- **Error**: "Can't connect to database"
  - Solution: Verify `DATABASE_URL` is correct and MongoDB allows connections from `0.0.0.0/0`

- **Error**: "Authentication not working"
  - Solution: Ensure `NEXTAUTH_URL` matches your deployed URL exactly (with https://)

### Images Not Loading
- **Error**: External images blocked
  - Solution: Already configured in `next.config.js` - should work by default

---

## 📊 Monitoring Your Deployment

- **Analytics**: Vercel dashboard → Analytics tab
- **Logs**: Vercel dashboard → Deployments → [your-deployment] → Logs
- **Performance**: Vercel dashboard → Speed Insights

---

## 🎉 You're Live!

Your OMG Rentals marketplace is now live at:
- **Vercel URL**: `https://[your-project-name].vercel.app`
- **Custom Domain**: Configure in Vercel settings

Share your URL and start renting out event spaces! 🎊

---

## 📝 Notes

- **Automatic Deployments**: Every push to `master` or `genspark_ai_developer` branch will auto-deploy
- **Preview Deployments**: Every pull request gets its own preview URL
- **Free Tier**: Vercel's free tier is perfect for this project
- **Scaling**: Automatically scales based on traffic

---

Need help? Check the Vercel docs: https://vercel.com/docs
