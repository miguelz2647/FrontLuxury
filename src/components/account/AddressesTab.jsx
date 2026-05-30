import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Pencil, Trash2, X } from 'lucide-react';
import AddressForm from './AddressForm';
import { DireccionAPI } from '../../services/api';

// DireccionResponseDto camelCase: id, id_Usuario, nombreUsuario, direccion, ciudad,
// departamento, pais, codigoPostal, referencia
const gId  = (o) => o?.id  ?? o?.Id  ?? 0;
const gStr = (o, ...keys) => { for (const k of keys) if (o[k] != null) return o[k]; return ''; };
const gNum = (o, ...keys) => { for (const k of keys) if (o[k] != null) return o[k]; return 0; };

export default function AddressesTab({ userId }) {
  const [addresses, setAddresses] = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [mode,      setMode]      = useState(null);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    DireccionAPI.porUsuario(userId)
      .then((data) => setAddresses(Array.isArray(data) ? data : []))
      .catch(() => setAddresses([]))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleCreate = async (form) => {
    try {
      const created = await DireccionAPI.crear({
        Id_Usuario:   userId,
        Direccion:    form.direccion,
        Ciudad:       form.ciudad,
        Departamento: form.departamento,
        Pais:         form.pais || 'Colombia',
        CodigoPostal: Number(form.codigoPostal) || 0,
        Referencia:   form.referencia || '',
      });
      setAddresses((prev) => [...prev, created]);
      setMode(null);
    } catch (err) {
      alert('Error al crear dirección: ' + err.message);
    }
  };

  const handleEdit = async (form) => {
    try {
      const editId = gId(mode.edit);
      const updated = await DireccionAPI.actualizar({
        Id:           editId,
        Id_Usuario:   userId,
        Direccion:    form.direccion,
        Ciudad:       form.ciudad,
        Departamento: form.departamento,
        Pais:         form.pais || 'Colombia',
        CodigoPostal: Number(form.codigoPostal) || 0,
        Referencia:   form.referencia || '',
      });
      setAddresses((prev) => prev.map((a) => gId(a) === editId ? updated : a));
      setMode(null);
    } catch (err) {
      alert('Error al editar dirección: ' + err.message);
    }
  };

  const handleDelete = async (addr) => {
    if (!confirm('¿Eliminar esta dirección?')) return;
    try {
      const addrId = gId(addr);
      await DireccionAPI.eliminar(addrId);
      setAddresses((prev) => prev.filter((a) => gId(a) !== addrId));
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  const toForm = (a) => ({
    direccion:    gStr(a, 'direccion',    'Direccion'),
    ciudad:       gStr(a, 'ciudad',       'Ciudad'),
    departamento: gStr(a, 'departamento', 'Departamento'),
    pais:         gStr(a, 'pais',         'Pais') || 'Colombia',
    codigoPostal: gStr(a, 'codigoPostal', 'CodigoPostal', 'codigo_Postal'),
    referencia:   gStr(a, 'referencia',   'Referencia'),
  });

  if (loading) return (
    <div className="py-12 text-center font-mono text-[0.85rem] tracking-[0.15em] text-[var(--muted)]">
      CARGANDO DIRECCIONES...
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-black">
        <h2 className="font-display text-[1.1rem] uppercase tracking-[0.05em]">Mis direcciones</h2>
        {mode === null && (
          <button onClick={() => setMode('create')}
            className="brutal-btn brutal-btn--accent flex items-center gap-2 text-[0.78rem]">
            <Plus size={13} /> AGREGAR
          </button>
        )}
      </div>

      {mode === 'create' && (
        <div className="border-2 border-black p-5 mb-5">
          <div className="flex items-center justify-between mb-2">
            <div className="font-display text-[0.9rem] uppercase">Nueva dirección</div>
            <button onClick={() => setMode(null)}
              className="w-7 h-7 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white">
              <X size={12} />
            </button>
          </div>
          <AddressForm onSave={handleCreate} onCancel={() => setMode(null)} />
        </div>
      )}

      {addresses.length === 0 && mode !== 'create' && (
        <div className="border-2 border-dashed border-black p-10 text-center">
          <MapPin size={28} className="mx-auto mb-3 opacity-40" />
          <div className="font-display uppercase">Sin direcciones guardadas</div>
          <p className="text-[var(--muted)] text-[0.9rem] mt-1">Agrega tu primera dirección de envío.</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {addresses.map((addr) => {
          const addrId     = gId(addr);
          const ciudad     = gStr(addr, 'ciudad',       'Ciudad');
          const direccion  = gStr(addr, 'direccion',    'Direccion');
          const depto      = gStr(addr, 'departamento', 'Departamento');
          const pais       = gStr(addr, 'pais',         'Pais');
          const cp         = gNum(addr, 'codigoPostal', 'CodigoPostal', 'codigo_Postal');
          const referencia = gStr(addr, 'referencia',   'Referencia');
          const editMode   = mode?.edit;
          const editId     = editMode ? gId(editMode) : null;

          return (
            <div key={addrId} className="border-2 border-black p-5">
              {editId === addrId ? (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-display text-[0.9rem] uppercase">Editar dirección</div>
                    <button onClick={() => setMode(null)}
                      className="w-7 h-7 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white">
                      <X size={12} />
                    </button>
                  </div>
                  <AddressForm initial={toForm(addr)} onSave={handleEdit} onCancel={() => setMode(null)} />
                </>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="label-tiny">{ciudad.toUpperCase() || 'DIRECCIÓN'}</div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => setMode({ edit: addr })}
                        className="w-7 h-7 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white">
                        <Pencil size={11} />
                      </button>
                      <button onClick={() => handleDelete(addr)}
                        className="w-7 h-7 border-2 border-[var(--accent)] text-[var(--accent)] flex items-center justify-center hover:bg-[var(--accent)] hover:text-white">
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                  <div className="font-display text-[0.9rem]">{direccion}</div>
                  <div className="text-[0.85rem] text-[var(--ink-soft)] mt-1">
                    {ciudad}, {depto}<br />
                    {pais} {cp ? `· CP ${cp}` : ''}
                    {referencia && <><br />{referencia}</>}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
