// Platform statistics and data models

export interface PlatformStatistics {
  portfolioCount: number
  vacancyCount: number
}

export interface PortfolioItem {
  id: string
  title: string
  description: string
  specialistId: string
  specialistName: string
  createdAt: string
  result?: string // Results from portfolio case
  tools?: string[] // Tools used in the project
}