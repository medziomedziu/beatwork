import { NavLink, useNavigate } from 'react-router-dom'
import {
  Music,
  LayoutDashboard,
  TrendingUp,
  MessageCircle,
  Radio,
} from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Sidebar() {
  const { role, setRole, student, allUnanswered, completedCount, totalCount } = useApp()
  const navigate = useNavigate()

  const isTeacher = role === 'teacher'

  const handleRoleToggle = (newRole) => {
    setRole(newRole)
    if (newRole === 'teacher') navigate('/teacher')
    else navigate('/')
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">
          <div className="sidebar-logo-icon">
            <Music />
          </div>
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

            <NavLink
              to="/"
              end
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <LayoutDashboard />
              Dashboard
            </NavLink>

            <NavLink
              to="/progress"
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <TrendingUp />
              My Progress
              <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--text-light)', fontWeight: 600 }}>
                {completedCount}/{totalCount}
              </span>
            </NavLink>

            <div className="sidebar-divider" />

            <div className="sidebar-section-label">Ask</div>

            <NavLink
              to="/qa"
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <MessageCircle />
              My Questions
            </NavLink>
          </>
        ) : (
          <>
            <div className="sidebar-section-label">Teacher</div>

            <NavLink
              to="/teacher"
              end
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <MessageCircle />
              Q&amp;A Inbox
              {allUnanswered.length > 0 && (
                <span className="sidebar-link-badge">{allUnanswered.length}</span>
              )}
            </NavLink>

            <NavLink
              to="/"
              end
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <LayoutDashboard />
              Course Overview
            </NavLink>
          </>
        )}
      </nav>

      {/* Footer / Avatar */}
      <div className="sidebar-footer">
        <div className="sidebar-avatar-row">
          <div className="sidebar-avatar">
            {isTeacher ? 'T' : student.name.charAt(0)}
          </div>
          <div>
            <div className="sidebar-user-name">
              {isTeacher ? 'Teacher' : student.name}
            </div>
            <div className="sidebar-user-role">
              {isTeacher ? 'Instructor view' : 'Student'}
            </div>
          </div>
        </div>

        {/* Role toggle */}
        <div className="sidebar-role-toggle" style={{ marginTop: 10 }}>
          <button
            className={`sidebar-role-btn${!isTeacher ? ' active' : ''}`}
            onClick={() => handleRoleToggle('student')}
          >
            Student
          </button>
          <button
            className={`sidebar-role-btn${isTeacher ? ' active' : ''}`}
            onClick={() => handleRoleToggle('teacher')}
          >
            Teacher
          </button>
        </div>
      </div>
    </aside>
  )
}
