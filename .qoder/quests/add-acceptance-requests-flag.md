# Add "Open to Offers" Flag Feature Design

## Overview

This document outlines the design for adding an "Open to Offers" flag to the specialist profile. This feature will allow specialists to indicate their availability for new projects by toggling a switch in their profile. The flag will be visible both in the user's own profile view and in the public profile view of specialists.

## Architecture

The implementation involves:

1. **Data Model Enhancement**:
   - Add `isOpenToOffers` boolean field to User and SpecialistProfile data models
   - Update related TypeScript interfaces

2. **Frontend Implementation**:
   - Add toggle switch to ProfilePage.vue for specialists
   - Display status indicator in SpecialistProfileViewPage.vue
   - Update relevant stores and components

3. **UI/UX Design**:
   - Toggle switch in user profile for controlling the flag
   - Visual indicator in public profiles showing the status

## Data Models & Type System

### User Model Extension

Add `isOpenToOffers` field to the existing User model:

```typescript
// In src/types/index.ts
export interface User {
  id: string
  name: string
  firstName: string
  lastName: string
  email: string
  avatar?: string
  role: 'admin' | 'user' | 'moderator'
  userType: 'specialist' | 'client'
  isActive: boolean
  isOpenToOffers?: boolean // New field
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

// In src/types/index.ts
export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  avatar?: string
  userType: 'specialist' | 'client'
  role: 'admin' | 'user' | 'moderator'
  isActive: boolean
  isOpenToOffers?: boolean // New field
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}
```

### Specialist Profile Model Extension

Add field to specialist profile view data:

```typescript
// In src/types/specialist-profile-view.ts
export interface ProfileViewData {
  basicInfo: {
    id: string
    userId: string
    displayName: string
    superpower: string
    avatarUrl?: string
    status: 'available' | 'busy' | 'unavailable'
    isOpenToOffers?: boolean // New field
    lastActive: string
  }
  // ... rest of the interface
}
```

## Component Architecture

### Profile Page Component

We'll add a new section to the profile page for specialists that includes a toggle switch for the "Open to Offers" flag.

Component Structure:

- Location: Profile actions section, visible only to specialists
- Component: Switch/toggle control with clear labeling
- Behavior: Immediate visual feedback with async backend update

### Specialist Profile View Component

We'll add a visual indicator to show the specialist's availability status in their public profile.

Component Enhancement:

- Location: Profile header, near other status indicators
- Component: Badge with green color coding for "open" status
- Text: "Открыт к предложениям"
- Visibility: Only shown when specialist has opted in

## State Management

### User Store Enhancement

We'll enhance the user store to handle the new field:

1. Add `isOpenToOffers` to the user state
2. Add actions to update the field

### Specialist Profile View Store

We'll ensure the new field is properly handled when loading specialist profiles.

## API Integration Layer

### User Service Enhancement

We'll need to update the user service to support updating the `isOpenToOffers` field:

1. Add API endpoint for updating user status
2. Implement the service method for updating the flag

## Business Logic Layer

### Toggle Handler Implementation

The business logic for handling the toggle will include:

1. **Client-side update**: Immediate UI feedback
2. **Server-side persistence**: Send update to backend
3. **Error handling**: Revert UI change if server update fails
4. **Loading states**: Show indicators during update process

### Profile Display Logic

In the public profile view:

1. Display visual indicator when specialist is open to offers
2. Position indicator in profile header
3. Ensure indicator only shown for specialists

## UI/UX Design

### Profile Page Toggle

- Location: Profile actions section, visible only to specialists
- Component: Switch/toggle control with clear labeling
- Behavior: Immediate visual feedback with async backend update
- States: Loading, Success, Error

### Public Profile Indicator

- Location: Profile header, near other status indicators
- Component: Badge with green color coding for "open" status
- Text: "Открыт к предложениям"
- Visibility: Only shown when specialist has opted in

## Testing

### Unit Tests

1. **User Store Tests**:
   - Test that the isOpenToOffers field is properly initialized
   - Test that the updateOpenToOffers action works correctly

2. **Component Tests**:
   - Test that the toggle is only visible for specialists
   - Test that the public indicator displays correctly

3. **Service Tests**:
   - Test that the API call for updating status works

### Integration Tests

1. **Profile Flow Test**:
   - Login as a specialist
   - Navigate to profile page
   - Toggle the "Open to Offers" switch
   - Verify the change is persisted
   - View the public profile
   - Verify the indicator is displayed

2. **Status Persistence Test**:
   - Toggle the status
   - Refresh the page
   - Verify the status is maintained
   - Log out and log back in
   - Verify the status is still correct

## Implementation Plan

### Phase 1: Data Model Updates

1. Update TypeScript interfaces in `src/types/index.ts`
2. Update specialist profile types in `src/types/specialist-profile-view.ts`
3. Add necessary imports and exports

### Phase 2: Backend Integration

1. Coordinate with backend team to add `isOpenToOffers` field to user model
2. Implement API endpoint for updating the field
3. Update user service with new methods

### Phase 3: Frontend Implementation

1. Update user store with new field and actions
2. Add toggle component to ProfilePage.vue
3. Add indicator to ProfileHeader.vue
4. Implement business logic for toggle handling

### Phase 4: Testing

1. Write unit tests for new functionality
2. Implement integration tests
3. Conduct manual testing

### Phase 5: Documentation

1. Update relevant documentation
2. Add user guides if necessary
