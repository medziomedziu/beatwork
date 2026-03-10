import { Play } from 'lucide-react'

const WAVEFORM_HEIGHTS = [
  14, 28, 40, 22, 36, 50, 18, 44, 30, 16, 42, 26, 38, 20, 48,
  12, 34, 24, 46, 16, 40, 28, 22, 44, 18, 36, 30, 50, 14, 38,
  24, 46, 20, 32, 16, 44, 28, 40, 22, 36, 18, 48, 26, 38, 14,
]

export default function VideoPlaceholder({ title }) {
  return (
    <div className="video-placeholder">
      <div className="video-placeholder-bg" />
      <div className="video-placeholder-overlay" />

      {/* Waveform decoration */}
      <div className="video-waveform">
        {WAVEFORM_HEIGHTS.map((h, i) => (
          <div
            key={i}
            className="video-waveform-bar"
            style={{ height: `${h}px` }}
          />
        ))}
      </div>

      {/* Grid overlay for a "studio" feel */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Play button */}
      <div className="video-play-btn">
        <Play />
      </div>

      {/* Label */}
      <div className="video-label">
        {title ? `Lesson: ${title}` : 'Video Lesson — Coming Soon'}
      </div>
    </div>
  )
}
