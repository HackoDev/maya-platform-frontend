# Reset Password API Documentation

## Overview

This document describes the complete password reset flow using OTP (One-Time Password) verification. The process allows users who have forgotten their password to reset it securely without requiring authentication.

## API Endpoints

### 1. Send OTP for Password Reset

**Endpoint:** `POST /web/otp/send`

**Description:** Send a one-time password to the user's email for password reset.

**Request Body:**
```json
{
  "type": "reset_password",
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "token": "abc123def456",
  "message": "OTP sent successfully"
}
```

**Error Responses:**
- `400` - User with this email does not exist
- `400` - User with this email already exists (for signup type)

### 2. Verify OTP Code

**Endpoint:** `POST /web/otp/verify`

**Description:** Verify the OTP code received via email.

**Request Body:**
```json
{
  "token": "abc123def456",
  "code": "123456"
}
```

**Response (200):**
```json
{
  "token": "abc123def456",
  "verified": true,
  "message": "OTP verified successfully"
}
```

**Error Responses:**
- `400` - Invalid OTP token
- `400` - OTP has expired
- `400` - Maximum verification attempts exceeded
- `400` - Invalid OTP code

### 3. Reset Password

**Endpoint:** `POST /web/users/reset-password`

**Description:** Reset user password using verified OTP token. Does not require authentication.

**Request Body:**
```json
{
  "otpToken": "abc123def456",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Response (200):**
```json
{
  "message": "Password successfully reset",
  "email": "user@example.com"
}
```

**Error Responses:**
- `400` - Invalid OTP token
- `400` - OTP has not been verified
- `400` - OTP has already been used
- `400` - OTP has expired
- `400` - Invalid OTP type for password reset
- `400` - OTP is not associated with a user
- `400` - Passwords do not match
- `400` - Password validation errors (too short, too common, etc.)

## Complete Flow Example

### Step 1: Send OTP

```bash
curl -X POST "https://api.example.com/web/otp/send" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "reset_password",
    "email": "user@example.com"
  }'
```

**Response:**
```json
{
  "token": "abc123def456",
  "message": "OTP sent successfully"
}
```

### Step 2: Verify OTP

```bash
curl -X POST "https://api.example.com/web/otp/verify" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "abc123def456",
    "code": "123456"
  }'
```

**Response:**
```json
{
  "token": "abc123def456",
  "verified": true,
  "message": "OTP verified successfully"
}
```

### Step 3: Reset Password

```bash
curl -X POST "https://api.example.com/web/users/reset-password" \
  -H "Content-Type: application/json" \
  -d '{
    "otpToken": "abc123def456",
    "newPassword": "newpassword123",
    "confirmPassword": "newpassword123"
  }'
```

**Response:**
```json
{
  "message": "Password successfully reset",
  "email": "user@example.com"
}
```

## JavaScript Implementation

```javascript
class PasswordResetService {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async sendResetOTP(email) {
    const response = await fetch(`${this.baseURL}/web/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'reset_password',
        email: email
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail);
    }
    
    return await response.json();
  }

  async verifyOTP(token, code) {
    const response = await fetch(`${this.baseURL}/web/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: token,
        code: code
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail);
    }
    
    return await response.json();
  }

  async resetPassword(otpToken, newPassword, confirmPassword) {
    const response = await fetch(`${this.baseURL}/web/users/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        otpToken: otpToken,
        newPassword: newPassword,
        confirmPassword: confirmPassword
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail);
    }
    
    return await response.json();
  }

  // Complete password reset flow
  async resetPasswordFlow(email, otpCode, newPassword) {
    try {
      // Step 1: Send OTP
      const sendResult = await this.sendResetOTP(email);
      console.log('OTP sent:', sendResult.message);
      
      // Step 2: Verify OTP (in real app, user would enter the code)
      const verifyResult = await this.verifyOTP(sendResult.token, otpCode);
      if (!verifyResult.verified) {
        throw new Error('OTP verification failed');
      }
      
      // Step 3: Reset password
      const resetResult = await this.resetPassword(
        verifyResult.token, 
        newPassword, 
        newPassword
      );
      
      console.log('Password reset successful:', resetResult.message);
      return resetResult;
      
    } catch (error) {
      console.error('Password reset failed:', error.message);
      throw error;
    }
  }
}

// Usage example
const resetService = new PasswordResetService('https://api.example.com');

// Complete flow
resetService.resetPasswordFlow('user@example.com', '123456', 'newpassword123')
  .then(result => {
    console.log('Password reset completed:', result);
  })
  .catch(error => {
    console.error('Password reset failed:', error);
  });
```

## Important Notes

1. **No Authentication Required**: The reset password endpoint does not require authentication
2. **User Must Exist**: The user must exist in the system for password reset
3. **OTP Verification**: OTP must be verified before password reset
4. **One-Time Use**: Each OTP can only be used once
5. **Time Limit**: OTP expires after 15 minutes
6. **Password Validation**: New password must meet security requirements
7. **Email Confirmation**: User receives email with OTP code

## Security Considerations

- OTP tokens are unique and time-limited
- Password validation follows Django's built-in validators
- No authentication required for password reset (by design)
- OTP can only be used once
- User must have access to their email to complete reset

## Error Codes

- `400` - Validation errors (invalid data, expired OTP, etc.)
- `401` - Authentication errors (not applicable for reset password)
- `422` - Schema validation errors (invalid email format, password too short, etc.)

## Testing

The API includes comprehensive test coverage for:
- Successful password reset flow
- Invalid OTP tokens
- Unverified OTPs
- Expired OTPs
- Wrong OTP types
- Password validation
- Error handling
