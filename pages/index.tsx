import Head from 'next/head'
import Card from '@/components/core/Card'
import Button from '@/components/core/Button'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>Boa Prova - Estudos para Concursos Públicos</title>
        <meta name="description" content="Plataforma moderna de estudos para concursos públicos com ferramentas interativas" />
      </Head>

      <div className="space-y-12">
        <section className="text-center py-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Bem-vindo ao Boa Prova
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Sua plataforma de estudos para concursos públicos com ferramentas interativas 
            que vão te ajudar a alcançar a aprovação.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Direito Constitucional
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Conteúdo completo sobre direito constitucional para concursos.
            </p>
            <Link href="/direito-constitucional">
              <Button>Acessar</Button>
            </Link>
          </Card>

          <Card>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Língua Portuguesa
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Gramática, interpretação de texto e redação.
            </p>
            <Link href="/lingua-portuguesa">
              <Button>Acessar</Button>
            </Link>
          </Card>

          <Card>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Raciocínio Lógico
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Exercícios e teoria de raciocínio lógico.
            </p>
            <Link href="/raciocinio-logico">
              <Button>Acessar</Button>
            </Link>
          </Card>
        </section>

        <section className="bg-primary-50 dark:bg-gray-800 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
            Ferramentas de Estudo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="text-center">
              <div className="text-4xl mb-2">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Modo Foco
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Esconda distrações e foque no conteúdo
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">⏱️</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Pomodoro Timer
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Gerencie seu tempo de estudo
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">❓</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Quiz Automático
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Gere quizzes baseados no conteúdo
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Plano de Estudos
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Organize sua jornada de aprovação
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
