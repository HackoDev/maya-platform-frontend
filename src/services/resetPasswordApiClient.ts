import { AuthApiClient } from './authApiClient'
import { CONTENT_TYPES } from './baseApiClient'

export interface SendResetOTPRequest {
  type: 'reset_password'
  email: string
}

export interface SendResetOTPResponse {
  token: string
  message: string
}

export interface VerifyOTPRequest {
  token: string
  code: string
}

export interface VerifyOTPResponse {
  token: string
  verified: boolean
  message: string
}

export interface ResetPasswordRequest {
  otpToken: string
  newPassword: string
  confirmPassword: string
}

export interface ResetPasswordResponse {
  message: string
  email: string
}

/**
 * Reset Password API Client class
 * Handles password reset operations with OTP authentication
 */
export class ResetPasswordApiClient extends AuthApiClient {
  constructor(baseURL?: string) {
    // Get base URL from environment variable or use provided/default
    // In development, use relative URLs to leverage Vite proxy
    const apiBaseURL = baseURL || ''

    // Call AuthApiClient constructor with proper parameters
    super(apiBaseURL)
    
    // Update headers for reset password API calls
    this.setDefaultHeaders({
      ...this.getDefaultHeaders(),
      'Content-Type': CONTENT_TYPES.JSON,
    })
  }

  /**
   * Send OTP for password reset
   */
  async sendResetOTP(email: string): Promise<SendResetOTPResponse> {
    const response = await this.nonAuthenticatedRequest<SendResetOTPResponse>(
      'POST',
      '/api/web/otp/send',
      {
        type: 'reset_password',
        email: email
      }
    )
    return response
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(token: string, code: string): Promise<VerifyOTPResponse> {
    const response = await this.nonAuthenticatedRequest<VerifyOTPResponse>(
      'POST',
      '/api/web/otp/verify',
      {
        token: token,
        code: code
      }
    )
    return response
  }

  /**
   * Reset password using verified OTP token
   */
  async resetPassword(otpToken: string, newPassword: string, confirmPassword: string): Promise<ResetPasswordResponse> {
    const response = await this.nonAuthenticatedRequest<ResetPasswordResponse>(
      'POST',
      '/api/web/users/reset-password',
      {
        otpToken: otpToken,
        newPassword: newPassword,
        confirmPassword: confirmPassword
      }
    )
    return response
  }

  /**
   * Complete password reset flow
   */
  async resetPasswordFlow(email: string, otpCode: string, newPassword: string): Promise<ResetPasswordResponse> {
    try {
      // Step 1: Send OTP
      const sendResult = await this.sendResetOTP(email)
      console.log('OTP sent:', sendResult.message)
      
      // Step 2: Verify OTP
      const verifyResult = await this.verifyOTP(sendResult.token, otpCode)
      if (!verifyResult.verified) {
        throw new Error('OTP verification failed')
      }
      
      // Step 3: Reset password
      const resetResult = await this.resetPassword(
        verifyResult.token, 
        newPassword, 
        newPassword
      )
      
      console.log('Password reset successful:', resetResult.message)
      return resetResult
      
    } catch (error) {
      console.error('Password reset failed:', error)
      throw error
    }
  }
}

// Create default instance
export const resetPasswordApiClient = new ResetPasswordApiClient()

// Export convenience functions
export const resetPasswordApi = {
  sendResetOTP: (email: string) => resetPasswordApiClient.sendResetOTP(email),
  verifyOTP: (token: string, code: string) => resetPasswordApiClient.verifyOTP(token, code),
  resetPassword: (otpToken: string, newPassword: string, confirmPassword: string) => 
    resetPasswordApiClient.resetPassword(otpToken, newPassword, confirmPassword),
}
