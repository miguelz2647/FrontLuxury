import React, { useMemo, useState } from 'react';
import ProductCard from '../components/common/ProductCard';
import Paginador   from '../components/common/Paginador';
import { useProducts } from '../context/ProductsContext';

const POR_PAGINA = 12;

export default function Todos() {
  const { products, loading } = useProducts();
  const [search, setSearch]   = useState('');
  const [pagina, setPagina]   = useState(1);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const t = search.toLowerCase();
    return products.filter((p) =>
      p.Nombre?.toLowerCase().includes(t) ||
      p.NombreMarca?.toLowerCase().includes(t) ||
      p.NombreCategoria?.toLowerCase().includes(t)
    );
  }, [products, search]);

  const totalItems   = filtered.length;
  const totalPaginas = Math.max(1, Math.ceil(totalItems / POR_PAGINA));
  const paginaReal   = Math.min(pagina, totalPaginas);
  const pagItems     = filtered.slice((paginaReal - 1) * POR_PAGINA, paginaReal * POR_PAGINA);

  const irA = (p) => {
    if (p >= 1 && p <= totalPaginas) {
      setPagina(p);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="label-tiny mb-2">CATÁLOGO COMPLETO</div>
          <h1 className="font-display text-[clamp(2.4rem,5vw,4rem)] uppercase leading-none">
            TODOS LOS<br />
            <span className="text-[var(--accent)]">PRODUCTOS</span>
          </h1>
          <div className="mt-3 text-[var(--muted)] text-[0.9rem]">
            {totalItems} producto{totalItems === 1 ? '' : 's'} en total
          </div>
        </div>
        <div className="flex items-center border-2 border-black">
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPagina(1); }}
            placeholder="FILTRAR..."
            className="px-3 py-2 font-mono text-[0.75rem] tracking-[0.08em] outline-none w-44"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="brutal-card aspect-[3/4] bg-[#ececec] animate-pulse" />
          ))}
        </div>
      ) : pagItems.length === 0 ? (
        <div className="border-2 border-black p-12 text-center">
          <div className="font-display text-2xl mb-2">SIN RESULTADOS</div>
          <div className="text-[var(--muted)] text-[0.9rem]">Intenta con otro término.</div>
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
