import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import Paginador   from '../components/common/Paginador';
import { useProducts } from '../context/ProductsContext';

const POR_PAGINA = 12;

export default function Marca() {
  const { slug }              = useParams();
  const { products, loading } = useProducts();
  const [sort,   setSort]     = useState('relevance');
  const [pagina, setPagina]   = useState(1);

  const nombreMarca = decodeURIComponent(slug || '');

  const sorted = useMemo(() => {
    let arr = products.filter((p) =>
      p.NombreMarca?.toLowerCase() === nombreMarca.toLowerCase()
    );
    if (sort === 'price-asc')  arr.sort((a, b) => (a.Precio ?? 0) - (b.Precio ?? 0));
    if (sort === 'price-desc') arr.sort((a, b) => (b.Precio ?? 0) - (a.Precio ?? 0));
    if (sort === 'rating')     arr.sort((a, b) => (b.CalificacionPromedio ?? 0) - (a.CalificacionPromedio ?? 0));
    return arr;
  }, [products, nombreMarca, sort]);

  const totalItems   = sorted.length;
  const totalPaginas = Math.max(1, Math.ceil(totalItems / POR_PAGINA));
  const paginaReal   = Math.min(pagina, totalPaginas);
  const pagItems     = sorted.slice((paginaReal - 1) * POR_PAGINA, paginaReal * POR_PAGINA);

  const irA = (p) => { if (p >= 1 && p <= totalPaginas) { setPagina(p); window.scrollTo({ top: 0, behavior: 'smooth' }); } };

  if (loading) return (
    <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-24 text-center">
      <div className="font-mono text-[0.85rem] tracking-[0.15em] text-[var(--muted)]">CARGANDO...</div>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="label-tiny mb-2">MARCA</div>
          <h1 className="font-display text-[clamp(2.4rem,5vw,4rem)] uppercase leading-none">
            {nombreMarca.toUpperCase()}
          </h1>
          <div className="mt-3 text-[var(--muted)] text-[0.9rem]">
            {totalItems} producto{totalItems === 1 ? '' : 's'}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="label-tiny">ORDENAR</span>
          <select value={sort} onChange={(e) => { setSort(e.target.value); setPagina(1); }}
            className="brutal-input !py-2 !px-3 font-mono text-[0.78rem] uppercase tracking-[0.1em] cursor-pointer">
            <option value="relevance">RELEVANCIA</option>
            <option value="price-asc">PRECIO ↑</option>
            <option value="price-desc">PRECIO ↓</option>
            <option value="rating">RATING</option>
          </select>
        </div>
      </div>

      {totalItems === 0 ? (
        <div className="border-2 border-black p-12 text-center">
          <div className="font-display text-2xl mb-2">SIN PRODUCTOS</div>
          <div className="text-[var(--muted)] text-[0.9rem]">Aún no hay productos de esta marca.</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {pagItems.map((p) => <ProductCard key={p.Id} product={p} />)}
        </div>
      )}

      <Paginador
        pagina={paginaReal} totalPaginas={totalPaginas} totalItems={totalItems}
        irA={irA} hayAnterior={paginaReal > 1} haySiguiente={paginaReal < totalPaginas}
      />
    </div>
  );
}
