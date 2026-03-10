import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'

export default function ProgressBar() {
  const { completedCount, totalCount, progressPercent, student, modules } = useApp()

  const inProgressModule = modules.find((m) => m.status === 'in_progress')
  const availableCount = modules.filter((m) => m.status === 'available').length

  return (
    <div className="progress-card">
      <div className="progress-header">
        <div>
          <div className="progress-title">
            Welcome back, <em>{student.name}</em>
          </div>
        </div>
        <div className="progress-label">
          <span>{completedCount}</span> / {totalCount} modules completed
        </div>
      </div>

      <div className="progress-track">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
        />
      </div>

      <div className="progress-stats">
        <div className="progress-stat">
          <div
            className="progress-stat-dot"
            style={{ background: 'var(--success)' }}
          />
          {completedCount} completed
        </div>
        {inProgressModule && (
          <div className="progress-stat">
            <div
              className="progress-stat-dot"
              style={{ background: 'var(--primary)' }}
            />
            1 in progress
          </div>
        )}
        {availableCount > 0 && (
          <div className="progress-stat">
            <div
              className="progress-stat-dot"
              style={{ background: 'var(--border-strong)' }}
            />
            {availableCount} available
          </div>
        )}
        <div className="progress-stat">
          <div
            className="progress-stat-dot"
            style={{ background: 'var(--border)' }}
          />
          {totalCount - completedCount - (inProgressModule ? 1 : 0) - availableCount} locked
        </div>
      </div>
    </div>
  )
}
