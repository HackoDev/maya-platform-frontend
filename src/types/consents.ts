// Consent-related types

export type ConsentSubject = 'specialist' | 'client'

export interface PersonalData {
  firstName: string
  lastName: string
  email: string
  phone?: string
}

export interface ConsentPayload {
  subject: ConsentSubject
  personalData: PersonalData
  consents: {
    generalConsentAccepted: boolean
    privacyAccepted: boolean
    marketingAccepted?: boolean
  }
}

export interface ConsentResponse {
  id: string
  subject: ConsentSubject
  savedAt: string
}







