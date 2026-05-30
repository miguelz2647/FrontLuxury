import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCategorias } from '../../context/CategoriaContext';

const VISIBLE = 4;

export default function CategoryGrid() {
  const { categorias, loading } = useCategorias();
  const [idx, setIdx] = useState(0);

  if (loading || categorias.length === 0) return null;

  const total   = categorias.length;
  const canPrev = idx > 0;
  const canNext = idx + VISIBLE < total;
  const visible = categorias.slice(idx, idx + VISIBLE);

  return (
    <section className="border-b-2 border-black">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">Categorías</h2>
          <div className="flex items-center gap-3">
            <span className="label-tiny">{total} EN TOTAL</span>
            <div className="flex gap-1">
              <button
                onClick={() => setIdx((i) => i - 1)}
                disabled={!canPrev}
                className="w-9 h-9 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={() => setIdx((i) => i + 1)}
                disabled={!canNext}
                className="w-9 h-9 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {visible.map((c, i) => (
            <Link key={c.id} to={`/categoria/${c.slug}`}
              className="brutal-card aspect-[5/3] flex items-center justify-center group relative overflow-hidden">
              <span className="absolute inset-0 bg-[var(--accent)] -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              <span className="relative font-display tracking-tight text-[1rem] group-hover:text-white">
                {c.nombre.toUpperCase()}
              </span>
              <span className="absolute top-2 left-2 font-mono text-[0.65rem] text-[var(--muted)] group-hover:text-white/70">
                {String(idx + i + 1).padStart(2, '0')}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
