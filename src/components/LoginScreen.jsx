import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, GraduationCap, Eye, EyeOff, ArrowRight } from 'lucide-react'

const PASSWORD = 'dupa1234'

const PROFILES = [
  {
    id:       'zuzia',
    name:     'Zuzia',
    label:    'Student',
    labelPl:  'Uczennica',
    Icon:     Music,
    color:    'var(--primary)',
    colorBg:  'var(--primary-lighter)',
  },
  {
    id:       'teacher',
    name:     'Nauczyciel',
    label:    'Teacher',
    labelPl:  'Prowadzący',
    Icon:     GraduationCap,
    color:    'var(--success)',
    colorBg:  'var(--success-bg)',
  },
]

export default function LoginScreen({ onLogin }) {
  const [selected, setSelected]   = useState(null)
  const [password, setPassword]   = useState('')
  const [showPw, setShowPw]       = useState(false)
  const [error, setError]         = useState(false)
  const [shake, setShake]         = useState(false)
  const inputRef                  = useRef(null)

  const handleSelectProfile = (profileId) => {
    setSelected(profileId)
    setPassword('')
    setError(false)
    setTimeout(() => inputRef.current?.focus(), 200)
  }

  const handleSubmit = () => {
    if (password === PASSWORD) {
      onLogin(selected)
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setPassword('')
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  const activeProfile = PROFILES.find((p) => p.id === selected)

  return (
    <div className="login-screen">
      {/* Logo */}
      <motion.div
        className="login-logo"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="login-logo-icon">
          <Music />
        </div>
        <div className="login-logo-text">Beatflow</div>
        <div className="login-logo-sub">Ableton Live — Music Production Course</div>
      </motion.div>

      {/* Profile cards */}
      <motion.div
        className="login-profiles"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="login-who">Who are you?</div>
        <div className="login-cards">
          {PROFILES.map((p) => (
            <button
              key={p.id}
              className={`login-card${selected === p.id ? ' selected' : ''}`}
              onClick={() => handleSelectProfile(p.id)}
              style={{ '--card-color': p.color, '--card-bg': p.colorBg }}
            >
              <div className="login-card-icon">
                <p.Icon />
              </div>
              <div className="login-card-name">{p.name}</div>
              <div className="login-card-label">{p.labelPl}</div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Password form */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className={`login-password-box${shake ? ' shake' : ''}`}
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="login-password-label">
              Enter password for{' '}
              <strong style={{ color: activeProfile.color }}>{activeProfile.name}</strong>
            </div>

            <div className={`login-password-field${error ? ' error' : ''}`}>
              <input
                ref={inputRef}
                type={showPw ? 'text' : 'password'}
                className="login-password-input"
                placeholder="Password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false) }}
                onKeyDown={handleKeyDown}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-pw-toggle"
                onClick={() => setShowPw((v) => !v)}
                tabIndex={-1}
              >
                {showPw ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  className="login-error"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Wrong password — try again.
                </motion.div>
              )}
            </AnimatePresence>

            <button
              className="btn btn-primary login-submit"
              onClick={handleSubmit}
              disabled={!password}
            >
              Enter
              <ArrowRight />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
