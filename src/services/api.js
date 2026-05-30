/**
 * api.js
 * Capa de comunicación con la API.
 * Todos los endpoints y la URL base se leen desde variables de entorno.
 * No hay nada quemado en este archivo.
 *
 * Archivos de entorno disponibles:
 *   .env.local       → desarrollo local
 *   .env.test        → pruebas / QA
 *   .env.production  → producción
 */

// ─── Base URL ─────────────────────────────────────────────────────────────────
const BASE = import.meta.env.VITE_API_URL;

// ─── Endpoints desde .env ────────────────────────────────────────────────────
const EP = {
  // Usuario
  USUARIO_LOGIN:      import.meta.env.VITE_EP_USUARIO_LOGIN,
  USUARIO_REGISTRAR:  import.meta.env.VITE_EP_USUARIO_REGISTRAR,
  USUARIO_OBTENER:    import.meta.env.VITE_EP_USUARIO_OBTENER,
  USUARIO_ACTUALIZAR: import.meta.env.VITE_EP_USUARIO_ACTUALIZAR,
  USUARIO_TODOS:      import.meta.env.VITE_EP_USUARIO_TODOS,

  // Producto
  PRODUCTO_TODOS:        import.meta.env.VITE_EP_PRODUCTO_TODOS,
  PRODUCTO_OBTENER:      import.meta.env.VITE_EP_PRODUCTO_OBTENER,
  PRODUCTO_POR_CATEGORIA:import.meta.env.VITE_EP_PRODUCTO_POR_CATEGORIA,
  PRODUCTO_BUSCAR:       import.meta.env.VITE_EP_PRODUCTO_BUSCAR,
  PRODUCTO_CREAR:        import.meta.env.VITE_EP_PRODUCTO_CREAR,
  PRODUCTO_ACTUALIZAR:   import.meta.env.VITE_EP_PRODUCTO_ACTUALIZAR,
  PRODUCTO_ELIMINAR:     import.meta.env.VITE_EP_PRODUCTO_ELIMINAR,

  // Catálogos
  CATEGORIA_TODOS:      import.meta.env.VITE_EP_CATEGORIA_TODOS,
  CATEGORIA_CREAR:      import.meta.env.VITE_EP_CATEGORIA_CREAR,
  CATEGORIA_ACTUALIZAR: import.meta.env.VITE_EP_CATEGORIA_ACTUALIZAR,
  CATEGORIA_ELIMINAR:   import.meta.env.VITE_EP_CATEGORIA_ELIMINAR,

  MARCA_TODOS:          import.meta.env.VITE_EP_MARCA_TODOS,
  MARCA_CREAR:          import.meta.env.VITE_EP_MARCA_CREAR,
  MARCA_ACTUALIZAR:     import.meta.env.VITE_EP_MARCA_ACTUALIZAR,
  MARCA_ELIMINAR:       import.meta.env.VITE_EP_MARCA_ELIMINAR,

  MODELO_TODOS:         import.meta.env.VITE_EP_MODELO_TODOS,
  MODELO_CREAR:         import.meta.env.VITE_EP_MODELO_CREAR,
  MODELO_ACTUALIZAR:    import.meta.env.VITE_EP_MODELO_ACTUALIZAR,
  MODELO_ELIMINAR:      import.meta.env.VITE_EP_MODELO_ELIMINAR,

  TALLA_TODOS:          import.meta.env.VITE_EP_TALLA_TODOS,
  TALLA_CREAR:          import.meta.env.VITE_EP_TALLA_CREAR,
  TALLA_ACTUALIZAR:     import.meta.env.VITE_EP_TALLA_ACTUALIZAR,
  TALLA_ELIMINAR:       import.meta.env.VITE_EP_TALLA_ELIMINAR,

  COLOR_TODOS:          import.meta.env.VITE_EP_COLOR_TODOS,
  COLOR_CREAR:          import.meta.env.VITE_EP_COLOR_CREAR,
  COLOR_ACTUALIZAR:     import.meta.env.VITE_EP_COLOR_ACTUALIZAR,
  COLOR_ELIMINAR:       import.meta.env.VITE_EP_COLOR_ELIMINAR,

  // Producto Variación
  VARIACION_POR_PRODUCTO: import.meta.env.VITE_EP_VARIACION_POR_PRODUCTO,
  VARIACION_CREAR:        import.meta.env.VITE_EP_VARIACION_CREAR,
  VARIACION_ACTUALIZAR:   import.meta.env.VITE_EP_VARIACION_ACTUALIZAR,
  VARIACION_ELIMINAR:     import.meta.env.VITE_EP_VARIACION_ELIMINAR,

  // Producto Imagen
  IMAGEN_POR_PRODUCTO: import.meta.env.VITE_EP_IMAGEN_POR_PRODUCTO,
  IMAGEN_CREAR:        import.meta.env.VITE_EP_IMAGEN_CREAR,
  IMAGEN_ELIMINAR:     import.meta.env.VITE_EP_IMAGEN_ELIMINAR,

  // Carrito
  CARRITO_POR_USUARIO: import.meta.env.VITE_EP_CARRITO_POR_USUARIO,
  CARRITO_CREAR:       import.meta.env.VITE_EP_CARRITO_CREAR,

  // Carrito Detalle
  CARRITODETALLE_CREAR:      import.meta.env.VITE_EP_CARRITODETALLE_CREAR,
  CARRITODETALLE_ACTUALIZAR: import.meta.env.VITE_EP_CARRITODETALLE_ACTUALIZAR,
  CARRITODETALLE_ELIMINAR:   import.meta.env.VITE_EP_CARRITODETALLE_ELIMINAR,
  CARRITODETALLE_VACIAR:     import.meta.env.VITE_EP_CARRITODETALLE_VACIAR,

  // Dirección
  DIRECCION_POR_USUARIO: import.meta.env.VITE_EP_DIRECCION_POR_USUARIO,
  DIRECCION_CREAR:       import.meta.env.VITE_EP_DIRECCION_CREAR,
  DIRECCION_ACTUALIZAR:  import.meta.env.VITE_EP_DIRECCION_ACTUALIZAR,
  DIRECCION_ELIMINAR:    import.meta.env.VITE_EP_DIRECCION_ELIMINAR,

  // Orden
  ORDEN_TODOS:       import.meta.env.VITE_EP_ORDEN_TODOS,
  ORDEN_POR_USUARIO: import.meta.env.VITE_EP_ORDEN_POR_USUARIO,
  ORDEN_OBTENER:     import.meta.env.VITE_EP_ORDEN_OBTENER,
  ORDEN_CREAR:       import.meta.env.VITE_EP_ORDEN_CREAR,
  ORDEN_ACTUALIZAR:         import.meta.env.VITE_EP_ORDEN_ACTUALIZAR,
  ORDEN_CAMBIAR_ESTADO:     import.meta.env.VITE_EP_ORDEN_CAMBIAR_ESTADO,

  // Orden Detalle
  ORDENDETALLE_CREAR: import.meta.env.VITE_EP_ORDENDETALLE_CREAR,

  // Envío
  ENVIO_CREAR:      import.meta.env.VITE_EP_ENVIO_CREAR,
  ENVIO_ACTUALIZAR: import.meta.env.VITE_EP_ENVIO_ACTUALIZAR,

  // Pago
  PAGO_CREAR:      import.meta.env.VITE_EP_PAGO_CREAR,
  PAGO_ACTUALIZAR: import.meta.env.VITE_EP_PAGO_ACTUALIZAR,

  // Opinion
  OPINION_POR_PRODUCTO: import.meta.env.VITE_EP_OPINION_POR_PRODUCTO,
  OPINION_CREAR:        import.meta.env.VITE_EP_OPINION_CREAR,
};

// ─── Request helper ───────────────────────────────────────────────────────────
async function request(method, endpoint, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE}/${endpoint}`, options);

  if (res.status === 204) return null;

  const data = await res.json();

  if (!res.ok) throw new Error(data?.mensaje || data?.title || 'Error en la solicitud');

  return data;
}

const get  = (ep)    => request('GET',    ep);
const post = (ep, b) => request('POST',   ep, b);
const put  = (ep, b) => request('PUT',    ep, b);
const del  = (ep, b) => request('DELETE', ep, b);

// ─── USUARIO ─────────────────────────────────────────────────────────────────
export const UsuarioAPI = {
  login:      (dto) => post(EP.USUARIO_LOGIN,      dto),
  registrar:  (dto) => post(EP.USUARIO_REGISTRAR,  dto),
  obtener:    (id)  => post(EP.USUARIO_OBTENER,    { Id: id }),
  actualizar: (dto) => put(EP.USUARIO_ACTUALIZAR,  dto),
  todos:      ()    => get(EP.USUARIO_TODOS),
};

// ─── PRODUCTO ────────────────────────────────────────────────────────────────
export const ProductoAPI = {
  todos:        ()            => get(EP.PRODUCTO_TODOS),
  paginado:     (p, n) => get(`${EP.PRODUCTO_PAGINADO}?pagina=${p}&porPagina=${n}`),
  obtener:      (id)  => post(EP.PRODUCTO_OBTENER,        { Id: id }),
  porCategoria: (id)  => post(EP.PRODUCTO_POR_CATEGORIA,  { Id_Categoria: id }),
  buscar:       (txt) => post(EP.PRODUCTO_BUSCAR,         { Texto: txt }),
  crear:        (dto) => post(EP.PRODUCTO_CREAR,          dto),
  actualizar:   (dto) => put(EP.PRODUCTO_ACTUALIZAR,      dto),
  eliminar:     (id)  => del(EP.PRODUCTO_ELIMINAR,        { Id: id }),
};

// ─── CATALOGOS ───────────────────────────────────────────────────────────────
export const CategoriaAPI = {
  todos:      ()    => get(EP.CATEGORIA_TODOS),
  crear:      (dto) => post(EP.CATEGORIA_CREAR,      dto),
  actualizar: (dto) => put(EP.CATEGORIA_ACTUALIZAR,  dto),
  eliminar:   (id)  => del(EP.CATEGORIA_ELIMINAR,    { Id: id }),
};
export const MarcaAPI = {
  todos:      ()    => get(EP.MARCA_TODOS),
  crear:      (dto) => post(EP.MARCA_CREAR,      dto),
  actualizar: (dto) => put(EP.MARCA_ACTUALIZAR,  dto),
  eliminar:   (id)  => del(EP.MARCA_ELIMINAR,    { Id: id }),
};
export const ModeloAPI = {
  todos:      ()    => get(EP.MODELO_TODOS),
  crear:      (dto) => post(EP.MODELO_CREAR,      dto),
  actualizar: (dto) => put(EP.MODELO_ACTUALIZAR,  dto),
  eliminar:   (id)  => del(EP.MODELO_ELIMINAR,    { Id: id }),
};
export const TallaAPI = {
  todos:      ()    => get(EP.TALLA_TODOS),
  crear:      (dto) => post(EP.TALLA_CREAR,      dto),
  actualizar: (dto) => put(EP.TALLA_ACTUALIZAR,  dto),
  eliminar:   (id)  => del(EP.TALLA_ELIMINAR,    { Id: id }),
};
export const ColorAPI = {
  todos:      ()    => get(EP.COLOR_TODOS),
  crear:      (dto) => post(EP.COLOR_CREAR,      dto),
  actualizar: (dto) => put(EP.COLOR_ACTUALIZAR,  dto),
  eliminar:   (id)  => del(EP.COLOR_ELIMINAR,    { Id: id }),
};

// ─── PRODUCTO VARIACION ──────────────────────────────────────────────────────
export const ProductoVariacionAPI = {
  porProducto: (id)  => post(EP.VARIACION_POR_PRODUCTO, { Id_Producto: id }),
  crear:       (dto) => post(EP.VARIACION_CREAR,        dto),
  actualizar:  (dto) => put(EP.VARIACION_ACTUALIZAR,    dto),
  eliminar:    (id)  => del(EP.VARIACION_ELIMINAR,      { Id: id }),
};

// ─── PRODUCTO IMAGEN ─────────────────────────────────────────────────────────
export const ProductoImagenAPI = {
  porProducto: (id)  => post(EP.IMAGEN_POR_PRODUCTO, { Id_Producto: id }),
  crear:       (dto) => post(EP.IMAGEN_CREAR,        dto),
  eliminar:    (id)  => del(EP.IMAGEN_ELIMINAR,      { Id: id }),
};

// ─── CARRITO ─────────────────────────────────────────────────────────────────
export const CarritoAPI = {
  porUsuario: (id)  => post(EP.CARRITO_POR_USUARIO, { Id_Usuario: id }),
  crear:      (dto) => post(EP.CARRITO_CREAR,        dto),
};

// ─── CARRITO DETALLE ─────────────────────────────────────────────────────────
export const CarritoDetalleAPI = {
  crear:      (dto) => post(EP.CARRITODETALLE_CREAR,      dto),
  actualizar: (dto) => put(EP.CARRITODETALLE_ACTUALIZAR,  dto),
  eliminar:   (id)  => del(EP.CARRITODETALLE_ELIMINAR,    { Id: id }),
  vaciar:     (id)  => del(EP.CARRITODETALLE_VACIAR,      { Id_Carrito: id }),
};

// ─── DIRECCION ───────────────────────────────────────────────────────────────
export const DireccionAPI = {
  porUsuario: (id)  => post(EP.DIRECCION_POR_USUARIO, { Id_Usuario: id }),
  crear:      (dto) => post(EP.DIRECCION_CREAR,        dto),
  actualizar: (dto) => put(EP.DIRECCION_ACTUALIZAR,    dto),
  eliminar:   (id)  => del(EP.DIRECCION_ELIMINAR,      { Id: id }),
};

// ─── ORDEN ───────────────────────────────────────────────────────────────────
export const OrdenAPI = {
  todos:         ()           => get(EP.ORDEN_TODOS),
  porUsuario:    (id)         => post(EP.ORDEN_POR_USUARIO,     { Id_Usuario: id }),
  obtener:       (id)         => post(EP.ORDEN_OBTENER,         { Id: id }),
  crear:         (dto)        => post(EP.ORDEN_CREAR,            dto),
  actualizar:    (dto)        => put(EP.ORDEN_ACTUALIZAR,        dto),
  cambiarEstado: (id, estado) => request('PATCH', EP.ORDEN_CAMBIAR_ESTADO, { Id: id, Estado: estado }),
};

// ─── ORDEN DETALLE ───────────────────────────────────────────────────────────
export const OrdenDetalleAPI = {
  crear: (dto) => post(EP.ORDENDETALLE_CREAR, dto),
};

// ─── ENVIO ───────────────────────────────────────────────────────────────────
export const EnvioAPI = {
  crear:      (dto) => post(EP.ENVIO_CREAR,      dto),
  actualizar: (dto) => put(EP.ENVIO_ACTUALIZAR,  dto),
};

// ─── PAGO ────────────────────────────────────────────────────────────────────
export const PagoAPI = {
  crear:      (dto) => post(EP.PAGO_CREAR,      dto),
  actualizar: (dto) => put(EP.PAGO_ACTUALIZAR,  dto),
};

// ─── OPINION ─────────────────────────────────────────────────────────────────
export const OpinionAPI = {
  porProducto: (id)  => post(EP.OPINION_POR_PRODUCTO, { Id_Producto: id }),
  crear:       (dto) => post(EP.OPINION_CREAR,         dto),
};
