import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import ModuleDetail from './pages/ModuleDetail'
import TeacherInbox from './pages/TeacherInbox'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/module/:id" element={<ModuleDetail />} />
              <Route path="/teacher" element={<TeacherInbox />} />
              {/* redirect /progress and /qa back to dashboard for now */}
              <Route path="/progress" element={<Navigate to="/" replace />} />
              <Route path="/qa" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}
