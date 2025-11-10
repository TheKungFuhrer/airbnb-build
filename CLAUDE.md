# CLAUDE.md - Project Context for AI Assistants

## Project Overview

**Event Space Rental Platform** (Not a traditional Airbnb clone!)

This is an hourly event space booking platform for photoshoots, meetings, parties, workshops, film production, and other events. Key difference from traditional Airbnb: **hourly rentals** with time-slot bookings, not overnight stays.

---

## Tech Stack Summary

### Frontend
- **Next.js 13.2.4** - App Router architecture (new model)
- **React 18.2.0** - UI library
- **TypeScript 5.0.3** - Type safety
- **TailwindCSS 3.3.1** - Utility-first CSS
- **Framer Motion 10.10.0** - Animations
- **React Hook Form 7.43.9** - Form state management
- **Zustand 4.3.7** - Global state (modals, UI)

### Backend & Database
- **Prisma 4.12.0** - ORM
- **MongoDB** - Database
- **NextAuth 4.20.1** - Authentication (Google, Facebook, Credentials)
  - Session strategy: JWT
  - Located in: `/pages/api/auth/[...nextauth].ts`

### Third-Party Services
- **Stripe** - Payment processing
- **Twilio 5.10.4** - Phone/SMS verification
- **Cloudinary** - Image uploads/CDN
- **Leaflet + React-Leaflet** - Interactive maps
- **SendGrid** - Email delivery (for verification)

### UI Libraries
- **React Icons** - Icon library
- **React Date Range** - Date/time pickers
- **React Select** - Enhanced dropdowns
- **React Toastify** - Toast notifications
- **React World Flags** - Country flags

---

## Key NPM Commands

```bash
# Development
npm run dev              # Start dev server (localhost:3000)

# Build & Production
npm run build            # Prisma generate + Next.js build
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npx prisma generate      # Generate Prisma Client (runs on postinstall)
npx prisma studio        # Open Prisma Studio GUI
npx prisma db push       # Push schema changes to MongoDB
npx prisma db seed       # Run seed scripts (if configured)
```

---

## Code Style Guidelines Observed

### Naming Conventions
- **Components**: PascalCase with default exports (`ListingCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useRentModal.ts`)
- **API Routes**: `route.ts` files in app directory
- **Types**: Mix of PascalCase and camelCase (inconsistent - see gotchas)

### Component Patterns
```typescript
// Standard functional component structure
"use client"; // Client components explicitly marked

import statements...

type Props = {
  // Props interface
};

function ComponentName({ props }: Props) {
  // Hooks
  // Event handlers (useCallback)
  // Memoized values (useMemo)
  // Early returns
  // JSX return
}

export default ComponentName;
```

### State Management
- **Zustand stores** for modal open/close state
- **React Hook Form** for complex form state
- **useState** for local component state
- **URL search params** for filters/search

### Form Handling
- React Hook Form with `register`, `watch`, `setValue`
- Multi-step forms use enum-based step tracking
- Custom `setCustomValue` helper for programmatic updates

### API Patterns
```typescript
// API route structure (Next.js 13 App Router)
import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/lib/prismadb";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.error();

  const body = await request.json();
  // ... validation and logic

  return NextResponse.json(data);
}
```

### Data Fetching
- **Server actions** in `/app/actions` for data fetching
- Server components fetch data directly (no client-side fetching)
- Date serialization: Prisma dates converted to ISO strings

---

## Important File Locations

### Configuration
- `/prisma/schema.prisma` - Database schema (models, relations)
- `/pages/api/auth/[...nextauth].ts` - Authentication config
- `/.env` - Environment variables (not in repo)
- `/tailwind.config.js` - Tailwind configuration
- `/tsconfig.json` - TypeScript configuration

### Core Application
- `/app` - Next.js 13 App Router
  - `/app/page.tsx` - Home page with listings
  - `/app/layout.tsx` - Root layout with providers
  - `/app/actions/*` - Server actions (data fetching)
  - `/app/api/*` - API route handlers

### Components
- `/components` - Reusable components
  - `/components/inputs/*` - Form inputs
  - `/components/listing/*` - Listing-related components
  - `/components/models/*` - Modal components (typo: should be "modals")
  - `/components/navbar/*` - Navigation components

### Utilities & Hooks
- `/hook/*` - Custom hooks (mostly Zustand stores)
- `/lib/prismadb.ts` - Prisma client singleton
- `/types.ts` - TypeScript type definitions

### Categories
- `/components/navbar/Categories.tsx` - 15 event space categories defined here

---

## Gotchas & Quirks

### 1. TYPO: Modals Folder
The modals folder is named `components/models` instead of `components/modals`. Don't get confused with database models!

### 2. Inconsistent Type Naming
```typescript
// types.ts has inconsistent casing:
safeListing   // lowercase 's'
SafeReservation  // uppercase 'S'
SafeUser      // uppercase 'S'
```

### 3. Hybrid Routing
- Main app uses **App Router** (`/app`)
- Auth still uses **Pages Router** (`/pages/api/auth`)
- This is intentional for NextAuth compatibility

### 4. Date Handling
Prisma returns `Date` objects, but server actions serialize to ISO strings:
```typescript
{
  ...currentUser,
  createdAt: currentUser.createdAt.toISOString(),
  updatedAt: currentUser.updatedAt.toISOString(),
}
```
Always expect string dates in components!

### 5. Error Handling Issues
```typescript
// Common pattern - returns generic 500 error:
if (!currentUser) {
  return NextResponse.error(); // Should use proper status codes!
}
```
Many API routes need better error handling with proper HTTP status codes.

### 6. Image Handling Inconsistency
- Schema supports `images: String[]` (multiple images)
- Most components only use `imageSrc: String` (single image)
- Frontend doesn't fully support multiple images yet

### 7. Location Data
- Originally used countries, now supports cities
- Components check both: `getCityByValue(data.locationValue) || getCountryByValue(data.locationValue)`
- Backward compatibility maintained

### 8. Hourly Pricing Model
```typescript
// Listings have:
hourlyRate: Int        // Price per hour
minimumHours: Int      // Minimum booking (default: 2)
cleaningFee: Int       // One-time fee

// Reservations store:
startTime: DateTime    // e.g., "2024-03-15 14:00"
endTime: DateTime      // e.g., "2024-03-15 18:00"
durationHours: Int     // Calculated hours
```

### 9. Dynamic Imports
Map component is dynamically imported to avoid SSR issues with Leaflet:
```typescript
const Map = useMemo(
  () => dynamic(() => import("../Map"), { ssr: false }),
  [location]
);
```

### 10. User Types
The app supports multiple user roles (in schema):
- `guest` - Regular users booking spaces
- `host` - Space owners
- `photographer` - Professional photographers
- `event_planner` - Event planners
- `meeting_organizer` - Corporate organizers

Currently all users default to "guest" on registration.

### 11. Verification Flow
- Email verification: SendGrid codes
- Phone verification: Twilio Verify API
- Codes stored in `VerificationToken` model
- **Security issue**: Codes not hashed in database

### 12. Stripe Integration
- `/app/api/create-checkout-session` - Creates checkout
- `/app/api/webhooks/stripe` - Handles payment events
- Reservation status updated via webhook
- Success redirect: `/booking/success`

### 13. No Validation Library
Currently no schema validation (Zod, Yup, etc.). Input validation is manual and minimal. **This should be added.**

### 14. Framer Motion Animations
ListingCard components have entrance animations. May impact performance with many listings.

### 15. Environment Variables Required
```bash
DATABASE_URL                          # MongoDB connection
NEXTAUTH_SECRET                       # JWT secret
NEXTAUTH_URL                          # App URL
GOOGLE_CLIENT_ID                      # Google OAuth
GOOGLE_CLIENT_SECRET                  # Google OAuth
FACEBOOK_ID                           # Facebook OAuth
FACEBOOK_SECRET                       # Facebook OAuth
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME     # Cloudinary
NEXT_PUBLIC_LOOKUP_KEY                # IP lookup API
# Twilio & SendGrid vars for verification
```

---

## Common Tasks

### Adding a New Modal
1. Create Zustand store in `/hook/useYourModal.ts`
2. Create modal component in `/components/models/YourModal.tsx`
3. Add to layout providers if needed

### Creating a New Listing Category
Edit `/components/navbar/Categories.tsx`:
```typescript
{
  label: "New Category",
  icon: IconComponent,
  description: "Category description"
}
```

### Adding an API Endpoint
Create `/app/api/your-endpoint/route.ts`:
```typescript
export async function POST(request: Request) {
  // Handler logic
}
```

### Adding a Server Action
Create `/app/actions/yourAction.ts`:
```typescript
export default async function yourAction() {
  // Fetch data
  return data;
}
```

---

## Testing

**Current state: No tests configured**

Recommended setup:
- Jest + React Testing Library for unit/integration tests
- Playwright or Cypress for E2E tests
- Test critical paths: booking flow, payment, authentication

---

## Deployment

- **Platform**: Vercel (optimized for Next.js)
- **Build command**: `npm run build` (includes Prisma generate)
- **Database**: MongoDB Atlas recommended
- **Environment**: Set all env vars in hosting platform

---

## Known Issues & TODOs

### Critical
- [ ] Add proper error handling with HTTP status codes
- [ ] Implement input validation (Zod recommended)
- [ ] Add rate limiting to API routes
- [ ] Hash verification codes before storing
- [ ] Fix type naming inconsistencies

### High Priority
- [ ] Complete multiple image upload/display
- [ ] Build availability calendar UI
- [ ] Add amenity selection to listing creation
- [ ] Implement booking status workflow
- [ ] Add search by time slots

### Nice to Have
- [ ] Rename `components/models` to `components/modals`
- [ ] Add comprehensive test coverage
- [ ] Implement caching strategy
- [ ] Add pagination to listings
- [ ] Create messaging system between hosts/guests
- [ ] Add reviews and ratings
- [ ] Email notifications for bookings

---

## Useful References

- [Next.js 13 Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Stripe API](https://stripe.com/docs/api)
- [Twilio Verify API](https://www.twilio.com/docs/verify/api)

---

**Last Updated**: 2025-11-10
**Project Version**: 0.1.0
