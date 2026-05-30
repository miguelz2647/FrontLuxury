import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, loading } = useAuth();
  const nav = useNavigate();
  const [form,  setForm]  = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(form);
      // Rol ya viene normalizado a minúscula desde AuthContext
      nav(user.Rol === 'admin' ? '/admin' : '/cuenta');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-16 grid lg:grid-cols-2 gap-10">
      <div className="relative hidden lg:block">
        <div className="absolute inset-0 bg-black overflow-hidden border-2 border-black">
          <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80"
            className="w-full h-full object-cover opacity-70" alt="" />
        </div>
        <div className="absolute bottom-8 left-8 text-white">
          <div className="label-tiny" style={{ color: '#fff', opacity: 0.7 }}>WELCOME BACK</div>
          <div className="font-display text-[3rem] leading-none uppercase mt-2">RAW<br />DESIGN</div>
        </div>
      </div>

      <div className="max-w-md w-full mx-auto">
        <h1 className="font-display text-[clamp(2rem,4vw,3rem)] uppercase leading-none mb-3">
          Iniciar sesión
        </h1>
        <p className="text-[var(--muted)] text-[0.92rem] mb-8">
          Bienvenido de vuelta. Ingresa para continuar.
        </p>

        <form onSubmit={submit} className="grid gap-5">
          <div>
            <label className="label-tiny block mb-2">EMAIL</label>
            <input required type="email" className="brutal-input"
              value={form.email} onChange={set('email')} placeholder="juan@ejemplo.com" />
          </div>
          <div>
            <label className="label-tiny block mb-2">CONTRASEÑA</label>
            <input required type="password" className="brutal-input"
              value={form.password} onChange={set('password')} placeholder="Tu contraseña" />
          </div>

          {error && (
            <div className="border-2 border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] px-4 py-3 font-mono text-[0.85rem]">
              {error}
            </div>
          )}

          <button disabled={loading} className="brutal-btn brutal-btn--accent">
            {loading ? 'INGRESANDO...' : 'INGRESAR'}
          </button>

          <div className="text-center text-[0.9rem] text-[var(--muted)]">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="text-black underline underline-offset-4 hover:text-[var(--accent)]">
              Regístrate
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
