import React, { useState, useMemo, useEffect } from 'react';
import {
  Plus, Pencil, Trash2, Search,
  ChevronDown, ChevronUp, AlertTriangle, Check, X,
} from 'lucide-react';
import { useProducts } from '../../context/ProductsContext';
import { ProductoVariacionAPI, TallaAPI, ColorAPI } from '../../services/api';
import ProductForm from './ProductForm';

const formatCOP = (n) => typeof n === 'number' ? '$' + n.toLocaleString('es-CO') : '$0';

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 overflow-y-auto py-8 px-4">
      <div className="w-full max-w-2xl bg-white border-2 border-black">
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-black">
          <h2 className="font-display text-[1.1rem] uppercase tracking-tight">{title}</h2>
          <button onClick={onClose} className="w-9 h-9 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">
            <X size={15} />
          </button>
        </div>
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Editor de variaciones ────────────────────────────────────────────────────
function VariacionesEditor({ product, onClose }) {
  const { refresh }                   = useProducts();
  const [variaciones, setVariaciones] = useState(product.Variaciones || []);
  const [tallas,      setTallas]      = useState([]);
  const [colores,       setColores]       = useState([]);
  const [saving,        setSaving]        = useState(false);
  const [newVar,        setNewVar]        = useState({ id_talla: '', id_color: '', stock: 1 });
  const [error,         setError]         = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null); // variación pendiente de confirmar

  useEffect(() => {
    Promise.all([TallaAPI.todos(), ColorAPI.todos()])
      .then(([tals, cols]) => {
        setTallas(Array.isArray(tals) ? tals : []);
        setColores(Array.isArray(cols) ? cols : []);
      }).catch(() => {});
  }, []);

  const gId  = (o) => o.Id  ?? o.id;
  const gNom = (o) => o.Nombre ?? o.nombre ?? '';
  const gNum = (o) => o.Numero ?? o.numero ?? '';

  const setStock = (id, val) =>
    setVariaciones((prev) => prev.map((v) => v.Id === id ? { ...v, Stock: Number(val) } : v));

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      await Promise.all(variaciones.map((v) =>
        ProductoVariacionAPI.actualizar({
          Id: v.Id, Id_Producto: product.Id,
          Id_Talla: v.Id_Talla, Id_Color: v.Id_Color, Stock: v.Stock,
        })
      ));
      await refresh();
      onClose();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleAdd = async () => {
    if (!newVar.id_talla || !newVar.id_color) { setError('Selecciona talla y color'); return; }
    const ya = variaciones.find(
      (v) => String(v.Id_Talla) === String(newVar.id_talla) &&
             String(v.Id_Color) === String(newVar.id_color)
    );
    if (ya) { setError('Esa combinación ya existe'); return; }
    setError(''); setSaving(true);
    try {
      const created = await ProductoVariacionAPI.crear({
        Id_Producto: product.Id,
        Id_Talla:    Number(newVar.id_talla),
        Id_Color:    Number(newVar.id_color),
        Stock:       Number(newVar.stock) || 1,
      });
      const talla = tallas.find((t) => String(gId(t)) === String(newVar.id_talla));
      const color = colores.find((c) => String(gId(c)) === String(newVar.id_color));
      setVariaciones((prev) => [...prev, {
        Id: created.id ?? created.Id,
        Id_Talla: Number(newVar.id_talla), Id_Color: Number(newVar.id_color),
        Stock: Number(newVar.stock) || 1,
        NumeroTalla: gNum(talla), NombreColor: gNom(color),
      }]);
      setNewVar({ id_talla: '', id_color: '', stock: 1 });
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (v) => {
    if (confirmDelete?.Id !== v.Id) { setConfirmDelete(v); return; }
    setConfirmDelete(null);
    try {
      await ProductoVariacionAPI.eliminar(v.Id);
      setVariaciones((prev) => prev.filter((x) => x.Id !== v.Id));
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-4 pb-3 border-b-2 border-black">
        {product.Imagenes?.[0] && (
          <div className="w-14 h-14 border-2 border-black overflow-hidden bg-[#ececf1] shrink-0">
            <img src={product.Imagenes[0].Url_Imagen} alt={product.Nombre} className="w-full h-full object-cover" />
          </div>
        )}
        <div>
          <div className="font-display">{product.Nombre}</div>
          <div className="label-tiny">{product.NombreMarca}</div>
        </div>
      </div>

      <div className="border-2 border-black p-4 grid grid-cols-[1fr_1fr_80px_auto] gap-2 items-end bg-[#f4f4f4]">
        <div>
          <label className="label-tiny block mb-1">TALLA</label>
          <select className="brutal-input cursor-pointer !py-2" value={newVar.id_talla}
            onChange={(e) => setNewVar((f) => ({ ...f, id_talla: e.target.value }))}>
            <option value="">— Talla —</option>
            {tallas.map((t) => <option key={gId(t)} value={gId(t)}>{gNum(t)}</option>)}
          </select>
        </div>
        <div>
          <label className="label-tiny block mb-1">COLOR</label>
          <select className="brutal-input cursor-pointer !py-2" value={newVar.id_color}
            onChange={(e) => setNewVar((f) => ({ ...f, id_color: e.target.value }))}>
            <option value="">— Color —</option>
            {colores.map((c) => <option key={gId(c)} value={gId(c)}>{gNom(c)}</option>)}
          </select>
        </div>
        <div>
          <label className="label-tiny block mb-1">STOCK</label>
          <input className="brutal-input !py-2" type="number" min={0}
            value={newVar.stock} onChange={(e) => setNewVar((f) => ({ ...f, stock: e.target.value }))} />
        </div>
        <button type="button" onClick={handleAdd} disabled={saving}
          className="h-[42px] px-3 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors disabled:opacity-50">
          <Plus size={16} />
        </button>
      </div>

      {error && (
        <div className="border-2 border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] px-3 py-2 font-mono text-[0.78rem] flex items-center gap-2">
          <AlertTriangle size={13} /> {error}
        </div>
      )}

      {variaciones.length === 0 ? (
        <div className="text-center py-4 text-[var(--muted)] font-mono text-[0.82rem]">Sin variaciones — agrega la primera arriba</div>
      ) : (
        <div className="grid gap-2 max-h-72 overflow-y-auto">
          {variaciones.map((v) => (
            <div key={v.Id} className="flex items-center gap-3 border border-black/20 px-4 py-2">
              <div className="flex gap-2 flex-1">
                <span className="bg-black text-white font-mono text-[0.68rem] px-2 py-0.5">T{v.NumeroTalla}</span>
                <span className="border border-black font-mono text-[0.68rem] px-2 py-0.5">{v.NombreColor}</span>
              </div>
              <label className="label-tiny shrink-0">STOCK</label>
              <input type="number" min={0} className="brutal-input !py-1 !px-2 w-20 font-mono text-center"
                value={v.Stock} onChange={(e) => setStock(v.Id, e.target.value)} />
              <button onClick={() => handleDelete(v)}
                className={`shrink-0 font-mono text-[0.65rem] tracking-[0.08em] px-2 py-1 border-2 transition-colors ${
                  confirmDelete?.Id === v.Id
                    ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                    : 'border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white'
                }`}>
                {confirmDelete?.Id === v.Id ? '¿CONFIRMAR?' : '✕'}
              </button>
              {confirmDelete?.Id === v.Id && (
                <button onClick={() => setConfirmDelete(null)}
                  className="shrink-0 font-mono text-[0.65rem] px-2 py-1 border-2 border-black hover:bg-black hover:text-white transition-colors">
                  CANCELAR
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3 pt-2 border-t-2 border-black">
        <button onClick={handleSave} disabled={saving} className="brutal-btn brutal-btn--accent flex items-center gap-2">
          <Check size={14} /> {saving ? 'GUARDANDO...' : 'GUARDAR STOCK'}
        </button>
        <button onClick={onClose} className="brutal-btn brutal-btn--ghost">CERRAR</button>
      </div>
    </div>
  );
}
export default function AdminProducts() {
  const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts();

  const [search,    setSearch]  = useState('');
  const [catFilter, setCat]     = useState('');
  const [sortKey,   setSortKey] = useState('Nombre');
  const [sortDir,   setSortDir] = useState(1);
  const [modal,     setModal]   = useState(null);
  const [saving,      setSaving]     = useState(false);
  const [modalError,  setModalError] = useState('');

  const close = () => { setModal(null); setModalError(''); };

  const toggleSort = (k) => {
    if (sortKey === k) setSortDir((d) => d * -1);
    else { setSortKey(k); setSortDir(1); }
  };

  // Categorías únicas para el filtro
  const categorias = useMemo(() =>
    [...new Set(products.map((p) => p.NombreCategoria).filter(Boolean))]
  , [products]);

  const filtered = useMemo(() => {
    let arr = [...products];
    if (search) {
      const t = search.toLowerCase();
      arr = arr.filter((p) =>
        p.Nombre?.toLowerCase().includes(t) || p.NombreMarca?.toLowerCase().includes(t)
      );
    }
    if (catFilter) arr = arr.filter((p) => p.NombreCategoria === catFilter);
    arr.sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      return (av > bv ? 1 : av < bv ? -1 : 0) * sortDir;
    });
    return arr;
  }, [products, search, catFilter, sortKey, sortDir]);


  const handleCreate = async (data, variaciones = []) => {
    setSaving(true); setModalError('');
    try {
      const producto   = await addProduct(data);
      const productoId = producto?.Id ?? producto?.id;
      if (productoId && variaciones.length > 0) {
        await Promise.all(variaciones.map((v) =>
          ProductoVariacionAPI.crear({
            Id_Producto: productoId,
            Id_Talla:    v.id_talla,
            Id_Color:    v.id_color,
            Stock:       v.stock,
          })
        ));
      }
      close();
    }
    catch (err) { setModalError(err.message || 'Error al guardar'); }
    finally { setSaving(false); }
  };

  const handleUpdate = async (data, variacionesNuevas = []) => {
    setSaving(true); setModalError('');
    try {
      await updateProduct(modal.product.Id, data);
      if (variacionesNuevas.length > 0) {
        await Promise.all(variacionesNuevas.map((v) =>
          ProductoVariacionAPI.crear({
            Id_Producto: modal.product.Id,
            Id_Talla:    v.id_talla,
            Id_Color:    v.id_color,
            Stock:       v.stock,
          })
        ));
      }
      close();
    }
    catch (err) { setModalError(err.message || 'Error al guardar'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try { await deleteProduct(modal.product.Id); close(); }
    catch (err) { alert(err.message); }
    finally { setSaving(false); }
  };

  const SortBtn = ({ k, label }) => (
    <button onClick={() => toggleSort(k)} className="flex items-center gap-1 hover:text-[var(--accent)] transition-colors">
      {label}
      {sortKey === k && (sortDir === 1 ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="font-mono text-[0.85rem] tracking-[0.15em] text-[var(--muted)]">CARGANDO PRODUCTOS...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-[clamp(1.6rem,3vw,2rem)] uppercase leading-none">
          GESTIÓN DE PRODUCTOS
        </h1>
        <button onClick={() => setModal({ mode: 'create' })} className="brutal-btn brutal-btn--accent flex items-center gap-2">
          <Plus size={15} /> NUEVO PRODUCTO
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex items-center border-2 border-black flex-1">
          <Search size={15} className="ml-3 shrink-0 text-[var(--muted)]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o marca..."
            className="flex-1 px-3 py-2.5 font-mono text-[0.78rem] outline-none" />
        </div>
        <select value={catFilter} onChange={(e) => setCat(e.target.value)}
          className="brutal-input !py-2.5 font-mono text-[0.78rem] uppercase cursor-pointer">
          <option value="">TODAS LAS CATEGORÍAS</option>
          {categorias.map((c) => <option key={c} value={c}>{c.toUpperCase()}</option>)}
        </select>
      </div>

      {/* Tabla */}
      <div className="border-2 border-black overflow-x-auto">
        <table className="w-full min-w-[760px] text-[0.85rem]">
          <thead className="bg-black text-white">
            <tr>
              <th className="text-left px-4 py-3 font-mono text-[0.68rem] tracking-[0.1em] w-16">IMG</th>
              <th className="text-left px-4 py-3 font-mono text-[0.68rem] tracking-[0.1em]"><SortBtn k="Nombre" label="NOMBRE" /></th>
              <th className="text-left px-4 py-3 font-mono text-[0.68rem] tracking-[0.1em]"><SortBtn k="Precio" label="PRECIO" /></th>
              <th className="text-left px-4 py-3 font-mono text-[0.68rem] tracking-[0.1em]">STOCK</th>
              <th className="text-left px-4 py-3 font-mono text-[0.68rem] tracking-[0.1em]">VARIACIONES</th>
              <th className="text-left px-4 py-3 font-mono text-[0.68rem] tracking-[0.1em]">CATEGORÍA</th>
              <th className="text-left px-4 py-3 font-mono text-[0.68rem] tracking-[0.1em]">TAGS</th>
              <th className="text-left px-4 py-3 font-mono text-[0.68rem] tracking-[0.1em]">ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-[var(--muted)] font-mono text-[0.78rem]">
                  SIN RESULTADOS
                </td>
              </tr>
            )}
            {filtered.map((p, i) => {
              const imgPrincipal = p.Imagenes?.find((im) => im.Principal)?.Url_Imagen
                || p.Imagenes?.[0]?.Url_Imagen || '';
              const stockTotal = (p.Variaciones || []).reduce((s, v) => s + v.Stock, 0);
              const tags = p.Tags ? p.Tags.split(',').map((t) => t.trim()) : [];

              return (
                <tr key={p.Id} className={`border-t border-black/10 ${i % 2 === 0 ? 'bg-white' : 'bg-[#f4f4f4]'}`}>
                  {/* Imagen */}
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 border-2 border-black overflow-hidden bg-[#ececf1]">
                      {imgPrincipal && <img src={imgPrincipal} alt={p.Nombre} className="w-full h-full object-cover" />}
                    </div>
                  </td>

                  {/* Nombre */}
                  <td className="px-4 py-3">
                    <div className="font-display text-[0.85rem]">{p.Nombre}</div>
                    <div className="label-tiny mt-0.5">{p.NombreMarca}</div>
                  </td>

                  {/* Precio */}
                  <td className="px-4 py-3 font-mono">
                    <div>{formatCOP(p.Precio)}</div>
                    {p.PrecioAnterior && (
                      <div className="text-[0.72rem] text-[var(--muted)] line-through">{formatCOP(p.PrecioAnterior)}</div>
                    )}
                  </td>

                  {/* Stock total */}
                  <td className="px-4 py-3">
                    <span className={`font-mono font-bold text-[0.88rem] ${stockTotal <= 5 ? 'text-[var(--accent)]' : 'text-[var(--ok)]'}`}>
                      {stockTotal}
                    </span>
                  </td>

                  {/* Variaciones — clic para editar */}
                  <td className="px-4 py-3">
                    <button onClick={() => setModal({ mode: 'variaciones', product: p })}
                      className="flex flex-wrap gap-1 hover:opacity-70 transition-opacity"
                      title="Clic para editar variaciones">
                      {(p.Variaciones || []).slice(0, 3).map((v) => (
                        <span key={v.Id} className="bg-black text-white font-mono text-[0.58rem] px-1.5 py-0.5">
                          T{v.NumeroTalla}
                        </span>
                      ))}
                      {(p.Variaciones?.length || 0) > 3 && (
                        <span className="font-mono text-[0.65rem] text-[var(--muted)]">+{p.Variaciones.length - 3}</span>
                      )}
                    </button>
                  </td>

                  {/* Categoría */}
                  <td className="px-4 py-3">
                    <span className="font-mono text-[0.6rem] px-2 py-0.5 border border-black uppercase">
                      {p.NombreCategoria}
                    </span>
                  </td>

                  {/* Tags */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {tags.map((t) => (
                        <span key={t} className={`font-mono text-[0.6rem] px-2 py-0.5 text-white ${
                          t === 'sale' ? 'bg-[var(--accent)]' : t === 'new' ? 'bg-[var(--ok)]' : 'bg-black'
                        }`}>{t}</span>
                      ))}
                    </div>
                  </td>

                  {/* Acciones */}
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setModal({ mode: 'edit', product: p })}
                        title="Editar"
                        className="w-8 h-8 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => setModal({ mode: 'delete', product: p })}
                        title="Eliminar"
                        className="w-8 h-8 border-2 border-[var(--accent)] text-[var(--accent)] flex items-center justify-center hover:bg-[var(--accent)] hover:text-white transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-3 label-tiny text-right">{filtered.length} DE {products.length} PRODUCTOS</div>

      {/* ── Modales ── */}
      {modal?.mode === 'create' && (
        <Modal title="NUEVO PRODUCTO" onClose={close}>
          {modalError && (
            <div className="border-2 border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] px-4 py-3 font-mono text-[0.82rem] flex items-center gap-2 mb-4">
              <AlertTriangle size={14} /> {modalError}
            </div>
          )}
          <ProductForm onSave={handleCreate} onCancel={close} />
        </Modal>
      )}

      {modal?.mode === 'edit' && (
        <Modal title={`EDITAR — ${modal.product.Nombre}`} onClose={close}>
          {modalError && (
            <div className="border-2 border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] px-4 py-3 font-mono text-[0.82rem] flex items-center gap-2 mb-4">
              <AlertTriangle size={14} /> {modalError}
            </div>
          )}
          <ProductForm
            initial={{
              Nombre:         modal.product.Nombre,
              Id_Modelo:      modal.product.Id_Modelo,
              Id_Marca:       modal.product.Id_Marca,
              Id_Categoria:   modal.product.Id_Categoria,
              Descripcion:    modal.product.Descripcion,
              Costo:          modal.product.Costo,
              Precio:         modal.product.Precio,
              PrecioAnterior: modal.product.PrecioAnterior,
              Tags:           modal.product.Tags,
              Estado:         modal.product.Estado,
            }}
            variacionesIniciales={modal.product.Variaciones || []}
            onSave={handleUpdate}
            onCancel={close}
          />
        </Modal>
      )}

      {modal?.mode === 'variaciones' && (
        <Modal title={`VARIACIONES — ${modal.product.Nombre}`} onClose={close}>
          <VariacionesEditor product={modal.product} onClose={close} />
        </Modal>
      )}

      {modal?.mode === 'delete' && (
        <Modal title="CONFIRMAR ELIMINACIÓN" onClose={close}>
          <div className="grid gap-5">
            <div className="border-2 border-[var(--accent)] bg-[var(--accent)]/10 p-4 flex gap-3 items-start">
              <AlertTriangle size={18} className="text-[var(--accent)] shrink-0 mt-0.5" />
              <p className="text-[0.92rem]">
                ¿Eliminar <strong>{modal.product.Nombre}</strong>? Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleDelete} disabled={saving}
                className="brutal-btn brutal-btn--accent flex items-center gap-2">
                <Trash2 size={14} /> {saving ? 'ELIMINANDO...' : 'ELIMINAR'}
              </button>
              <button onClick={close} className="brutal-btn brutal-btn--ghost">CANCELAR</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
