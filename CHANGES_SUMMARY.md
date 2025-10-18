# Changes Summary: Added Reporter Details to Submit Report Form

## Overview
Added "Complaint Person Details" section to the report submission form with required name and phone number fields.

## Files Modified

### 1. ReportForm Component (`components/report/ReportForm.tsx`)
- Added `reporterName` and `reporterPhone` fields to the form state
- Updated form submission handler to include these fields in the API request
- Added a new section in the form UI with:
  - "Complaint Person Details" heading
  - Required "Full Name" text input field
  - Required "Phone Number" telephone input field
  - Proper styling consistent with the rest of the form

### 2. Report Creation API Route (`app/api/reports/create/route.ts`)
- Updated to extract `reporterName` and `reporterPhone` from the request body
- Modified the Prisma create call to include these fields when creating a new report

### 3. Prisma Schema (`prisma/schema.prisma`)
- Added `reporterName` (String, optional) field to the Report model
- Added `reporterPhone` (String, optional) field to the Report model

### 4. Database Migration (`prisma/migrations/20251018100000_add_reporter_details/migration.sql`)
- Created SQL migration to add the new columns to the existing Report table:
  ```sql
  ALTER TABLE "public"."Report" ADD COLUMN "reporterName" TEXT;
  ALTER TABLE "public"."Report" ADD COLUMN "reporterPhone" TEXT;
  ```

## Implementation Details

### Form Fields
- Both fields are required as per the requirements
- Proper validation is handled through HTML5 `required` attribute
- Fields are clearly labeled with asterisks to indicate required status
- Phone field uses `type="tel"` for appropriate mobile keyboard display

### Data Flow
1. User fills out the report form including the new reporter details
2. Form data including reporter details is sent to the API endpoint
3. API endpoint creates a new report record with all data including reporter details
4. Database stores the reporter information with the report

### UI/UX Considerations
- Added a visual separator (border-top) to distinguish the reporter details section
- Used consistent styling with the rest of the form
- Placed the section after the description field as requested
- Clear labeling and required indicators for user guidance