import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Paginador({ pagina, totalPaginas, totalItems, irA, hayAnterior, haySiguiente }) {
  if (totalPaginas <= 1) return null;

  // Mostrar máx 5 páginas centradas en la actual
  const rango = [];
  const delta = 2;
  const inicio = Math.max(1, pagina - delta);
  const fin    = Math.min(totalPaginas, pagina + delta);
  for (let i = inicio; i <= fin; i++) rango.push(i);

  return (
    <div className="flex items-center justify-center gap-2 mt-10 pt-8 border-t-2 border-black">
      <button
        onClick={() => irA(pagina - 1)}
        disabled={!hayAnterior}
        className="w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} />
      </button>

      {inicio > 1 && (
        <>
          <button onClick={() => irA(1)} className="w-10 h-10 border-2 border-black font-mono text-[0.82rem] hover:bg-black hover:text-white transition-colors">1</button>
          {inicio > 2 && <span className="font-mono text-[var(--muted)]">…</span>}
        </>
      )}

      {rango.map((p) => (
        <button key={p} onClick={() => irA(p)}
          className={`w-10 h-10 border-2 font-mono text-[0.82rem] transition-colors ${
            p === pagina
              ? 'bg-black text-white border-black'
              : 'border-black hover:bg-black hover:text-white'
          }`}>
          {p}
        </button>
      ))}

      {fin < totalPaginas && (
        <>
          {fin < totalPaginas - 1 && <span className="font-mono text-[var(--muted)]">…</span>}
          <button onClick={() => irA(totalPaginas)} className="w-10 h-10 border-2 border-black font-mono text-[0.82rem] hover:bg-black hover:text-white transition-colors">{totalPaginas}</button>
        </>
      )}

      <button
        onClick={() => irA(pagina + 1)}
        disabled={!haySiguiente}
        className="w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
      >
        <ChevronRight size={16} />
      </button>

      <span className="font-mono text-[0.72rem] text-[var(--muted)] ml-2">
        {totalItems} en total
      </span>
    </div>
  );
}
