import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, loading } = useAuth();
  const nav = useNavigate();
  const [form, setForm]   = useState({
    firstName: '', lastName: '', email: '',
    phone: '', password: '', confirm: '',
  });
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      nav('/cuenta');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-16 grid lg:grid-cols-2 gap-10">
      {/* Formulario */}
      <div className="max-w-md w-full mx-auto order-2 lg:order-1">
        <h1 className="font-display text-[clamp(2rem,4vw,3rem)] uppercase leading-none mb-3">
          Crear cuenta
        </h1>
        <p className="text-[var(--muted)] text-[0.92rem] mb-8">
          Únete y empieza a comprar con estilo brutal.
        </p>

        <form onSubmit={submit} className="grid gap-5">
          {/* Nombre + Apellido */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-tiny block mb-2">NOMBRE *</label>
              <input required className="brutal-input"
                value={form.firstName} onChange={set('firstName')} placeholder="Juan" />
            </div>
            <div>
              <label className="label-tiny block mb-2">APELLIDO *</label>
              <input required className="brutal-input"
                value={form.lastName} onChange={set('lastName')} placeholder="García" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="label-tiny block mb-2">EMAIL *</label>
            <input required type="email" className="brutal-input"
              value={form.email} onChange={set('email')} placeholder="juan@ejemplo.com" />
          </div>

          {/* Teléfono */}
          <div>
            <label className="label-tiny block mb-2">TELÉFONO</label>
            <input className="brutal-input"
              value={form.phone} onChange={set('phone')} placeholder="+57 300 123 4567" />
          </div>

          {/* Contraseñas */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-tiny block mb-2">CONTRASEÑA *</label>
              <input required type="password" className="brutal-input"
                value={form.password} onChange={set('password')} placeholder="Mín. 6 caracteres" />
            </div>
            <div>
              <label className="label-tiny block mb-2">CONFIRMAR *</label>
              <input required type="password" className="brutal-input"
                value={form.confirm} onChange={set('confirm')} placeholder="Repite la contraseña" />
            </div>
          </div>

          {error && (
            <div className="border-2 border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] px-4 py-3 font-mono text-[0.85rem]">
              {error}
            </div>
          )}

          <button disabled={loading} className="brutal-btn brutal-btn--accent">
            {loading ? 'CREANDO...' : 'CREAR CUENTA'}
          </button>

          <div className="text-center text-[0.9rem] text-[var(--muted)]">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-black underline underline-offset-4 hover:text-[var(--accent)]">
              Inicia sesión
            </Link>
          </div>
        </form>
      </div>

      {/* Imagen lateral */}
      <div className="relative hidden lg:block order-1 lg:order-2">
        <div className="absolute inset-0 overflow-hidden border-2 border-black bg-[var(--accent)]">
          <img src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=1200&q=80"
            className="w-full h-full object-cover mix-blend-multiply opacity-90" alt="" />
        </div>
        <div className="absolute bottom-8 right-8 text-white text-right">
          <div className="label-tiny" style={{ color: '#fff', opacity: 0.85 }}>JOIN BRUTAL</div>
          <div className="font-display text-[3rem] leading-none uppercase mt-2">NEW<br />MOVEMENT</div>
        </div>
      </div>
    </div>
  );
}
