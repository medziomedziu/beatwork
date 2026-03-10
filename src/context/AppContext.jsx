import { createContext, useContext, useState, useCallback } from 'react'
import { INITIAL_MODULES } from '../data/modules'

const AppContext = createContext(null)

const STORAGE_KEY = 'beatflow_state'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return null
}

function saveState(modules) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(modules))
  } catch {
    // ignore
  }
}

export function AppProvider({ children }) {
  const [modules, setModules] = useState(() => loadState() ?? INITIAL_MODULES)
  const [role, setRole] = useState('student') // 'student' | 'teacher'
  const [completionCelebration, setCompletionCelebration] = useState(null) // moduleId

  const updateModules = useCallback((updater) => {
    setModules((prev) => {
      const next = updater(prev)
      saveState(next)
      return next
    })
  }, [])

  const completeLesson = useCallback(
    (moduleId, lessonId) => {
      updateModules((prev) =>
        prev.map((m) => {
          if (m.id !== moduleId) return m
          const lessons = m.lessons.map((l) =>
            l.id === lessonId ? { ...l, completed: true } : l
          )
          return { ...m, lessons }
        })
      )
    },
    [updateModules]
  )

  const completeModule = useCallback(
    (moduleId) => {
      updateModules((prev) => {
        const idx = prev.findIndex((m) => m.id === moduleId)
        if (idx === -1) return prev
        return prev.map((m, i) => {
          if (i === idx) {
            return {
              ...m,
              status: 'completed',
              lessons: m.lessons.map((l) => ({ ...l, completed: true })),
            }
          }
          if (i === idx + 1 && m.status === 'locked') {
            return { ...m, status: 'available' }
          }
          return m
        })
      })
      setCompletionCelebration(moduleId)
      setTimeout(() => setCompletionCelebration(null), 3000)
    },
    [updateModules]
  )

  const addQuestion = useCallback(
    (moduleId, questionText) => {
      updateModules((prev) =>
        prev.map((m) => {
          if (m.id !== moduleId) return m
          const newQuestion = {
            id: Date.now(),
            question: questionText,
            askedAt: new Date().toISOString(),
            answer: null,
            answeredAt: null,
          }
          return { ...m, questions: [...m.questions, newQuestion] }
        })
      )
    },
    [updateModules]
  )

  const answerQuestion = useCallback(
    (moduleId, questionId, answerText) => {
      updateModules((prev) =>
        prev.map((m) => {
          if (m.id !== moduleId) return m
          return {
            ...m,
            questions: m.questions.map((q) =>
              q.id === questionId
                ? { ...q, answer: answerText, answeredAt: new Date().toISOString() }
                : q
            ),
          }
        })
      )
    },
    [updateModules]
  )

  const updateNotes = useCallback(
    (moduleId, notes) => {
      updateModules((prev) =>
        prev.map((m) => (m.id === moduleId ? { ...m, notes } : m))
      )
    },
    [updateModules]
  )

  const resetProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setModules(INITIAL_MODULES)
  }, [])

  const completedCount = modules.filter((m) => m.status === 'completed').length
  const totalCount = modules.length
  const progressPercent = Math.round((completedCount / totalCount) * 100)

  const allUnanswered = modules.flatMap((m) =>
    m.questions
      .filter((q) => q.answer === null)
      .map((q) => ({ ...q, moduleId: m.id, moduleTitle: m.title }))
  )

  return (
    <AppContext.Provider
      value={{
        modules,
        role,
        setRole,
        completedCount,
        totalCount,
        progressPercent,
        completionCelebration,
        allUnanswered,
        student: { name: 'Ania' },
        completeLesson,
        completeModule,
        addQuestion,
        answerQuestion,
        updateNotes,
        resetProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
