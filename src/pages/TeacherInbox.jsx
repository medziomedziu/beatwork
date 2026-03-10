import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  MessageCircle,
  CheckCircle2,
  ChevronRight,
  Inbox,
  Send,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import QAThread from '../components/QAThread'

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function TeacherInbox() {
  const { allUnanswered, modules, answerQuestion } = useApp()
  const navigate = useNavigate()

  // Group unanswered by module
  const byModule = allUnanswered.reduce((acc, q) => {
    if (!acc[q.moduleId]) {
      acc[q.moduleId] = { moduleId: q.moduleId, moduleTitle: q.moduleTitle, questions: [] }
    }
    acc[q.moduleId].questions.push(q)
    return acc
  }, {})

  const groups = Object.values(byModule)

  return (
    <div className="page">
      {/* Header */}
      <motion.div
        className="teacher-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-light)',
            marginBottom: 6,
          }}
        >
          Teacher View
        </div>
        <h1 className="teacher-title">Q&amp;A Inbox</h1>
        <p className="teacher-subtitle">
          {allUnanswered.length === 0
            ? 'All caught up — no unanswered questions.'
            : `${allUnanswered.length} question${allUnanswered.length > 1 ? 's' : ''} waiting for your reply.`}
        </p>
      </motion.div>

      {/* Empty state */}
      {allUnanswered.length === 0 && (
        <motion.div
          className="teacher-empty"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="teacher-empty-icon">
            <CheckCircle2 />
          </div>
          <div className="teacher-empty-title">All questions answered!</div>
          <p className="teacher-empty-text">
            You're all caught up. Ania has no pending questions right now.
          </p>
        </motion.div>
      )}

      {/* Question groups */}
      {groups.length > 0 && (
        <motion.div
          className="teacher-inbox-group"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          {groups.map((group, gi) => (
            <motion.div
              key={group.moduleId}
              className="teacher-module-group"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + gi * 0.07, duration: 0.35 }}
            >
              <div className="teacher-module-header">
                <MessageCircle />
                <span className="teacher-module-name">{group.moduleTitle}</span>
                <span className="teacher-module-count">
                  {group.questions.length}
                </span>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ marginLeft: 8, padding: '4px 8px', fontSize: '0.75rem' }}
                  onClick={() => navigate(`/module/${group.moduleId}`)}
                >
                  View Module
                  <ChevronRight style={{ width: 12, height: 12 }} />
                </button>
              </div>

              <div>
                {group.questions.map((q) => (
                  <InboxQuestionItem
                    key={q.id}
                    question={q}
                    moduleId={group.moduleId}
                    onAnswer={answerQuestion}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Divider + All answered questions */}
      <div className="divider" style={{ marginTop: 48 }} />

      <div
        style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.09em',
          textTransform: 'uppercase',
          color: 'var(--text-light)',
          marginBottom: 20,
        }}
      >
        All Answered Questions
      </div>

      <div className="teacher-inbox-group">
        {modules.map((mod) => {
          const answered = mod.questions.filter((q) => q.answer !== null)
          if (answered.length === 0) return null
          return (
            <div key={mod.id} className="teacher-module-group">
              <div className="teacher-module-header">
                <CheckCircle2 style={{ color: 'var(--success)' }} />
                <span className="teacher-module-name">{mod.title}</span>
                <span
                  className="teacher-module-count"
                  style={{ background: 'var(--success)' }}
                >
                  {answered.length}
                </span>
              </div>
              <div>
                {answered.map((q) => (
                  <div key={q.id} className="teacher-question-item">
                    <div
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--text)',
                        fontWeight: 500,
                        marginBottom: 6,
                      }}
                    >
                      {q.question}
                    </div>
                    <div
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--text-muted)',
                        lineHeight: 1.55,
                        borderLeft: '3px solid var(--success-light)',
                        paddingLeft: 12,
                        marginTop: 8,
                      }}
                    >
                      {q.answer}
                    </div>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--text-light)',
                        marginTop: 8,
                        display: 'flex',
                        gap: 12,
                      }}
                    >
                      <span>Asked {formatDate(q.askedAt)}</span>
                      {q.answeredAt && <span>· Answered {formatDate(q.answeredAt)}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function InboxQuestionItem({ question, moduleId, onAnswer }) {
  const [draft, setDraft] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = () => {
    if (!draft.trim()) return
    setSubmitting(true)
    setTimeout(() => {
      onAnswer(moduleId, question.id, draft.trim())
      setDraft('')
      setSubmitting(false)
      setDone(true)
    }, 300)
  }

  if (done) {
    return (
      <motion.div
        className="teacher-question-item"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0, height: 0, padding: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        style={{ overflow: 'hidden' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: 'var(--success)',
            fontSize: '0.825rem',
          }}
        >
          <CheckCircle2 style={{ width: 14, height: 14 }} />
          Answer sent!
        </div>
      </motion.div>
    )
  }

  return (
    <div className="teacher-question-item">
      <div
        style={{
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
          marginBottom: 12,
        }}
      >
        <div
          className="qa-avatar student"
          style={{ width: 28, height: 28, fontSize: '0.65rem' }}
        >
          A
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              marginBottom: 4,
            }}
          >
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text)',
              }}
            >
              Ania
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>
              {formatDate(question.askedAt)}
            </span>
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.55 }}>
            {question.question}
          </div>
        </div>
      </div>

      {/* Answer form */}
      <div
        style={{
          background: 'var(--surface-warm)',
          borderRadius: 'var(--r-sm)',
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div
          style={{
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
        >
          Your reply
        </div>
        <textarea
          className="qa-answer-textarea"
          placeholder="Write a clear, helpful answer for Ania..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>
            Cmd+Enter to send
          </span>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleSubmit}
            disabled={!draft.trim() || submitting}
          >
            <Send />
            {submitting ? 'Sending…' : 'Send Answer'}
          </button>
        </div>
      </div>
    </div>
  )
}
