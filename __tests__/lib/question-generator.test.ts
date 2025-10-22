import { QuestionGenerator } from '@/lib/study-tools/quiz/QuestionGenerator'
import { QuestionType } from '@/lib/study-tools/quiz/types'

describe('Question Generator Strategy Pattern', () => {
  const mockContent = `
    <p>A Constituição Federal é a lei fundamental do Brasil.</p>
    <p>O Poder Legislativo é exercido pelo Congresso Nacional.</p>
    <p>Os direitos fundamentais estão previstos no artigo 5º da Constituição.</p>
    <p>O Brasil adota o sistema presidencialista de governo.</p>
    <p>A democracia é um dos pilares da República.</p>
    <p>O voto é obrigatório para maiores de 18 anos.</p>
    <p>A Constituição foi promulgada em 1988.</p>
    <p>O Estado de Direito garante direitos e deveres.</p>
    <p>A separação dos poderes é fundamental.</p>
    <p>O Poder Judiciário é independente.</p>
  `

  it('should generate multiple choice questions', async () => {
    const generator = new QuestionGenerator()
    const questions = await generator.generateQuestions(mockContent, QuestionType.MultipleChoice, 2)
    
    expect(questions.length).toBeGreaterThanOrEqual(1)
    questions.forEach(q => {
      expect(q.type).toBe(QuestionType.MultipleChoice)
      expect(q.options).toHaveLength(4)
      expect(q.correctAnswer).toBeGreaterThanOrEqual(0)
      expect(q.correctAnswer).toBeLessThan(4)
    })
  })

  it('should generate true/false questions', async () => {
    const generator = new QuestionGenerator()
    const questions = await generator.generateQuestions(mockContent, QuestionType.TrueFalse, 2)
    
    expect(questions).toHaveLength(2)
    questions.forEach(q => {
      expect(q.type).toBe(QuestionType.TrueFalse)
      expect(q.options).toHaveLength(2)
      expect(q.options).toContain('Verdadeiro')
      expect(q.options).toContain('Falso')
    })
  })

  it('should generate mixed quiz', async () => {
    const generator = new QuestionGenerator()
    const questions = await generator.generateMixedQuiz(mockContent, 10)
    
    expect(questions.length).toBeGreaterThanOrEqual(5)
    
    const mcqCount = questions.filter(q => q.type === QuestionType.MultipleChoice).length
    const tfCount = questions.filter(q => q.type === QuestionType.TrueFalse).length
    
    expect(mcqCount).toBeGreaterThan(0)
    expect(tfCount).toBeGreaterThan(0)
  })

  it('should throw error for unsupported question type', async () => {
    const generator = new QuestionGenerator()
    
    await expect(
      generator.generateQuestions(mockContent, 'UNSUPPORTED' as QuestionType, 1)
    ).rejects.toThrow()
  })

  it('should include question ID and text', async () => {
    const generator = new QuestionGenerator()
    const questions = await generator.generateQuestions(mockContent, QuestionType.MultipleChoice, 1)
    
    expect(questions[0].id).toBeDefined()
    expect(questions[0].text).toBeDefined()
    expect(questions[0].text.length).toBeGreaterThan(0)
  })
})
