import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { INITIAL_MODULES } from '../data/modules'
import { supabase, STUDENT_ID } from '../lib/supabase'

const AppContext = createContext(null)

// ── Helpers ──────────────────────────────────────────────────────────────────

// Map DB rows (snake_case) back into the shape the app expects
function mergeModules(initial, progressRows = [], notesRows = [], questionRows = []) {
  return initial.map((mod) => {
    const progress  = progressRows.find((p) => p.module_id === mod.id)
    const noteRow   = notesRows.find((n) => n.module_id === mod.id)
    const questions = questionRows
      .filter((q) => q.module_id === mod.id)
      .map((q) => ({
        id:         q.id,
        question:   q.question,
        askedAt:    q.asked_at,
        answer:     q.answer,
        answeredAt: q.answered_at,
      }))

    return {
      ...mod,
      status:    progress ? progress.status  : mod.status,
      lessons:   progress ? progress.lessons : mod.lessons,
      notes:     noteRow  ? noteRow.content  : mod.notes,
      questions: questions.length > 0 ? questions : mod.questions,
    }
  })
}

// Seed the initial placeholder data on first run
async function seedInitialData() {
  const { error: progressError } = await supabase.from('module_progress').upsert(
    INITIAL_MODULES.map((mod) => ({
      user_id:   STUDENT_ID,
      module_id: mod.id,
      status:    mod.status,
      lessons:   mod.lessons,
    }))
  )
  if (progressError) console.error('Seed progress error:', progressError)

  const noteRows = INITIAL_MODULES.filter((m) => m.notes).map((m) => ({
    user_id: STUDENT_ID, module_id: m.id, content: m.notes,
  }))
  if (noteRows.length) {
    const { error } = await supabase.from('notes').upsert(noteRows)
    if (error) console.error('Seed notes error:', error)
  }

  for (const mod of INITIAL_MODULES) {
    for (const q of mod.questions) {
      const { error } = await supabase.from('questions').insert({
        user_id:     STUDENT_ID,
        module_id:   mod.id,
        question:    q.question,
        asked_at:    q.askedAt,
        answer:      q.answer   ?? null,
        answered_at: q.answeredAt ?? null,
      })
      if (error) console.error('Seed question error:', error)
    }
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function AppProvider({ children }) {
  const [modules, setModules]                             = useState(INITIAL_MODULES)
  const [role, setRole]                                   = useState('student')
  const [loading, setLoading]                             = useState(true)
  const [completionCelebration, setCompletionCelebration] = useState(null)

  // Load from Supabase on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [progressRes, notesRes, questionsRes] = await Promise.all([
          supabase.from('module_progress').select('*').eq('user_id', STUDENT_ID),
          supabase.from('notes').select('*').eq('user_id', STUDENT_ID),
          supabase.from('questions').select('*').eq('user_id', STUDENT_ID).order('asked_at', { ascending: true }),
        ])

        if (progressRes.error) throw progressRes.error

        const hasData = progressRes.data?.length > 0

        if (hasData) {
          setModules(mergeModules(INITIAL_MODULES, progressRes.data, notesRes.data, questionsRes.data))
        } else {
          // First run — write the initial seed data to Supabase
          await seedInitialData()
          setModules(INITIAL_MODULES)
        }
      } catch (err) {
        console.error('Supabase load error:', err)
        // App still works with in-memory initial data as fallback
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // ── Actions ──────────────────────────────────────────────────────────────

  const completeLesson = useCallback((moduleId, lessonId) => {
    setModules((prev) => {
      const next = prev.map((m) => {
        if (m.id !== moduleId) return m
        return { ...m, lessons: m.lessons.map((l) => l.id === lessonId ? { ...l, completed: true } : l) }
      })
      const updated = next.find((m) => m.id === moduleId)
      supabase
        .from('module_progress')
        .upsert({ user_id: STUDENT_ID, module_id: moduleId, status: updated.status, lessons: updated.lessons })
        .then(({ error }) => { if (error) console.error('completeLesson DB error:', error) })
      return next
    })
  }, [])

  const completeModule = useCallback((moduleId) => {
    setModules((prev) => {
      const idx = prev.findIndex((m) => m.id === moduleId)
      if (idx === -1) return prev

      const next = prev.map((m, i) => {
        if (i === idx)
          return { ...m, status: 'completed', lessons: m.lessons.map((l) => ({ ...l, completed: true })) }
        if (i === idx + 1 && m.status === 'locked')
          return { ...m, status: 'available' }
        return m
      })

      const upserts = [
        { user_id: STUDENT_ID, module_id: next[idx].id, status: 'completed', lessons: next[idx].lessons },
      ]
      if (idx + 1 < next.length) {
        upserts.push({
          user_id: STUDENT_ID, module_id: next[idx + 1].id,
          status: next[idx + 1].status, lessons: next[idx + 1].lessons,
        })
      }
      supabase
        .from('module_progress')
        .upsert(upserts)
        .then(({ error }) => { if (error) console.error('completeModule DB error:', error) })

      return next
    })

    setCompletionCelebration(moduleId)
    setTimeout(() => setCompletionCelebration(null), 3000)
  }, [])

  const addQuestion = useCallback(async (moduleId, questionText) => {
    const { data, error } = await supabase
      .from('questions')
      .insert({ user_id: STUDENT_ID, module_id: moduleId, question: questionText, asked_at: new Date().toISOString() })
      .select()
      .single()

    if (error) { console.error('addQuestion DB error:', error); return }

    setModules((prev) =>
      prev.map((m) => {
        if (m.id !== moduleId) return m
        return {
          ...m,
          questions: [...m.questions, { id: data.id, question: data.question, askedAt: data.asked_at, answer: null, answeredAt: null }],
        }
      })
    )
  }, [])

  const answerQuestion = useCallback(async (moduleId, questionId, answerText) => {
    const answeredAt = new Date().toISOString()
    const { error } = await supabase
      .from('questions')
      .update({ answer: answerText, answered_at: answeredAt })
      .eq('id', questionId)

    if (error) { console.error('answerQuestion DB error:', error); return }

    setModules((prev) =>
      prev.map((m) => {
        if (m.id !== moduleId) return m
        return {
          ...m,
          questions: m.questions.map((q) =>
            q.id === questionId ? { ...q, answer: answerText, answeredAt } : q
          ),
        }
      })
    )
  }, [])

  const updateNotes = useCallback(async (moduleId, notes) => {
    setModules((prev) => prev.map((m) => (m.id === moduleId ? { ...m, notes } : m)))
    const { error } = await supabase
      .from('notes')
      .upsert({ user_id: STUDENT_ID, module_id: moduleId, content: notes })
    if (error) console.error('updateNotes DB error:', error)
  }, [])

  // ── Derived values ────────────────────────────────────────────────────────

  const completedCount  = modules.filter((m) => m.status === 'completed').length
  const totalCount      = modules.length
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
        loading,
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
