import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DireccionAPI } from '../../services/api';

export default function ShippingForm({ onNext }) {
  const { user } = useAuth();
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedId,     setSelectedId]     = useState(null); // Id de dirección guardada
  const [useNew,         setUseNew]          = useState(false);
  const [form, setForm] = useState({
    nombre: user ? `${user.Nombres || ''} ${user.Apellidos || ''}`.trim() : '',
    apellido: '',
    email:    user?.Email || '',
    telefono: user?.Telefono || '',
    direccion: '', ciudad: '', departamento: '',
    codigoPostal: '', referencia: '',
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // Cargar direcciones guardadas si hay sesión
  useEffect(() => {
    if (!user?.Id) return;
    DireccionAPI.porUsuario(user.Id)
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        // Normalizar camelCase a PascalCase
        const norm = list.map((a) => ({
          Id:           a.Id           ?? a.id           ?? 0,
          Direccion:    a.Direccion    ?? a.direccion    ?? '',
          Ciudad:       a.Ciudad       ?? a.ciudad       ?? '',
          Departamento: a.Departamento ?? a.departamento ?? '',
          Pais:         a.Pais         ?? a.pais         ?? 'Colombia',
          CodigoPostal: a.CodigoPostal ?? a.codigoPostal ?? a.codigo_Postal ?? '',
          Referencia:   a.Referencia   ?? a.referencia   ?? '',
        }));
        setSavedAddresses(norm);
        if (norm.length > 0) setSelectedId(norm[0].Id);
      })
      .catch(() => {});
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!useNew && selectedId) {
      const addr = savedAddresses.find((a) => a.Id === selectedId);
      onNext({
        ...form,
        direccion:    addr.Direccion,
        ciudad:       addr.Ciudad,
        departamento: addr.Departamento,
        codigoPostal: addr.CodigoPostal?.toString() || '',
        referencia:   addr.Referencia || '',
        Id_Direccion: addr.Id,
      });
    } else {
      onNext({ ...form, Id_Direccion: null });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <h2 className="font-display text-[1.1rem] uppercase tracking-[0.05em] pb-3 border-b-2 border-black">
        Datos de envío
      </h2>

      {/* Datos del contacto */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-tiny block mb-2">NOMBRE *</label>
          <input required className="brutal-input" value={form.nombre}
            onChange={set('nombre')} placeholder="Juan" />
        </div>
        <div>
          <label className="label-tiny block mb-2">APELLIDO *</label>
          <input required className="brutal-input" value={form.apellido}
            onChange={set('apellido')} placeholder="García" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-tiny block mb-2">EMAIL *</label>
          <input required type="email" className="brutal-input" value={form.email}
            onChange={set('email')} placeholder="juan@ejemplo.com" />
        </div>
        <div>
          <label className="label-tiny block mb-2">TELÉFONO *</label>
          <input required className="brutal-input" value={form.telefono}
            onChange={set('telefono')} placeholder="+57 300 123 4567" />
        </div>
      </div>

      {/* Direcciones guardadas */}
      {savedAddresses.length > 0 && (
        <div>
          <label className="label-tiny block mb-3">DIRECCIÓN DE ENVÍO</label>
          <div className="grid gap-2">
            {savedAddresses.map((a) => (
              <label key={a.Id}
                className={`flex items-start gap-3 border-2 p-4 cursor-pointer transition-colors ${
                  !useNew && selectedId === a.Id ? 'border-black bg-[#f4f4f4]' : 'border-black/30 hover:border-black'
                }`}>
                <input type="radio" name="addr" className="mt-1"
                  checked={!useNew && selectedId === a.Id}
                  onChange={() => { setSelectedId(a.Id); setUseNew(false); }} />
                <div>
                  <div className="font-display text-[0.85rem]">{a.Direccion}</div>
                  <div className="font-mono text-[0.72rem] text-[var(--muted)] mt-0.5">
                    {a.Ciudad}, {a.Departamento} — {a.Pais}
                  </div>
                </div>
              </label>
            ))}
            <label className={`flex items-center gap-3 border-2 p-4 cursor-pointer transition-colors ${
              useNew ? 'border-black bg-[#f4f4f4]' : 'border-black/30 hover:border-black'
            }`}>
              <input type="radio" name="addr" checked={useNew}
                onChange={() => setUseNew(true)} />
              <span className="font-mono text-[0.78rem] tracking-[0.08em]">USAR OTRA DIRECCIÓN</span>
            </label>
          </div>
        </div>
      )}

      {/* Dirección manual si no hay guardadas o eligió nueva */}
      {(savedAddresses.length === 0 || useNew) && (
        <>
          <div>
            <label className="label-tiny block mb-2">DIRECCIÓN *</label>
            <input required className="brutal-input" value={form.direccion}
              onChange={set('direccion')} placeholder="Cra 7 #123-45" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-tiny block mb-2">CIUDAD *</label>
              <input required className="brutal-input" value={form.ciudad}
                onChange={set('ciudad')} placeholder="Bogotá" />
            </div>
            <div>
              <label className="label-tiny block mb-2">DEPARTAMENTO *</label>
              <input required className="brutal-input" value={form.departamento}
                onChange={set('departamento')} placeholder="Cundinamarca" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-tiny block mb-2">CÓDIGO POSTAL</label>
              <input className="brutal-input" value={form.codigoPostal}
                onChange={set('codigoPostal')} placeholder="110111" />
            </div>
            <div>
              <label className="label-tiny block mb-2">REFERENCIA</label>
              <input className="brutal-input" value={form.referencia}
                onChange={set('referencia')} placeholder="Apto 301, Torre B" />
            </div>
          </div>
        </>
      )}

      <button type="submit" className="brutal-btn brutal-btn--accent w-full mt-2">
        CONTINUAR AL PAGO →
      </button>
    </form>
  );
}
