import { Link, useLocation } from 'react-router-dom'
import { BarChart3, Users, Package, Inbox, Upload } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { canAccess } from '../utils/rolePermissions'

function Sidebar() {
  const location = useLocation()
  const { user } = useAuth()

  const menuItems = [
    { path: '/', icon: BarChart3, label: 'Dashboard', permission: 'dashboard' },
    { path: '/barang', icon: Package, label: 'Barang Analysis', permission: 'barang' },
    { path: '/supplier', icon: Users, label: 'Supplier Scorecard', permission: 'supplier' },
    { path: '/barang-baru', icon: Inbox, label: 'Barang Baru', permission: 'barangBaru' },
    { path: '/upload', icon: Upload, label: 'Upload Data', permission: 'upload' },
  ]

  const allowedMenuItems = menuItems.filter((item) => {
    return canAccess(user.role, item.permission)
  })

  return (
    <aside className="w-64 bg-gray-900 text-white p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-8">Narma Analytics</h1>

      <nav className="space-y-2">
        {allowedMenuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              location.pathname === item.path
                ? 'bg-blue-600'
                : 'hover:bg-gray-800'
            }`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar