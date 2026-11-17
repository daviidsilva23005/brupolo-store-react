import { Routes, Route, Link } from 'react-router-dom'
import { Header } from './components/Header/Header'
import { Footer } from './components/Footer/Footer'
import { ItemListContainer } from './components/ItemListContainer/ItemListContainer'
import { ItemDetailContainer } from './components/ItemDetailContainer/ItemDetailContainer'
import { Cart } from './cart/Cart'
import { Admin } from './components/Admin/Admin'
import { ProductSuccess } from './components/ProductForm/ProductSuccess'
import './App.css'
function App() {
  return <><Header /><main><Routes>
    <Route path="/" element={<ItemListContainer />} />
    <Route path="/product/:id" element={<ItemDetailContainer />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/admin" element={<Admin />} />
    <Route path="/product-success/:id" element={<ProductSuccess />} />
    <Route path="*" element={<section><h1>Página no encontrada</h1><Link to="/">Volver al inicio</Link></section>} />
  </Routes></main><Footer /></>
}
export default App
