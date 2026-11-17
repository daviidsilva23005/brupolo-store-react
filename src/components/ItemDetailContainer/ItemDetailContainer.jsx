import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ItemDetail } from '../ItemDetail/ItemDetail'
import { getProductById } from '../../services/products.service'
export const ItemDetailContainer = () => {
  const { id } = useParams()
  const [state, setState] = useState({ id: null, item: null, loading: true, error: '' })
  useEffect(() => {
    let active = true
    getProductById(id).then(item => {
      if (active) setState({ id, item, loading: false, error: '' })
    }).catch(() => {
      if (active) setState({ id, item: null, loading: false, error: 'No se pudo cargar el producto.' })
    })
    return () => { active = false }
  }, [id])
  if (state.id !== id || state.loading) return <p role="status">Cargando producto...</p>
  if (state.error) return <p role="alert">{state.error}</p>
  if (!state.item) return <p>Producto no encontrado.</p>
  return <ItemDetail key={id} item={state.item} />
}
