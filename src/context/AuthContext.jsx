import React, { createContext, useContext, useState } from 'react';
import { UsuarioAPI } from '../services/api';

const AuthContext = createContext(null);
const SESSION_KEY = 'brutal_session';

function getSession() {
  try {
    const raw = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    if (!raw) return null;
    // Si la sesión guardada tiene Email vacío (sesión corrupta de versiones anteriores),
    // la descartamos para forzar un login limpio
    const email = raw.Email ?? raw.email ?? '';
    if (!email) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return raw;
  } catch {
    return null;
  }
}

// La API usa System.Text.Json camelCase por defecto:
// devuelve { id, nombres, apellidos, email, telefono, rol, activo, fechaRegistro }
function normalizeUser(u) {
  if (!u) return null;
  return {
    ...u,
    Id:        u.Id        ?? u.id        ?? 0,
    Nombres:   u.Nombres   ?? u.nombres   ?? '',
    Apellidos: u.Apellidos ?? u.apellidos ?? '',
    Email:     u.Email     ?? u.email     ?? '',
    Telefono:  u.Telefono  ?? u.telefono  ?? '',
    Rol:       (u.Rol      ?? u.rol       ?? 'user').toLowerCase(),
    Activo:    u.Activo    ?? u.activo    ?? true,
  };
}

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(() => normalizeUser(getSession()));
  const [loading, setLoading] = useState(false);

  const saveSession = (u) => {
    const normalized = normalizeUser(u);
    localStorage.setItem(SESSION_KEY, JSON.stringify(normalized));
    setUser(normalized);
    return normalized;
  };

  const login = async ({ email, password }) => {
    if (!email || !password) throw new Error('Completa todos los campos');
    setLoading(true);
    try {
      const res = await UsuarioAPI.login({
        EmailUsuario:      email.trim(),
        ContraseñaUsuario: password,
      });
      if (!res.success) throw new Error(res.mensaje || 'Credenciales incorrectas');
      if (!res.result)  throw new Error('Respuesta inesperada del servidor');
      return saveSession(res.result);
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ firstName, lastName, email, phone, password, confirm }) => {
    if (!firstName || !email || !password) throw new Error('Completa todos los campos');
    if (password !== confirm)  throw new Error('Las contraseñas no coinciden');
    if (password.length < 6)   throw new Error('La contraseña debe tener al menos 6 caracteres');
    setLoading(true);
    try {
      const res = await UsuarioAPI.registrar({
        NombreUsuario:       firstName.trim(),
        ApellidoUsuario:     lastName.trim(),
        EmailUsuario:        email.trim(),
        ContraseñaUsuario:   password,
        ConfirmarContraseña: confirm,
        Telefono:            phone || '',
      });
      if (!res.success) throw new Error(res.mensaje || 'No se pudo crear la cuenta');
      if (!res.result)  throw new Error('Respuesta inesperada del servidor');
      return saveSession(res.result);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const updateProfile = async ({ name, phone }) => {
    if (!user) return;
    setLoading(true);
    try {
      const parts     = (name || '').trim().split(' ');
      const nombres   = parts[0] || '';
      const apellidos = parts.slice(1).join(' ') || '';
      const res = await UsuarioAPI.actualizar({
        Id:        user.Id,
        Nombres:   nombres,
        Apellidos: apellidos,
        Telefono:  phone || '',
        Activo:    true,
        Rol:       user.Rol || 'user',
      });
      if (!res.success) throw new Error(res.mensaje);
      return saveSession(res.result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAdmin: user?.Rol === 'admin',
      login,
      register,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
