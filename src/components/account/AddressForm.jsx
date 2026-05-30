import React, { useState } from 'react';
import { Check } from 'lucide-react';

const EMPTY = { direccion: '', ciudad: '', departamento: '', pais: 'Colombia', codigoPostal: '', referencia: '' };

export default function AddressForm({ initial = {}, onSave, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="grid gap-4 mt-4">
      <div>
        <label className="label-tiny block mb-2">PAÍS</label>
        <input required className="brutal-input" value={form.pais} onChange={set('pais')} />
      </div>
      <div>
        <label className="label-tiny block mb-2">DIRECCIÓN COMPLETA *</label>
        <input required className="brutal-input" value={form.direccion} onChange={set('direccion')} placeholder="Cra 7 #123-45" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label-tiny block mb-2">CIUDAD *</label>
          <input required className="brutal-input" value={form.ciudad} onChange={set('ciudad')} placeholder="Bogotá" />
        </div>
        <div>
          <label className="label-tiny block mb-2">DEPARTAMENTO *</label>
          <input required className="brutal-input" value={form.departamento} onChange={set('departamento')} placeholder="Cundinamarca" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label-tiny block mb-2">CÓDIGO POSTAL</label>
          <input className="brutal-input" value={form.codigoPostal} onChange={set('codigoPostal')} placeholder="110111" />
        </div>
        <div>
          <label className="label-tiny block mb-2">REFERENCIA</label>
          <input className="brutal-input" value={form.referencia} onChange={set('referencia')} placeholder="Apto 301, Torre B" />
        </div>
      </div>
      <div className="flex gap-3 pt-1">
        <button type="submit" className="brutal-btn brutal-btn--accent flex items-center gap-2">
          <Check size={14} /> GUARDAR
        </button>
        <button type="button" onClick={onCancel} className="brutal-btn brutal-btn--ghost">CANCELAR</button>
      </div>
    </form>
  );
}
