import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Lock,
  Clock,
  ChevronRight,
  Zap,
  LayoutDashboard,
  AlignLeft,
  Music,
  Music2,
  Scissors,
  SlidersHorizontal,
  Wand2,
  Upload,
} from 'lucide-react'

const ICON_MAP = {
  LayoutDashboard,
  AlignLeft,
  Music,
  Music2,
  Scissors,
  SlidersHorizontal,
  Wand2,
  Upload,
  Zap,
}

const STATUS_CONFIG = {
  completed: {
    label: 'Completed',
    icon: CheckCircle2,
    className: 'status-completed',
  },
  in_progress: {
    label: 'In Progress',
    icon: Zap,
    className: 'status-in_progress',
  },
  available: {
    label: 'Available',
    icon: ChevronRight,
    className: 'status-available',
  },
  locked: {
    label: 'Locked',
    icon: Lock,
    className: 'status-locked',
  },
}

function getLessonProgress(lessons) {
  if (!lessons.length) return 0
  return Math.round((lessons.filter((l) => l.completed).length / lessons.length) * 100)
}

export default function ModuleCard({ module, index }) {
  const { id, title, description, estimatedTime, icon, accentColor, status, lessons } = module

  const IconComponent = ICON_MAP[icon] ?? Music
  const statusCfg = STATUS_CONFIG[status]
  const StatusIcon = statusCfg.icon
  const isClickable = status !== 'locked'
  const progress = getLessonProgress(lessons)

  const cardContent = (
    <motion.div
      className={`module-card${isClickable ? ' clickable' : ''} ${status}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      whileHover={isClickable ? { y: -2 } : {}}
    >
      {/* Top row: icon + status */}
      <div className="module-card-top">
        <div
          className="module-card-icon"
          style={{
            background: status === 'locked'
              ? 'var(--surface-warm)'
              : `${accentColor}18`,
          }}
        >
          <IconComponent
            style={{ color: status === 'locked' ? 'var(--text-light)' : accentColor }}
          />
        </div>
        <div className={`module-card-status ${statusCfg.className}`}>
          <StatusIcon />
          {statusCfg.label}
        </div>
      </div>

      {/* Module number */}
      <div className="module-card-num">Module {String(id).padStart(2, '0')}</div>

      {/* Title */}
      <div className="module-card-title">{title}</div>

      {/* Description */}
      <div className="module-card-desc">{description}</div>

      {/* Progress bar (only when in_progress) */}
      {status === 'in_progress' && progress > 0 && (
        <div className="module-card-progress-bar">
          <div
            className="module-card-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Footer */}
      <div className="module-card-footer">
        <div className="module-card-time">
          <Clock />
          {estimatedTime}
        </div>
        {isClickable && (
          <div className="module-card-arrow">
            <ChevronRight />
          </div>
        )}
      </div>
    </motion.div>
  )

  if (!isClickable) return cardContent

  return (
    <Link to={`/module/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      {cardContent}
    </Link>
  )
}
