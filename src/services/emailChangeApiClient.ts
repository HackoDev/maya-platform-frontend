import { AuthApiClient } from './authApiClient'
import { CONTENT_TYPES } from './baseApiClient'

export interface SendOTPRequest {
  type: 'change_email'
  email: string
}

export interface SendOTPResponse {
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

export interface ChangeEmailRequest {
  otp_token: string
  new_email: string
}

export interface ChangeEmailResponse {
  message: string
  old_email: string
  new_email: string
}

/**
 * Email Change API Client class
 * Handles email change operations with OTP authentication
 */
export class EmailChangeApiClient extends AuthApiClient {
  constructor(baseURL?: string) {
    // Get base URL from environment variable or use provided/default
    // In development, use relative URLs to leverage Vite proxy
    const apiBaseURL = baseURL || ''

    // Call AuthApiClient constructor with proper parameters
    super(apiBaseURL)
    
    // Update headers for email change API calls
    this.setDefaultHeaders({
      ...this.getDefaultHeaders(),
      'Content-Type': CONTENT_TYPES.JSON,
    })
  }

  /**
   * Отправляет OTP код на указанный email для смены email
   */
  async sendChangeEmailOTP(email: string): Promise<SendOTPResponse> {
    const response = await this.authenticatedRequest<SendOTPResponse>(
      'POST',
      '/api/web/otp/send',
      {
        type: 'change_email',
        email: email
      }
    )
    return response
  }

  /**
   * Верифицирует OTP код
   */
  async verifyOTP(token: string, code: string): Promise<VerifyOTPResponse> {
    const response = await this.authenticatedRequest<VerifyOTPResponse>(
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
   * Меняет email пользователя
   */
  async changeEmail(otpToken: string, newEmail: string): Promise<ChangeEmailResponse> {
    const response = await this.authenticatedRequest<ChangeEmailResponse>(
      'POST',
      '/api/web/users/me/change-email',
      {
        otp_token: otpToken,
        new_email: newEmail
      }
    )
    return response
  }
}

// Create default instance
export const emailChangeApiClient = new EmailChangeApiClient()

// Export convenience functions
export const emailChangeApi = {
  sendChangeEmailOTP: (email: string) => emailChangeApiClient.sendChangeEmailOTP(email),
  verifyOTP: (token: string, code: string) => emailChangeApiClient.verifyOTP(token, code),
  changeEmail: (otpToken: string, newEmail: string) => emailChangeApiClient.changeEmail(otpToken, newEmail),
}

