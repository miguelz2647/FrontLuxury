import React from 'react';

export default function Hero() {
  return (
    <section className="border-b-2 border-black">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-6 lg:py-10 grid lg:grid-cols-12 gap-8 items-center">

        {/* Texto */}
        <div className="lg:col-span-5 flex flex-col justify-start rise rise-1">
          <div className="label-tiny mb-4">2026 — COLECCIÓN BRUTAL</div>
          <h1 className="font-display text-[clamp(3rem,7vw,6rem)] leading-[0.9] uppercase">
            RAW<br />
            <span className="relative inline-block">
              DESIGN
              <span className="absolute -bottom-3 left-0 right-0 h-3 bg-[var(--accent)] -z-0" />
            </span>
          </h1>
          <p className="mt-6 text-[0.95rem] text-[var(--ink-soft)] max-w-md leading-relaxed">
            Estética brutalista. Funcionalidad máxima. Zapatos diseñados sin compromisos.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
            {[{ k: '12+', v: 'COLECCIONES' }, { k: '4.8', v: 'RATING' }, { k: '10K', v: 'CLIENTES' }].map((s) => (
              <div key={s.k} className="border-l-2 border-black pl-3">
                <div className="font-display text-[1.6rem] leading-none">{s.k}</div>
                <div className="label-tiny mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Imágenes */}
        <div className="lg:col-span-7 rise rise-2">
          <div className="relative grid grid-cols-6 grid-rows-6 gap-2 lg:gap-3 h-[420px] lg:h-[560px]">
            <div className="col-span-3 row-span-6 border-2 border-black overflow-hidden">
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="col-span-3 row-span-3 border-2 border-black overflow-hidden bg-black">
              <img src="https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=900&q=80" alt="" className="w-full h-full object-cover opacity-90" />
            </div>
            <div className="col-span-2 row-span-3 border-2 border-black overflow-hidden">
              <img src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=900&q=80" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="col-span-1 row-span-3 border-2 border-black bg-[var(--accent)] flex items-center justify-center">
              <span className="font-display text-white text-2xl rotate-90 whitespace-nowrap">BRUTAL</span>
            </div>
            <div className="absolute -top-4 left-3 bg-black text-white px-3 py-1 font-mono text-[0.7rem] tracking-[0.18em] border-2 border-black">NEW DROP</div>
            <div className="absolute -bottom-4 right-3 bg-white px-3 py-1 font-mono text-[0.7rem] tracking-[0.18em] border-2 border-black">FROM DUSK TO DAWN</div>
          </div>
        </div>

      </div>
    </section>
  );
}
