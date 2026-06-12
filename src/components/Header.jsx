import { User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { ROLE_LABELS, ROLES } from '../utils/rolePermissions'

function Header() {
  const { user, setRole } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-800">
        Analytics Dashboard
      </h2>

      <div className="flex items-center gap-3">
        <div className="flex items-center space-x-2 text-gray-700">
          <User size={20} />
          <span>{user.name}</span>
        </div>

        <select
          value={user.role}
          onChange={(event) => setRole(event.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={ROLES.ADMIN}>{ROLE_LABELS.admin}</option>
          <option value={ROLES.MANAGER}>{ROLE_LABELS.manager}</option>
          <option value={ROLES.BUYER}>{ROLE_LABELS.buyer}</option>
          <option value={ROLES.FINANCE}>{ROLE_LABELS.finance}</option>
        </select>
      </div>
    </header>
  )
}

export default Header