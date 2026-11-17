import { collection, getDocs, getDoc, doc, addDoc, runTransaction } from 'firebase/firestore'
import { db } from '../firebase/config'
export async function getProducts() {
  const result = await getDocs(collection(db, 'productos'))
  return result.docs.map(document => ({ ...document.data(), id: document.id }))
}
export async function getProductById(id) {
  const result = await getDoc(doc(db, 'productos', String(id)))
  return result.exists() ? { ...result.data(), id: result.id } : null
}
export async function createProduct(product) {
  const result = await addDoc(collection(db, 'productos'), product)
  return result.id
}
export async function importInitialProducts() {
  const response = await fetch('/data/productos.json')
  if (!response.ok) throw new Error('No se pudo abrir productos.json')
  const products = await response.json()
  // Una transacción evita duplicados y conserva documentos ya existentes.
  return runTransaction(db, async transaction => {
    const refs = products.map(product => doc(db, 'productos', String(product.id)))
    const snapshots = await Promise.all(refs.map(ref => transaction.get(ref)))
    let added = 0
    snapshots.forEach((snapshot, index) => {
      if (!snapshot.exists()) {
        const { id: originalId, ...data } = products[index]
        if (originalId == null) throw new Error('Producto sin ID')
        transaction.set(refs[index], data)
        added += 1
      }
    })
    return added
  })
}
