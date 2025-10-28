export interface MediaKitStats {
  monthlyPageviews: number
  monthlyUsers: number
  avgSessionDuration: string
  bounceRate: string
  topCategories: Array<{
    name: string
    percentage: number
  }>
}

export interface ContactFormData {
  name: string
  email: string
  company: string
  adType: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}
