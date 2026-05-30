import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Truck, Repeat2, ShieldCheck, Check, ChevronLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';
import { OpinionAPI } from '../services/api';

const formatCOP = (n) => typeof n === 'number' ? '$' + n.toLocaleString('es-CO') : '$0';

// ── Sección de opiniones con formulario ──────────────────────────────────────
function OpinionesSection({ productoId, usuario }) {
  const [opiniones, setOpiniones] = React.useState([]);
  const [loading,   setLoading]   = React.useState(true);
  const [form,      setForm]      = React.useState({ calificacion: 5, comentario: '' });
  const [enviando,  setEnviando]  = React.useState(false);
  const [enviado,   setEnviado]   = React.useState(false);
  const [error,     setError]     = React.useState('');

  React.useEffect(() => {
    if (!productoId) return;
    OpinionAPI.porProducto(productoId)
      .then((data) => setOpiniones(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuario) { setError('Debes iniciar sesión para dejar una opinión'); return; }
    if (!form.comentario.trim()) { setError('Escribe un comentario'); return; }
    setError(''); setEnviando(true);
    try {
      const nueva = await OpinionAPI.crear({
        Id_Usuario:   usuario.Id,
        Id_Producto:  productoId,
        Calificacion: form.calificacion,
        Comentario:   form.comentario.trim(),
      });
      const nombre = `${usuario.Nombres || ''} ${usuario.Apellidos || ''}`.trim();
      setOpiniones((prev) => [{
        id:            nueva.id ?? nueva.Id,
        nombreUsuario: nueva.nombreUsuario ?? nombre,
        calificacion:  nueva.calificacion  ?? nueva.Calificacion ?? form.calificacion,
        comentario:    nueva.comentario    ?? nueva.Comentario   ?? form.comentario,
        fecha:         nueva.fecha         ?? nueva.Fecha        ?? new Date().toISOString(),
      }, ...prev]);
      setForm({ calificacion: 5, comentario: '' });
      setEnviado(true);
      setTimeout(() => setEnviado(false), 2500);
    } catch (err) {
      setError(err.message || 'Error al enviar la opinión');
    } finally {
      setEnviando(false);
    }
  };

  const gStr = (o, ...keys) => { for (const k of keys) if (o[k]) return o[k]; return ''; };
  const gNum = (o, ...keys) => { for (const k of keys) if (o[k] != null) return o[k]; return 0; };

  return (
    <div className="mt-16 pt-10 border-t-2 border-black">
      <h2 className="section-title mb-6">Opiniones de clientes</h2>

      {/* Formulario nueva opinión */}
      {usuario && (
        <form onSubmit={handleSubmit} className="border-2 border-black p-5 mb-8 bg-[#f9f9f9]">
          <div className="label-tiny mb-3">DEJA TU OPINIÓN</div>
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[0.78rem]">CALIFICACIÓN</span>
            {[1,2,3,4,5].map((s) => (
              <button key={s} type="button" onClick={() => setForm((f) => ({ ...f, calificacion: s }))}
                className="transition-transform hover:scale-110">
                <Star size={22} fill={s <= form.calificacion ? 'currentColor' : 'none'}
                  className={s <= form.calificacion ? 'text-yellow-400' : 'text-gray-300'} />
              </button>
            ))}
          </div>
          <textarea
            className="brutal-input resize-none w-full mb-3" rows={3}
            placeholder="Cuéntanos tu experiencia con el producto..."
            value={form.comentario}
            onChange={(e) => setForm((f) => ({ ...f, comentario: e.target.value }))}
          />
          {error && <div className="text-[var(--accent)] font-mono text-[0.82rem] mb-2">{error}</div>}
          {enviado && <div className="text-green-600 font-mono text-[0.82rem] mb-2 flex items-center gap-1"><Check size={13}/> ¡Opinión enviada!</div>}
          <button disabled={enviando} className="brutal-btn brutal-btn--accent">
            {enviando ? 'ENVIANDO...' : 'PUBLICAR OPINIÓN'}
          </button>
        </form>
      )}

      {!usuario && (
        <div className="border border-black/20 p-4 mb-6 font-mono text-[0.82rem] text-[var(--muted)]">
          <a href="/login" className="text-[var(--accent)] hover:underline">Inicia sesión</a> para dejar una opinión.
        </div>
      )}

      {/* Lista de opiniones */}
      {loading ? (
        <div className="font-mono text-[0.82rem] text-[var(--muted)]">Cargando opiniones...</div>
      ) : opiniones.length === 0 ? (
        <div className="border-2 border-dashed border-black p-8 text-center">
          <div className="font-display uppercase">Sin opiniones aún</div>
          <div className="text-[var(--muted)] text-[0.88rem] mt-1">Sé el primero en opinar.</div>
        </div>
      ) : (
        <div className="grid gap-4">
          {opiniones.map((r, i) => {
            const nombre = gStr(r, 'nombreUsuario', 'NombreUsuario', 'nombre');
            const rating = gNum(r, 'calificacion', 'Calificacion');
            const texto  = gStr(r, 'comentario', 'Comentario');
            const fecha  = gStr(r, 'fecha', 'Fecha');
            const fechaFmt = fecha
              ? new Date(fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
              : '';
            return (
              <div key={r.id ?? r.Id ?? i} className="border-2 border-black p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-display text-[0.88rem]">{nombre || 'Cliente'}</div>
                    {fechaFmt && <div className="font-mono text-[0.7rem] text-[var(--muted)] mt-0.5">{fechaFmt}</div>}
                  </div>
                  <div className="flex shrink-0">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} size={14} fill={s <= rating ? 'currentColor' : 'none'}
                        className={s <= rating ? 'text-yellow-400' : 'text-gray-200'} />
                    ))}
                  </div>
                </div>
                {texto && <div className="text-[0.92rem] text-[var(--ink-soft)] mt-3">{texto}</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}



export default function ProductDetail() {
  const { id }      = useParams();
  const nav         = useNavigate();
  const { addItem } = useCart();
  const { user }    = useAuth();
  const { getProduct, loading } = useProducts();
  const p           = getProduct(id);

  const [selectedTalla,  setSelectedTalla]  = useState(null); // NumeroTalla string
  const [selectedColor,  setSelectedColor]  = useState(null); // Id del color
  const [error,          setError]          = useState('');
  const [added,          setAdded]          = useState(false);

  if (loading) return (
    <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-24 text-center">
      <div className="font-mono text-[0.85rem] tracking-[0.15em] text-[var(--muted)]">CARGANDO...</div>
    </div>
  );

  if (!p) return (
    <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-20 text-center">
      <div className="font-display text-2xl mb-3">PRODUCTO NO ENCONTRADO</div>
      <button onClick={() => nav(-1)} className="brutal-btn brutal-btn--ghost mt-4">VOLVER</button>
    </div>
  );

  const nombre      = p.Nombre;
  const marca       = p.NombreMarca;
  const precio      = p.Precio;
  const precioAnt   = p.PrecioAnterior;
  const descripcion = p.Descripcion;
  const rating      = p.CalificacionPromedio ?? 0;
  const nReviews    = p.TotalOpiniones ?? 0;
  const variaciones = p.Variaciones || [];
  const imagenes    = p.Imagenes    || [];
  const imgPrincipal = imagenes.find((i) => i.Principal)?.Url_Imagen || imagenes[0]?.Url_Imagen || '';

  // Tallas únicas con stock total por talla
  const tallasMap = variaciones.reduce((acc, v) => {
    const t = v.NumeroTalla;
    if (!acc[t]) acc[t] = { numero: t, stockTotal: 0 };
    acc[t].stockTotal += v.Stock;
    return acc;
  }, {});
  const tallas = Object.values(tallasMap).sort((a, b) =>
    parseFloat(a.numero) - parseFloat(b.numero)
  );

  // Colores disponibles para la talla seleccionada
  const coloresDeTalla = selectedTalla
    ? variaciones.filter((v) => v.NumeroTalla === selectedTalla && v.Stock > 0)
    : [];

  // Variación exacta seleccionada (talla + color)
  const variacionExacta = selectedTalla && selectedColor
    ? variaciones.find(
        (v) => v.NumeroTalla === selectedTalla && v.Id_Color === selectedColor
      )
    : null;

  const handleSelectTalla = (numero) => {
    setSelectedTalla(numero);
    setSelectedColor(null); // resetear color al cambiar talla
    setError('');
  };

  const handleAdd = (buyNow = false) => {
    if (!selectedTalla)    { setError('Selecciona una talla'); return; }
    if (!selectedColor)    { setError('Selecciona un color'); return; }
    if (!variacionExacta)  { setError('Combinación no disponible'); return; }
    if (variacionExacta.Stock === 0) { setError('Sin stock'); return; }
    setError('');

    addItem(
      { id: p.Id, name: nombre, brand: marca, price: precio, image: imgPrincipal },
      selectedTalla,
      1,
      variacionExacta.Id,
    );

    setAdded(true);
    if (buyNow) nav('/carrito');
    else setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-10">
      <button onClick={() => nav(-1)}
        className="inline-flex items-center gap-1 label-tiny hover:text-[var(--accent)] mb-6">
        <ChevronLeft size={14} /> VOLVER
      </button>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Imagen */}
        <div className="border-2 border-black aspect-square overflow-hidden bg-[#ececf1]">
          {imgPrincipal
            ? <img src={imgPrincipal} alt={nombre} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-[var(--muted)] font-mono text-sm">SIN IMAGEN</div>
          }
        </div>

        {/* Info */}
        <div>
          <div className="label-tiny mb-2">{marca}</div>
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] leading-none uppercase">{nombre}</h1>

          {nReviews > 0 && (
            <div className="flex items-center gap-2 mt-4 pb-5 border-b-2 border-black">
              <div className="flex">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={16} fill={s <= Math.round(rating) ? 'currentColor' : 'none'} />
                ))}
              </div>
              <span className="font-mono text-[0.85rem] font-bold">{Number(rating).toFixed(1)}</span>
              <span className="font-mono text-[0.78rem] text-[var(--muted)]">({nReviews} reseñas)</span>
            </div>
          )}

          <div className="py-5 border-b-2 border-black flex items-baseline gap-3">
            {precioAnt && (
              <span className="font-mono text-[1rem] text-[var(--muted)] line-through">{formatCOP(precioAnt)}</span>
            )}
            <span className="font-display text-[2.4rem] leading-none">{formatCOP(precio)}</span>
          </div>

          {/* ── Selector talla ── */}
          <div className="py-5 border-b-2 border-black">
            <div className="label-tiny mb-3">SELECCIONA TU TALLA</div>
            {tallas.length === 0 ? (
              <p className="font-mono text-[0.82rem] text-[var(--muted)]">Sin tallas disponibles</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tallas.map((t) => {
                  const agotada = t.stockTotal === 0;
                  const activa  = selectedTalla === t.numero;
                  return (
                    <button key={t.numero}
                      onClick={() => handleSelectTalla(t.numero)}
                      disabled={agotada}
                      className={`w-14 h-14 border-2 border-black font-display text-[0.95rem] transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                        activa
                          ? 'bg-black text-white shadow-[3px_3px_0_0_var(--accent)] -translate-x-[1px] -translate-y-[1px]'
                          : 'bg-white hover:bg-black hover:text-white'
                      }`}>
                      {t.numero}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Selector color (aparece al elegir talla) ── */}
          {selectedTalla && (
            <div className="py-5 border-b-2 border-black">
              <div className="label-tiny mb-3">SELECCIONA UN COLOR</div>
              {coloresDeTalla.length === 0 ? (
                <p className="font-mono text-[0.82rem] text-[var(--muted)]">Sin colores con stock para esta talla</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {coloresDeTalla.map((v) => {
                    const hex    = v.CodigoHex || '#cccccc';
                    const activo = selectedColor === v.Id_Color;
                    return (
                      <button
                        key={v.Id}
                        onClick={() => { setSelectedColor(v.Id_Color); setError(''); }}
                        title={v.NombreColor}
                        className={`w-9 h-9 rounded-full border-2 transition-all ${
                          activo
                            ? 'border-black scale-110 shadow-[0_0_0_3px_black]'
                            : 'border-black/30 hover:border-black hover:scale-105'
                        }`}
                        style={{ backgroundColor: hex }}
                      />
                    );
                  })}
                </div>
              )}

              {/* Info variación seleccionada */}
              {variacionExacta && (
                <div className={`font-mono text-[0.78rem] mt-3 flex items-center gap-2 ${
                  variacionExacta.Stock <= 5 ? 'text-[var(--accent)]' : 'text-green-600'
                }`}>
                  {variacionExacta.Stock === 0
                    ? 'AGOTADO'
                    : variacionExacta.Stock <= 5
                      ? `⚠ Solo quedan ${variacionExacta.Stock} unidades`
                      : `✓ ${variacionExacta.Stock} disponibles`}
                </div>
              )}
            </div>
          )}

          {/* Mensajes */}
          <div className="pt-4">
            {error && <div className="text-[var(--accent)] text-[0.85rem] mb-3 font-mono">{error}</div>}
            {added && (
              <div className="text-green-600 text-[0.85rem] mb-3 font-mono flex items-center gap-1">
                <Check size={14} /> AGREGADO AL CARRITO
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="grid gap-3 pb-6">
            <button onClick={() => handleAdd(true)} className="brutal-btn brutal-btn--accent w-full">
              COMPRAR AHORA
            </button>
            <button onClick={() => handleAdd(false)} className="brutal-btn brutal-btn--ghost w-full">
              AGREGAR AL CARRITO
            </button>
          </div>

          {descripcion && (
            <div className="border-2 border-black p-5 mb-4">
              <div className="label-tiny mb-2">DESCRIPCIÓN</div>
              <p className="text-[0.92rem] leading-relaxed text-[var(--ink-soft)]">{descripcion}</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            {[
              { Icon: Truck,       t: 'ENVÍO GRATIS', s: 'Compras +$200k' },
              { Icon: Repeat2,     t: '30 DÍAS',      s: 'Devoluciones' },
              { Icon: ShieldCheck, t: 'GARANTÍA',     s: 'Calidad garantizada' },
            ].map(({ Icon, t, s }) => (
              <div key={t} className="border-2 border-black p-3 flex gap-2 items-center">
                <Icon size={18} className="shrink-0" />
                <div>
                  <div className="font-display text-[0.7rem] tracking-[0.1em]">{t}</div>
                  <div className="text-[0.7rem] text-[var(--muted)]">{s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reseñas */}
      <OpinionesSection productoId={p.Id} usuario={user} />
    </div>
  );
}
