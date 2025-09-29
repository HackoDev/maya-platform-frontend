# Main Menu and Vacancy Logic Update Design

## Overview

This document outlines the design for updating the main menu and vacancy logic in the MayaWork frontend application. The changes involve:

1. Modifying the main navigation menu labels
2. Restructuring the vacancy functionality to separate published vacancies (accessible to all users) from personal vacancies (client-specific)
3. Updating navigation items and their visibility based on user roles

## Architecture

### Current Architecture

The application currently uses:

- Vue 3 with Composition API
- Pinia for state management
- Vue Router for navigation
- A centralized navigation store (`useNavigationStore`) that manages menu items
- A vacancy store (`useVacancyStore`) that manages vacancy data
- User authentication and role-based access control via `useUserStore`

### Proposed Architecture Changes

The key changes involve:

1. Renaming navigation items in the navigation store
2. Creating a new page/route for viewing all published vacancies accessible to all users
3. Maintaining the existing personal vacancy management for clients
4. Implementing role-based access control for vacancy management actions

## Component Architecture

### Navigation Components

#### TopNavbar.vue

- Will display a "Вакансии" link instead of "Мои вакансии"
- Will display "Специалисты" instead of "Поиск специалиста"
- Create vacancy button will remain visible only for clients

#### MobileNavigationMenu.vue

- Will reflect the same navigation item changes as the desktop menu

### New Components

#### AllVacanciesPage.vue

- A new page component to display all published vacancies on the platform
- Accessible to all authenticated users (both specialists and clients)
- Will not show management controls (edit/delete) for non-owners
- Will show vacancy details with contact information for specialists
- Will implement infinite scroll pagination using the existing `useInfiniteScroll` composable
- Will use consistent loading spinner UI with animated icon and localized text ("Загружаем еще вакансии...") following the pattern from SpecialistSearchResults.vue
- Will follow Tailwind CSS styling patterns consistent with other listing pages
- Will use the same loading skeleton pattern as VacancyList.vue for initial loading states

### Modified Components

#### MyVacanciesPage.vue

- Will retain its current functionality for clients to manage their own vacancies
- Will be accessible only to clients
- Will show all management controls (create/edit/delete)
- Will be accessible via the profile menu
- Will maintain existing pagination and loading patterns

#### VacancyCard.vue

- Will conditionally show management controls based on user ownership
- For specialists viewing published vacancies, only basic information will be displayed without management controls
- For clients viewing their own vacancies in their personal list, full management controls will be available
- Will maintain consistent styling with Tailwind CSS classes following the existing design system

## Routing & Navigation

### Current Routes

```
/profile/vacancies - MyVacanciesPage (client-only)
/profile/vacancies/:id - VacancyDetailPage
```

### Updated Routes

```
/vacancies - AllVacanciesPage (all users)
/profile/vacancies - MyVacanciesPage (client-only)
/vacancies/:id - VacancyDetailPage (all users)
/profile/vacancies/:id - VacancyDetailPage (client-only, for edit functionality)
```

The `/vacancies` route will show all published vacancies on the platform, accessible to all users.
The `/profile/vacancies` route will remain for clients to manage their personal vacancies.

### Navigation Store Changes

The navigation items in `useNavigationStore` will be updated:

- "Мои вакансии" → "Вакансии" (route: /vacancies)
- "Поиск специалиста" → "Специалисты" (route: /search/specialists)

## Data Models & State Management

### Navigation Store (`useNavigationStore`)

Changes to `navigationItems`:

```typescript
;[
  {
    id: 'my-profile',
    label: 'Мой профиль',
    route: '/profile',
    icon: 'user-circle',
    requiresAuth: true,
    visible: true,
  },
  {
    id: 'vacancies',
    label: 'Вакансии', // Changed from "Мои вакансии"
    route: '/vacancies', // Changed from "/profile/vacancies"
    icon: 'briefcase',
    requiresAuth: true,
    visible: true,
  },
  {
    id: 'specialists',
    label: 'Специалисты', // Changed from "Поиск специалиста"
    route: '/search/specialists',
    icon: 'magnifying-glass',
    requiresAuth: true,
    visible: true,
  },
  // ... other items
]
```

### Vacancy Store (`useVacancyStore`)

New actions will be added:

- `fetchAllVacancies(page: number, pageSize: number)` - Fetches paginated published vacancies (for the new all vacancies page with infinite scroll)
- `getVacancyById(id: string)` - Gets a specific vacancy by ID (for detail views)

Modified getters:

- `publishedVacancies` - Will be used for the all vacancies page
- `myVacancies` - Will filter vacancies by current user ID (for client's personal vacancy management)

New state properties for pagination:

- `currentPage` - Current page for infinite scroll
- `hasMoreVacancies` - Flag indicating if more vacancies can be loaded
- `loadingMore` - Flag indicating if more vacancies are being loaded

## Business Logic Layer

### Access Control Logic

#### For All Users

- Can view all published vacancies through the main "Вакансии" menu item
- Can view details of any published vacancy
- Cannot edit/delete vacancies they don't own

#### For Clients

- Can view all published vacancies through the main "Вакансии" menu item
- Can manage their own vacancies (create/edit/delete) through their personal "Вакансии" page in profile
- Have access to their personal vacancy management page via profile menu

#### For Specialists

- Can view all published vacancies through the main "Вакансии" menu item
- Cannot manage any vacancies (no create/edit/delete)
- Can contact vacancy owners through appropriate channels

### Component Visibility Logic

#### Vacancy Management Controls

Controls for editing/deleting vacancies will be conditionally rendered:

```vue
<div v-if="userStore.currentUser?.userType === 'client' && isOwner(vacancy)">
  <!-- Edit/Delete buttons -->
</div>
```

#### Create Vacancy Button

Will only be visible to clients:

```vue
<button v-if="userStore.currentUser?.userType === 'client'">
  Создать вакансию
</button>
```

## API Integration Layer

### New API Endpoints

#### VacancyService

New methods will be added:

- `getAllPublishedVacancies(page: number, pageSize: number)` - Fetches paginated published vacancies from the platform with infinite scroll support
- `getVacancyById(id: string)` - Fetches a specific vacancy by ID

Modified methods:

- `getMyVacancies()` - Will be used exclusively for client's personal vacancy management

## Testing Strategy

### Unit Tests

#### Navigation Store Tests

- Verify navigation item labels are updated correctly
- Ensure route paths are updated correctly
- Test visibility logic for different user types

#### Vacancy Store Tests

- Test new `fetchAllVacancies` action
- Test modified getters for filtering vacancies
- Test user-based access control logic

#### Component Tests

- Test conditional rendering of management controls
- Test navigation item display based on user roles
- Test vacancy card behavior for different user types

### Integration Tests

#### Routing Tests

- Verify navigation between new and existing pages
- Test access control for protected routes
- Test redirect logic for unauthorized access

#### User Flow Tests

- Test specialist user flow for viewing vacancies
- Test client user flow for managing vacancies
- Test navigation menu changes for different user types

## Implementation Plan

### Phase 1: Navigation Updates

1. Update navigation store with new labels ("Вакансии" instead of "Мои вакансии", "Специалисты" instead of "Поиск специалиста")
2. Update route paths in navigation store (/vacancies instead of /profile/vacancies)
3. Update TopNavbar component to reflect new navigation
4. Update MobileNavigationMenu component
5. Add new route configuration for AllVacanciesPage

### Phase 2: Vacancy Page Development

1. Create AllVacanciesPage component to display all published vacancies with infinite scroll pagination
2. Implement conditional rendering in VacancyCard based on user role and ownership
3. Update VacancyDetailPage to handle both public and personal vacancy views
4. Add new actions to vacancy store for fetching all published vacancies with pagination support
5. Implement consistent loading states and UI patterns using existing components as reference

### Phase 3: Access Control Implementation

1. Implement ownership checking logic in vacancy components
2. Add conditional rendering for management controls (only visible to owners)
3. Update routing guards to protect client-only routes
4. Ensure create vacancy button is only visible to clients

### Phase 4: Testing and Refinement

1. Implement unit tests for navigation changes
2. Test vacancy management controls visibility for different user roles
3. Conduct integration testing for all user flows
4. Verify access control for different user types
