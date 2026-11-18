import { useEffect, useState } from 'react'
import { ItemList } from '../ItemList/ItemList'
import { subscribeProducts } from '../../services/products.service'
export const ItemListContainer = () => {
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  useEffect(() => subscribeProducts(data => {
    setProducts(data); setError(''); setLoading(false)
  }, () => {
    setError('No se pudieron cargar los productos. Revisá la conexión y las reglas de Firestore.'); setLoading(false)
  }), [])
  if (loading) return <p role="status">Cargando productos...</p>
  if (error) return <p role="alert">{error}</p>
  return <section><h2>Productos</h2><ItemList products={products} /></section>
}
