import { useRef, useState } from 'react'
import { importInitialProducts } from '../../services/products.service'
import { ProductFormContainer } from '../ProductForm/ProductFormContainer'
export function Admin() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const busy = useRef(false)
  async function importProducts() {
    if (busy.current) return
    busy.current = true; setLoading(true); setMessage('')
    try {
      const count = await importInitialProducts()
      setMessage(count ? `Se cargaron ${count} productos. Los existentes se conservaron.` : 'Los seis productos ya estaban cargados. No se modificaron.')
    } catch { setMessage('No se pudo importar. Revisá tu conexión y los permisos de Firestore.') }
    finally { busy.current = false; setLoading(false) }
  }
  return <section>
    <details><summary>Carga inicial del catálogo</summary>
      <p>Esta opción agrega los seis productos originales que todavía no existan.</p>
      <button onClick={importProducts} disabled={loading}>{loading ? 'Importando...' : 'Cargar los 6 productos iniciales'}</button>
    </details>
    {message && <p role="status">{message}</p>}
    <ProductFormContainer />
  </section>
}
