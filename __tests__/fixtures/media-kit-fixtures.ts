import { MediaKitStats } from '@/types/media-kit'
import { ContactFormData } from '@/types/media-kit'

export const mockMediaKitStats: MediaKitStats = {
  monthlyPageviews: 500000,
  monthlyUsers: 150000,
  avgSessionDuration: '4:32',
  bounceRate: '42%',
  topCategories: [
    { name: 'Concursos Públicos', percentage: 45 },
    { name: 'Direito', percentage: 25 },
    { name: 'Português', percentage: 15 },
    { name: 'Matemática', percentage: 10 },
    { name: 'Atualidades', percentage: 5 }
  ]
}

export const mockContactFormData: ContactFormData = {
  name: 'João Silva',
  email: 'joao@empresa.com',
  company: 'Empresa LTDA',
  adType: 'banner-superior',
  message: 'Gostaria de anunciar no site e saber mais sobre as opções disponíveis.'
}

export const mockInvalidContactFormData: ContactFormData = {
  name: '',
  email: 'invalid-email',
  company: '',
  adType: '',
  message: 'x'
}
