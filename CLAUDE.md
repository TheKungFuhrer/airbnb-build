# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 0 — Purpose

These rules ensure maintainability, safety, and developer velocity.
**MUST** rules are non-negotiable; **SHOULD** rules are strongly recommended.

---

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

---

## Implementation Best Practices

### 1 — Before Coding

- **BP-1 (MUST)** Ask the user clarifying questions.
- **BP-2 (SHOULD)** Draft and confirm an approach for complex work.
- **BP-3 (SHOULD)** If ≥ 2 approaches exist, list clear pros and cons.

### 2 — While Coding

- **C-1 (SHOULD)** Follow TDD when appropriate: scaffold stub → write test → implement.
- **C-2 (MUST)** Name functions with existing domain vocabulary for consistency (e.g., `listing`, `reservation`, `hourlyRate`).
- **C-3 (SHOULD NOT)** Introduce classes when small testable functions suffice.
- **C-4 (SHOULD)** Prefer simple, composable, testable functions.
- **C-5 (MUST)** Prefer branded `type`s for IDs when type safety is critical:
  ```ts
  type UserId = Brand<string, 'UserId'>   // ✅ Good
  type UserId = string                    // ❌ Bad
  ```
- **C-6 (MUST)** Use `import type { … }` for type-only imports.
- **C-7 (SHOULD NOT)** Add comments except for critical caveats; rely on self-explanatory code.
- **C-8 (SHOULD)** Default to `type`; use `interface` only when more readable or interface merging is required.
- **C-9 (SHOULD NOT)** Extract a new function unless:
  - It will be reused elsewhere
  - It's the only way to unit-test otherwise untestable logic
  - It drastically improves readability of an opaque block

### 3 — Testing

- **T-1 (SHOULD)** Colocate unit tests in `*.spec.ts` or `*.test.ts` in same directory as source file.
- **T-2 (SHOULD)** For API changes, add/extend integration tests.
- **T-3 (MUST)** ALWAYS separate pure-logic unit tests from DB-touching integration tests.
- **T-4 (SHOULD)** Prefer integration tests over heavy mocking.
- **T-5 (SHOULD)** Unit-test complex algorithms thoroughly.
- **T-6 (SHOULD)** Test the entire structure in one assertion if possible:
  ```ts
  expect(result).toEqual([value]) // ✅ Good

  expect(result).toHaveLength(1); // ❌ Bad
  expect(result[0]).toBe(value);  // ❌ Bad
  ```

### 4 — Database

- **D-1 (MUST)** Use Prisma client from `lib/prismadb.ts` singleton.
- **D-2 (SHOULD)** Type database operations with proper Prisma types from `@prisma/client`.
- **D-3 (MUST)** Handle Prisma errors gracefully in API routes.
- **D-4 (SHOULD)** Use Prisma transactions for operations that need atomicity.

### 5 — Code Organization

- **O-1 (MUST)** Place reusable utilities in `lib/` directory.
- **O-2 (MUST)** Place server actions in `app/actions/` directory.
- **O-3 (MUST)** Place API routes in `app/api/[resource]/route.ts`.
- **O-4 (MUST)** Place React hooks in `hook/` directory.
- **O-5 (MUST)** Place reusable components in `components/` directory with appropriate subdirectory.

### 6 — Tooling Gates

- **G-1 (MUST)** `npm run lint` passes (ESLint for Next.js).
- **G-2 (SHOULD)** Run `npx prettier --write .` before committing.
- **G-3 (SHOULD)** Run `npm run build` to ensure TypeScript compilation succeeds.

### 7 — Git

- **GH-1 (MUST)** Use Conventional Commits format: https://www.conventionalcommits.org/en/v1.0.0
- **GH-2 (SHOULD NOT)** Refer to Claude or Anthropic in commit messages.
- **GH-3 (MUST)** Commit message structure:
  ```
  <type>[optional scope]: <description>
  [optional body]
  [optional footer(s)]
  ```
- **GH-4 (MUST)** Use appropriate commit types:
  - `fix:` - patches a bug (PATCH in Semantic Versioning)
  - `feat:` - introduces a new feature (MINOR in Semantic Versioning)
  - `BREAKING CHANGE:` - introduces breaking changes (MAJOR in Semantic Versioning)
  - Other types: `build:`, `chore:`, `ci:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`

---

## Writing Functions Best Practices

When evaluating whether a function you implemented is good or not, use this checklist:

1. Can you read the function and HONESTLY easily follow what it's doing? If yes, then stop here.
2. Does the function have very high cyclomatic complexity? (number of independent paths, or number of nested if-else). If it does, then it's probably sketchy.
3. Are there any common data structures and algorithms that would make this function much easier to follow and more robust? Parsers, trees, stacks/queues, etc.
4. Are there any unused parameters in the function?
5. Are there any unnecessary type casts that can be moved to function arguments?
6. Is the function easily testable without mocking core features (e.g., Prisma queries, Stripe calls)? If not, can this function be tested as part of an integration test?
7. Does it have any hidden untested dependencies or any values that can be factored out into the arguments instead? Only care about non-trivial dependencies that can actually change or affect the function.
8. Brainstorm 3 better function names and see if the current name is the best, consistent with rest of codebase.

**IMPORTANT:** You SHOULD NOT refactor out a separate function unless there is a compelling need, such as:
- The refactored function is used in more than one place
- The refactored function is easily unit testable while the original function is not AND you can't test it any other way
- The original function is extremely hard to follow and you resort to putting comments everywhere just to explain it

---

## Writing Tests Best Practices

When evaluating whether a test you've implemented is good or not, use this checklist:

1. **SHOULD** parameterize inputs; never embed unexplained literals such as `42` or `"foo"` directly in the test.
2. **SHOULD NOT** add a test unless it can fail for a real defect. Trivial asserts (e.g., `expect(2).toBe(2)`) are forbidden.
3. **SHOULD** ensure the test description states exactly what the final expect verifies. If the wording and assert don't align, rename or rewrite.
4. **SHOULD** compare results to independent, pre-computed expectations or to properties of the domain, never to the function's output re-used as the oracle.
5. **SHOULD** follow the same lint, type-safety, and style rules as production code.
6. **SHOULD** express invariants or axioms (e.g., commutativity, idempotence, round-trip) rather than single hard-coded cases whenever practical.
7. Unit tests for a function should be grouped under `describe(functionName, () => ...)`.
8. Use `expect.any(...)` when testing for parameters that can be anything (e.g., variable ids).
9. **ALWAYS** use strong assertions over weaker ones:
   ```ts
   expect(x).toEqual(1)                    // ✅ Good
   expect(x).toBeGreaterThanOrEqual(1)     // ❌ Bad
   ```
10. **SHOULD** test edge cases, realistic input, unexpected input, and value boundaries.
11. **SHOULD NOT** test conditions that are caught by the type checker.

---

## Remember Shortcuts

Remember the following shortcuts which the user may invoke at any time.

### QNEW

When I type "qnew", this means:
```
Understand all BEST PRACTICES listed in CLAUDE.md.
Your code SHOULD ALWAYS follow these best practices.
```

### QPLAN

When I type "qplan", this means:
```
Analyze similar parts of the codebase and determine whether your plan:
- Is consistent with rest of codebase
- Introduces minimal changes
- Reuses existing code
```

### QCODE

When I type "qcode", this means:
```
Implement your plan and make sure your new tests pass.
Always run tests to make sure you didn't break anything else.
Always run npm run lint to ensure linting passes.
Always run npm run build to ensure TypeScript compilation succeeds.
```

### QCHECK

When I type "qcheck", this means:
```
You are a SKEPTICAL senior software engineer.
Perform this analysis for every MAJOR code change you introduced (skip minor changes):

1. CLAUDE.md checklist: Writing Functions Best Practices
2. CLAUDE.md checklist: Writing Tests Best Practices
3. CLAUDE.md checklist: Implementation Best Practices
```

### QCHECKF

When I type "qcheckf", this means:
```
You are a SKEPTICAL senior software engineer.
Perform this analysis for every MAJOR function you added or edited (skip minor changes):

1. CLAUDE.md checklist: Writing Functions Best Practices
```

### QCHECKT

When I type "qcheckt", this means:
```
You are a SKEPTICAL senior software engineer.
Perform this analysis for every MAJOR test you added or edited (skip minor changes):

1. CLAUDE.md checklist: Writing Tests Best Practices
```

### QUX

When I type "qux", this means:
```
Imagine you are a human UX tester of the feature you implemented.
Output a comprehensive list of scenarios you would test, sorted by highest priority.
```

### QGIT

When I type "qgit", this means:
```
Add all changes to staging, create a commit, and push to remote.

Follow this checklist for writing your commit message:
- MUST use Conventional Commits format: https://www.conventionalcommits.org/en/v1.0.0
- MUST NOT refer to Claude or Anthropic in the commit message
- MUST structure commit message as follows:
  <type>[optional scope]: <description>
  [optional body]
  [optional footer(s)]
- Commit types:
  - fix: patches a bug in the codebase (PATCH)
  - feat: introduces a new feature (MINOR)
  - BREAKING CHANGE: introduces breaking changes (MAJOR)
  - Other: build:, chore:, ci:, docs:, style:, refactor:, perf:, test:
```
