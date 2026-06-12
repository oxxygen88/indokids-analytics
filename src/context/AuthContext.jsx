import { createContext, useContext, useMemo, useState } from 'react'
import { loadStorage, saveStorage } from '../utils/localStorage'
import { ROLES } from '../utils/rolePermissions'

const AuthContext = createContext(null)

const DEFAULT_USER = {
  name: 'Narma User',
  role: ROLES.ADMIN,
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    return loadStorage('user', DEFAULT_USER)
  })

  function setRole(role) {
    const updatedUser = {
      ...user,
      role,
    }

    setUser(updatedUser)
    saveStorage('user', updatedUser)
  }

  function logout() {
    const resetUser = DEFAULT_USER
    setUser(resetUser)
    saveStorage('user', resetUser)
  }

  const value = useMemo(() => {
    return {
      user,
      setRole,
      logout,
      isLoggedIn: Boolean(user),
    }
  }, [user])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}