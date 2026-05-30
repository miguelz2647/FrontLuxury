/**
 * ProductsContext
 * La API devuelve camelCase (System.Text.Json default).
 * normalizarProducto() convierte todo a PascalCase al cargar,
 * así el resto del React usa siempre p.Nombre, p.Precio, p.Variaciones, etc.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ProductoAPI, ProductoVariacionAPI } from '../services/api';

const ProductsContext = createContext(null);

// ── Helpers ──────────────────────────────────────────────────────────────────
const s = (o, ...keys) => { for (const k of keys) if (o?.[k] != null) return o[k]; return ''; };
const n = (o, ...keys) => { for (const k of keys) if (o?.[k] != null) return o[k]; return 0; };
const b = (o, ...keys) => { for (const k of keys) if (o?.[k] != null) return o[k]; return false; };

function normalizarVariacion(v) {
  return {
    ...v,
    Id:           n(v, 'Id',          'id'),
    Id_Producto:  n(v, 'Id_Producto', 'id_Producto'),
    Id_Talla:     n(v, 'Id_Talla',    'id_Talla'),
    Id_Color:     n(v, 'Id_Color',    'id_Color'),
    NumeroTalla:  s(v, 'NumeroTalla', 'numeroTalla'),
    NombreColor:  s(v, 'NombreColor', 'nombreColor'),
    CodigoHex:    s(v, 'CodigoHex',  'codigoHex'),
    Stock:        n(v, 'Stock',       'stock'),
  };
}

function normalizarImagen(i) {
  return {
    ...i,
    Id:         n(i, 'Id',         'id'),
    Url_Imagen: s(i, 'Url_Imagen', 'url_Imagen'),
    Principal:  b(i, 'Principal',  'principal'),
  };
}

function normalizarProducto(p) {
  return {
    ...p,
    Id:                   n(p, 'Id',                  'id'),
    Nombre:               s(p, 'Nombre',               'nombre'),
    Id_Marca:             n(p, 'Id_Marca',             'id_Marca'),
    NombreMarca:          s(p, 'NombreMarca',          'nombreMarca'),
    Id_Categoria:         n(p, 'Id_Categoria',         'id_Categoria'),
    NombreCategoria:      s(p, 'NombreCategoria',      'nombreCategoria'),
    Id_Modelo:            n(p, 'Id_Modelo',            'id_Modelo'),
    NombreModelo:         s(p, 'NombreModelo',         'nombreModelo'),
    Descripcion:          s(p, 'Descripcion',          'descripcion'),
    Precio:               n(p, 'Precio',               'precio'),
    PrecioAnterior:       p.PrecioAnterior ?? p.precioAnterior ?? null,
    Costo:                n(p, 'Costo',                'costo'),
    Tags:                 s(p, 'Tags',                 'tags'),
    Estado:               b(p, 'Estado',               'estado'),
    CalificacionPromedio: n(p, 'CalificacionPromedio', 'calificacionPromedio'),
    TotalOpiniones:       n(p, 'TotalOpiniones',       'totalOpiniones'),
    Variaciones: (p.Variaciones ?? p.variaciones ?? []).map(normalizarVariacion),
    Imagenes:    (p.Imagenes    ?? p.imagenes    ?? []).map(normalizarImagen),
  };
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ProductoAPI.todos();
      setProducts((Array.isArray(data) ? data : []).map(normalizarProducto));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const addProduct = async (dto) => {
    const created = await ProductoAPI.crear(dto);
    const norm    = normalizarProducto(created);
    setProducts((prev) => [...prev, norm]);
    return norm;
  };

  const updateProduct = async (id, dto) => {
    if (dto._variacion) {
      await ProductoVariacionAPI.actualizar(dto._variacion);
      const updated = normalizarProducto(await ProductoAPI.obtener(id));
      setProducts((prev) => prev.map((p) => p.Id === id ? updated : p));
      return updated;
    }
    const updated = normalizarProducto(await ProductoAPI.actualizar({ Id: id, ...dto }));
    setProducts((prev) => prev.map((p) => p.Id === id ? updated : p));
    return updated;
  };

  const deleteProduct = async (id) => {
    await ProductoAPI.eliminar(id);
    setProducts((prev) => prev.filter((p) => p.Id !== id));
  };

  const getProducts = useCallback(({ category, marca, tag } = {}) => {
    let items = [...products];
    if (category) {
      items = items.filter((p) =>
        p.NombreCategoria?.toLowerCase() === category.toLowerCase()
      );
    }
    if (marca) {
      items = items.filter((p) =>
        p.NombreMarca?.toLowerCase() === marca.toLowerCase()
      );
    }
    if (tag) {
      items = items.filter((p) => {
        const tags = p.Tags?.split(',').map((t) => t.trim()) || [];
        return tags.includes(tag);
      });
    }
    return items;
  }, [products]);

  const getProduct = useCallback((id) =>
    products.find((p) => p.Id === parseInt(id) || p.Id === id) || null
  , [products]);

  const searchProducts = useCallback((q) => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return products.filter((p) =>
      p.Nombre?.toLowerCase().includes(term) ||
      p.NombreMarca?.toLowerCase().includes(term) ||
      p.NombreCategoria?.toLowerCase().includes(term) ||
      p.Descripcion?.toLowerCase().includes(term)
    );
  }, [products]);

  return (
    <ProductsContext.Provider value={{
      products,
      loading,
      error,
      addProduct,
      updateProduct,
      deleteProduct,
      getProducts,
      getProduct,
      searchProducts,
      refresh: fetchAll,
    }}>
      {children}
    </ProductsContext.Provider>
  );
}

export const useProducts = () => useContext(ProductsContext);
