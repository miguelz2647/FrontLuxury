import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../common/ProductCard';

function Skeleton() {
  return <div className="brutal-card aspect-[3/4] bg-[#ececec] animate-pulse" />;
}

export default function ProductSection({ title, products, linkTo, linkLabel, variant, bg, loading }) {
  const isAccent = bg === 'bg-[var(--accent)]';
  return (
    <section className={`border-b-2 border-black ${bg || ''}`}>
      <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-14">
        <div className="flex items-end justify-between mb-8">
          <h2 className={`section-title ${isAccent ? 'text-white' : ''}`}>{title}</h2>
          {linkTo && (
            <Link to={linkTo} className="label-tiny hover:text-[var(--accent)]">{linkLabel} →</Link>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />)
            : products.map((p) => <ProductCard key={p.Id ?? p.id} product={p} variant={variant} />)
          }
        </div>
      </div>
    </section>
  );
}
