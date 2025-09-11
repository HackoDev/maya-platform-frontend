# Profile Page Enhancement Design

## Overview

This design document outlines the enhancement of the existing ProfilePage component to add essential user management functionality. The current profile page displays basic user information but lacks important navigation options. The enhancement will add three key features:

1. **User Questionnaire Link** - Direct access to the neural network specialist questionnaire
2. **Change Password Link** - Navigation to password change functionality
3. **Logout Button** - Quick logout capability with proper state management

## Technology Stack & Dependencies

- **Framework**: Vue 3 with Composition API and `<script setup>` syntax
- **Styling**: Tailwind CSS with dark theme support using `dark:` variants
- **State Management**: Pinia store for user authentication state
- **Routing**: Vue Router for navigation
- **Icons**: Heroicons for consistent iconography
- **Package Manager**: pnpm

## Component Architecture

### Enhanced ProfilePage Component Structure

The profile page will be restructured to include a dedicated actions section with three main navigation options:

``mermaid
graph TB
ProfilePage[ProfilePage.vue]

    subgraph "Current Components"
        UserInfo[User Information Display]
        PageHeader[Page Header with Icon]
    end

    subgraph "New Components"
        ActionSection[Profile Actions Section]
        QuestionnaireCard[Questionnaire Access Card]
        PasswordCard[Password Change Card]
        LogoutCard[Logout Action Card]
    end

    ProfilePage --> UserInfo
    ProfilePage --> PageHeader
    ProfilePage --> ActionSection

    ActionSection --> QuestionnaireCard
    ActionSection --> PasswordCard
    ActionSection --> LogoutCard

    QuestionnaireCard --> Router[Vue Router]
    PasswordCard --> Router
    LogoutCard --> UserStore[User Store]

    classDef current fill:#e1f5fe
    classDef new fill:#f3e5f5
    classDef external fill:#fff3e0

    class UserInfo,PageHeader current
    class ActionSection,QuestionnaireCard,PasswordCard,LogoutCard new
    class Router,UserStore external

```

### Component Hierarchy

``mermaid
graph LR
    ProfilePage --> UserInformation
    ProfilePage --> ProfileActions

    subgraph ProfileActions
        QuestionnaireLink[Questionnaire Access]
        PasswordLink[Change Password]
        LogoutButton[Logout Action]
    end

    QuestionnaireLink --> NeuralNetworkProfilePage
    PasswordLink --> ChangePasswordPage
    LogoutButton --> UserStore
```

## Detailed Component Enhancement

### Profile Actions Section

The new actions section will be implemented as a grid layout with three distinct action cards:

#### Questionnaire Access Card

- **Route**: `/profile/neural-network` (existing route)
- **Icon**: Brain/CPU icon representing AI functionality
- **Description**: Access to neural network specialist questionnaire
- **Visual Indicator**: Progress badge showing completion status
- **Styling**: Purple/blue gradient theme to match AI branding

#### Password Change Card

- **Route**: `/profile/change-password` (existing route)
- **Icon**: Key/Lock icon for security
- **Description**: Secure password modification
- **Visual Indicator**: Security badge
- **Styling**: Green theme for security actions

#### Logout Action Card

- **Action**: Direct logout without navigation
- **Icon**: Arrow-right-on-rectangle (logout icon)
- **Description**: Sign out from current session
- **Behavior**: Immediate logout with confirmation
- **Styling**: Red theme for destructive actions

### Layout Structure

``mermaid
graph TD
Container[Profile Page Container]
Header[Profile Header Section]
UserInfo[User Information Grid]
Actions[Profile Actions Section]

    Container --> Header
    Container --> UserInfo
    Container --> Actions

    subgraph ActionsGrid[Actions Grid - 3 Columns]
        Card1[Questionnaire Card]
        Card2[Password Card]
        Card3[Logout Card]
    end

    Actions --> ActionsGrid

```

## Routing & Navigation

### Existing Routes (No Changes Required)
- `/profile` - Current profile page (enhanced)
- `/profile/change-password` - Password change functionality
- `/profile/neural-network` - Neural network questionnaire

### Navigation Flow

``mermaid
sequenceDiagram
    participant User
    participant ProfilePage
    participant Router
    participant UserStore
    participant QuestionnaireForm
    participant PasswordPage

    User->>ProfilePage: Visit /profile
    ProfilePage->>UserStore: Get current user
    UserStore-->>ProfilePage: Return user data

    alt Questionnaire Access
        User->>ProfilePage: Click questionnaire link
        ProfilePage->>Router: Navigate to /profile/neural-network
        Router->>QuestionnaireForm: Load questionnaire
    else Password Change
        User->>ProfilePage: Click password change
        ProfilePage->>Router: Navigate to /profile/change-password
        Router->>PasswordPage: Load password form
    else Logout
        User->>ProfilePage: Click logout
        ProfilePage->>UserStore: Call logout()
        UserStore->>UserStore: Clear currentUser
        UserStore->>Router: Redirect to login
    end
```

## State Management Integration

### User Store Integration

The enhanced profile page will leverage the existing `useUserStore` for:

- **Authentication Check**: Verify user is logged in
- **User Data Display**: Show current user information
- **Logout Functionality**: Handle session termination

```typescript
// Store integration pattern
const userStore = useUserStore()

const handleLogout = async () => {
  await userStore.logout()
  router.push('/login')
}
```

### Store State Dependencies

``mermaid
graph LR
UserStore[User Store State]

    UserStore --> currentUser[currentUser]
    UserStore --> isAuthenticated[isAuthenticated]
    UserStore --> userDisplayName[userDisplayName]
    UserStore --> userTypeLabel[userTypeLabel]

    currentUser --> ProfileDisplay[Profile Information]
    isAuthenticated --> RouteGuard[Route Protection]
    userDisplayName --> HeaderDisplay[Header Display]
    userTypeLabel --> TypeBadge[User Type Badge]

````

## Styling Strategy

### Dark Theme Support

All components will implement comprehensive dark theme support using Tailwind CSS `dark:` variants:

```css
/* Card styling example */
.action-card {
  @apply bg-white dark:bg-gray-800
         border border-gray-200 dark:border-gray-700
         hover:shadow-lg dark:hover:shadow-gray-900/20
         transition-all duration-200;
}

/* Button styling */
.action-button {
  @apply text-gray-700 dark:text-gray-200
         hover:text-gray-900 dark:hover:text-white;
}
````

### Responsive Design

The actions section will be responsive across different screen sizes:

- **Desktop (lg+)**: 3-column grid layout
- **Tablet (md)**: 2-column with logout on second row
- **Mobile (sm)**: Single column stack

``css
.actions-grid {
@apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}

````

### Visual Design Patterns

#### Action Cards Design
- **Elevation**: Subtle shadow with hover enhancement
- **Spacing**: Consistent padding using Tailwind spacing scale
- **Typography**: Clear hierarchy with title, description, and action text
- **Colors**: Theme-based color coding (purple for AI, green for security, red for logout)

#### Interactive States
- **Hover**: Shadow elevation and slight scale transform
- **Focus**: Clear focus ring for accessibility
- **Active**: Subtle press animation

## Data Flow Architecture

### Component Data Flow

```mermaid
graph TD
    UserStore[User Store] --> ProfilePage[Profile Page]
    ProfilePage --> UserDisplay[User Information Display]
    ProfilePage --> ActionSection[Actions Section]

    ActionSection --> QuestionnaireCard[Questionnaire Card]
    ActionSection --> PasswordCard[Password Card]
    ActionSection --> LogoutCard[Logout Card]

    QuestionnaireCard --> RouterPush[router.push('/profile/neural-network')]
    PasswordCard --> RouterPush2[router.push('/profile/change-password')]
    LogoutCard --> LogoutAction[userStore.logout()]

    LogoutAction --> RouterPush3[router.push('/login')]
````

### User Interaction Flow

``mermaid
sequenceDiagram
participant U as User
participant P as ProfilePage
participant R as Router
participant S as UserStore

    U->>P: Loads profile page
    P->>S: Gets user data
    S-->>P: Returns current user
    P-->>U: Displays profile + actions

    alt Questionnaire Navigation
        U->>P: Clicks questionnaire card
        P->>R: Navigate to neural-network
        R-->>U: Shows questionnaire form
    else Password Change Navigation
        U->>P: Clicks password card
        P->>R: Navigate to change-password
        R-->>U: Shows password form
    else Logout Action
        U->>P: Clicks logout card
        P->>S: Calls logout()
        S->>S: Clears user state
        S->>R: Redirects to login
        R-->>U: Shows login page
    end

```

## Testing Strategy

### Unit Testing Requirements

The enhanced ProfilePage component will require comprehensive unit tests covering:

#### Component Rendering Tests
- Verify all action cards render correctly
- Test responsive grid layout
- Validate dark theme styling
- Check icon and text content

#### Navigation Tests
- Test router navigation for questionnaire link
- Test router navigation for password change link
- Verify proper route parameters

#### User Interaction Tests
- Test click handlers for all action cards
- Test logout functionality and state changes
- Test hover and focus states

#### Store Integration Tests
- Test user store data binding
- Test logout store action calls
- Test authentication state handling

### Test Structure Example

``typescript
describe('ProfilePage Enhancement', () => {
  describe('Action Cards Rendering', () => {
    it('should render questionnaire access card')
    it('should render password change card')
    it('should render logout action card')
  })

  describe('Navigation Functionality', () => {
    it('should navigate to neural network questionnaire')
    it('should navigate to password change page')
    it('should handle logout and redirect')
  })

  describe('Responsive Design', () => {
    it('should display 3 columns on desktop')
    it('should display 2 columns on tablet')
    it('should display 1 column on mobile')
  })
})
```

## Implementation Details

### Enhanced ProfilePage Template Structure

``vue
<template>

  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Existing User Information Section -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
        <!-- Current user info display (unchanged) -->
      </div>
      
      <!-- New Profile Actions Section -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Действия профиля
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Questionnaire Card -->
          <ActionCard 
            title="Анкета специалиста"
            description="Заполните анкету нейросетевого специалиста"
            icon="CpuChipIcon"
            route="/profile/neural-network"
            color="purple"
          />
          
          <!-- Password Change Card -->
          <ActionCard
            title="Смена пароля" 
            description="Измените пароль для безопасности"
            icon="KeyIcon"
            route="/profile/change-password"
            color="green"
          />
          
          <!-- Logout Card -->
          <ActionCard
            title="Выход"
            description="Завершить текущую сессию"
            icon="ArrowRightOnRectangleIcon"
            @click="handleLogout"
            color="red"
            :is-action="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>
```

### ActionCard Component Interface

```typescript
interface ActionCardProps {
  title: string
  description: string
  icon: string
  route?: string
  color: 'purple' | 'green' | 'red'
  isAction?: boolean
}
```

## Security Considerations

### Authentication Verification

- Ensure all profile actions verify user authentication
- Implement proper route guards for protected pages
- Handle unauthenticated state gracefully

### Logout Security

- Clear all user session data on logout
- Redirect to login page immediately
- Clear any cached user information

### Navigation Security

- Validate user permissions before navigation
- Implement proper error handling for failed navigation
- Ensure CSRF protection on logout action

## Accessibility Implementation

### Keyboard Navigation

- All action cards accessible via keyboard
- Proper tab order for logical flow
- Enter/Space key activation for cards

### Screen Reader Support

- Descriptive ARIA labels for all actions
- Proper heading structure
- Alternative text for icons

### Focus Management

- Visible focus indicators
- Logical focus order
- Focus trap where appropriate

### Color Accessibility

- High contrast ratios for all text
- Color coding supplemented with icons
- Dark theme compliance

This design provides a comprehensive enhancement to the existing profile page while maintaining consistency with the current application architecture and design patterns. The implementation leverages existing components and routing structure while adding essential user management functionality.
