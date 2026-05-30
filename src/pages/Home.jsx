import React, { useMemo } from 'react';
import Hero           from '../components/home/Hero';
import Marquee        from '../components/home/Marquee';
import CategoryGrid   from '../components/home/CategoryGrid';
import MarcaGrid      from '../components/home/MarcaGrid';
import ProductSection from '../components/home/ProductSection';
import ServiceStrip   from '../components/home/ServiceStrip';
import { useProducts } from '../context/ProductsContext';

export default function Home() {
  const { getProducts, loading } = useProducts();

  const featured = useMemo(() => getProducts({ tag: 'featured' }), [getProducts]);
  const news     = useMemo(() => getProducts({ tag: 'new' }),      [getProducts]);
  const sales    = useMemo(() => getProducts({ tag: 'sale' }),     [getProducts]);

  return (
    <div>
      <Hero />
      <Marquee />
      <CategoryGrid />
      <MarcaGrid />
      {!loading && featured.length > 0 && (
        <ProductSection title="Destacados" products={featured.slice(0, 4)}
          linkTo="/todos" linkLabel="VER TODOS" bg="bg-[#f4f4f4]" />
      )}
      {!loading && news.length > 0 && (
        <ProductSection title="Nuevos" products={news.slice(0, 4)} />
      )}
      {!loading && sales.length > 0 && (
        <ProductSection title="Ofertas" products={sales}
          bg="bg-[var(--accent)]" variant="sale" />
      )}
      {loading && (
        <div className="border-b-2 border-black py-24 text-center">
          <div className="font-mono text-[0.85rem] tracking-[0.15em] text-[var(--muted)]">
            CARGANDO PRODUCTOS...
          </div>
        </div>
      )}
      <ServiceStrip />
    </div>
  );
}
