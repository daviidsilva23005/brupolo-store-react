import { useRef, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
export function Login() {
  const { user, loading, isAdmin, error: authError, login, logout } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const lock = useRef(false)
  const requested = location.state?.from
  const destination = typeof requested === 'string' && /^\/admin(?:\/|\?|$)/.test(requested) ? requested : '/admin'
  if (loading) return <p role="status">Verificando sesión...</p>
  if (user && isAdmin) return <Navigate to={destination} replace />
  if (user) return <section><h1>Cuenta sin acceso de administrador</h1>
    <p role="alert">{authError || 'Esta cuenta está autenticada pero no autorizada para administrar productos.'}</p>
    <button disabled={busy} onClick={async () => {
      setBusy(true)
      try { await logout() } catch { setError('No se pudo cerrar la sesión.') } finally { setBusy(false) }
    }}>Usar otra cuenta</button>{error && <p role="alert">{error}</p>}
  </section>
  async function handleSubmit(event) {
    event.preventDefault()
    if (lock.current) return
    lock.current = true; setBusy(true); setError('')
    try { await login(email, password); setPassword('') }
    catch (err) {
      setError(err.code === 'auth/too-many-requests' ? 'Demasiados intentos. Esperá unos minutos y volvé a intentar.' : 'No se pudo ingresar. Revisá tu email y contraseña.')
    } finally { lock.current = false; setBusy(false) }
  }
  return <section><form className="product-form" onSubmit={handleSubmit}>
    <h1>Ingreso de administrador</h1>
    <label htmlFor="login-email">Correo electrónico</label>
    <input id="login-email" type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="username" required disabled={busy} />
    <label htmlFor="login-password">Contraseña</label>
    <input id="login-password" type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required disabled={busy} />
    {(error || authError) && <p role="alert">{error || authError}</p>}
    <button disabled={busy}>{busy ? 'Ingresando...' : 'Ingresar'}</button>
  </form></section>
}
