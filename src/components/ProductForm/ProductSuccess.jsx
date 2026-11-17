import { Link, useParams } from 'react-router-dom'
export function ProductSuccess() {
  const { id } = useParams()
  return <section><h1>Producto guardado</h1><p>ID: {id}</p>
    <p><Link to={`/product/${id}`}>Ver producto</Link></p>
    <p><Link to="/admin">Agregar otro producto</Link></p>
    <Link to="/">Volver al catálogo</Link>
  </section>
}
