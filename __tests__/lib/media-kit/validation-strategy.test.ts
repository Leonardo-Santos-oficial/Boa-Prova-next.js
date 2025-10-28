import { formValidator } from '@/lib/media-kit/validation-strategy'
import { ContactFormData } from '@/types/media-kit'

describe('MediaKit Validation Strategy', () => {
  const validFormData: ContactFormData = {
    name: 'João Silva',
    email: 'joao@empresa.com',
    company: 'Empresa LTDA',
    adType: 'banner-superior',
    message: 'Gostaria de anunciar no site.'
  }

  describe('RequiredFields Validation', () => {
    it('should pass with all fields filled', () => {
      const result = formValidator.validate(validFormData)
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should fail when name is missing', () => {
      const data = { ...validFormData, name: '' }
      const result = formValidator.validate(data)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.name).toBeDefined()
    })

    it('should fail when email is missing', () => {
      const data = { ...validFormData, email: '' }
      const result = formValidator.validate(data)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.email).toBeDefined()
    })

    it('should fail when company is missing', () => {
      const data = { ...validFormData, company: '' }
      const result = formValidator.validate(data)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.company).toBeDefined()
    })

    it('should fail when adType is missing', () => {
      const data = { ...validFormData, adType: '' }
      const result = formValidator.validate(data)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.adType).toBeDefined()
    })

    it('should fail when message is missing', () => {
      const data = { ...validFormData, message: '' }
      const result = formValidator.validate(data)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.message).toBeDefined()
    })
  })

  describe('Email Validation', () => {
    it('should pass with valid email', () => {
      const result = formValidator.validate(validFormData)
      expect(result.isValid).toBe(true)
    })

    it('should fail with invalid email format', () => {
      const data = { ...validFormData, email: 'invalid-email' }
      const result = formValidator.validate(data)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.email).toBeDefined()
    })

    it('should fail with email without @', () => {
      const data = { ...validFormData, email: 'emailsem-arroba.com' }
      const result = formValidator.validate(data)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.email).toBeDefined()
    })

    it('should fail with email without domain', () => {
      const data = { ...validFormData, email: 'email@' }
      const result = formValidator.validate(data)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.email).toBeDefined()
    })
  })

  describe('Message Length Validation', () => {
    it('should pass with valid message length', () => {
      const result = formValidator.validate(validFormData)
      expect(result.isValid).toBe(true)
    })

    it('should fail when message is too short', () => {
      const data = { ...validFormData, message: 'Curta' }
      const result = formValidator.validate(data)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.message).toContain('mínimo')
    })

    it('should fail when message is too long', () => {
      const data = { ...validFormData, message: 'a'.repeat(1001) }
      const result = formValidator.validate(data)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.message).toContain('máximo')
    })

    it('should pass with message at minimum length', () => {
      const data = { ...validFormData, message: 'a'.repeat(10) }
      const result = formValidator.validate(data)
      
      expect(result.isValid).toBe(true)
    })

    it('should pass with message at maximum length', () => {
      const data = { ...validFormData, message: 'a'.repeat(1000) }
      const result = formValidator.validate(data)
      
      expect(result.isValid).toBe(true)
    })
  })

  describe('Composite Validation', () => {
    it('should accumulate multiple errors', () => {
      const data: ContactFormData = {
        name: '',
        email: 'invalid',
        company: '',
        adType: '',
        message: 'x'
      }
      
      const result = formValidator.validate(data)
      
      expect(result.isValid).toBe(false)
      expect(Object.keys(result.errors).length).toBeGreaterThan(1)
    })

    it('should pass when all validations succeed', () => {
      const result = formValidator.validate(validFormData)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })
  })
})
