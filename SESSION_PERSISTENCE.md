# Session Persistence Implementation

This document explains how session persistence works in the Maya Platform frontend, ensuring users remain logged in after page reloads.

## 🎯 **Overview**

The session persistence system automatically:
- **Stores** authentication tokens and user data in localStorage
- **Restores** session on app startup/page reload
- **Validates** stored tokens before using them
- **Refreshes** expired tokens automatically
- **Clears** invalid sessions gracefully

## 🏗️ **Architecture**

### **1. Storage Layer (`authApiClient.ts`)**
```typescript
// Token storage interface
interface TokenStorage {
  getToken(): string | null
  setToken(token: string): void
  removeToken(): void
  getRefreshToken(): string | null
  setRefreshToken(token: string): void
  removeRefreshToken(): void
  getUser(): User | null
  setUser(user: User): void
  removeUser(): void
}
```

### **2. Session Management (`useSession.ts`)**
```typescript
// Session state management
interface SessionState {
  isInitialized: boolean
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
```

### **3. App Initialization (`main.ts`)**
```typescript
// Automatic session restoration on app startup
const session = useGlobalSession()
const hasAuth = await session.initializeSession()
```

## 🔄 **Session Lifecycle**

### **1. Login Process**
```typescript
// User logs in
const response = await authApi.login(credentials)

// Tokens and user data are automatically stored
localStorage.setItem('auth_access_token', response.access_token)
localStorage.setItem('auth_refresh_token', response.refresh_token)
localStorage.setItem('auth_user', JSON.stringify(response.user))
```

### **2. Page Reload/Restart**
```typescript
// App starts up
const session = useGlobalSession()

// Session is automatically restored
await session.initializeSession()

// If valid token exists, user is logged in
if (session.isAuthenticated.value) {
  console.log('User session restored:', session.currentUser.value.name)
}
```

### **3. Token Validation**
```typescript
// Periodic token validation (every 5 minutes)
setInterval(async () => {
  const isValid = await validateStoredToken()
  if (!isValid) {
    await clearSession() // Auto-logout on invalid token
  }
}, 5 * 60 * 1000)
```

### **4. Token Refresh**
```typescript
// Automatic token refresh on 401 responses
try {
  await authApi.get('/protected-endpoint')
} catch (error) {
  if (error.status === 401) {
    await authApi.refreshToken() // Auto-refresh
    // Retry original request
  }
}
```

## 📁 **File Structure**

```
src/
├── services/
│   └── authApiClient.ts          # OAuth2 client with token storage
├── stores/
│   └── user.ts                   # User store with session integration
├── composables/
│   └── useSession.ts             # Session management composable
├── utils/
│   └── sessionTest.ts            # Session testing utilities
├── router/
│   └── index.ts                  # Router with auth guards
└── main.ts                       # App initialization with session restore
```

## 🚀 **Usage Examples**

### **1. Component Usage**
```vue
<script setup>
import { useGlobalSession } from '@/composables/useSession'

const session = useGlobalSession()

// Reactive session state
const isAuthenticated = computed(() => session.isAuthenticated.value)
const currentUser = computed(() => session.currentUser.value)
const isLoading = computed(() => session.isLoading.value)

// Session actions
const handleLogin = async (email, password) => {
  const success = await session.login(email, password)
  if (success) {
    // User is logged in and session is stored
    router.push('/dashboard')
  }
}

const handleLogout = async () => {
  await session.logout()
  // Session is cleared from localStorage
  router.push('/login')
}
</script>
```

### **2. Router Guards**
```typescript
// Automatic authentication checking
router.beforeEach(async (to, _from, next) => {
  const session = useGlobalSession()
  
  // Wait for session initialization
  if (session.isLoading.value) {
    // Wait for session to be ready
    return
  }
  
  // Check authentication
  if (to.meta.requiresAuth && !session.isAuthenticated.value) {
    next({ name: 'Login' })
    return
  }
  
  next()
})
```

### **3. API Calls**
```typescript
// All API calls automatically include stored tokens
const userProfile = await authApi.get('/user/profile')
const updatedUser = await authApi.patch('/user/profile', userData)

// Tokens are automatically refreshed if expired
// User data is automatically synced
```

## 🧪 **Testing Session Persistence**

### **Browser Console Testing**
```javascript
// Test session persistence
window.testSession.runAll()

// Test specific functionality
window.testSession.persistence()  // Test login and storage
window.testSession.integrity()    // Check stored data
window.testSession.reload()       // Simulate page reload
window.testSession.expiration()   // Test token expiration
```

### **Manual Testing Steps**
1. **Login** to the application
2. **Reload** the page (F5 or Ctrl+R)
3. **Verify** user remains logged in
4. **Check** console for session restoration logs
5. **Navigate** to protected routes

## 🔧 **Configuration**

### **Environment Variables**
```env
# Development (uses proxy)
VITE_API_BASE_URL=
VITE_OAUTH_CLIENT_ID=XtBXtiE3ceaBoTdeagaLvBWArAhIR5oalakmwXFu

# Production (uses full URLs)
VITE_API_BASE_URL=https://api.maya-platform.com
VITE_OAUTH_CLIENT_ID=your-production-client-id
```

### **Storage Keys**
```typescript
// localStorage keys used
const ACCESS_TOKEN_KEY = 'auth_access_token'
const REFRESH_TOKEN_KEY = 'auth_refresh_token'
const USER_KEY = 'auth_user'
```

## 🛡️ **Security Features**

### **1. Token Validation**
- **Stored tokens** are validated before use
- **Invalid tokens** are automatically cleared
- **Expired tokens** trigger automatic refresh

### **2. Automatic Cleanup**
- **Failed refresh** attempts clear the session
- **Network errors** don't corrupt stored data
- **Invalid data** is detected and removed

### **3. Secure Storage**
- **Tokens** are stored in localStorage (not sessionStorage)
- **User data** is JSON serialized safely
- **No sensitive data** is logged to console

## 📊 **Session State Flow**

```
App Start
    ↓
Initialize Session
    ↓
Check localStorage
    ↓
┌─ Has Token? ─ No ─→ Not Authenticated
│     ↓ Yes
│   Validate Token
│     ↓
│   ┌─ Valid? ─ No ─→ Clear Session
│   │    ↓ Yes
│   │  Restore User
│   │    ↓
│   └─ Authenticated
│
└─ Start Token Validation Timer
```

## 🔍 **Debugging**

### **Console Logs**
```javascript
// Session initialization
🚀 Initializing app...
✅ User session restored from localStorage
👤 Current user: John Doe

// Token validation
🔄 Token expired, clearing session
✅ Token refreshed successfully

// Navigation
⏳ Waiting for session initialization...
🔒 Route requires authentication, redirecting to login
```

### **Browser DevTools**
1. **Application Tab** → Local Storage → Check stored keys
2. **Network Tab** → Monitor API requests with tokens
3. **Console Tab** → View session logs and errors

## ⚠️ **Important Notes**

1. **Development vs Production**: Uses different base URLs automatically
2. **Token Expiration**: Tokens are validated every 5 minutes
3. **Network Issues**: Failed requests don't clear valid sessions
4. **Browser Compatibility**: Uses standard localStorage API
5. **Memory Management**: Intervals are cleaned up on component unmount

## 🎉 **Benefits**

- ✅ **Seamless UX**: Users stay logged in across sessions
- ✅ **Automatic Recovery**: Handles token expiration gracefully
- ✅ **Secure**: Validates tokens before use
- ✅ **Robust**: Handles network errors and edge cases
- ✅ **Testable**: Comprehensive testing utilities included
- ✅ **Maintainable**: Clean separation of concerns

The session persistence system ensures a smooth user experience while maintaining security and reliability across page reloads and app restarts.


