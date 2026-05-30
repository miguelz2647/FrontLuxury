import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, Tag, Layers, BarChart2, Users } from 'lucide-react';
import { UsuarioAPI, OrdenAPI } from '../../services/api';

// Importar todas las imágenes de graficos dinámicamente
const graficosModules = import.meta.glob('../../assets/graficos/*.{png,jpg,jpeg,webp,svg}', { eager: true });
const GRAFICOS = Object.values(graficosModules).map((m) => m.default);

const formatCOP = (n) => typeof n === 'number' ? '$' + n.toLocaleString('es-CO') : '$0';


// ── Sección órdenes ───────────────────────────────────────────────────────────
const ESTADOS = ['pendiente','procesando','enviado','entregado','cancelado'];
const ESTADO_COLOR = {
  pendiente:  'bg-yellow-100 text-yellow-800 border-yellow-300',
  procesando: 'bg-blue-100 text-blue-800 border-blue-300',
  enviado:    'bg-purple-100 text-purple-800 border-purple-300',
  entregado:  'bg-green-100 text-green-800 border-green-300',
  cancelado:  'bg-red-100 text-red-800 border-red-300',
};

function SeccionOrdenes() {
  const [ordenes,  setOrdenes]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(null); // id de orden en proceso

  useEffect(() => {
    OrdenAPI.todos()
      .then((data) => setOrdenes(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleEstado = async (orden, nuevoEstado) => {
    const id = orden.id ?? orden.Id;
    setSaving(id);
    try {
      await OrdenAPI.cambiarEstado(id, nuevoEstado);
      setOrdenes((prev) => prev.map((o) => {
        const oid = o.id ?? o.Id;
        return oid === id ? { ...o, estado: nuevoEstado, Estado: nuevoEstado } : o;
      }));
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-10">
      <span className="font-mono text-[0.85rem] tracking-[0.15em] text-[var(--muted)]">CARGANDO...</span>
    </div>
  );

  return (
    <div className="grid gap-3">
      {ordenes.length === 0 && (
        <div className="border-2 border-dashed border-black p-10 text-center">
          <div className="font-display uppercase">Sin órdenes aún</div>
        </div>
      )}
      {ordenes.map((o, i) => {
        const id          = o.id          ?? o.Id;
        const usuario     = o.nombreUsuario ?? o.NombreUsuario ?? '—';
        const estado      = (o.estado      ?? o.Estado      ?? 'pendiente').toLowerCase();
        const valorNeto   = o.valor_Neto   ?? o.Valor_Neto  ?? o.valorNeto ?? 0;
        const fecha       = o.fecha        ?? o.Fecha;
        const detalles    = o.detalles     ?? o.Detalles    ?? [];
        const fechaFmt    = fecha
          ? new Date(fecha).toLocaleDateString('es-CO', { day:'2-digit', month:'short', year:'numeric' })
          : '—';
        const isSaving    = saving === id;
        const estilo      = ESTADO_COLOR[estado] || 'bg-gray-100 text-gray-800 border-gray-300';

        return (
          <div key={id} className={`border-2 border-black ${i % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'}`}>
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div className="flex items-center gap-4">
                <div>
                  <div className="font-display text-[0.85rem]">ORDEN #{id}</div>
                  <div className="font-mono text-[0.72rem] text-[var(--muted)]">{usuario} · {fechaFmt}</div>
                </div>
                <span className={`font-mono text-[0.65rem] tracking-[0.1em] uppercase px-2 py-0.5 border ${estilo}`}>
                  {estado}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-display text-[0.95rem]">
                  {'$' + (valorNeto ?? 0).toLocaleString('es-CO')}
                </span>
                <select
                  disabled={isSaving}
                  value={estado}
                  onChange={(e) => handleEstado(o, e.target.value)}
                  className="brutal-input !py-1.5 !px-2 font-mono text-[0.68rem] uppercase tracking-[0.08em] cursor-pointer disabled:opacity-50"
                >
                  {ESTADOS.map((s) => (
                    <option key={s} value={s}>{s.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Detalles colapsados */}
            {detalles.length > 0 && (
              <div className="border-t border-black/10 px-5 py-3 grid gap-1">
                {detalles.map((d, di) => {
                  const nombre   = d.nombreProducto ?? d.NombreProducto ?? '—';
                  const cantidad = d.cantidad        ?? d.Cantidad       ?? 0;
                  const subtotal = d.subtotal        ?? d.Subtotal       ?? 0;
                  return (
                    <div key={di} className="flex justify-between font-mono text-[0.75rem] text-[var(--muted)]">
                      <span>{nombre} × {cantidad}</span>
                      <span>{'$' + subtotal.toLocaleString('es-CO')}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Sección gráficas ──────────────────────────────────────────────────────────
function SeccionGraficas() {
  if (GRAFICOS.length === 0) return (
    <div className="border-2 border-dashed border-black p-10 text-center">
      <BarChart2 size={28} className="mx-auto mb-3 opacity-40" />
      <div className="font-display uppercase">Sin gráficas disponibles</div>
      <p className="text-[var(--muted)] text-[0.9rem] mt-1">Agrega imágenes en src/assets/graficos/</p>
    </div>
  );
  return (
    <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))' }}>
      {GRAFICOS.map((src, i) => (
        <div key={i} className="border-2 border-black bg-white overflow-hidden">
          <img src={src} alt={`Gráfica ${i + 1}`} className="w-full object-contain" style={{ maxHeight: 300 }} />
        </div>
      ))}
    </div>
  );
}

// ── Sección usuarios ──────────────────────────────────────────────────────────
function SeccionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    UsuarioAPI.todos()
      .then((data) => setUsuarios(Array.isArray(data) ? data : []))
      .catch(() => setUsuarios([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-10">
      <span className="font-mono text-[0.85rem] tracking-[0.15em] text-[var(--muted)]">CARGANDO...</span>
    </div>
  );

  const total   = usuarios.length;
  const activos = usuarios.filter((u) => u.activo ?? u.Activo).length;
  const admins  = usuarios.filter((u) => (u.rol ?? u.Rol ?? '').toLowerCase() === 'admin').length;
  const clients = total - admins;

  const statsUser = [
    { label: 'TOTAL',    value: total,   color: 'bg-black text-white' },
    { label: 'ACTIVOS',  value: activos, color: 'bg-black text-white' },
    { label: 'ADMINS',   value: admins,  color: 'bg-[var(--accent)] text-white' },
    { label: 'CLIENTES', value: clients, color: 'bg-black text-white' },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsUser.map(({ label, value, color }) => (
          <div key={label} className={`border-2 border-black p-5 ${color}`}>
            <div className="font-display text-[2.2rem] leading-none">{value}</div>
            <div className="font-mono text-[0.65rem] tracking-[0.15em] mt-1 opacity-70">{label}</div>
          </div>
        ))}
      </div>

      <div className="border-2 border-black overflow-x-auto">
        <table className="w-full text-[0.88rem]">
          <thead className="bg-black text-white">
            <tr>
              <th className="text-left px-4 py-3 font-mono text-[0.7rem] tracking-[0.1em]">NOMBRE</th>
              <th className="text-left px-4 py-3 font-mono text-[0.7rem] tracking-[0.1em]">EMAIL</th>
              <th className="text-left px-4 py-3 font-mono text-[0.7rem] tracking-[0.1em]">TELÉFONO</th>
              <th className="text-left px-4 py-3 font-mono text-[0.7rem] tracking-[0.1em]">ROL</th>
              <th className="text-left px-4 py-3 font-mono text-[0.7rem] tracking-[0.1em]">ESTADO</th>
              <th className="text-left px-4 py-3 font-mono text-[0.7rem] tracking-[0.1em]">REGISTRO</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u, i) => {
              // La API puede devolver camelCase o PascalCase dependiendo del endpoint
              const nombres   = u.Nombres   ?? u.nombres   ?? '';
              const apellidos = u.Apellidos ?? u.apellidos ?? '';
              const email     = u.Email     ?? u.email     ?? '—';
              const telefono  = u.Telefono  ?? u.telefono  ?? '—';
              const rol       = (u.Rol      ?? u.rol       ?? 'user').toLowerCase();
              const activo    = u.Activo    ?? u.activo    ?? true;
              const fecha     = (u.FechaRegistro ?? u.fechaRegistro ?? u.fecha_Registro)
                ? new Date(u.FechaRegistro ?? u.fechaRegistro ?? u.fecha_Registro).toLocaleDateString('es-CO', {
                    day: '2-digit', month: 'short', year: 'numeric'
                  })
                : '—';

              return (
                <tr key={u.Id ?? u.id ?? i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f4f4f4]'}>
                  <td className="px-4 py-3 font-display text-[0.85rem]">
                    {`${nombres} ${apellidos}`.trim() || '—'}
                  </td>
                  <td className="px-4 py-3 font-mono text-[0.78rem] text-[var(--muted)]">{email}</td>
                  <td className="px-4 py-3 font-mono text-[0.78rem] text-[var(--muted)]">{telefono}</td>
                  <td className="px-4 py-3">
                    <span className={`font-mono text-[0.65rem] px-2 py-0.5 tracking-[0.1em] border ${
                      rol === 'admin'
                        ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                        : 'bg-black text-white border-black'
                    }`}>
                      {rol.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[0.72rem]">
                    <span className={activo ? 'text-[var(--ok)]' : 'text-[var(--accent)]'}>
                      {activo ? '● ACTIVO' : '○ INACTIVO'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[0.78rem] text-[var(--muted)]">{fecha}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Dashboard principal ───────────────────────────────────────────────────────
export default function AdminDashboard({ products, loading, section = 'dashboard' }) {
  if (section === 'ordenes')  return <SeccionOrdenes />;
  if (section === 'usuarios') return <SeccionUsuarios />;
  if (section === 'graficas') return <SeccionGraficas />;

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="font-mono text-[0.85rem] tracking-[0.15em] text-[var(--muted)]">CARGANDO...</div>
    </div>
  );

  const parseTags  = (p) => p.Tags?.split(',').map((t) => t.trim()) || [];
  const total      = products.length;
  const totalStock = products.reduce((a, p) => a + (p.Variaciones?.reduce((s, v) => s + v.Stock, 0) || 0), 0);
  const onSale     = products.filter((p) => parseTags(p).includes('sale')).length;
  const lowStock   = products.filter((p) => (p.Variaciones || []).some((v) => v.Stock <= 5)).length;
  const cats       = [...new Set(products.map((p) => p.NombreCategoria).filter(Boolean))].length;

  const stats = [
    { label: 'PRODUCTOS',   value: total,      Icon: Package,       color: 'bg-black text-white' },
    { label: 'STOCK TOTAL', value: totalStock,  Icon: Layers,       color: 'bg-black text-white' },
    { label: 'EN OFERTA',   value: onSale,      Icon: Tag,          color: 'bg-[var(--accent)] text-white' },
    { label: 'STOCK BAJO',  value: lowStock,    Icon: AlertTriangle, color: lowStock > 0 ? 'bg-[var(--accent)] text-white' : 'bg-black text-white' },
    { label: 'CATEGORÍAS',  value: cats,        Icon: BarChart2,    color: 'bg-black text-white' },
  ];

  const lowStockProducts = products.filter((p) => (p.Variaciones || []).some((v) => v.Stock <= 5));

  return (
    <div>
      <h1 className="font-display text-[clamp(1.8rem,3vw,2.5rem)] uppercase leading-none mb-8">
        PANEL <span className="text-[var(--accent)]">ADMIN</span>
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {stats.map(({ label, value, Icon, color }) => (
          <div key={label} className={`border-2 border-black p-5 ${color}`}>
            <Icon size={20} className="mb-3 opacity-80" />
            <div className="font-display text-[2rem] leading-none">{value}</div>
            <div className="font-mono text-[0.65rem] tracking-[0.15em] mt-1 opacity-70">{label}</div>
          </div>
        ))}
      </div>

      {lowStockProducts.length > 0 && (
        <div className="border-2 border-[var(--accent)] p-5 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-[var(--accent)]" />
            <span className="font-display uppercase text-[0.9rem] text-[var(--accent)]">
              Variaciones con stock bajo (≤ 5)
            </span>
          </div>
          <div className="grid gap-2">
            {lowStockProducts.map((p) => (
              <div key={p.Id} className="flex items-center justify-between border border-[var(--accent)]/30 px-4 py-2">
                <div className="font-display text-[0.88rem]">{p.Nombre}</div>
                <div className="flex gap-2 flex-wrap justify-end">
                  {(p.Variaciones || []).filter((v) => v.Stock <= 5).map((v) => (
                    <span key={v.Id} className="font-mono text-[0.72rem] text-[var(--accent)] border border-[var(--accent)]/50 px-2 py-0.5">
                      T{v.NumeroTalla} {v.NombreColor} — {v.Stock}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="section-title mb-4">Últimos productos</h2>
      <div className="border-2 border-black overflow-hidden">
        <table className="w-full text-[0.88rem]">
          <thead className="bg-black text-white">
            <tr>
              <th className="text-left px-4 py-3 font-mono text-[0.7rem] tracking-[0.1em]">PRODUCTO</th>
              <th className="text-left px-4 py-3 font-mono text-[0.7rem] tracking-[0.1em]">PRECIO</th>
              <th className="text-left px-4 py-3 font-mono text-[0.7rem] tracking-[0.1em]">STOCK TOTAL</th>
              <th className="text-left px-4 py-3 font-mono text-[0.7rem] tracking-[0.1em]">CATEGORÍA</th>
            </tr>
          </thead>
          <tbody>
            {products.slice(0, 6).map((p, i) => {
              const stockTotal = (p.Variaciones || []).reduce((s, v) => s + v.Stock, 0);
              return (
                <tr key={p.Id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f4f4f4]'}>
                  <td className="px-4 py-3">
                    <div className="font-display text-[0.85rem]">{p.Nombre}</div>
                    <div className="label-tiny mt-0.5">{p.NombreMarca}</div>
                  </td>
                  <td className="px-4 py-3 font-mono">{formatCOP(p.Precio)}</td>
                  <td className={`px-4 py-3 font-mono font-bold ${stockTotal <= 5 ? 'text-[var(--accent)]' : 'text-[var(--ok)]'}`}>
                    {stockTotal}
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-black text-white font-mono text-[0.6rem] px-2 py-0.5 tracking-[0.1em]">
                      {p.NombreCategoria}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
