import { useState, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Music,
  LayoutDashboard,
  TrendingUp,
  MessageCircle,
  LogOut,
  Pencil,
  Camera,
  Check,
  X,
} from 'lucide-react'
import { useApp } from '../context/AppContext'

// ── Profile Editor ────────────────────────────────────────────────────────────

function ProfileEditor({ currentNickname, currentAvatar, onSave, onCancel }) {
  const [nickname, setNickname] = useState(currentNickname)
  const [avatar, setAvatar]     = useState(currentAvatar)
  const fileRef                 = useRef(null)

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    // Resize to max 200px before storing as base64
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const max = 200
        const scale = Math.min(max / img.width, max / img.height, 1)
        canvas.width  = Math.round(img.width  * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        setAvatar(canvas.toDataURL('image/jpeg', 0.85))
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  }

  return (
    <motion.div
      className="profile-editor"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Avatar upload */}
      <div className="profile-editor-avatar-wrap" onClick={() => fileRef.current.click()}>
        {avatar ? (
          <img src={avatar} alt="" className="profile-editor-img" />
        ) : (
          <div className="profile-editor-initials">{nickname.charAt(0).toUpperCase()}</div>
        )}
        <div className="profile-editor-camera"><Camera /></div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      </div>

      {/* Name input */}
      <input
        className="profile-editor-input"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        maxLength={20}
        placeholder="Your name"
        onKeyDown={(e) => { if (e.key === 'Enter') onSave({ nickname: nickname.trim() || currentNickname, avatarBase64: avatar }) }}
      />

      {/* Actions */}
      <div className="profile-editor-actions">
        <button className="profile-editor-btn cancel" onClick={onCancel}>
          <X />
        </button>
        <button
          className="profile-editor-btn save"
          onClick={() => onSave({ nickname: nickname.trim() || currentNickname, avatarBase64: avatar })}
        >
          <Check />
          Save
        </button>
      </div>
    </motion.div>
  )
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const { role, logout, student, allUnanswered, completedCount, totalCount, updateProfile } = useApp()
  const navigate    = useNavigate()
  const [editing, setEditing] = useState(false)
  const isTeacher   = role === 'teacher'

  const handleSave = ({ nickname, avatarBase64 }) => {
    updateProfile({ nickname, avatarBase64 })
    setEditing(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const avatarContent = student.avatarBase64 ? (
    <img src={student.avatarBase64} alt={student.name} className="sidebar-avatar-img" />
  ) : (
    student.name.charAt(0).toUpperCase()
  )

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">
          <div className="sidebar-logo-icon"><Music /></div>
          <div>
            <div className="sidebar-logo-text">Beatflow</div>
            <div className="sidebar-logo-sub">Ableton Course</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {!isTeacher ? (
          <>
            <div className="sidebar-section-label">Learn</div>
            <NavLink to="/" end className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
              <LayoutDashboard />
              Dashboard
            </NavLink>
            <NavLink to="/progress" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
              <TrendingUp />
              My Progress
              <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--text-light)', fontWeight: 600 }}>
                {completedCount}/{totalCount}
              </span>
            </NavLink>
            <div className="sidebar-divider" />
            <div className="sidebar-section-label">Ask</div>
            <NavLink to="/qa" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
              <MessageCircle />
              My Questions
            </NavLink>
          </>
        ) : (
          <>
            <div className="sidebar-section-label">Teacher</div>
            <NavLink to="/teacher" end className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
              <MessageCircle />
              Q&amp;A Inbox
              {allUnanswered.length > 0 && (
                <span className="sidebar-link-badge">{allUnanswered.length}</span>
              )}
            </NavLink>
            <NavLink to="/" end className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
              <LayoutDashboard />
              Course Overview
            </NavLink>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <AnimatePresence mode="wait">
          {editing ? (
            <ProfileEditor
              key="editor"
              currentNickname={student.name}
              currentAvatar={student.avatarBase64}
              onSave={handleSave}
              onCancel={() => setEditing(false)}
            />
          ) : (
            <motion.div
              key="profile"
              className="sidebar-profile-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div className="sidebar-avatar" onClick={() => setEditing(true)} style={{ cursor: 'pointer' }}>
                {avatarContent}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="sidebar-user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {student.name}
                </div>
                <div className="sidebar-user-role">{isTeacher ? 'Instructor' : 'Student'}</div>
              </div>
              <button className="sidebar-edit-btn" onClick={() => setEditing(true)} title="Edit profile">
                <Pencil />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button className="btn-logout" onClick={handleLogout}>
          <LogOut />
          Log out
        </button>
      </div>
    </aside>
  )
}
