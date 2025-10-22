import { StudyPlanOriginator, StudyPlanCaretaker } from '@/lib/study-tools/study-plan/StudyPlanMemento'
import { StudyPlan, StudyStrategyType, StudyTopic } from '@/lib/study-tools/study-plan/types'

describe('Study Plan Memento Pattern', () => {
  const createMockPlan = (): StudyPlan => ({
    id: 'test-plan',
    userId: 'user1',
    topics: [
      {
        id: 't1',
        title: 'Topic 1',
        estimatedHours: 4,
        priority: 'HIGH',
        completed: false
      }
    ],
    sessions: [
      {
        id: 's1',
        topicId: 't1',
        duration: 2,
        completed: false,
        scheduledDate: new Date()
      },
      {
        id: 's2',
        topicId: 't1',
        duration: 2,
        completed: false,
        scheduledDate: new Date()
      }
    ],
    strategy: StudyStrategyType.Regular,
    createdAt: new Date()
  })

  it('should save plan state to memento', () => {
    const plan = createMockPlan()
    const caretaker = new StudyPlanCaretaker()
    
    caretaker.save(plan)
    
    const history = caretaker.getHistory()
    expect(history).toHaveLength(1)
  })

  it('should restore plan from memento', () => {
    const plan = createMockPlan()
    const caretaker = new StudyPlanCaretaker()
    const originator = new StudyPlanOriginator(plan)
    
    caretaker.save(plan)
    
    originator.completeSession('s1')
    caretaker.save(originator.getPlan())
    
    const previousState = caretaker.restore(0)
    expect(previousState?.completedSessions).toBe(0)
  })

  it('should track completed sessions', () => {
    const plan = createMockPlan()
    const originator = new StudyPlanOriginator(plan)
    
    originator.completeSession('s1')
    
    const progress = originator.getProgress()
    expect(progress.completedSessions).toBe(1)
  })

  it('should mark topic as completed when all sessions done', () => {
    const plan = createMockPlan()
    const originator = new StudyPlanOriginator(plan)
    
    originator.completeSession('s1')
    originator.completeSession('s2')
    
    const updatedPlan = originator.getPlan()
    const topic = updatedPlan.topics.find(t => t.id === 't1')
    
    expect(topic?.completed).toBe(true)
  })

  it('should calculate progress correctly', () => {
    const plan = createMockPlan()
    const originator = new StudyPlanOriginator(plan)
    
    originator.completeSession('s1')
    
    const progress = originator.getProgress()
    
    expect(progress.completedSessions).toBe(1)
    expect(progress.totalSessions).toBe(2)
    expect(progress.hoursStudied).toBe(2)
    expect(progress.totalHours).toBe(4)
    expect(progress.percentageComplete).toBe(50)
  })

  it('should add new topic to plan', () => {
    const plan = createMockPlan()
    const originator = new StudyPlanOriginator(plan)
    
    const newTopic: StudyTopic = {
      id: 't2',
      title: 'New Topic',
      estimatedHours: 3,
      priority: 'MEDIUM',
      completed: false
    }
    
    originator.addTopic(newTopic)
    
    const updatedPlan = originator.getPlan()
    expect(updatedPlan.topics).toHaveLength(2)
  })

  it('should remove topic from plan', () => {
    const plan = createMockPlan()
    const originator = new StudyPlanOriginator(plan)
    
    originator.removeTopic('t1')
    
    const updatedPlan = originator.getPlan()
    expect(updatedPlan.topics).toHaveLength(0)
    expect(updatedPlan.sessions).toHaveLength(0)
  })

  it('should restore from memento state', () => {
    const plan = createMockPlan()
    const originator = new StudyPlanOriginator(plan)
    const caretaker = new StudyPlanCaretaker()
    
    caretaker.save(plan)
    
    originator.completeSession('s1')
    originator.completeSession('s2')
    
    const oldState = caretaker.restore(0)
    if (oldState) {
      originator.restoreFromMemento(oldState)
    }
    
    const restoredPlan = originator.getPlan()
    const completedSessions = restoredPlan.sessions.filter(s => s.completed).length
    
    expect(completedSessions).toBe(0)
  })

  it('should limit history size', () => {
    const plan = createMockPlan()
    const caretaker = new StudyPlanCaretaker()
    
    for (let i = 0; i < 15; i++) {
      caretaker.save(plan)
    }
    
    const history = caretaker.getHistory()
    expect(history.length).toBeLessThanOrEqual(10)
  })

  it('should get latest memento', () => {
    const plan = createMockPlan()
    const caretaker = new StudyPlanCaretaker()
    
    caretaker.save(plan)
    
    const originator = new StudyPlanOriginator(plan)
    originator.completeSession('s1')
    caretaker.save(originator.getPlan())
    
    const latest = caretaker.getLatest()
    expect(latest?.completedSessions).toBe(1)
  })

  it('should clear history', () => {
    const plan = createMockPlan()
    const caretaker = new StudyPlanCaretaker()
    
    caretaker.save(plan)
    caretaker.save(plan)
    
    caretaker.clear()
    
    expect(caretaker.getHistory()).toHaveLength(0)
  })
})
