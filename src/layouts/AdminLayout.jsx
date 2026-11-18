import { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
export function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function handleLogout() {
    setBusy(true); setError('')
    try { await logout(); navigate('/login', { replace: true }) }
    catch { setError('No se pudo cerrar sesión. Intentá de nuevo.'); setBusy(false) }
  }
  return <div className="admin-layout">
    <header className="admin-header">
      <h1>Brupolo · Administración</h1>
      <nav aria-label="Administración"><ul>
        <li><Link to="/admin">Alta de productos</Link></li>
        <li><Link to="/">Ver tienda</Link></li>
      </ul></nav>
      <button type="button" onClick={handleLogout} disabled={busy}>{busy ? 'Saliendo...' : 'Cerrar sesión'}</button>
    </header>
    <main><p className="session-email">Sesión: {user.email}</p>{error && <p role="alert">{error}</p>}<Outlet /></main>
    <footer><p>Panel privado · Brupolo Store</p></footer>
  </div>
}
