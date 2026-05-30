import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ProfileForm() {
  const { user, updateProfile, loading } = useAuth();
  const [form,  setForm]  = useState({ name: '', email: '', phone: '' });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Se actualiza cada vez que user cambia (fix: antes se inicializaba vacío)
  useEffect(() => {
    if (!user) return;
    setForm({
      name:  `${user.Nombres || ''} ${user.Apellidos || ''}`.trim(),
      email: user.Email    || '',
      phone: user.Telefono || '',
    });
  }, [user]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setSaved(false);
    try {
      await updateProfile({ name: form.name, phone: form.phone });
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={submit}>
      <h2 className="font-display text-[1.1rem] uppercase tracking-[0.05em] mb-6 pb-3 border-b-2 border-black">
        Información del perfil
      </h2>
      <div className="grid gap-5 max-w-xl">
        <div>
          <label className="label-tiny block mb-2">NOMBRE COMPLETO</label>
          <input className="brutal-input" value={form.name} onChange={set('name')} />
        </div>
        <div>
          <label className="label-tiny block mb-2">EMAIL</label>
          <input className="brutal-input bg-[#f4f4f4] cursor-not-allowed" type="email"
            value={form.email} readOnly title="El email no se puede cambiar" />
        </div>
        <div>
          <label className="label-tiny block mb-2">TELÉFONO</label>
          <input className="brutal-input" value={form.phone} onChange={set('phone')} placeholder="+57 300 123 4567" />
        </div>

        {error && (
          <div className="border-2 border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] px-4 py-3 font-mono text-[0.85rem]">
            {error}
          </div>
        )}

        <div className="flex items-center gap-4">
          <button disabled={loading} className="brutal-btn brutal-btn--accent">
            {loading ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
          </button>
          {saved && <span className="font-mono text-[0.85rem] text-[var(--ok)]">✓ GUARDADO</span>}
        </div>
      </div>
    </form>
  );
}
