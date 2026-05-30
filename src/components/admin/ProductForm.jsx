import React, { useState, useEffect } from 'react';
import { Check, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { CategoriaAPI, MarcaAPI, ModeloAPI, TallaAPI, ColorAPI, ProductoVariacionAPI } from '../../services/api';

const ALL_TAGS = ['featured', 'new', 'sale'];

const EMPTY = {
  Nombre: '', Id_Modelo: '', Id_Marca: '', Id_Categoria: '',
  Descripcion: '', Costo: '', Precio: '', PrecioAnterior: '', Tags: '',
  Estado: true,
};

export default function ProductForm({ initial = {}, variacionesIniciales = [], onSave, onCancel }) {
  const [form,       setForm]       = useState({ ...EMPTY, ...initial });
  const [error,      setError]      = useState('');
  const [categorias, setCategorias] = useState([]);
  const [marcas,     setMarcas]     = useState([]);
  const [modelos,    setModelos]    = useState([]);
  const [tallas,     setTallas]     = useState([]);
  const [colores,    setColores]    = useState([]);
  const [loadingCat, setLoadingCat] = useState(true);

  // Variaciones existentes (modo edición) + nuevas que el usuario agrega
  const [variaciones, setVariaciones] = useState(() =>
    variacionesIniciales.map((v) => ({
      key:         `${v.Id_Talla}_${v.Id_Color}`,
      id_talla:    v.Id_Talla,
      id_color:    v.Id_Color,
      stock:       v.Stock,
      nombreTalla: v.NumeroTalla,
      nombreColor: v.NombreColor,
      esExistente: true,
    }))
  );
  const [newVar,      setNewVar]      = useState({ id_talla: '', id_color: '', stock: 1 });

  const tagsArr = form.Tags ? form.Tags.split(',').map((t) => t.trim()).filter(Boolean) : [];
  const toggleTag = (tag) => {
    const next = tagsArr.includes(tag) ? tagsArr.filter((t) => t !== tag) : [...tagsArr, tag];
    setForm((f) => ({ ...f, Tags: next.join(',') }));
  };

  useEffect(() => {
    Promise.all([
      CategoriaAPI.todos(),
      MarcaAPI.todos(),
      ModeloAPI.todos(),
      TallaAPI.todos(),
      ColorAPI.todos(),
    ]).then(([cats, mars, mods, tals, cols]) => {
      setCategorias(cats || []);
      setMarcas(mars || []);
      setModelos(mods || []);
      setTallas(tals || []);
      setColores(cols || []);
    }).catch((err) => setError('Error cargando catálogos: ' + err.message))
      .finally(() => setLoadingCat(false));
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setV = (k) => (e) => setNewVar((f) => ({ ...f, [k]: e.target.value }));

  // Agregar variación a la lista local
  const addVariacion = () => {
    if (!newVar.id_talla || !newVar.id_color) { setError('Selecciona talla y color'); return; }
    const talla = tallas.find((t) => String(t.Id ?? t.id) === String(newVar.id_talla));
    const color = colores.find((c) => String(c.Id ?? c.id) === String(newVar.id_color));
    const key   = `${newVar.id_talla}_${newVar.id_color}`;
    if (variaciones.find((v) => v.key === key)) { setError('Esa combinación ya existe'); return; }
    setError('');
    setVariaciones((prev) => [...prev, {
      key,
      id_talla:    Number(newVar.id_talla),
      id_color:    Number(newVar.id_color),
      stock:       Number(newVar.stock) || 1,
      nombreTalla: talla?.Numero ?? talla?.numero ?? '',
      nombreColor: color?.Nombre ?? color?.nombre ?? '',
    }]);
    setNewVar({ id_talla: '', id_color: '', stock: 1 });
  };

  const removeVariacion = (key) => setVariaciones((prev) => prev.filter((v) => v.key !== key));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.Nombre.trim())                        return setError('El nombre es obligatorio');
    if (!form.Id_Marca)                             return setError('Selecciona una marca');
    if (!form.Id_Categoria)                         return setError('Selecciona una categoría');
    if (!form.Precio || isNaN(Number(form.Precio))) return setError('Precio inválido');
    setError('');

    const dto = {
      Nombre:         form.Nombre,
      Id_Modelo:      Number(form.Id_Modelo) || 0,   // API exige int, no null
      Id_Marca:       Number(form.Id_Marca),
      Id_Categoria:   Number(form.Id_Categoria),
      Descripcion:    form.Descripcion || '',
      Costo:          Number(form.Costo) || 0,
      Precio:         Number(form.Precio),
      PrecioAnterior: form.PrecioAnterior ? Number(form.PrecioAnterior) : null,
      Tags:           form.Tags || '',
      Estado:         form.Estado ?? true,
    };

    // onSave recibe dto + variaciones para que AdminProducts las cree después de crear el producto
    // Solo enviar variaciones NUEVAS — las existentes ya están en la BD
    onSave(dto, variaciones.filter((v) => !v.esExistente));
  };

  // ── helpers camelCase ──
  const gId  = (o) => o.Id  ?? o.id;
  const gNom = (o) => o.Nombre ?? o.nombre ?? '';
  const gNum = (o) => o.Numero ?? o.numero ?? '';

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">

      {/* Nombre */}
      <div>
        <label className="label-tiny block mb-2">NOMBRE *</label>
        <input className="brutal-input" value={form.Nombre} onChange={set('Nombre')} placeholder="AIR FORCE BRUTAL" />
      </div>

      {/* Marca + Categoría */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="label-tiny block mb-2">MARCA *</label>
          <select className="brutal-input cursor-pointer" value={form.Id_Marca} onChange={set('Id_Marca')} disabled={loadingCat}>
            <option value="">— Selecciona —</option>
            {marcas.map((m) => <option key={gId(m)} value={gId(m)}>{gNom(m)}</option>)}
          </select>
        </div>
        <div>
          <label className="label-tiny block mb-2">CATEGORÍA *</label>
          <select className="brutal-input cursor-pointer" value={form.Id_Categoria} onChange={set('Id_Categoria')} disabled={loadingCat}>
            <option value="">— Selecciona —</option>
            {categorias.map((c) => <option key={gId(c)} value={gId(c)}>{gNom(c)}</option>)}
          </select>
        </div>
      </div>

      {/* Modelo */}
      <div>
        <label className="label-tiny block mb-2">MODELO</label>
        <select className="brutal-input cursor-pointer" value={form.Id_Modelo} onChange={set('Id_Modelo')} disabled={loadingCat}>
          <option value="">— Selecciona —</option>
          {modelos.map((m) => <option key={gId(m)} value={gId(m)}>{gNom(m)}</option>)}
        </select>
      </div>

      {/* Precios */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="label-tiny block mb-2">PRECIO VENTA * (COP)</label>
          <input className="brutal-input" type="number" min={0} value={form.Precio} onChange={set('Precio')} placeholder="289000" />
        </div>
        <div>
          <label className="label-tiny block mb-2">PRECIO ANTERIOR</label>
          <input className="brutal-input" type="number" min={0} value={form.PrecioAnterior || ''} onChange={set('PrecioAnterior')} placeholder="349000" />
        </div>
        <div>
          <label className="label-tiny block mb-2">COSTO (COMPRA)</label>
          <input className="brutal-input" type="number" min={0} value={form.Costo} onChange={set('Costo')} placeholder="150000" />
        </div>
      </div>

      {/* Descripción */}
      <div>
        <label className="label-tiny block mb-2">DESCRIPCIÓN</label>
        <textarea className="brutal-input resize-none" rows={3}
          value={form.Descripcion} onChange={set('Descripcion')}
          placeholder="Describe el producto..." />
      </div>

      {/* ── Variaciones ── */}
      <div>
        <label className="label-tiny block mb-3">TALLAS / VARIACIONES</label>

        {/* Agregar nueva variación */}
        <div className="border-2 border-black p-4 mb-3 grid grid-cols-[1fr_1fr_80px_auto] gap-2 items-end">
          <div>
            <label className="label-tiny block mb-1">TALLA</label>
            <select className="brutal-input cursor-pointer !py-2" value={newVar.id_talla} onChange={setV('id_talla')} disabled={loadingCat}>
              <option value="">— Talla —</option>
              {tallas.map((t) => <option key={gId(t)} value={gId(t)}>{gNum(t)}</option>)}
            </select>
          </div>
          <div>
            <label className="label-tiny block mb-1">COLOR</label>
            <select className="brutal-input cursor-pointer !py-2" value={newVar.id_color} onChange={setV('id_color')} disabled={loadingCat}>
              <option value="">— Color —</option>
              {colores.map((c) => <option key={gId(c)} value={gId(c)}>{gNom(c)}</option>)}
            </select>
          </div>
          <div>
            <label className="label-tiny block mb-1">STOCK</label>
            <input className="brutal-input !py-2" type="number" min={0}
              value={newVar.stock} onChange={setV('stock')} />
          </div>
          <button type="button" onClick={addVariacion}
            className="h-[42px] px-3 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">
            <Plus size={16} />
          </button>
        </div>

        {/* Lista de variaciones agregadas */}
        {variaciones.length === 0 ? (
          <div className="border border-dashed border-black/30 px-4 py-3 text-center font-mono text-[0.75rem] text-[var(--muted)]">
            Sin variaciones — agrega al menos una talla
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {variaciones.map((v) => (
              <div key={v.key}
                className="flex items-center gap-2 border-2 border-black px-3 py-1.5 bg-white">
                <span className="font-display text-[0.82rem]">T{v.nombreTalla}</span>
                {v.nombreColor && <span className="font-mono text-[0.7rem] text-[var(--muted)]">{v.nombreColor}</span>}
                <span className="font-mono text-[0.7rem] border-l border-black/20 pl-2">×{v.stock}</span>
                <button type="button" onClick={() => removeVariacion(v.key)}
                  className="text-[var(--accent)] hover:text-red-700 transition-colors ml-1">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="label-tiny block mb-3">ETIQUETAS</label>
        <div className="flex flex-wrap gap-2">
          {ALL_TAGS.map((t) => (
            <button key={t} type="button" onClick={() => toggleTag(t)}
              className={`px-3 py-1.5 border-2 font-mono text-[0.7rem] uppercase tracking-[0.1em] transition-all ${
                tagsArr.includes(t)
                  ? t === 'sale' ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                  : t === 'new'  ? 'bg-[var(--ok)] border-[var(--ok)] text-white'
                  : 'bg-black border-black text-white'
                  : 'bg-white border-black hover:bg-black hover:text-white'
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="border-2 border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] px-4 py-3 font-mono text-[0.82rem] flex items-center gap-2">
          <AlertTriangle size={14} /> {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="submit" className="brutal-btn brutal-btn--accent flex items-center gap-2">
          <Check size={15} /> GUARDAR
        </button>
        <button type="button" onClick={onCancel} className="brutal-btn brutal-btn--ghost">CANCELAR</button>
      </div>
    </form>
  );
}
