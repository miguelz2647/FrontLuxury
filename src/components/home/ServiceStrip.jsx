import React from 'react';
import { Truck, Repeat2, ShieldCheck, Award } from 'lucide-react';

const ITEMS = [
  { Icon: Truck,       t: 'ENVÍO GRATIS',   s: 'En compras superiores a $200,000' },
  { Icon: Repeat2,     t: 'CAMBIOS FÁCILES', s: '30 días para devoluciones' },
  { Icon: ShieldCheck, t: 'PAGO SEGURO',    s: 'Transacciones 100% protegidas' },
  { Icon: Award,       t: 'GARANTÍA',       s: 'Calidad garantizada' },
];

export default function ServiceStrip() {
  return (
    <section className="bg-black text-white">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
        {ITEMS.map(({ Icon, t, s }) => (
          <div key={t} className="text-center">
            <div className="inline-flex w-12 h-12 border-2 border-white items-center justify-center mb-3">
              <Icon size={18} />
            </div>
            <div className="font-display text-[0.85rem] tracking-[0.12em]">{t}</div>
            <div className="text-[0.78rem] text-white/60 mt-1">{s}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
