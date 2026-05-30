import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import { useProducts } from '../context/ProductsContext';

export default function Search() {
  const [params]              = useSearchParams();
  const q                     = params.get('q') || '';
  const { searchProducts, loading } = useProducts();
  const results               = useMemo(() => searchProducts(q), [searchProducts, q]);

  return (
    <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-12">
      <div className="label-tiny mb-2">RESULTADOS DE BÚSQUEDA</div>
      <h1 className="font-display text-[clamp(2rem,4vw,3rem)] uppercase leading-none">"{q}"</h1>
      <div className="text-[var(--muted)] mt-2">
        {loading ? 'Buscando...' : `${results.length} producto${results.length === 1 ? '' : 's'}`}
      </div>
      <div className="mt-10">
        {!loading && results.length === 0 ? (
          <div className="border-2 border-black p-12 text-center">
            <div className="font-display text-2xl mb-2">SIN RESULTADOS</div>
            <div className="text-[var(--muted)]">Intenta con otra búsqueda.</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {results.map((p) => <ProductCard key={p.Id ?? p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
