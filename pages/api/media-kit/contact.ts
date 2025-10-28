import type { NextApiRequest, NextApiResponse } from 'next'
import { ContactFormData, ValidationResult } from '@/types/media-kit'
import { formValidator } from '@/lib/media-kit/validation-strategy'

interface ContactResponse {
  success: boolean
  message: string
  errors?: Record<string, string>
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ContactResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    })
  }

  try {
    const formData: ContactFormData = req.body

    const validation: ValidationResult = formValidator.validate(formData)

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      })
    }

    console.log('[Media Kit Contact]', {
      name: formData.name,
      email: formData.email,
      company: formData.company,
      adType: formData.adType,
      messageLength: formData.message.length,
      timestamp: new Date().toISOString()
    })

    return res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully'
    })
  } catch (error) {
    console.error('[Media Kit Contact Error]', error)
    
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}
