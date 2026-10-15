export const ItemDetail = ({ item }) => {
  return (
    <section>
      <img src={item.imagen} alt={item.titulo} />

      <div>
        <h2>{item.titulo}</h2>
        <p>{item.descripcion}</p>
        <strong>
          ${item.precio.toLocaleString('es-AR')}
        </strong>
      </div>
    </section>
  )
}