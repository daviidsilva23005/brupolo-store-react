import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
export const Nav = () => {
  const { count } = useCart()
  return <nav aria-label="Principal"><ul>
    <li><Link to="/">Inicio</Link></li>
    <li><Link to="/cart">Carrito ({count})</Link></li>
    <li><Link to="/admin">Administración</Link></li>
  </ul></nav>
}
