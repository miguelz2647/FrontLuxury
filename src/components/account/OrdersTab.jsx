import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import { OrdenAPI } from '../../services/api';

const formatCOP = (n) => typeof n === 'number' ? '$' + n.toLocaleString('es-CO') : '$0';

// camelCase helpers — la API serializa en camelCase (System.Text.Json default)
// OrdenResponseDto: id, fecha, estado, valor_Neto, detalles, estadoEnvio
// OrdenDetalleResponseDto: id, nombreProducto, imagenProducto, cantidad, subtotal, nombreTalla, nombreColor
const gStr = (o, ...keys) => { for (const k of keys) if (o[k] != null) return o[k]; return ''; };
const gNum = (o, ...keys) => { for (const k of keys) if (o[k] != null) return o[k]; return 0; };

const ESTADO_STYLE = {
  pendiente:  'bg-yellow-100 text-yellow-800 border-yellow-300',
  procesando: 'bg-blue-100 text-blue-800 border-blue-300',
  enviado:    'bg-purple-100 text-purple-800 border-purple-300',
  entregado:  'bg-green-100 text-green-800 border-green-300',
  cancelado:  'bg-red-100 text-red-800 border-red-300',
};

function OrdenCard({ orden }) {
  const [open, setOpen] = useState(false);

  const id        = gNum(orden, 'id', 'Id');
  const estado    = gStr(orden, 'estado', 'Estado').toLowerCase();
  const fecha     = gStr(orden, 'fecha', 'Fecha');
  const valorNeto = gNum(orden, 'valor_Neto', 'Valor_Neto', 'valorNeto');
  const detalles  = orden.detalles ?? orden.Detalles ?? [];
  const estEnvio  = gStr(orden, 'estadoEnvio', 'EstadoEnvio');
  const estilo    = ESTADO_STYLE[estado] || 'bg-gray-100 text-gray-800 border-gray-300';

  const fechaFmt = fecha
    ? new Date(fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  return (
    <div className="border-2 border-black">
      <button onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#f4f4f4] transition-colors">
        <div className="flex items-center gap-4 text-left">
          <div>
            <div className="font-display text-[0.85rem]">ORDEN #{id}</div>
            <div className="font-mono text-[0.72rem] text-[var(--muted)] mt-0.5">{fechaFmt}</div>
          </div>
          <span className={`font-mono text-[0.65rem] tracking-[0.1em] uppercase px-2 py-1 border ${estilo}`}>
            {estado || 'pendiente'}
          </span>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span className="font-display text-[0.95rem]">{formatCOP(valorNeto)}</span>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {open && (
        <div className="border-t-2 border-black px-5 py-4 bg-[#f9f9f9]">
          <div className="grid gap-3">
            {detalles.map((d) => {
              const dId      = gNum(d, 'id', 'Id');
              const nombre   = gStr(d, 'nombreProducto', 'NombreProducto');
              const imagen   = gStr(d, 'imagenProducto', 'ImagenProducto');
              const cantidad = gNum(d, 'cantidad', 'Cantidad');
              const subtotal = gNum(d, 'subtotal', 'Subtotal');
              const talla    = gStr(d, 'nombreTalla', 'NombreTalla');
              const color    = gStr(d, 'nombreColor', 'NombreColor');
              return (
                <div key={dId} className="flex gap-3 items-center">
                  {imagen && (
                    <div className="w-12 h-12 border border-black overflow-hidden bg-[#ececf1] shrink-0">
                      <img src={imagen} alt={nombre} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-[0.82rem] truncate">{nombre}</div>
                    <div className="font-mono text-[0.7rem] text-[var(--muted)]">
                      {talla && `Talla ${talla}`}
                      {color && ` · ${color}`}
                      {` · x${cantidad}`}
                    </div>
                  </div>
                  <div className="font-mono text-[0.82rem] shrink-0">{formatCOP(subtotal)}</div>
                </div>
              );
            })}
          </div>
          {estEnvio && (
            <div className="mt-3 pt-3 border-t border-black/10 font-mono text-[0.75rem] text-[var(--muted)]">
              Envío: {estEnvio}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function OrdersTab({ userId }) {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    OrdenAPI.porUsuario(userId)
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return (
    <div className="py-12 text-center font-mono text-[0.85rem] tracking-[0.15em] text-[var(--muted)]">
      CARGANDO PEDIDOS...
    </div>
  );

  return (
    <div>
      <h2 className="font-display text-[1.1rem] uppercase tracking-[0.05em] mb-6 pb-3 border-b-2 border-black">
        Mis pedidos
      </h2>
      {orders.length === 0 ? (
        <div className="border-2 border-dashed border-black p-10 text-center">
          <Package size={28} className="mx-auto mb-3 opacity-40" />
          <div className="font-display uppercase">Aún no tienes pedidos</div>
          <p className="text-[var(--muted)] text-[0.9rem] mt-1">Cuando compres algo aparecerá aquí.</p>
          <Link to="/" className="brutal-btn brutal-btn--accent mt-5 inline-flex">EXPLORAR CATÁLOGO</Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {orders.map((o) => <OrdenCard key={o.id ?? o.Id} orden={o} />)}
        </div>
      )}
    </div>
  );
}
