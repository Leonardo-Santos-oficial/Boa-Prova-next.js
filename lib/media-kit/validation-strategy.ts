import { ContactFormData, ValidationResult } from '@/types/media-kit'

export interface ValidationStrategy {
  validate(data: ContactFormData): ValidationResult
}

class EmailValidationStrategy implements ValidationStrategy {
  validate(data: ContactFormData): ValidationResult {
    const errors: Record<string, string> = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(data.email)) {
      errors.email = 'Email inválido'
    }

    if (!data.email.includes('@') || !data.email.includes('.')) {
      errors.email = 'Email deve conter @ e domínio válido'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }
}

class RequiredFieldsValidationStrategy implements ValidationStrategy {
  private requiredFields: (keyof ContactFormData)[] = [
    'name',
    'email',
    'company',
    'adType',
    'message'
  ]

  validate(data: ContactFormData): ValidationResult {
    const errors: Record<string, string> = {}

    this.requiredFields.forEach((field) => {
      if (!data[field] || data[field].trim() === '') {
        errors[field] = `Campo ${this.getFieldLabel(field)} é obrigatório`
      }
    })

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  private getFieldLabel(field: keyof ContactFormData): string {
    const labels: Record<keyof ContactFormData, string> = {
      name: 'Nome',
      email: 'Email',
      company: 'Empresa',
      adType: 'Tipo de Anúncio',
      message: 'Mensagem'
    }
    return labels[field]
  }
}

class MessageLengthValidationStrategy implements ValidationStrategy {
  private minLength = 10
  private maxLength = 1000

  validate(data: ContactFormData): ValidationResult {
    const errors: Record<string, string> = {}

    if (data.message.length < this.minLength) {
      errors.message = `Mensagem deve ter no mínimo ${this.minLength} caracteres`
    }

    if (data.message.length > this.maxLength) {
      errors.message = `Mensagem deve ter no máximo ${this.maxLength} caracteres`
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }
}

export class CompositeValidationStrategy implements ValidationStrategy {
  private strategies: ValidationStrategy[]

  constructor(strategies: ValidationStrategy[]) {
    this.strategies = strategies
  }

  validate(data: ContactFormData): ValidationResult {
    let allErrors: Record<string, string> = {}

    for (const strategy of this.strategies) {
      const result = strategy.validate(data)
      if (!result.isValid) {
        allErrors = { ...allErrors, ...result.errors }
      }
    }

    return {
      isValid: Object.keys(allErrors).length === 0,
      errors: allErrors
    }
  }
}

export const formValidator = new CompositeValidationStrategy([
  new RequiredFieldsValidationStrategy(),
  new EmailValidationStrategy(),
  new MessageLengthValidationStrategy()
])
