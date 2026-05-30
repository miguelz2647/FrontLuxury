/**
 * CategoriaContext
 * Carga las categorías reales del backend una sola vez.
 * Convierte el nombre en slug: "Hombre" → "hombre", "Niños" → "ninos"
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CategoriaAPI } from '../services/api';

const CategoriaContext = createContext(null);

function toSlug(nombre) {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita tildes
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function CategoriaProvider({ children }) {
  const [categorias, setCategorias] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    CategoriaAPI.todos()
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        // Normaliza: id/Id + nombre/Nombre + slug generado
        setCategorias(arr.map((c) => ({
          id:     c.id    ?? c.Id,
          nombre: c.nombre ?? c.Nombre ?? '',
          slug:   toSlug(c.nombre ?? c.Nombre ?? ''),
        })));
      })
      .catch(() => setCategorias([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <CategoriaContext.Provider value={{ categorias, loading, toSlug }}>
      {children}
    </CategoriaContext.Provider>
  );
}

export const useCategorias = () => useContext(CategoriaContext);
