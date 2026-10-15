export const Item = ({ titulo, precio, imagen, descripcion }) => {
  return (
    <article>
      <img src={imagen} alt={titulo} />

      <h3>{titulo}</h3>

      <p>{descripcion}</p>

      <strong>
        ${precio.toLocaleString('es-AR')}
      </strong>
    </article>
  )
}