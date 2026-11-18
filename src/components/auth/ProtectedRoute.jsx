import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
export function ProtectedRoute() {
  const { user, loading, isAdmin, error, logout } = useAuth()
  const location = useLocation()
  if (loading) return <main><p role="status">Verificando sesión...</p></main>
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  if (!isAdmin) return <main><section>
    <h1>Acceso restringido</h1>
    <p role="alert">{error || 'Tu cuenta no tiene permisos de administrador.'}</p>
    <p><Link to="/">Volver a la tienda</Link></p>
    <button type="button" onClick={() => { logout().catch(() => window.alert('No se pudo cerrar sesión. Intentá de nuevo.')) }}>Cerrar sesión</button>
  </section></main>
  return <Outlet />
}
