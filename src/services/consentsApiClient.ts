import { AuthApiClient } from './authApiClient'
import { CONTENT_TYPES } from './baseApiClient'
import type { ConsentPayload, ConsentResponse } from '@/types/consents'

export class ConsentsApiClient extends AuthApiClient {
  constructor(baseURL?: string) {
    super(baseURL)
    this.setDefaultHeaders({
      ...this.getDefaultHeaders(),
      'Content-Type': CONTENT_TYPES.JSON,
    })
  }

  async saveConsent(payload: ConsentPayload): Promise<ConsentResponse> {
    return this.authenticatedRequest<ConsentResponse>('POST', '/api/web/consents', payload)
  }

  async getConsent(subject: 'specialist' | 'client'): Promise<ConsentResponse | null> {
    try {
      return await this.authenticatedRequest<ConsentResponse>('GET', `/api/web/consents/${subject}`)
    } catch (e: any) {
      if (e?.status === 404) return null
      throw e
    }
  }
}

export const consentsApiClient = new ConsentsApiClient()

export const consentsApi = {
  save: (payload: ConsentPayload) => consentsApiClient.saveConsent(payload),
  get: (subject: 'specialist' | 'client') => consentsApiClient.getConsent(subject),
}







