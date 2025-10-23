import { QuestionDraft, QuestionType } from '../types'
import { QuizAIClient } from './QuizAIClient'

interface OpenAIQuizClientOptions {
  apiKey?: string
  model?: string
  temperature?: number
  maxContentLength?: number
  fetchImpl?: typeof fetch
}

type OpenAIStreamMessage = { text?: string }

type OpenAIResponse = {
  choices?: Array<{
    message?: {
      content?: string | OpenAIStreamMessage[]
    }
  }>
  output_text?: string[]
}

export class OpenAIQuizClient implements QuizAIClient {
  private readonly apiKey: string
  private readonly model: string
  private readonly temperature: number
  private readonly maxContentLength: number
  private readonly fetchImpl?: typeof fetch

  constructor(options: OpenAIQuizClientOptions = {}) {
    const globalFetch = typeof globalThis.fetch === 'function' ? globalThis.fetch.bind(globalThis) : undefined

    this.apiKey = options.apiKey ?? process.env.OPENAI_API_KEY ?? ''
    this.model = options.model ?? 'gpt-4o-mini'
    this.temperature = options.temperature ?? 0.2
    this.maxContentLength = options.maxContentLength ?? 4000
    this.fetchImpl = options.fetchImpl ?? globalFetch
  }

  canGenerate(): boolean {
    return Boolean(this.apiKey && this.fetchImpl)
  }

  async generate(content: string, type: QuestionType, count: number): Promise<QuestionDraft[]> {
    if (!this.canGenerate()) {
      throw new Error('OpenAI client not configured')
    }

    const fetch = this.fetchImpl!

    const prompt = this.buildPrompt(content, type, count)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        temperature: this.temperature,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: 'Você é um gerador de quizzes para estudantes brasileiros. Responda apenas com JSON válido.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI request failed with status ${response.status}`)
    }

    const payload = (await response.json()) as OpenAIResponse
    const rawContent = this.extractContent(payload)
    const data = this.parseJson(rawContent)

    if (!Array.isArray(data.questions)) {
      throw new Error('OpenAI response missing questions array')
    }

    return data.questions
      .slice(0, count)
      .map((question: unknown) => this.normalizeQuestion(question, type))
      .filter((question: QuestionDraft | null): question is QuestionDraft => question !== null)
  }

  private buildPrompt(content: string, type: QuestionType, count: number): string {
    const sanitized = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, this.maxContentLength)

    if (type === QuestionType.TrueFalse) {
      return `Gere exatamente ${count} questões de verdadeiro ou falso sobre o conteúdo a seguir. Use o formato JSON: {"questions": [{"text": string, "options": ["Verdadeiro", "Falso"], "correctAnswer": 0 ou 1, "explanation": string}]}. Conteúdo: ${sanitized}`
    }

    return `Gere ${count} questões de múltipla escolha em português brasileiro com quatro alternativas únicas (A, B, C, D) sobre o conteúdo a seguir. Use apenas o formato JSON: {"questions": [{"text": string, "options": [string, string, string, string], "correctAnswer": número de 0 a 3, "explanation": string}]}. Conteúdo: ${sanitized}`
  }

  private extractContent(payload: OpenAIResponse): string {
    if (Array.isArray(payload.output_text) && payload.output_text.length > 0) {
      return payload.output_text.join('\n')
    }

    const choice = payload.choices?.[0]?.message?.content

    if (Array.isArray(choice)) {
      return choice.map(part => part.text ?? '').join('').trim()
    }

    if (typeof choice === 'string') {
      return choice
    }

    throw new Error('OpenAI response did not contain textual content')
  }

  private parseJson(raw: string): { questions?: unknown } {
    try {
      return JSON.parse(raw) as { questions?: unknown }
    } catch (parseError) {
      const reason = parseError instanceof Error ? parseError.message : 'Unknown error'
      throw new Error(`Failed to parse JSON from OpenAI response: ${reason}`)
    }
  }

  private normalizeQuestion(candidate: unknown, type: QuestionType): QuestionDraft | null {
    if (!candidate || typeof candidate !== 'object') {
      return null
    }

    const text = this.extractString(candidate, 'text')
    const explanation = this.extractOptionalString(candidate, 'explanation')
    const options = this.extractOptions(candidate, type)
    const correctAnswer = this.extractCorrectAnswer(candidate, options.length)

    if (!text || options.length === 0) {
      return null
    }

    return {
      text,
      options,
      correctAnswer,
      explanation
    }
  }

  private extractString(candidate: unknown, key: string): string | null {
    if (!candidate || typeof candidate !== 'object') {
      return null
    }

    const value = (candidate as Record<string, unknown>)[key]
    return typeof value === 'string' ? value.trim() : null
  }

  private extractOptionalString(candidate: unknown, key: string): string | undefined {
    if (!candidate || typeof candidate !== 'object') {
      return undefined
    }

    const value = (candidate as Record<string, unknown>)[key]
    if (typeof value === 'string') {
      const trimmed = value.trim()
      return trimmed.length > 0 ? trimmed : undefined
    }

    return undefined
  }

  private extractOptions(candidate: unknown, type: QuestionType): string[] {
    if (!candidate || typeof candidate !== 'object') {
      return []
    }

    const rawOptions = (candidate as Record<string, unknown>).options

    if (!Array.isArray(rawOptions)) {
      return type === QuestionType.TrueFalse ? ['Verdadeiro', 'Falso'] : []
    }

    const options = rawOptions
      .map(option => (typeof option === 'string' ? option.trim() : null))
      .filter((option): option is string => Boolean(option))

    if (type === QuestionType.TrueFalse) {
      return ['Verdadeiro', 'Falso']
    }

    return options.slice(0, 4)
  }

  private extractCorrectAnswer(candidate: unknown, optionCount: number): number {
    if (!candidate || typeof candidate !== 'object') {
      return 0
    }

    const value = (candidate as Record<string, unknown>).correctAnswer

    if (typeof value === 'number' && value >= 0 && value < optionCount) {
      return value
    }

    return 0
  }
}
