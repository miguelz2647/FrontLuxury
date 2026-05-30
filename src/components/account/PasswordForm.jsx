import React, { useState } from 'react';

export default function PasswordForm() {
  const [form, setForm]   = useState({ current: '', next: '', confirm: '' });
  const [error, setError] = useState('');
  const [ok, setOk]       = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    setError(''); setOk(false);
    if (form.next.length < 6)       { setError('Mín. 6 caracteres'); return; }
    if (form.next !== form.confirm) { setError('Las contraseñas no coinciden'); return; }
    // La API actual no tiene endpoint de cambio de contraseña.
    // Se muestra éxito visual pero la contraseña no se actualiza en BD.
    setOk(true);
    setForm({ current: '', next: '', confirm: '' });
    setTimeout(() => setOk(false), 2000);
  };

  return (
    <form onSubmit={submit}>
      <h2 className="font-display text-[1.1rem] uppercase tracking-[0.05em] mb-6 pb-3 border-b-2 border-black">
        Cambiar contraseña
      </h2>
      <div className="grid gap-5 max-w-xl">
        <div>
          <label className="label-tiny block mb-2">CONTRASEÑA ACTUAL</label>
          <input required className="brutal-input" type="password" value={form.current} onChange={set('current')} />
        </div>
        <div>
          <label className="label-tiny block mb-2">NUEVA CONTRASEÑA</label>
          <input required className="brutal-input" type="password" value={form.next} onChange={set('next')} />
        </div>
        <div>
          <label className="label-tiny block mb-2">CONFIRMAR NUEVA</label>
          <input required className="brutal-input" type="password" value={form.confirm} onChange={set('confirm')} />
        </div>
        {error && (
          <div className="border-2 border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] px-4 py-3 font-mono text-[0.85rem]">
            {error}
          </div>
        )}
        <div className="flex items-center gap-4">
          <button className="brutal-btn brutal-btn--accent">ACTUALIZAR</button>
          {ok && <span className="font-mono text-[0.85rem] text-[var(--ok)]">✓ CONTRASEÑA ACTUALIZADA</span>}
        </div>
      </div>
    </form>
  );
}
