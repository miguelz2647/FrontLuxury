/**
 * AdminCatalogos
 * CRUD completo para: Categorías, Marcas, Modelos, Tallas, Colores.
 * DTOs exactos según la API:
 *   Crear:      { Nombre }  (Talla: { Numero }, Color: { Nombre, CodigoHex })
 *   Actualizar: { Id, Nombre } (Talla: { Id, Numero }, Color: { Id, Nombre, CodigoHex })
 *   Eliminar:   { Id }  → DELETE
 * Respuesta: camelCase { id, nombre } / { id, numero } / { id, nombre, codigoHex }
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Check, X, AlertTriangle } from 'lucide-react';
import {
  CategoriaAPI, MarcaAPI, ModeloAPI, TallaAPI, ColorAPI,
} from '../../services/api';

// ─── Helpers para manejar camelCase o PascalCase de la API ───────────────────
const gId     = (o) => o.Id     ?? o.id     ?? 0;
const gNombre = (o) => o.Nombre ?? o.nombre ?? '';
const gNumero = (o) => o.Numero ?? o.numero ?? '';
const gHex    = (o) => o.CodigoHex ?? o.codigoHex ?? '';

// ─── Configuración de cada catálogo ──────────────────────────────────────────
const CATALOGOS = [
  {
    key:    'categorias',
    label:  'Categorías',
    api:    CategoriaAPI,
    fields: [{ key: 'Nombre', label: 'NOMBRE', placeholder: 'Ej: Hombre' }],
    toDto:  (f) => ({ Nombre: f.Nombre }),
    toUpd:  (id, f) => ({ Id: id, Nombre: f.Nombre }),
    toRow:  (o) => ({ id: gId(o), Nombre: gNombre(o) }),
    display:(o) => o.Nombre,
  },
  {
    key:    'marcas',
    label:  'Marcas',
    api:    MarcaAPI,
    fields: [{ key: 'Nombre', label: 'NOMBRE', placeholder: 'Ej: Nike' }],
    toDto:  (f) => ({ Nombre: f.Nombre }),
    toUpd:  (id, f) => ({ Id: id, Nombre: f.Nombre }),
    toRow:  (o) => ({ id: gId(o), Nombre: gNombre(o) }),
    display:(o) => o.Nombre,
  },
  {
    key:    'modelos',
    label:  'Modelos',
    api:    ModeloAPI,
    fields: [{ key: 'Nombre', label: 'NOMBRE', placeholder: 'Ej: Air Force' }],
    toDto:  (f) => ({ Nombre: f.Nombre }),
    toUpd:  (id, f) => ({ Id: id, Nombre: f.Nombre }),
    toRow:  (o) => ({ id: gId(o), Nombre: gNombre(o) }),
    display:(o) => o.Nombre,
  },
  {
    key:    'tallas',
    label:  'Tallas',
    api:    TallaAPI,
    fields: [{ key: 'Numero', label: 'NÚMERO DE TALLA', placeholder: 'Ej: 42' }],
    toDto:  (f) => ({ Numero: f.Numero }),
    toUpd:  (id, f) => ({ Id: id, Numero: f.Numero }),
    toRow:  (o) => ({ id: gId(o), Numero: gNumero(o) }),
    display:(o) => o.Numero,
  },
  {
    key:    'colores',
    label:  'Colores',
    api:    ColorAPI,
    fields: [
      { key: 'Nombre',    label: 'NOMBRE',    placeholder: 'Ej: Rojo' },
      { key: 'CodigoHex', label: 'HEX',       placeholder: '#FF0000', optional: true },
    ],
    toDto:  (f) => ({ Nombre: f.Nombre, CodigoHex: f.CodigoHex || null }),
    toUpd:  (id, f) => ({ Id: id, Nombre: f.Nombre, CodigoHex: f.CodigoHex || null }),
    toRow:  (o) => ({ id: gId(o), Nombre: gNombre(o), CodigoHex: gHex(o) }),
    display:(o) => o.Nombre,
  },
];

// ─── Tabla de un catálogo ────────────────────────────────────────────────────
function CatalogoTab({ config }) {
  const [items,      setItems]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [editingId,  setEditingId]  = useState(null);   // id del item en edición
  const [editForm,   setEditForm]   = useState({});
  const [newForm,    setNewForm]    = useState({});
  const [showNew,    setShowNew]    = useState(false);
  const [saving,     setSaving]     = useState(false);

  const emptyForm = useCallback(() =>
    config.fields.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {}), [config]);

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    config.api.todos()
      .then((data) => setItems((Array.isArray(data) ? data : []).map(config.toRow)))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [config]);

  useEffect(() => { load(); }, [load]);

  // ── Crear ──────────────────────────────────────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault();
    const required = config.fields.filter((f) => !f.optional);
    for (const f of required) {
      if (!newForm[f.key]?.trim()) { setError(`El campo ${f.label} es obligatorio`); return; }
    }
    setSaving(true); setError('');
    try {
      await config.api.crear(config.toDto(newForm));
      setNewForm(emptyForm());
      setShowNew(false);
      load();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  // ── Editar ─────────────────────────────────────────────────────────────────
  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({ ...item });
    setError('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const required = config.fields.filter((f) => !f.optional);
    for (const f of required) {
      if (!editForm[f.key]?.trim()) { setError(`El campo ${f.label} es obligatorio`); return; }
    }
    setSaving(true); setError('');
    try {
      await config.api.actualizar(config.toUpd(editingId, editForm));
      setEditingId(null);
      load();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  // ── Eliminar ───────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este registro?')) return;
    setError('');
    try {
      await config.api.eliminar(id);
      load();
    } catch (e) { setError(e.message); }
  };

  return (
    <div>
      {/* Error */}
      {error && (
        <div className="border-2 border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] px-4 py-3 font-mono text-[0.82rem] flex items-center gap-2 mb-4">
          <AlertTriangle size={14} /> {error}
        </div>
      )}

      {/* Botón nuevo */}
      <div className="flex justify-end mb-4">
        <button onClick={() => { setShowNew(true); setNewForm(emptyForm()); setError(''); }}
          className="brutal-btn brutal-btn--accent flex items-center gap-2">
          <Plus size={15} /> NUEVO
        </button>
      </div>

      {/* Form nuevo */}
      {showNew && (
        <form onSubmit={handleCreate}
          className="border-2 border-black p-4 mb-4 grid gap-3 bg-[#f4f4f4]">
          <div className={`grid gap-3 ${config.fields.length > 1 ? 'md:grid-cols-2' : ''}`}>
            {config.fields.map((f) => (
              <div key={f.key}>
                <label className="label-tiny block mb-1">{f.label}{!f.optional && ' *'}</label>
                <input className="brutal-input"
                  value={newForm[f.key] || ''}
                  onChange={(e) => setNewForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder} />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={saving}
              className="brutal-btn brutal-btn--accent flex items-center gap-2 text-[0.78rem]">
              <Check size={13} /> {saving ? 'GUARDANDO...' : 'GUARDAR'}
            </button>
            <button type="button" onClick={() => setShowNew(false)}
              className="brutal-btn brutal-btn--ghost flex items-center gap-2 text-[0.78rem]">
              <X size={13} /> CANCELAR
            </button>
          </div>
        </form>
      )}

      {/* Tabla */}
      {loading ? (
        <div className="py-10 text-center font-mono text-[0.85rem] text-[var(--muted)] tracking-[0.15em]">
          CARGANDO...
        </div>
      ) : items.length === 0 ? (
        <div className="border-2 border-dashed border-black p-8 text-center">
          <div className="font-display uppercase text-[0.9rem]">Sin registros</div>
          <p className="text-[var(--muted)] text-[0.82rem] mt-1">Crea el primero con el botón NUEVO</p>
        </div>
      ) : (
        <div className="border-2 border-black overflow-hidden">
          <table className="w-full text-[0.88rem]">
            <thead className="bg-black text-white">
              <tr>
                <th className="text-left px-4 py-3 font-mono text-[0.7rem] tracking-[0.1em]">ID</th>
                {config.fields.map((f) => (
                  <th key={f.key} className="text-left px-4 py-3 font-mono text-[0.7rem] tracking-[0.1em]">
                    {f.label}
                  </th>
                ))}
                <th className="px-4 py-3 font-mono text-[0.7rem] tracking-[0.1em] text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f4f4f4]'}>
                  {editingId === item.id ? (
                    /* Fila en edición */
                    <>
                      <td className="px-4 py-2 font-mono text-[0.78rem] text-[var(--muted)]">{item.id}</td>
                      {config.fields.map((f) => (
                        <td key={f.key} className="px-2 py-2">
                          <input className="brutal-input !py-1.5 text-[0.82rem]"
                            value={editForm[f.key] || ''}
                            onChange={(e) => setEditForm((p) => ({ ...p, [f.key]: e.target.value }))}
                            placeholder={f.placeholder} />
                        </td>
                      ))}
                      <td className="px-4 py-2">
                        <div className="flex gap-2 justify-end">
                          <button onClick={handleUpdate} disabled={saving}
                            className="w-8 h-8 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                            <Check size={13} />
                          </button>
                          <button onClick={() => setEditingId(null)}
                            className="w-8 h-8 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                            <X size={13} />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    /* Fila normal */
                    <>
                      <td className="px-4 py-3 font-mono text-[0.78rem] text-[var(--muted)]">{item.id}</td>
                      {config.fields.map((f) => (
                        <td key={f.key} className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {f.key === 'CodigoHex' && item.CodigoHex && (
                              <span className="w-4 h-4 rounded-full border border-black shrink-0"
                                style={{ backgroundColor: item.CodigoHex }} />
                            )}
                            <span className="font-display text-[0.85rem]">
                              {item[f.key] || '—'}
                            </span>
                          </div>
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => startEdit(item)}
                            className="w-8 h-8 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                            <Pencil size={13} />
                          </button>
                          <button onClick={() => handleDelete(item.id)}
                            className="w-8 h-8 border-2 border-[var(--accent)] text-[var(--accent)] flex items-center justify-center hover:bg-[var(--accent)] hover:text-white transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Componente principal con tabs ────────────────────────────────────────────
export default function AdminCatalogos() {
  const [tab, setTab] = useState('categorias');
  const config = CATALOGOS.find((c) => c.key === tab);

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-0 border-2 border-black mb-6 overflow-hidden">
        {CATALOGOS.map((c) => (
          <button key={c.key} onClick={() => setTab(c.key)}
            className={`px-5 py-3 font-mono text-[0.72rem] tracking-[0.12em] uppercase transition-colors border-r-2 border-black last:border-r-0 ${
              tab === c.key
                ? 'bg-black text-white'
                : 'bg-white hover:bg-[#f4f4f4]'
            }`}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Tabla activa */}
      {config && <CatalogoTab key={tab} config={config} />}
    </div>
  );
}
