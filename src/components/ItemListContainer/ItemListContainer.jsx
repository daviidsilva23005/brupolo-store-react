import { useEffect, useState } from 'react'
import { ItemList } from '../ItemList/ItemList'

export const ItemListContainer = () => {
  const [products, setProducts] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/productos.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('No se pudieron cargar los productos')
        }

        return response.json()
      })
      .then((data) => {
        setProducts(data)
      })
      .catch((error) => {
        setError(error.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <p>Cargando productos...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <section>
      <h2>Productos</h2>
      <ItemList products={products} />
    </section>
  )
}