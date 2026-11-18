import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ItemDetail } from '../ItemDetail/ItemDetail'
import { subscribeProductById } from '../../services/products.service'
export const ItemDetailContainer = () => {
  const { id } = useParams()
  const [state, setState] = useState({ id: null, item: null, error: '' })
  useEffect(() => subscribeProductById(id, item => {
    setState({ id, item, error: '' })
  }, () => {
    setState({ id, item: null, error: 'No se pudo cargar el producto.' })
  }), [id])
  if (state.id !== id) return <p role="status">Cargando producto...</p>
  if (state.error) return <p role="alert">{state.error}</p>
  if (!state.item) return <p>Producto no encontrado.</p>
  return <ItemDetail key={id} item={state.item} />
}
