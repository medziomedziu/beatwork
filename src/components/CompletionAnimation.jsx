import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const COLORS = [
  '#C96A2E',
  '#E8946A',
  '#D4956A',
  '#F7E0CF',
  '#7A9E7E',
  '#C4DBC6',
  '#F5F0EB',
  '#1A1714',
]

function randomBetween(a, b) {
  return a + Math.random() * (b - a)
}

function generateParticles(count = 60) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: randomBetween(10, 90),       // percent from left
    y: randomBetween(-10, 20),      // percent from top (starts above fold)
    size: randomBetween(6, 14),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: randomBetween(0, 360),
    duration: randomBetween(1.8, 3.2),
    delay: randomBetween(0, 0.6),
    shape: Math.random() > 0.5 ? 'rect' : 'circle',
  }))
}

function Particle({ p }) {
  return (
    <motion.div
      key={p.id}
      initial={{
        left: `${p.x}%`,
        top: `${p.y}%`,
        opacity: 1,
        rotate: p.rotation,
        scale: 0,
      }}
      animate={{
        top: `${p.y + randomBetween(60, 120)}%`,
        opacity: [1, 1, 0],
        rotate: p.rotation + randomBetween(-180, 180),
        scale: [0, 1, 0.8],
      }}
      transition={{
        duration: p.duration,
        delay: p.delay,
        ease: [0.4, 0, 0.6, 1],
      }}
      style={{
        position: 'absolute',
        width: p.size,
        height: p.size * (p.shape === 'rect' ? 0.4 : 1),
        background: p.color,
        borderRadius: p.shape === 'circle' ? '50%' : 2,
        pointerEvents: 'none',
      }}
    />
  )
}

export default function CompletionAnimation({ visible }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (visible) {
      setParticles(generateParticles(70))
    } else {
      setParticles([])
    }
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="celebration-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop flash */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(201, 106, 46, 0.06)',
              pointerEvents: 'none',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.6 }}
          />

          {/* Confetti particles */}
          {particles.map((p) => (
            <Particle key={p.id} p={p} />
          ))}

          {/* Central success message */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              textAlign: 'center',
            }}
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.1, 1], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2.5, times: [0, 0.2, 0.5, 1], delay: 0.1 }}
              style={{
                background: 'var(--surface)',
                borderRadius: 'var(--r-xl)',
                padding: '28px 44px',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border)',
              }}
            >
              <div
                style={{
                  fontSize: '3rem',
                  marginBottom: 8,
                  lineHeight: 1,
                }}
              >
                🎉
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: 'var(--text)',
                  marginBottom: 4,
                }}
              >
                Module Complete!
              </div>
              <div
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                }}
              >
                Amazing work, Ania. Keep it up!
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
