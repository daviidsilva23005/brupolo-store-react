export function ProductFormUI({ product, errors, loading, onChange, onSubmit }) {
  return <form className="product-form" onSubmit={onSubmit} noValidate>
    <h2>Agregar producto</h2>
    {[
      ['titulo', 'Nombre', 'text'], ['precio', 'Precio en pesos', 'number'],
      ['descripcion', 'Descripción', 'text'], ['categoria', 'Categoría', 'text'],
      ['imagen', 'Imagen (URL https:// o ruta /img/)', 'text'],
    ].map(([name, label, type]) => <div key={name}>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} value={product[name]} onChange={onChange}
        step={type === 'number' ? '0.01' : undefined} disabled={loading}
        aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${name}-error` : undefined} />
      {errors[name] && <p id={`${name}-error`} role="alert">{errors[name]}</p>}
    </div>)}
    {errors.general && <p role="alert">{errors.general}</p>}
    <button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar producto'}</button>
  </form>
}
