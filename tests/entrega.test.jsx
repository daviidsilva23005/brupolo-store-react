import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const firebase = vi.hoisted(() => ({ authNext: null, unsubAuth: vi.fn(), login: vi.fn(), logout: vi.fn() }))
const products = vi.hoisted(() => ({ listNext: null, listError: null, itemNext: null, listUnsub: vi.fn(), itemUnsub: vi.fn() }))
vi.mock('../src/firebase/config', () => ({ auth: {}, db: {}, ADMIN_UIDS: ['owner', 'teacher'] }))
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (_auth, next) => { firebase.authNext = next; return firebase.unsubAuth },
  signInWithEmailAndPassword: (...args) => firebase.login(...args),
  signOut: (...args) => firebase.logout(...args),
}))
vi.mock('../src/services/products.service', () => ({
  subscribeProducts: (next, error) => { products.listNext = next; products.listError = error; return products.listUnsub },
  subscribeProductById: (_id, next) => { products.itemNext = next; return products.itemUnsub },
}))
import { AuthContext, AuthProvider, useAuth } from '../src/context/AuthContext'
import { CartProvider } from '../src/context/CartContext'
import { ProtectedRoute } from '../src/components/auth/ProtectedRoute'
import { Login } from '../src/components/Login/Login'
import { ItemListContainer } from '../src/components/ItemListContainer/ItemListContainer'
import { ItemDetailContainer } from '../src/components/ItemDetailContainer/ItemDetailContainer'

beforeEach(() => { vi.clearAllMocks(); localStorage.clear() })
afterEach(cleanup)
const session = (overrides = {}) => ({ user: null, loading: false, isAdmin: false, error: '', login: vi.fn(), logout: vi.fn(), ...overrides })
function protectedPage(auth) {
  return render(<AuthContext.Provider value={auth}><MemoryRouter initialEntries={['/admin']}><Routes>
    <Route path="/login" element={<p>LOGIN DE DESTINO</p>} />
    <Route element={<ProtectedRoute />}><Route path="/admin" element={<p>FORMULARIO PRIVADO</p>} /></Route>
  </Routes></MemoryRouter></AuthContext.Provider>)
}
describe('Ruta protegida', () => {
  it('espera la restauración de sesión sin mostrar contenido privado', () => {
    protectedPage(session({ loading: true }))
    expect(screen.getByRole('status').textContent).toContain('Verificando')
    expect(screen.queryByText('FORMULARIO PRIVADO')).toBeNull()
    expect(screen.queryByText('LOGIN DE DESTINO')).toBeNull()
  })
  it('redirige al login cuando no hay sesión', async () => {
    protectedPage(session())
    expect(await screen.findByText('LOGIN DE DESTINO')).toBeTruthy()
    expect(screen.queryByText('FORMULARIO PRIVADO')).toBeNull()
  })
  it('rechaza una cuenta autenticada sin permisos', () => {
    protectedPage(session({ user: { uid: 'outsider' } }))
    expect(screen.getByText('Acceso restringido')).toBeTruthy()
    expect(screen.queryByText('FORMULARIO PRIVADO')).toBeNull()
  })
  it('muestra el contenido privado para una administradora autorizada', () => {
    protectedPage(session({ user: { uid: 'teacher' }, isAdmin: true }))
    expect(screen.getByText('FORMULARIO PRIVADO')).toBeTruthy()
  })
})
function SessionProbe() {
  const { user, loading, isAdmin } = useAuth()
  return <p>{loading ? 'pending' : user ? `${user.uid}:${isAdmin}` : 'signed-out'}</p>
}
describe('AuthContext', () => {
  it('restaura la cuenta de evaluación y retira permisos al cerrar sesión', () => {
    const page = render(<AuthProvider><SessionProbe /></AuthProvider>)
    expect(screen.getByText('pending')).toBeTruthy()
    act(() => firebase.authNext({ uid: 'teacher' }))
    expect(screen.getByText('teacher:true')).toBeTruthy()
    act(() => firebase.authNext(null))
    expect(screen.getByText('signed-out')).toBeTruthy()
    page.unmount()
    expect(firebase.unsubAuth).toHaveBeenCalledOnce()
  })
  it('mantiene acceso del propietario y no concede permisos por tener cualquier sesión', () => {
    render(<AuthProvider><SessionProbe /></AuthProvider>)
    act(() => firebase.authNext({ uid: 'owner' }))
    expect(screen.getByText('owner:true')).toBeTruthy()
    act(() => firebase.authNext({ uid: 'stranger' }))
    expect(screen.getByText('stranger:false')).toBeTruthy()
  })
})
describe('Login', () => {
  it('envía las credenciales ingresadas al contexto, sin contraseña fija en el código', async () => {
    const login = vi.fn().mockResolvedValue({})
    render(<AuthContext.Provider value={session({ login })}><MemoryRouter><Login /></MemoryRouter></AuthContext.Provider>)
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'admin@admin.com' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'admin123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
    await waitFor(() => expect(login).toHaveBeenCalledWith('admin@admin.com', 'admin123'))
  })
  it('retorna a la ruta privada solicitada después de autenticar', async () => {
    render(<AuthContext.Provider value={session({ user: { uid: 'teacher' }, isAdmin: true })}>
      <MemoryRouter initialEntries={[{ pathname: '/login', state: { from: '/admin/product-success/123' } }]}><Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/product-success/123" element={<p>CONFIRMACION PRIVADA</p>} />
      </Routes></MemoryRouter>
    </AuthContext.Provider>)
    expect(await screen.findByText('CONFIRMACION PRIVADA')).toBeTruthy()
  })
})
const product = { id: '1', titulo: 'Funda', precio: 14500, imagen: '/img/funda.webp', descripcion: 'Funda resistente' }
describe('Lectura en tiempo real', () => {
  it('muestra altas y eliminaciones sin recargar y cancela la suscripción', () => {
    const page = render(<MemoryRouter><ItemListContainer /></MemoryRouter>)
    act(() => products.listNext([]))
    expect(screen.getByText('No hay productos para mostrar.')).toBeTruthy()
    act(() => products.listNext([product]))
    expect(screen.getByText('Funda')).toBeTruthy()
    act(() => products.listNext([]))
    expect(screen.queryByText('Funda')).toBeNull()
    page.unmount()
    expect(products.listUnsub).toHaveBeenCalledOnce()
  })
  it('actualiza el detalle y muestra producto no encontrado si desaparece', () => {
    const page = render(<MemoryRouter initialEntries={['/product/1']}><CartProvider><Routes>
      <Route path="/product/:id" element={<ItemDetailContainer />} />
    </Routes></CartProvider></MemoryRouter>)
    act(() => products.itemNext(product))
    expect(screen.getByRole('heading', { name: 'Funda' })).toBeTruthy()
    act(() => products.itemNext({ ...product, titulo: 'Funda actualizada' }))
    expect(screen.getByRole('heading', { name: 'Funda actualizada' })).toBeTruthy()
    act(() => products.itemNext(null))
    expect(screen.getByText('Producto no encontrado.')).toBeTruthy()
    page.unmount()
    expect(products.itemUnsub).toHaveBeenCalledOnce()
  })
  it('muestra un error de permisos en lugar de dejar la pantalla cargando', () => {
    render(<MemoryRouter><ItemListContainer /></MemoryRouter>)
    act(() => products.listError(new Error('permission-denied')))
    expect(screen.getByRole('alert').textContent).toContain('No se pudieron cargar')
    expect(screen.queryByRole('status')).toBeNull()
  })
})
