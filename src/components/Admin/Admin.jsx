import { useEffect, useRef, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth, ADMIN_UID } from '../../firebase/config'
import { importInitialProducts } from '../../services/products.service'
import { ProductFormContainer } from '../ProductForm/ProductFormContainer'
export function Admin() {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const busy = useRef(false)
  useEffect(() => onAuthStateChanged(auth, next => { setUser(next); setChecking(false) }), [])
  async function login(event) {
    event.preventDefault()
    if (busy.current) return
    busy.current = true; setLoading(true); setMessage('')
    try { await signInWithEmailAndPassword(auth, email.trim(), password); setPassword('') }
    catch { setMessage('No se pudo ingresar. Revisá email, contraseña y que Email/Contraseña esté habilitado en Firebase.') }
    finally { busy.current = false; setLoading(false) }
  }
  async function logout() {
    try { await signOut(auth); setMessage('') } catch { setMessage('No se pudo cerrar la sesión. Intentá de nuevo.') }
  }
  async function importProducts() {
    if (busy.current) return
    busy.current = true; setLoading(true); setMessage('')
    try {
      const count = await importInitialProducts()
      setMessage(count ? `Se cargaron ${count} productos. Los existentes se conservaron.` : 'Los seis productos ya estaban cargados. No se modificaron.')
    } catch { setMessage('No se pudo importar. Revisá las reglas de Firestore y el UID de administrador.') }
    finally { busy.current = false; setLoading(false) }
  }
  if (ADMIN_UID === 'PEGAR_TU_UID_AQUI') return <section><h1>Configurar administración</h1>
    <p>Seguí INSTRUCCIONES.md: creá tu usuario en Authentication, copiá su UID en src/firebase/config.js y en firestore.rules, y publicá esas reglas.</p></section>
  if (checking) return <p role="status">Verificando sesión...</p>
  if (!user) return <section><form className="product-form" onSubmit={login}>
    <h1>Acceso de administrador</h1>
    <label htmlFor="email">Email</label><input id="email" type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} />
    <label htmlFor="password">Contraseña</label><input id="password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required disabled={loading} />
    {message && <p role="alert">{message}</p>}
    <button disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
  </form></section>
  if (user.uid !== ADMIN_UID) return <section><h1>Acceso restringido</h1><p>Esta cuenta no es administradora.</p><button onClick={logout}>Cerrar sesión</button></section>
  return <section><h1>Administración</h1>
    <button onClick={logout} disabled={loading}>Cerrar sesión</button>
    <p>Primera carga: importá los seis productos originales. Se conservan los documentos que ya existan con esos IDs.</p>
    <button onClick={importProducts} disabled={loading}>{loading ? 'Importando...' : 'Cargar los 6 productos iniciales'}</button>
    {message && <p role="status">{message}</p>}
    <ProductFormContainer />
  </section>
}
