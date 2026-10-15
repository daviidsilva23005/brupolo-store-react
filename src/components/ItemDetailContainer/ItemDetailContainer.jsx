import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ItemDetail } from '../ItemDetail/ItemDetail'

export const ItemDetailContainer = () => {
  const [item, setItem] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const { id } = useParams()

  useEffect(() => {
    fetch('/data/productos.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('No se pudieron cargar los productos')
        }

        return response.json()
      })
      .then((data) => {
        const productFound = data.find(
          (product) => String(product.id) === id
        )

        setItem(productFound)
      })
      .catch((error) => {
        setError(error.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return <p>Cargando producto...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  if (!item) {
    return <p>Producto no encontrado.</p>
  }

  return <ItemDetail item={item} />
}