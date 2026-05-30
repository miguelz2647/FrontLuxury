import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MarcaAPI } from '../../services/api';

const VISIBLE = 4;

export default function MarcaGrid() {
  const [marcas,  setMarcas]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [idx,     setIdx]     = useState(0);

  useEffect(() => {
    MarcaAPI.todos()
      .then((data) => setMarcas(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || marcas.length === 0) return null;

  const total   = marcas.length;
  const canPrev = idx > 0;
  const canNext = idx + VISIBLE < total;
  const visible = marcas.slice(idx, idx + VISIBLE);

  return (
    <section className="border-b-2 border-black">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">Marcas</h2>
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
          {visible.map((m, i) => {
            const id     = m.Id     ?? m.id;
            const nombre = m.Nombre ?? m.nombre ?? '';
            return (
              <div key={id}
                className="brutal-card aspect-[5/3] flex items-center justify-center group relative overflow-hidden cursor-default">
                <span className="absolute inset-0 bg-black -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                <span className="relative font-display tracking-tight text-[1rem] group-hover:text-white">
                  {nombre.toUpperCase()}
                </span>
                <span className="absolute top-2 left-2 font-mono text-[0.65rem] text-[var(--muted)] group-hover:text-white/70">
                  {String(idx + i + 1).padStart(2, '0')}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
