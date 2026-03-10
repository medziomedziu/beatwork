import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import ProgressBar from '../components/ProgressBar'
import ModuleCard from '../components/ModuleCard'
import CompletionAnimation from '../components/CompletionAnimation'

export default function Dashboard() {
  const { modules, completionCelebration } = useApp()

  const inProgressModule = modules.find((m) => m.status === 'in_progress')
  const completedModules = modules.filter((m) => m.status === 'completed')
  const upcomingModules = modules.filter(
    (m) => m.status === 'available' || m.status === 'locked'
  )

  return (
    <div className="page">
      <CompletionAnimation visible={!!completionCelebration} />

      {/* Header */}
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="dashboard-greeting">Your learning journey</div>
        <h1 className="dashboard-title">
          Music Production
          <br />
          with <em>Ableton Live</em>
        </h1>
        <p className="dashboard-subtitle">
          8 modules covering everything from your first beat to a finished,
          export-ready track. Take it at your own pace.
        </p>
      </motion.div>

      {/* Progress */}
      <ProgressBar />

      {/* In Progress */}
      {inProgressModule && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          style={{ marginBottom: 36 }}
        >
          <div className="modules-section-label">Continue where you left off</div>
          <ModuleCard module={inProgressModule} index={0} />
        </motion.div>
      )}

      {/* All Modules */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
      >
        <div className="modules-section-label">All Modules</div>
        <div className="module-grid">
          {modules.map((module, index) => (
            <ModuleCard key={module.id} module={module} index={index} />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
