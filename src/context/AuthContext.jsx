import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth, ADMIN_UIDS } from '../firebase/config'

export const AuthContext = createContext(null)
export function AuthProvider({ children }) {
  const [session, setSession] = useState({ user: null, loading: true, error: '' })
  useEffect(() => {
    let active = true
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (active) setSession({ user, loading: false, error: '' })
    }, () => {
      if (active) setSession({ user: null, loading: false, error: 'No se pudo verificar la sesión.' })
    })
    return () => { active = false; unsubscribe() }
  }, [])
  const login = (email, password) => signInWithEmailAndPassword(auth, email.trim(), password)
  const logout = () => signOut(auth)
  const isAdmin = !!session.user && ADMIN_UIDS.includes(session.user.uid)
  return <AuthContext.Provider value={{ ...session, isAdmin, login, logout }}>{children}</AuthContext.Provider>
}
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe utilizarse dentro de AuthProvider')
  return context
}
