import type { GetStaticProps } from 'next'
import { MediaKitStats } from '@/types/media-kit'
import { MediaKitService } from '@/lib/media-kit/media-kit-service'
import { StatsSection } from '@/components/media-kit/StatsSection'
import { AudienceSection } from '@/components/media-kit/AudienceSection'
import { AdFormatsSection } from '@/components/media-kit/AdFormatsSection'
import { PerformanceSection } from '@/components/media-kit/PerformanceSection'
import { ContactForm } from '@/components/media-kit/ContactForm'

interface MediaKitPageProps {
  stats: MediaKitStats
}

export default function MediaKitPage({ stats }: MediaKitPageProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Anuncie no Boa Prova
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Alcance milhares de estudantes focados em concursos públicos e vestibulares
        </p>
      </header>

      <StatsSection stats={stats} />
      <AudienceSection stats={stats} />
      <AdFormatsSection />
      <PerformanceSection />
      <ContactForm />
    </div>
  )
}

export const getStaticProps: GetStaticProps<MediaKitPageProps> = async () => {
  const stats = await MediaKitService.getStatsAsync()

  return {
    props: { stats },
    revalidate: 86400
  }
}
