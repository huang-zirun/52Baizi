# Walkthrough - Location & True Solar Time Update

I have updated the Bazi application to include True Solar Time calculation based on birth location and improved the user interface.

## Changes

### 1. Location Service (`lib/services/location-service.ts`)
- Implemented `getLocationCoordinates` using Nominatim API.
- Implemented `calculateTrueSolarTime` logic.

### 2. Bazi Service (`lib/services/bazi/bazi-service.ts`)
- Updated to use `Location Service`.
- Added `PillarInfo` with Ten Stars (Main Star), Zodiac, and NaYin Element.
- Fixed Ten Star calculation logic (Day Master vs Pillar Stem).
- **Note**: The API calls for location might timeout in restricted environments; it defaults to Beijing Time (120°E) in such cases.

### 3. UI Components (`app/_components/`)
- Created `bazi-form.tsx`:
  - Added HTML5 Time input for precise Minute entry.
  - Added Location input.
- Created `bazi-display.tsx`:
  - New "Stone" color scheme.
  - Displays detailed Pillar info (Ten Star, Gan, Zhi, Zodiac, Element).
  - Shows True Solar Time and Day Master.

### 4. Page Integration (`app/bazi/page.tsx`)
- Integrated new components.
- Added loading state.

## Verification
- Verified Bazi logic (Ten Stars calculation) using a test script.
- Confirmed correct Ten Star relations (e.g., Water Year generating Wood Day -> Resource).

## Next Steps
- You can try the app by running the dev server.
- The prompt for this task has been saved to `prompts/02-location-and-solar-time.md`.
