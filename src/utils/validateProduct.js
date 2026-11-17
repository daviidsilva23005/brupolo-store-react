export function validateProduct(product) {
  const errors = {}
  if (!product.titulo.trim()) errors.titulo = 'Escribí el nombre del producto.'
  if (!String(product.precio).trim() || !Number.isFinite(Number(product.precio)) || Number(product.precio) <= 0) errors.precio = 'Ingresá un precio mayor a cero.'
  if (!product.descripcion.trim()) errors.descripcion = 'Escribí una descripción.'
  if (!product.categoria.trim()) errors.categoria = 'Elegí una categoría.'
  if (!/^(https:\/\/|\/img\/)/.test(product.imagen.trim())) errors.imagen = 'Usá una dirección https:// o una ruta /img/.'
  return errors
}
