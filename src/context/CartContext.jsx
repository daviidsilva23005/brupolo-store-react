import { createContext, useContext, useEffect, useState } from 'react'
const CartContext = createContext(null)
const STORAGE_KEY = 'brupolo-cart-v1'
function readCart() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(data) ? data.filter(item => item && item.id != null &&
      Number.isFinite(Number(item.precio)) && Number(item.precio) > 0 &&
      Number.isInteger(item.cantidad) && item.cantidad > 0) : []
  } catch { return [] }
}
export function CartProvider({ children }) {
  const [cart, setCart] = useState(readCart)
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)) } catch { /* Carrito disponible en memoria. */ }
  }, [cart])
  const addItem = product => setCart(previous => {
    const exists = previous.some(item => String(item.id) === String(product.id))
    return exists ? previous.map(item => String(item.id) === String(product.id)
      ? { ...item, cantidad: item.cantidad + 1 } : item)
      : [...previous, { ...product, cantidad: 1 }]
  })
  const removeItem = id => setCart(previous => previous.filter(item => String(item.id) !== String(id)))
  const clearCart = () => setCart([])
  const total = cart.reduce((sum, item) => sum + Number(item.precio) * item.cantidad, 0)
  const count = cart.reduce((sum, item) => sum + item.cantidad, 0)
  return <CartContext.Provider value={{ cart, addItem, removeItem, clearCart, total, count }}>{children}</CartContext.Provider>
}
export function useCart() { return useContext(CartContext) }
