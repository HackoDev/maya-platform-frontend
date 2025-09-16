# Login Page Component

<cite>
**Referenced Files in This Document**   
- [LoginPage.vue](file://src/root/auth/pages/LoginPage.vue)
- [authStore.ts](file://src/root/auth/store/authStore.ts)
- [authApi.ts](file://src/root/shared/services/authApi.ts)
- [auth.types.ts](file://src/root/shared/models/auth.types.ts)
- [errors-form-message.ts](file://src/root/shared/utils/constant/errors-form-message.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Core Components](#core-components)
3. [Authentication Flow](#authentication-flow)
4. [Form State and Validation](#form-state-and-validation)
5. [Security Considerations](#security-considerations)
6. [User Feedback and Accessibility](#user-feedback-and-accessibility)
7. [Error Handling](#error-handling)
8. [Integration with Authentication Store](#integration-with-authentication-store)
9. [Sequence Diagram: Login Process](#sequence-diagram-login-process)

## Introduction
The LoginPage.vue component serves as the primary authentication entry point for the Maya Platform frontend application. It provides a clean, user-friendly interface for users to authenticate using their email and password credentials. The component integrates with the global Pinia store (authStore) to manage authentication state and communicates with backend services through the authApi service. This document details the implementation, architecture, and security aspects of the login functionality.

## Core Components

The LoginPage.vue component is built using Vue 3's Composition API with TypeScript support. It leverages Naive UI components for consistent styling and behavior across the application. The core elements include:

- **Form Inputs**: Email and password fields with appropriate validation attributes
- **Submit Button**: Primary action button that triggers the login process
- **Loading State**: Visual feedback during authentication requests
- **Navigation**: Link to registration page (currently informational)

The component uses reactive state management through Vue's `ref` and `computed` properties to track form data, loading status, and validation rules.

**Section sources**
- [LoginPage.vue](file://src/root/auth/pages/LoginPage.vue#L1-L102)

## Authentication Flow

The login process follows a standardized flow from user interaction to successful authentication or error handling:

1. User enters email and password in the form fields
2. User submits the form (via button click or enter key)
3. Frontend validates basic input requirements
4. Credentials are sent securely to the authentication API
5. Upon success: tokens are stored, user data is retrieved, and navigation occurs
6. Upon failure: error message is displayed to the user

This flow ensures a smooth user experience while maintaining security best practices.

```mermaid
flowchart TD
A[User Opens Login Page] --> B[Enters Email and Password]
B --> C[Clicks Login Button]
C --> D{Form Valid?}
D --> |No| E[Show Validation Feedback]
D --> |Yes| F[Set Loading State]
F --> G[Call authStore.login()]
G --> H[API Request to /auth/login]
H --> I{Authentication Success?}
I --> |Yes| J[Store Tokens in Memory and localStorage]
J --> K[Fetch Current User Data]
K --> L[Redirect to Dashboard or Intended Page]
I --> |No| M[Display Error Message]
M --> N[Reset Loading State]
L --> O[Authentication Complete]
```

**Diagram sources**
- [LoginPage.vue](file://src/root/auth/pages/LoginPage.vue#L50-L85)
- [authStore.ts](file://src/root/auth/store/authStore.ts#L19-L42)

## Form State and Validation

The login form manages its state through a reactive object defined using Vue's `ref`:

```typescript
const loginForm = ref({
  email: '',
  password: ''
})
```

Input validation is handled through both HTML5 attributes and computed properties:

- **HTML5 Validation**: `required` attribute and `type="email"` ensure basic input correctness
- **Computed Validation**: The `isFormValid` computed property checks if both fields have content

```typescript
const isFormValid = computed(() => {
  return loginForm.value.email.length > 0 && loginForm.value.password.length > 0
})
```

The submit button is disabled when the form is invalid or during loading:

```typescript
:NButton
  :disabled="!isFormValid || loading"
  :loading="loading"
```

**Section sources**
- [LoginPage.vue](file://src/root/auth/pages/LoginPage.vue#L25-L35)
- [errors-form-message.ts](file://src/root/shared/utils/constant/errors-form-message.ts)

## Security Considerations

The login implementation incorporates several security measures to protect user credentials and prevent common attack vectors:

### Secure Credential Transmission
All authentication requests are transmitted over HTTPS through the API client configuration. The `authApi.login()` method uses secure POST requests to send credentials to the server.

### Token Storage
Upon successful authentication:
- Access token is stored in memory and localStorage
- Refresh token (if provided) is also persisted in localStorage
- Tokens are used for subsequent authenticated requests via interceptors

### Rate Limiting Protection
While not implemented in the frontend, the system assumes backend API rate limiting to prevent brute force attacks. This protects against automated credential guessing.

### Error Message Sanitization
Error messages are sanitized to avoid information leakage:
- Generic error messages are shown to users
- Specific error details remain server-side
- Client displays either the error message from the server or a default "Ошибка входа" message

```typescript
catch (error: any) {
  message.error(error.message || 'Ошибка входа')
}
```

### Input Sanitization
Email input uses the `type="email"` attribute which provides built-in format validation and helps prevent injection attacks.

**Section sources**
- [authStore.ts](file://src/root/auth/store/authStore.ts#L19-L42)
- [authApi.ts](file://src/root/shared/services/authApi.ts#L9-L15)

## User Feedback and Accessibility

The component provides clear feedback throughout the authentication process:

### Visual Feedback
- **Loading State**: Button shows loading spinner during authentication
- **Success Messages**: Toast notification appears on successful login
- **Error Messages**: Toast notification displays error information

### Accessibility Features
- **Semantic HTML**: Form structure with proper labels and input types
- **Keyboard Navigation**: Full keyboard operability (tab navigation, enter to submit)
- **ARIA Attributes**: Implicit accessibility through Naive UI components
- **Color Contrast**: Sufficient contrast for text and interactive elements

### Password Visibility
The password field includes a visibility toggle activated by holding down the mouse button:

```html
:NInput
  :type="'password'"
  :show-password-on="'mousedown'"
```

This allows users to verify their password entry while maintaining security.

**Section sources**
- [LoginPage.vue](file://src/root/auth/pages/LoginPage.vue#L15-L20)

## Error Handling

The login process implements comprehensive error handling at multiple levels:

### Client-Side Validation
Prevents submission of empty credentials through the `isFormValid` computed property and HTML5 required attributes.

### API Error Handling
Errors from the authentication API are caught and presented to the user:

```typescript
try {
  await authStore.login(loginForm.value)
  message.success('Вход выполнен успешно')
  // Redirect logic
} catch (error: any) {
  message.error(error.message || 'Ошибка входа')
} finally {
  loading.value = false
}
```

### Network Error Resilience
The try-catch block captures network failures, authentication rejections, and other exceptions, ensuring the application doesn't crash on failed login attempts.

### Loading State Management
The `finally` block ensures that the loading state is reset regardless of success or failure, preventing the interface from becoming unresponsive.

**Section sources**
- [LoginPage.vue](file://src/root/auth/pages/LoginPage.vue#L70-L85)
- [authStore.ts](file://src/root/auth/store/authStore.ts#L25-L40)

## Integration with Authentication Store

The LoginPage.vue component integrates with the global authentication state management system through Pinia:

### Store Initialization
```typescript
const authStore = useAuthStore()
```

This provides access to the centralized authentication state and actions.

### State Management
The authStore manages:
- **User object**: Current authenticated user data
- **Authentication tokens**: Access and refresh tokens
- **Loading state**: Global authentication loading status
- **Error state**: Authentication error messages

### Actions
The component calls the `login()` action which handles the complete authentication workflow:

1. Sets loading state
2. Calls the authentication API
3. Stores tokens upon success
4. Persists data to localStorage
5. Handles errors appropriately

The store-based approach enables consistent authentication state across the entire application.

**Section sources**
- [LoginPage.vue](file://src/root/auth/pages/LoginPage.vue#L57-L57)
- [authStore.ts](file://src/root/auth/store/authStore.ts#L1-L154)

## Sequence Diagram: Login Process

```mermaid
sequenceDiagram
participant User as "User"
participant LoginPage as "LoginPage.vue"
participant AuthStore as "authStore"
participant AuthApi as "authApi"
participant API as "Authentication API"
User->>LoginPage : Enter credentials and submit
LoginPage->>LoginPage : Validate form inputs
alt Form Invalid
LoginPage-->>User : Highlight errors
stop
end
LoginPage->>AuthStore : login(credentials)
AuthStore->>AuthStore : Set loading = true, error = null
AuthStore->>AuthApi : login(credentials)
AuthApi->>API : POST /auth/login with credentials
API-->>AuthApi : Return AuthResponse or error
alt Authentication Success
AuthApi-->>AuthStore : Return response
AuthStore->>AuthStore : Store tokens and user data
AuthStore->>AuthStore : Persist to localStorage
AuthStore-->>LoginPage : Promise resolved
LoginPage->>LoginPage : Show success message
LoginPage->>LoginPage : Redirect to dashboard
else Authentication Failure
AuthApi-->>AuthStore : Throw error
AuthStore->>AuthStore : Set error message
AuthStore-->>LoginPage : Promise rejected
LoginPage->>LoginPage : Display error message
end
AuthStore->>AuthStore : Set loading = false
LoginPage->>LoginPage : Reset loading state
```

**Diagram sources**
- [LoginPage.vue](file://src/root/auth/pages/LoginPage.vue#L50-L85)
- [authStore.ts](file://src/root/auth/store/authStore.ts#L19-L42)
- [authApi.ts](file://src/root/shared/services/authApi.ts#L9-L15)