import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
export const Cart = () => {
  const { cart, removeItem, clearCart, total } = useCart()
  if (!cart.length) return <section><h1>Tu carrito está vacío</h1><Link to="/">Ver productos</Link></section>
  return <section><h1>Tu carrito</h1>
    {cart.map(item => <article className="cart-row" key={item.id}>
      <img src={item.imagen} alt={item.titulo} width="100" />
      <div><h2>{item.titulo}</h2><p>Cantidad: {item.cantidad}</p>
        <p>Precio por unidad: ${Number(item.precio).toLocaleString('es-AR')}</p>
        <p>Subtotal: ${(Number(item.precio) * item.cantidad).toLocaleString('es-AR')}</p>
      </div>
      <button onClick={() => removeItem(item.id)}>Eliminar producto</button>
    </article>)}
    <h2>Total: ${total.toLocaleString('es-AR')}</h2>
    <button onClick={clearCart}>Vaciar carrito</button>
    <p><Link to="/">Seguir comprando</Link></p>
  </section>
}
