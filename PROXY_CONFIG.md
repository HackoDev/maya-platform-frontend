# Vite Proxy Configuration

This document explains the proxy configuration set up for the Maya Platform frontend.

## Overview

The Vite development server is configured to proxy API requests to the backend server running on `http://127.0.0.1:8000`. This allows the frontend to make API calls without CORS issues during development.

## Proxy Routes

### 1. API Routes (`/api/*`)
- **Target**: `http://127.0.0.1:8000`
- **Rewrite**: Removes `/api` prefix from the path
- **Example**: 
  - Frontend request: `GET /api/users`
  - Proxied to: `GET http://127.0.0.1:8000/users`

### 2. OAuth2 Routes (`/oauth2/*`)
- **Target**: `http://127.0.0.1:8000`
- **No rewrite**: Keeps the full path
- **Example**:
  - Frontend request: `POST /oauth2/token/`
  - Proxied to: `POST http://127.0.0.1:8000/oauth2/token/`

### 3. Admin Routes (`/admin/*`)
- **Target**: `http://127.0.0.1:8000`
- **No rewrite**: Keeps the full path
- **Example**:
  - Frontend request: `GET /admin/users`
  - Proxied to: `GET http://127.0.0.1:8000/admin/users`

### 4. Static Files (`/static/*`)
- **Target**: `http://127.0.0.1:8000`
- **No rewrite**: Keeps the full path
- **Example**:
  - Frontend request: `GET /static/css/style.css`
  - Proxied to: `GET http://127.0.0.1:8000/static/css/style.css`

### 5. Media Files (`/media/*`)
- **Target**: `http://127.0.0.1:8000`
- **No rewrite**: Keeps the full path
- **Example**:
  - Frontend request: `GET /media/avatars/user.jpg`
  - Proxied to: `GET http://127.0.0.1:8000/media/avatars/user.jpg`

## Configuration Details

### Proxy Options
- **changeOrigin**: `true` - Changes the origin of the host header to the target URL
- **secure**: `false` - Allows proxying to HTTP servers (not just HTTPS)
- **rewrite**: Function to modify the request path before proxying

### Logging
The proxy configuration includes logging for debugging:
- **proxyReq**: Logs outgoing requests
- **proxyRes**: Logs incoming responses
- **error**: Logs proxy errors

## Environment Variables

### Development
In development mode, the `authApiClient` uses relative URLs to leverage the proxy:

```typescript
// Development: Uses relative URLs (leverages proxy)
const apiBaseURL = '' // Empty string for relative URLs

// Production: Uses full URLs
const apiBaseURL = 'https://api.maya-platform.com'
```

### Environment Files
Create these files in your project root:

#### `.env.local` (for local development)
```env
# API Configuration
VITE_API_BASE_URL=
VITE_BASE_URL=

# OAuth2 Configuration
VITE_OAUTH_CLIENT_ID=XtBXtiE3ceaBoTdeagaLvBWArAhIR5oalakmwXFu

# App Configuration
VITE_APP_NAME=Maya Platform
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development
```

#### `.env.production` (for production builds)
```env
# API Configuration
VITE_API_BASE_URL=https://api.maya-platform.com
VITE_BASE_URL=https://api.maya-platform.com

# OAuth2 Configuration
VITE_OAUTH_CLIENT_ID=your-production-client-id

# App Configuration
VITE_APP_NAME=Maya Platform
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
```

## Usage Examples

### Making API Calls in Development
```typescript
// These will be proxied automatically in development
const response = await fetch('/api/users')
const tokenResponse = await fetch('/oauth2/token/', {
  method: 'POST',
  body: formData
})
```

### Using authApiClient
```typescript
import { authApi } from '@/services/authApiClient'

// In development: uses proxy
// In production: uses full URL
const response = await authApi.login({
  username: 'user@example.com',
  password: 'password'
})
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your backend server allows requests from `http://localhost:3000`

2. **Proxy Not Working**: 
   - Check that your backend server is running on `http://127.0.0.1:8000`
   - Verify the proxy configuration in `vite.config.ts`
   - Check the browser's Network tab for request details

3. **404 Errors**: 
   - Ensure the backend routes match the proxy configuration
   - Check if the path rewriting is correct

### Debugging
Enable proxy logging by checking the console output when making requests. You should see:
```
Sending Request to the Target: POST /oauth2/token/
Received Response from the Target: 200 /oauth2/token/
```

## Production Deployment

In production, the proxy configuration is not used. Instead:
1. Set the correct `VITE_API_BASE_URL` environment variable
2. Ensure your backend server is accessible at the production URL
3. Configure CORS properly on your backend server
4. Use HTTPS in production

## Backend Server Requirements

Your backend server should:
1. Run on `http://127.0.0.1:8000` for development
2. Handle CORS properly (or rely on the proxy)
3. Serve the API endpoints at the expected paths
4. Support the OAuth2 endpoints at `/oauth2/*`


