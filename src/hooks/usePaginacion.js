/**
 * usePaginacion
 * Llama a ProductoAPI.paginado y devuelve items normalizados + controles de página.
 * Usado por Todos, Category y Marca.
 */
import { useState, useEffect, useCallback } from 'react';
import { ProductoAPI } from '../services/api';

// camelCase helpers — la API devuelve camelCase
function normalizarProducto(p) {
  return {
    ...p,
    Id:                   p.Id                   ?? p.id                   ?? 0,
    Nombre:               p.Nombre               ?? p.nombre               ?? '',
    Id_Marca:             p.Id_Marca             ?? p.id_Marca             ?? 0,
    NombreMarca:          p.NombreMarca          ?? p.nombreMarca          ?? '',
    Id_Categoria:         p.Id_Categoria         ?? p.id_Categoria         ?? 0,
    NombreCategoria:      p.NombreCategoria      ?? p.nombreCategoria      ?? '',
    Id_Modelo:            p.Id_Modelo            ?? p.id_Modelo            ?? 0,
    NombreModelo:         p.NombreModelo         ?? p.nombreModelo         ?? '',
    Descripcion:          p.Descripcion          ?? p.descripcion          ?? '',
    Precio:               p.Precio               ?? p.precio               ?? 0,
    PrecioAnterior:       p.PrecioAnterior       ?? p.precioAnterior       ?? null,
    Costo:                p.Costo                ?? p.costo                ?? 0,
    Tags:                 p.Tags                 ?? p.tags                 ?? '',
    Estado:               p.Estado               ?? p.estado               ?? true,
    CalificacionPromedio: p.CalificacionPromedio ?? p.calificacionPromedio ?? 0,
    TotalOpiniones:       p.TotalOpiniones       ?? p.totalOpiniones       ?? 0,
    Variaciones: (p.Variaciones ?? p.variaciones ?? []).map((v) => ({
      ...v,
      Id:          v.Id          ?? v.id          ?? 0,
      Id_Talla:    v.Id_Talla    ?? v.id_Talla    ?? 0,
      Id_Color:    v.Id_Color    ?? v.id_Color    ?? 0,
      NumeroTalla: v.NumeroTalla ?? v.numeroTalla ?? '',
      NombreColor: v.NombreColor ?? v.nombreColor ?? '',
      CodigoHex:   v.CodigoHex   ?? v.codigoHex   ?? '',
      Stock:       v.Stock       ?? v.stock       ?? 0,
    })),
    Imagenes: (p.Imagenes ?? p.imagenes ?? []).map((i) => ({
      ...i,
      Id:         i.Id         ?? i.id         ?? 0,
      Url_Imagen: i.Url_Imagen ?? i.url_Imagen ?? '',
      Principal:  i.Principal  ?? i.principal  ?? false,
    })),
  };
}

export function usePaginacion({ porPagina = 12 } = {}) {
  const [pagina,        setPagina]        = useState(1);
  const [items,         setItems]         = useState([]);
  const [totalItems,    setTotalItems]    = useState(0);
  const [totalPaginas,  setTotalPaginas]  = useState(0);
  const [loading,       setLoading]       = useState(true);

  const cargar = useCallback(async (p) => {
    setLoading(true);
    try {
      const data = await ProductoAPI.paginado(p, porPagina);
      const raw  = data.items ?? data.Items ?? [];
      setItems(raw.map(normalizarProducto));
      setTotalItems(   data.totalItems    ?? data.TotalItems    ?? 0);
      setTotalPaginas( data.totalPaginas  ?? data.TotalPaginas  ?? 1);
      setPagina(p);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [porPagina]);

  useEffect(() => { cargar(1); }, [cargar]);

  return {
    items, loading, pagina, totalPaginas, totalItems,
    irA:         (p) => { if (p >= 1 && p <= totalPaginas) cargar(p); },
    siguiente:   ()  => cargar(Math.min(pagina + 1, totalPaginas)),
    anterior:    ()  => cargar(Math.max(pagina - 1, 1)),
    haySiguiente: pagina < totalPaginas,
    hayAnterior:  pagina > 1,
  };
}
