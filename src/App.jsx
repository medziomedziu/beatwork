import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Music } from 'lucide-react'
import { AppProvider, useApp } from './context/AppContext'
import LoginScreen from './components/LoginScreen'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import ModuleDetail from './pages/ModuleDetail'
import TeacherInbox from './pages/TeacherInbox'

function LoadingScreen() {
  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '100vh', background: 'var(--bg)', gap: 16,
      }}
    >
      <div
        style={{
          width: 48, height: 48,
          background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
          borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Music style={{ color: '#fff', width: 22, height: 22 }} />
      </div>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)' }}>
        Beatflow
      </div>
      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        Loading your progress…
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--primary-light)',
              animation: `pulse-dot 1.4s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

function AppShell() {
  const { auth, login, loading, role } = useApp()

  if (!auth) return <LoginScreen onLogin={login} />
  if (loading) return <LoadingScreen />

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/"           element={<Dashboard />} />
          <Route path="/module/:id" element={<ModuleDetail />} />
          <Route path="/teacher"    element={role === 'teacher' ? <TeacherInbox /> : <Navigate to="/" replace />} />
          <Route path="/progress"   element={<Navigate to="/" replace />} />
          <Route path="/qa"         element={<Navigate to="/" replace />} />
          <Route path="*"           element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AppProvider>
  )
}
