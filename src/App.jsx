import { Routes, Route, Link, Navigate, useParams } from 'react-router-dom'
import { PublicLayout } from './layouts/PublicLayout'
import { AdminLayout } from './layouts/AdminLayout'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Login } from './components/Login/Login'
import { ItemListContainer } from './components/ItemListContainer/ItemListContainer'
import { ItemDetailContainer } from './components/ItemDetailContainer/ItemDetailContainer'
import { Cart } from './cart/Cart'
import { Admin } from './components/Admin/Admin'
import { ProductSuccess } from './components/ProductForm/ProductSuccess'
import './App.css'
function LegacySuccessRedirect() {
  const { id } = useParams()
  return <Navigate to={`/admin/product-success/${id}`} replace />
}
function App() {
  return <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<ItemListContainer />} />
      <Route path="/product/:id" element={<ItemDetailContainer />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/product-success/:id" element={<LegacySuccessRedirect />} />
      <Route path="*" element={<section><h1>Página no encontrada</h1><Link to="/">Volver al inicio</Link></section>} />
    </Route>
    <Route element={<ProtectedRoute />}>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Admin />} />
        <Route path="product-success/:id" element={<ProductSuccess />} />
      </Route>
    </Route>
  </Routes>
}
export default App
