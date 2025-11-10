# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**OMG Rentals** - An event space rental marketplace built with Next.js 13. Users can book unique event spaces by the hour for photoshoots, meetings, parties, workshops, and more. This is a full-stack application with an hourly booking model (not nightly like traditional Airbnb).

**Tech Stack:**
- Next.js 13 with App Router
- TypeScript
- Prisma ORM with MongoDB
- NextAuth.js (Google, Facebook, Credentials)
- Tailwind CSS
- Cloudinary (image uploads)
- Stripe (payments)
- Twilio Verify + SendGrid (email/SMS verification)
- Zustand (state management)

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev                    # Starts on http://localhost:3000

# Build for production
npm run build                  # Runs prisma generate + next build

# Start production server
npm start

# Lint code
npm run lint

# Prisma commands (run manually)
npx prisma generate            # Generate Prisma client
npx prisma db push             # Push schema changes to MongoDB
npx prisma studio              # Open Prisma Studio GUI
```

## Environment Variables

Required environment variables (see `.env.example`):
- `DATABASE_URL` - MongoDB connection string
- `NEXTAUTH_SECRET` - Secret for NextAuth.js
- `NEXTAUTH_URL` - Application URL
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - OAuth
- `FACEBOOK_ID` / `FACEBOOK_SECRET` - OAuth
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Image uploads
- `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_VERIFY_SERVICE_SID` - Verification
- `SENDGRID_API_KEY` - Email via SendGrid
- `STRIPE_SECRET_KEY` - Payment processing

## Architecture Overview

### Directory Structure

```
app/
├── actions/              # Server actions for data fetching
├── api/                  # API routes (Next.js 13 App Router)
│   ├── listings/        # CRUD for event space listings
│   ├── reservations/    # Booking management
│   ├── verify/          # Email/phone verification
│   ├── profile/         # User profile updates
│   └── webhooks/        # Stripe webhooks
├── booking/             # Booking flow pages
├── favorites/           # User favorites
├── listings/[id]/       # Individual listing detail pages
├── profile/             # User profile pages
├── properties/          # Host's listings
├── reservations/        # Host's booking requests
├── trips/               # User's booked trips
├── layout.tsx           # Root layout with modals/navbar
└── page.tsx             # Homepage

components/
├── models/              # Modal dialogs (Login, Register, RentModal, etc.)
├── navbar/              # Navigation and category filters
├── inputs/              # Form input components
└── listing/             # Listing card and detail components

lib/
├── prismadb.ts          # Prisma client singleton
├── stripe.ts            # Stripe client
└── verification.ts      # Twilio Verify helper functions

hook/                    # Custom React hooks (Zustand stores)
prisma/schema.prisma     # Database schema
```

### Database Models

**Key Models (MongoDB via Prisma):**

1. **User** - Authentication, profile info, user types (guest/host/photographer/event_planner)
2. **Listing** - Event spaces with hourly pricing, amenities, capacity, location
3. **Reservation** - Hourly bookings with start/end times, pricing breakdown, Stripe integration
4. **Availability** - Space availability schedule (day of week + time blocks)
5. **VerificationToken** - Email/phone verification codes (Twilio Verify)
6. **Account** - NextAuth provider accounts

**Important Schema Details:**
- Listings use **hourly pricing model** (`hourlyRate`, `minimumHours`, `durationHours`)
- Categories: Photoshoot, Meeting, Party, Workshop, Popup, Film Production, etc. (15 total)
- Amenities stored as arrays: `lighting[]`, `equipment[]`, `furniture[]`, `amenities[]`
- Location uses `locationValue` (city) + optional `address`, `floor`, `accessInstructions`

### Authentication & Authorization

- NextAuth.js with JWT strategy
- Providers: Google, Facebook, Credentials (email/password with bcrypt)
- Protected routes via middleware: `/trips`, `/reservations`, `/properties`, `/favorites`
- Server-side session validation using `getCurrentUser()` action
- Email and phone verification via Twilio Verify (optional but encouraged)

### State Management

- **Zustand stores** in `hook/` directory for modal state management
- Modal stores: `useLoginModal`, `useRegisterModal`, `useRentModal`, `useSearchModal`, etc.
- Favorites use optimistic UI updates via `useFavorite` hook

### API Route Patterns

All API routes in `app/api/*/route.ts`:
1. Validate user session via `getCurrentUser()`
2. Parse request body/params
3. Validate required fields
4. Perform Prisma operations
5. Return `NextResponse.json()` or `NextResponse.error()`

Example: `app/api/listings/route.ts` POST handler creates new listings

### Image Handling

- **Cloudinary** for image uploads (component: next-cloudinary)
- Multiple images supported for listings (`imageSrc` + `images[]` array)
- Configured domains in `next.config.js`: cloudinary, googleusercontent, unsplash

### Payment Flow

1. User selects hourly booking time
2. Frontend calculates pricing (hourly rate × hours + cleaning fee + service fee)
3. Creates Stripe checkout session via `app/api/create-checkout-session/route.ts`
4. Redirects to Stripe hosted checkout
5. Webhook handler (`app/api/webhooks/stripe/route.ts`) confirms payment and updates reservation status

### Verification System

- Twilio Verify integration for email/SMS codes
- 6-digit verification codes
- API endpoints: `/api/verify/email`, `/api/verify/phone`
- See `lib/verification.ts` for helper functions
- Native Twilio Verify code generation (not custom)

## Key Development Patterns

1. **Server Components by Default** - Use `"use client"` directive only when needed (hooks, interactivity)
2. **Server Actions** - Data fetching in `app/actions/` directory, called from Server Components
3. **Type Safety** - Custom safe types in `types.ts` (safeListing, SafeUser, SafeReservation)
4. **Form Handling** - React Hook Form with custom input components
5. **Toast Notifications** - react-toastify with custom ToastContainerBar
6. **Date Handling** - date-fns library, react-date-range for date pickers
7. **Maps** - Leaflet with react-leaflet for location display
8. **Animations** - Framer Motion for smooth transitions

## Testing Data

- `peerspace_listings.csv` - Contains sample listing data (13MB)
- `scripts/` directory has data import/migration scripts
- Currently has 50+ pre-populated listings in production database

## Important Notes

- **Hourly model**: All pricing is per hour, not per night (minimum 2 hours)
- **Categories**: 15 event categories defined in `components/navbar/Categories.tsx`
- **User types**: guest, host, photographer, event_planner, meeting_organizer
- **Booking status**: pending, confirmed, completed, cancelled
- **Middleware protection**: Authentication required for trips, reservations, properties, favorites
- **Profile completion**: Users are prompted to complete profile after registration (job title, phone)

## Deployment

- Vercel deployment (see `DEPLOYMENT_GUIDE.md`)
- Auto-deploy on push to main branch
- Environment variables must be set in Vercel dashboard
- Build command includes Prisma generation: `prisma generate && next build`
