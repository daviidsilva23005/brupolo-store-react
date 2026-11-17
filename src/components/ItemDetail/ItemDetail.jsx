import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
export const ItemDetail = ({ item }) => {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  return <section>
    <img src={item.imagen} alt={item.titulo} />
    <div><h2>{item.titulo}</h2><p>{item.descripcion}</p>
      <strong>${Number(item.precio).toLocaleString('es-AR')}</strong>
      <p><button onClick={() => { addItem(item); setAdded(true) }}>Agregar al carrito</button></p>
      {added && <p role="status">Producto agregado. <Link to="/cart">Ver carrito</Link></p>}
      <Link to="/">Volver a productos</Link>
    </div>
  </section>
}
