import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createProduct } from '../../services/products.service'
import { validateProduct } from '../../utils/validateProduct'
import { ProductFormUI } from './ProductFormUI'
export function ProductFormContainer() {
  const [product, setProduct] = useState({ titulo: '', precio: '', descripcion: '', categoria: '', imagen: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const busy = useRef(false)
  const navigate = useNavigate()
  const onChange = event => {
    const { name, value } = event.target
    setProduct(previous => ({ ...previous, [name]: value }))
    setErrors(previous => ({ ...previous, [name]: '', general: '' }))
  }
  const onSubmit = async event => {
    event.preventDefault()
    if (busy.current) return
    const validation = validateProduct(product)
    setErrors(validation)
    if (Object.keys(validation).length) return
    busy.current = true
    setLoading(true)
    try {
      const data = Object.fromEntries(Object.entries(product).map(([key, value]) => [key, value.trim()]))
      const id = await createProduct({ ...data, precio: Number(data.precio) })
      navigate(`/product-success/${id}`)
    } catch {
      setErrors({ general: 'No se pudo guardar. Revisá la conexión, el usuario administrador y las reglas de Firestore.' })
    } finally { busy.current = false; setLoading(false) }
  }
  return <ProductFormUI {...{ product, errors, loading, onChange, onSubmit }} />
}
