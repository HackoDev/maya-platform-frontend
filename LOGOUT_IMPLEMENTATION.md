# Logout Implementation

This document describes the logout implementation in the Maya Platform frontend, including OAuth2 token revocation and session cleanup.

## Overview

The logout functionality ensures that:
1. **OAuth2 tokens are properly revoked** on the server using the correct endpoint
2. **Local storage is cleared** of all authentication data
3. **Session state is reset** across all components and stores
4. **User is redirected** to the login page

## OAuth2 Token Revocation

### Endpoint
```
POST /oauth2/revoke_token/
Content-Type: application/x-www-form-urlencoded
```

### Request Body
```
token=ACCESS_TOKEN&client_id=CLIENT_ID
```

### Implementation Details

The `AuthApiClient` logout method:

1. **Revokes Access Token**: Sends a POST request to `/oauth2/revoke_token/` with the access token
2. **Revokes Refresh Token**: If different from access token, also revokes the refresh token
3. **Handles Errors Gracefully**: Continues with local cleanup even if server revocation fails
4. **Clears Local Storage**: Removes all tokens and user data from localStorage
5. **Updates Headers**: Removes Authorization header from default headers

```typescript
async logout(): Promise<void> {
  try {
    // Revoke tokens on server using OAuth2 revoke endpoint
    const accessToken = this.tokenStorage.getToken()
    const refreshToken = this.tokenStorage.getRefreshToken()
    
    // Revoke access token if available
    if (accessToken) {
      await this.post('/oauth2/revoke_token/', new URLSearchParams({
        token: accessToken,
        client_id: this.clientId,
      }), {
        headers: {
          'Content-Type': CONTENT_TYPES.URL_ENCODED,
        },
      }).catch((error) => {
        console.warn('Failed to revoke access token:', error)
      })
    }
    
    // Revoke refresh token if available and different from access token
    if (refreshToken && refreshToken !== accessToken) {
      await this.post('/oauth2/revoke_token/', new URLSearchParams({
        token: refreshToken,
        client_id: this.clientId,
      }), {
        headers: {
          'Content-Type': CONTENT_TYPES.URL_ENCODED,
        },
      }).catch((error) => {
        console.warn('Failed to revoke refresh token:', error)
      })
    }
  } catch (error) {
    console.warn('Error during logout:', error)
  } finally {
    // Clear stored tokens and user data
    this.tokenStorage.removeToken()
    this.tokenStorage.removeRefreshToken()
    this.tokenStorage.removeUser()

    // Remove authorization header
    const headers = this.getDefaultHeaders()
    delete headers['Authorization']
    this.setDefaultHeaders(headers)
  }
}
```

## Logout Flow

### 1. UI Components
UI components now use `userStore.logoutWithRedirect()` for proper async handling:

```typescript
// UserProfileSection.vue
const handleLogout = async () => {
  closeDropdown()
  await userStore.logoutWithRedirect('/login')
}

// MobileNavigationMenu.vue
const handleLogout = async () => {
  emit('close')
  await userStore.logoutWithRedirect('/login')
}

// AppNavigation.vue
const handleLogout = async () => {
  await userStore.logoutWithRedirect('/login')
}

// ProfilePage.vue
const handleLogout = async () => {
  await userStore.logoutWithRedirect('/login')
}
```

### 2. User Store
The user store provides both `logout()` and `logoutWithRedirect()` methods:

```typescript
const logout = async () => {
  try {
    // Use authApiClient logout to clear tokens
    await authApi.logout()
  } catch (err) {
    console.warn('Error during logout:', err)
  } finally {
    // Clear local state regardless of API call result
    currentUser.value = null
    error.value = null
    users.value = []
  }
}

const logoutWithRedirect = async (redirectPath: string = '/login') => {
  try {
    // Perform logout
    await logout()
    
    // Import router dynamically to avoid circular dependencies
    const { useRouter } = await import('vue-router')
    const router = useRouter()
    
    // Redirect to specified path
    await router.push(redirectPath)
    
  } catch (error) {
    console.error('Error during logout with redirect:', error)
    // Fallback: try to redirect anyway
    try {
      const { useRouter } = await import('vue-router')
      const router = useRouter()
      await router.push(redirectPath)
    } catch (redirectError) {
      console.error('Error during fallback redirect:', redirectError)
      // Last resort: reload the page
      window.location.href = redirectPath
    }
  }
}
```

### 3. Session Composable
The session composable also calls `userStore.logout()`:

```typescript
const logout = async (): Promise<void> => {
  try {
    sessionState.value.isLoading = true
    
    // Stop token validation
    stopTokenValidation()
    
    // Clear session
    await clearSession()
    
    console.log('✅ Logout successful')
  } catch (error) {
    console.error('❌ Logout error:', error)
  } finally {
    sessionState.value.isLoading = false
  }
}
```

## Data Cleanup

### Local Storage Keys Removed
- `auth_access_token`
- `auth_refresh_token`
- `auth_user`

### State Variables Reset
- `currentUser` → `null`
- `isAuthenticated` → `false`
- `error` → `null`
- `users` → `[]`

### Headers Updated
- `Authorization` header removed from default headers

## Error Handling

The logout implementation is designed to be resilient:

1. **Server Errors**: If token revocation fails on the server, local cleanup still proceeds
2. **Network Errors**: Logout continues even if network requests fail
3. **Storage Errors**: Local storage cleanup is attempted regardless of server response
4. **Graceful Degradation**: User is always logged out locally, even if server revocation fails

## Logout with Redirect

### New Feature: `logoutWithRedirect()`

The user store now provides a `logoutWithRedirect()` method that ensures proper async handling:

```typescript
// Basic usage - redirects to login page
await userStore.logoutWithRedirect()

// Custom redirect path
await userStore.logoutWithRedirect('/home')

// Redirect to any path
await userStore.logoutWithRedirect('/welcome')
```

### Benefits

1. **Proper Async Handling**: Waits for logout to complete before redirecting
2. **Error Resilience**: Multiple fallback mechanisms if redirect fails
3. **Consistent API**: Same method across all UI components
4. **Flexible Redirects**: Can redirect to any path, not just login

### Fallback Mechanisms

1. **Primary**: `router.push(redirectPath)`
2. **Secondary**: Retry `router.push(redirectPath)` on error
3. **Tertiary**: `window.location.href = redirectPath` as last resort

## Testing

### Manual Testing
Use the provided test utilities in `src/utils/logoutTest.ts` and `src/utils/logoutRedirectTest.ts`:

```typescript
import { runAllLogoutTests } from '@/utils/logoutTest'

// Test with credentials
const credentials = {
  username: 'test@example.com',
  password: 'password',
  client_id: 'your-client-id',
  grant_type: 'password'
}

await runAllLogoutTests(credentials)
```

### Browser Console Testing
The test utilities are also available in the browser console:

```javascript
// Test basic logout flow
await window.logoutTests.testLogoutFlow()

// Test with session composable
await window.logoutTests.testLogoutWithSession()

// Test complete login/logout cycle
await window.logoutTests.testLoginLogoutCycle({
  username: 'test@example.com',
  password: 'password',
  client_id: 'your-client-id',
  grant_type: 'password'
})

// Run all logout tests
await window.logoutTests.runAllLogoutTests()

// Test logout redirect functionality
await window.logoutRedirectTests.testLogoutRedirect()

// Test logout redirect with different paths
await window.logoutRedirectTests.testLogoutRedirectPaths()

// Test UI component logout handlers
window.logoutRedirectTests.testUIComponentLogoutHandlers()

// Run all logout redirect tests
await window.logoutRedirectTests.runAllLogoutRedirectTests()
```

## Security Considerations

1. **Token Revocation**: Tokens are properly revoked on the server to prevent unauthorized access
2. **Local Cleanup**: All sensitive data is removed from local storage
3. **Header Cleanup**: Authorization headers are cleared to prevent accidental reuse
4. **Error Logging**: Failed revocation attempts are logged for monitoring
5. **Graceful Degradation**: Logout succeeds locally even if server revocation fails

## Integration Points

### Router Guards
The router automatically redirects unauthenticated users to the login page after logout.

### Session Management
The global session composable ensures consistent state across the application.

### UI Components
All logout buttons and links use the same `userStore.logout()` method for consistency.

## Troubleshooting

### Common Issues

1. **Tokens Not Revoked**: Check network requests in browser dev tools
2. **Local Data Not Cleared**: Check localStorage in browser dev tools
3. **User Not Redirected**: Check router configuration and navigation guards
4. **Session State Inconsistent**: Check if all components are using the same store/composable

### Debug Steps

1. Open browser dev tools
2. Check Network tab for `/oauth2/revoke_token/` requests
3. Check Application tab > Local Storage for cleared keys
4. Check Console for error messages
5. Use test utilities to verify logout flow

## Future Enhancements

1. **Logout Confirmation**: Add confirmation dialog for logout
2. **Session Timeout**: Automatic logout on session timeout
3. **Multi-Device Logout**: Logout from all devices
4. **Audit Logging**: Log logout events for security monitoring
