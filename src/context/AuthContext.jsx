import { useCallback, useEffect, useState } from 'react'
import { AuthContext } from './authContextObject'
import * as authService from '../services/authService'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authService.getCurrentUser().then((current) => {
      setUser(current)
      setLoading(false)
    })
  }, [])

  const login = useCallback(async (credentials) => {
    const sessionUser = await authService.login(credentials)
    setUser(sessionUser)
    return sessionUser
  }, [])

  const signup = useCallback(async (data) => {
    const sessionUser = await authService.register(data)
    setUser(sessionUser)
    return sessionUser
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  const updateProfile = useCallback(async (updates) => {
    const updated = await authService.updateProfile(updates)
    setUser(updated)
    return updated
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        loading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
