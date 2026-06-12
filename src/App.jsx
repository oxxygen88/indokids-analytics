import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import BarangAnalysis from './pages/BarangAnalysis'
import SupplierScorecard from './pages/SupplierScorecard'
import BarangBaru from './pages/BarangBaru'
import Upload from './pages/Upload'

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />

        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />

          <main className="flex-1 overflow-y-auto p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />

              <Route
                path="/barang"
                element={
                  <ProtectedRoute permission="barang">
                    <BarangAnalysis />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/supplier"
                element={
                  <ProtectedRoute permission="supplier">
                    <SupplierScorecard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/barang-baru"
                element={
                  <ProtectedRoute permission="barangBaru">
                    <BarangBaru />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/upload"
                element={
                  <ProtectedRoute permission="upload">
                    <Upload />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App