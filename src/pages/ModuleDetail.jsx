import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  Clock,
  Target,
  CheckCircle2,
  Check,
  BookOpen,
  Lock,
  ChevronRight,
  Save,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import VideoPlaceholder from '../components/VideoPlaceholder'
import QAThread from '../components/QAThread'
import CompletionAnimation from '../components/CompletionAnimation'

function useDebounce(fn, delay) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export default function ModuleDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { modules, completeLesson, completeModule, updateNotes, completionCelebration } =
    useApp()

  const module = modules.find((m) => m.id === Number(id))

  const [notesDraft, setNotesDraft] = useState(module?.notes ?? '')
  const [notesSaved, setNotesSaved] = useState(false)
  const [localCelebration, setLocalCelebration] = useState(false)

  // Keep notesDraft in sync if module changes
  useEffect(() => {
    if (module) setNotesDraft(module.notes)
  }, [module?.id])

  const saveNotes = useCallback(
    (text) => {
      if (!module) return
      updateNotes(module.id, text)
      setNotesSaved(true)
      setTimeout(() => setNotesSaved(false), 2500)
    },
    [module, updateNotes]
  )

  const handleNotesChange = (e) => {
    const val = e.target.value
    setNotesDraft(val)
    // debounce auto-save
    clearTimeout(window.__notesSaveTimer__)
    window.__notesSaveTimer__ = setTimeout(() => saveNotes(val), 1000)
  }

  if (!module) {
    return (
      <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
        <p style={{ color: 'var(--text-muted)' }}>Module not found.</p>
        <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={() => navigate('/')}>
          Go back
        </button>
      </div>
    )
  }

  if (module.status === 'locked') {
    return (
      <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
        <div
          style={{
            width: 56,
            height: 56,
            background: 'var(--surface-warm)',
            borderRadius: 'var(--r-full)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <Lock style={{ color: 'var(--text-light)', width: 24, height: 24 }} />
        </div>
        <div
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.5rem',
            fontWeight: 600,
            color: 'var(--text)',
            marginBottom: 8,
          }}
        >
          Module Locked
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 24 }}>
          Complete the previous module to unlock this one.
        </p>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          <ChevronLeft />
          Back to Dashboard
        </button>
      </div>
    )
  }

  const isCompleted = module.status === 'completed'
  const allLessonsComplete = module.lessons.every((l) => l.completed)
  const lessonProgress = Math.round(
    (module.lessons.filter((l) => l.completed).length / module.lessons.length) * 100
  )

  const prevModule = modules.find((m) => m.id === module.id - 1)
  const nextModule = modules.find((m) => m.id === module.id + 1)

  const handleComplete = () => {
    if (isCompleted) return
    setLocalCelebration(true)
    completeModule(module.id)
    setTimeout(() => setLocalCelebration(false), 3500)
  }

  return (
    <div className="page">
      <CompletionAnimation visible={localCelebration} />

      {/* Back */}
      <button className="module-detail-back" onClick={() => navigate('/')}>
        <ChevronLeft />
        All Modules
      </button>

      {/* Header */}
      <motion.div
        className="module-detail-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="module-detail-meta">
          <span className="module-detail-num">Module {String(module.id).padStart(2, '0')}</span>
          <span style={{ color: 'var(--border-strong)' }}>·</span>
          <span
            className={`module-card-status ${
              isCompleted ? 'status-completed' : 'status-in_progress'
            }`}
            style={{ fontSize: '0.7rem' }}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 style={{ width: 10, height: 10 }} /> Completed
              </>
            ) : (
              <>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    display: 'inline-block',
                  }}
                />
                In Progress
              </>
            )}
          </span>
        </div>

        <h1 className="module-detail-title">{module.title}</h1>
        <p className="module-detail-desc">{module.description}</p>

        <div className="module-detail-time-row">
          <Clock />
          {module.estimatedTime}
        </div>
      </motion.div>

      {/* Video placeholder */}
      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <VideoPlaceholder title={module.lessons[0]?.title.replace('Watch: ', '')} />
      </motion.div>

      {/* Objectives */}
      <motion.div
        className="section-card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
      >
        <div className="section-card-title">
          <Target />
          What you'll learn
        </div>
        <ul className="objectives-list">
          {module.objectives.map((obj, i) => (
            <li key={i}>
              <div className="objective-bullet">
                <Check />
              </div>
              {obj}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Lessons checklist */}
      <motion.div
        className="section-card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.35 }}
      >
        <div className="section-card-title">
          <BookOpen />
          Lessons
          <span
            style={{
              marginLeft: 'auto',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-sans)',
              fontWeight: 500,
            }}
          >
            {module.lessons.filter((l) => l.completed).length}/{module.lessons.length} done
          </span>
        </div>

        {/* Mini progress */}
        <div
          style={{
            height: 4,
            background: 'var(--surface-warm)',
            borderRadius: 'var(--r-full)',
            marginBottom: 16,
            overflow: 'hidden',
          }}
        >
          <motion.div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, var(--primary), var(--primary-light))',
              borderRadius: 'var(--r-full)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${lessonProgress}%` }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>

        <div className="lessons-list">
          {module.lessons.map((lesson) => (
            <div
              key={lesson.id}
              className={`lesson-item${lesson.completed ? ' completed' : ''}`}
              onClick={() => {
                if (!isCompleted) completeLesson(module.id, lesson.id)
              }}
              role="checkbox"
              aria-checked={lesson.completed}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault()
                  if (!isCompleted) completeLesson(module.id, lesson.id)
                }
              }}
            >
              <div className="lesson-checkbox">
                <AnimatePresence>
                  {lesson.completed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      <Check />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <span className="lesson-title">{lesson.title}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Notes */}
      <motion.div
        className="section-card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.35 }}
      >
        <div className="section-card-title">
          <BookOpen />
          My Notes
        </div>
        <textarea
          className="notes-textarea"
          placeholder="Write your notes here — key takeaways, things to remember, ideas for tracks..."
          value={notesDraft}
          onChange={handleNotesChange}
        />
        <AnimatePresence>
          {notesSaved && (
            <motion.div
              className="notes-saved"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Save style={{ width: 12, height: 12 }} />
              Saved
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Mark as Complete */}
      {!isCompleted && (
        <motion.div
          className="section-card complete-cta"
          style={{
            background: 'linear-gradient(135deg, #FAF3EE 0%, #FFF8F4 100%)',
            borderColor: 'var(--primary-lighter)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.35 }}
        >
          <div
            style={{
              textAlign: 'center',
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.15rem',
                fontWeight: 600,
                color: 'var(--text)',
                marginBottom: 6,
              }}
            >
              Ready to move on?
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              {allLessonsComplete
                ? 'You\'ve completed all the lessons. Mark this module as done to unlock the next one.'
                : 'Tick off your lessons above, then mark the whole module as complete.'}
            </p>
          </div>
          <button className="btn btn-complete" onClick={handleComplete}>
            <CheckCircle2 />
            Mark Module as Complete
          </button>
        </motion.div>
      )}

      {isCompleted && (
        <motion.div
          className="section-card"
          style={{
            background: 'var(--success-bg)',
            borderColor: 'var(--success-light)',
            textAlign: 'center',
          }}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <CheckCircle2
            style={{
              width: 32,
              height: 32,
              color: 'var(--success)',
              margin: '0 auto 12px',
            }}
          />
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.1rem',
              fontWeight: 600,
              color: 'var(--text)',
              marginBottom: 4,
            }}
          >
            Module Complete
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Great job! You've finished this module.
          </p>
        </motion.div>
      )}

      {/* Q&A */}
      <div className="divider" />
      <QAThread moduleId={module.id} questions={module.questions} />

      {/* Prev / Next navigation */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginTop: 40,
          justifyContent: 'space-between',
        }}
      >
        {prevModule && (prevModule.status === 'completed' || prevModule.status === 'in_progress' || prevModule.status === 'available') ? (
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/module/${prevModule.id}`)}
          >
            <ChevronLeft />
            {prevModule.title.length > 30
              ? `${prevModule.title.slice(0, 30)}…`
              : prevModule.title}
          </button>
        ) : (
          <div />
        )}

        {nextModule &&
          (nextModule.status === 'completed' ||
            nextModule.status === 'in_progress' ||
            nextModule.status === 'available') && (
            <button
              className="btn btn-secondary"
              style={{ marginLeft: 'auto' }}
              onClick={() => navigate(`/module/${nextModule.id}`)}
            >
              {nextModule.title.length > 30
                ? `${nextModule.title.slice(0, 30)}…`
                : nextModule.title}
              <ChevronRight />
            </button>
          )}
      </div>
    </div>
  )
}
