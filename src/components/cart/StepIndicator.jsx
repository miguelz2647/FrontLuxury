import React from 'react';
import { Check } from 'lucide-react';

const STEPS = ['CARRITO', 'DATOS DE ENVÍO', 'PAGO'];

export default function StepIndicator({ current }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div className={`flex items-center gap-2 px-4 py-2 border-2 font-mono text-[0.7rem] tracking-[0.1em] ${
            i === current ? 'bg-black text-white border-black' : 'border-black/30 text-[var(--muted)]'
          }`}>
            <span className={`w-5 h-5 flex items-center justify-center text-[0.65rem] border ${
              i < current ? 'bg-[var(--ok)] border-[var(--ok)] text-white' :
              i === current ? 'border-white' : 'border-black/30'
            }`}>
              {i < current ? <Check size={10} /> : i + 1}
            </span>
            {s}
          </div>
          {i < STEPS.length - 1 && <div className="w-6 h-0.5 bg-black/20" />}
        </React.Fragment>
      ))}
    </div>
  );
}
