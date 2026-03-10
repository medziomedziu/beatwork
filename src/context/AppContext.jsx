import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { INITIAL_MODULES } from '../data/modules'
import { supabase, STUDENT_ID } from '../lib/supabase'

const AppContext = createContext(null)

// ── Storage keys ─────────────────────────────────────────────────────────────
const AUTH_KEY        = 'beatflow_auth'
const profileKey      = (id) => `beatflow_profile_${id}`

const DEFAULT_PROFILES = {
  zuzia:   { nickname: 'Zuzia',      avatarBase64: null },
  teacher: { nickname: 'Nauczyciel', avatarBase64: null },
}

function readAuth() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)) } catch { return null }
}

function readProfile(profileId) {
  try {
    return JSON.parse(localStorage.getItem(profileKey(profileId))) ?? DEFAULT_PROFILES[profileId]
  } catch {
    return DEFAULT_PROFILES[profileId]
  }
}

// ── Supabase helpers ──────────────────────────────────────────────────────────

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

async function seedInitialData() {
  const { error: e1 } = await supabase.from('module_progress').upsert(
    INITIAL_MODULES.map((m) => ({ user_id: STUDENT_ID, module_id: m.id, status: m.status, lessons: m.lessons }))
  )
  if (e1) console.error('Seed progress:', e1)

  const noteRows = INITIAL_MODULES.filter((m) => m.notes).map((m) => ({
    user_id: STUDENT_ID, module_id: m.id, content: m.notes,
  }))
  if (noteRows.length) {
    const { error: e2 } = await supabase.from('notes').upsert(noteRows)
    if (e2) console.error('Seed notes:', e2)
  }

  for (const mod of INITIAL_MODULES) {
    for (const q of mod.questions) {
      const { error } = await supabase.from('questions').insert({
        user_id: STUDENT_ID, module_id: mod.id,
        question: q.question, asked_at: q.askedAt,
        answer: q.answer ?? null, answered_at: q.answeredAt ?? null,
      })
      if (error) console.error('Seed question:', error)
    }
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function AppProvider({ children }) {
  const [auth, setAuth]                                   = useState(() => readAuth())
  const [profileData, setProfileData]                     = useState(() => readAuth() ? readProfile(readAuth().profile) : DEFAULT_PROFILES.zuzia)
  const [modules, setModules]                             = useState(INITIAL_MODULES)
  const [loading, setLoading]                             = useState(() => !!readAuth())
  const [completionCelebration, setCompletionCelebration] = useState(null)

  const role = auth?.profile === 'teacher' ? 'teacher' : 'student'

  // ── Load data whenever auth changes ──────────────────────────────────────
  useEffect(() => {
    if (!auth) { setLoading(false); return }
    setLoading(true)

    async function loadData() {
      try {
        const [progressRes, notesRes, questionsRes] = await Promise.all([
          supabase.from('module_progress').select('*').eq('user_id', STUDENT_ID),
          supabase.from('notes').select('*').eq('user_id', STUDENT_ID),
          supabase.from('questions').select('*').eq('user_id', STUDENT_ID).order('asked_at', { ascending: true }),
        ])
        if (progressRes.error) throw progressRes.error

        if (progressRes.data?.length > 0) {
          setModules(mergeModules(INITIAL_MODULES, progressRes.data, notesRes.data, questionsRes.data))
        } else {
          await seedInitialData()
          setModules(INITIAL_MODULES)
        }
      } catch (err) {
        console.error('Supabase load error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [auth?.profile])

  // ── Auth actions ──────────────────────────────────────────────────────────

  const login = useCallback((profileId) => {
    const authData = { profile: profileId }
    localStorage.setItem(AUTH_KEY, JSON.stringify(authData))
    setAuth(authData)
    setProfileData(readProfile(profileId))
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY)
    setAuth(null)
    setModules(INITIAL_MODULES)
  }, [])

  const updateProfile = useCallback(({ nickname, avatarBase64 }) => {
    if (!auth) return
    const updated = { nickname, avatarBase64 }
    localStorage.setItem(profileKey(auth.profile), JSON.stringify(updated))
    setProfileData(updated)
  }, [auth])

  // ── Module actions ────────────────────────────────────────────────────────

  // True toggle — checks and unchecks lessons
  const toggleLesson = useCallback((moduleId, lessonId) => {
    setModules((prev) => {
      const next = prev.map((m) => {
        if (m.id !== moduleId) return m
        return { ...m, lessons: m.lessons.map((l) => l.id === lessonId ? { ...l, completed: !l.completed } : l) }
      })
      const updated = next.find((m) => m.id === moduleId)
      supabase.from('module_progress')
        .upsert({ user_id: STUDENT_ID, module_id: moduleId, status: updated.status, lessons: updated.lessons })
        .then(({ error }) => { if (error) console.error('toggleLesson DB:', error) })
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
        upserts.push({ user_id: STUDENT_ID, module_id: next[idx + 1].id, status: next[idx + 1].status, lessons: next[idx + 1].lessons })
      }
      supabase.from('module_progress').upsert(upserts)
        .then(({ error }) => { if (error) console.error('completeModule DB:', error) })

      return next
    })

    setCompletionCelebration(moduleId)
    setTimeout(() => setCompletionCelebration(null), 3000)
  }, [])

  const uncompleteModule = useCallback((moduleId) => {
    setModules((prev) => {
      const idx = prev.findIndex((m) => m.id === moduleId)
      if (idx === -1 || prev[idx].status !== 'completed') return prev

      const shouldLockNext = idx + 1 < prev.length && prev[idx + 1].status === 'available'

      const next = prev.map((m, i) => {
        if (i === idx) return { ...m, status: 'in_progress' }
        if (i === idx + 1 && shouldLockNext) return { ...m, status: 'locked' }
        return m
      })

      const upserts = [
        { user_id: STUDENT_ID, module_id: next[idx].id, status: 'in_progress', lessons: next[idx].lessons },
      ]
      if (shouldLockNext) {
        upserts.push({ user_id: STUDENT_ID, module_id: next[idx + 1].id, status: 'locked', lessons: next[idx + 1].lessons })
      }
      supabase.from('module_progress').upsert(upserts)
        .then(({ error }) => { if (error) console.error('uncompleteModule DB:', error) })

      return next
    })
  }, [])

  const addQuestion = useCallback(async (moduleId, questionText) => {
    const { data, error } = await supabase
      .from('questions')
      .insert({ user_id: STUDENT_ID, module_id: moduleId, question: questionText, asked_at: new Date().toISOString() })
      .select().single()

    if (error) { console.error('addQuestion DB:', error); return }

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

    if (error) { console.error('answerQuestion DB:', error); return }

    setModules((prev) =>
      prev.map((m) => {
        if (m.id !== moduleId) return m
        return { ...m, questions: m.questions.map((q) => q.id === questionId ? { ...q, answer: answerText, answeredAt } : q) }
      })
    )
  }, [])

  const updateNotes = useCallback(async (moduleId, notes) => {
    setModules((prev) => prev.map((m) => (m.id === moduleId ? { ...m, notes } : m)))
    const { error } = await supabase.from('notes').upsert({ user_id: STUDENT_ID, module_id: moduleId, content: notes })
    if (error) console.error('updateNotes DB:', error)
  }, [])

  // ── Derived values ────────────────────────────────────────────────────────

  const completedCount  = modules.filter((m) => m.status === 'completed').length
  const totalCount      = modules.length
  const progressPercent = Math.round((completedCount / totalCount) * 100)

  const allUnanswered = modules.flatMap((m) =>
    m.questions.filter((q) => q.answer === null).map((q) => ({ ...q, moduleId: m.id, moduleTitle: m.title }))
  )

  return (
    <AppContext.Provider
      value={{
        auth,
        role,
        login,
        logout,
        profileData,
        updateProfile,
        loading,
        modules,
        completedCount,
        totalCount,
        progressPercent,
        completionCelebration,
        allUnanswered,
        student: { name: profileData.nickname, avatarBase64: profileData.avatarBase64 },
        toggleLesson,
        completeModule,
        uncompleteModule,
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
