import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MessageCircle, CheckCircle2 } from 'lucide-react'
import { useApp } from '../context/AppContext'

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function QAItem({ question, moduleId, showAnswerForm }) {
  const { answerQuestion } = useApp()
  const [answerDraft, setAnswerDraft] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleAnswer = () => {
    if (!answerDraft.trim()) return
    setSubmitting(true)
    setTimeout(() => {
      answerQuestion(moduleId, question.id, answerDraft.trim())
      setAnswerDraft('')
      setSubmitting(false)
    }, 300)
  }

  return (
    <motion.div
      className="qa-item"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Question */}
      <div className="qa-question-block">
        <div className="qa-avatar student">A</div>
        <div className="qa-bubble">
          <div className="qa-bubble-meta">
            <span className="qa-bubble-author">Ania</span>
            <span className="qa-bubble-time">{formatDate(question.askedAt)}</span>
          </div>
          <div className="qa-bubble-text">{question.question}</div>
        </div>
      </div>

      {/* Answer / Awaiting */}
      {question.answer ? (
        <div className="qa-answer-block">
          <div className="qa-avatar teacher">T</div>
          <div className="qa-bubble">
            <div className="qa-bubble-meta">
              <span className="qa-bubble-author">Teacher</span>
              <CheckCircle2
                style={{ width: 12, height: 12, color: 'var(--success)' }}
              />
              <span className="qa-bubble-time">{formatDate(question.answeredAt)}</span>
            </div>
            <div className="qa-bubble-text">{question.answer}</div>
          </div>
        </div>
      ) : showAnswerForm ? (
        <div className="qa-answer-form">
          <div className="qa-answer-form-label">Your answer</div>
          <textarea
            className="qa-answer-textarea"
            placeholder="Write a detailed answer for Ania..."
            value={answerDraft}
            onChange={(e) => setAnswerDraft(e.target.value)}
            rows={3}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleAnswer}
              disabled={!answerDraft.trim() || submitting}
            >
              <Send />
              {submitting ? 'Sending…' : 'Send Answer'}
            </button>
          </div>
        </div>
      ) : (
        <div className="qa-awaiting">
          <div className="qa-awaiting-dot" />
          Awaiting teacher reply…
        </div>
      )}
    </motion.div>
  )
}

export default function QAThread({ moduleId, questions }) {
  const { addQuestion, role } = useApp()
  const [draft, setDraft] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const isTeacher = role === 'teacher'

  const handleSubmit = () => {
    if (!draft.trim()) return
    setSubmitting(true)
    setTimeout(() => {
      addQuestion(moduleId, draft.trim())
      setDraft('')
      setSubmitting(false)
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    }, 300)
  }

  return (
    <div className="qa-section">
      <div className="qa-title">
        <MessageCircle
          style={{
            display: 'inline-block',
            verticalAlign: 'middle',
            marginRight: 8,
            color: 'var(--primary)',
            width: 18,
            height: 18,
          }}
        />
        Questions &amp; Answers
      </div>

      {/* Student: ask a question */}
      {!isTeacher && (
        <div className="qa-form">
          <textarea
            className="qa-input"
            placeholder="Got a question about this module? Ask away — I'll answer soon!"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
              Cmd+Enter to send
            </span>
            <button
              className="btn btn-primary btn-sm qa-submit"
              onClick={handleSubmit}
              disabled={!draft.trim() || submitting}
            >
              <Send />
              {submitting ? 'Sending…' : 'Ask Question'}
            </button>
          </div>
          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.8rem',
                  color: 'var(--success)',
                  fontWeight: 500,
                }}
              >
                <CheckCircle2 style={{ width: 14, height: 14 }} />
                Question sent! Your teacher will reply soon.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Thread */}
      {questions.length === 0 ? (
        <div className="qa-empty">
          {isTeacher
            ? 'No questions for this module yet.'
            : 'No questions yet. Be the first to ask!'}
        </div>
      ) : (
        <div className="qa-thread">
          {questions.map((q) => (
            <QAItem
              key={q.id}
              question={q}
              moduleId={moduleId}
              showAnswerForm={isTeacher}
            />
          ))}
        </div>
      )}
    </div>
  )
}
