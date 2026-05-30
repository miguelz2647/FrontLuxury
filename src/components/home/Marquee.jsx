import React from 'react';

export default function Marquee() {
  return (
    <div className="bg-black text-white py-3 overflow-hidden border-b-2 border-black">
      <div className="brutal-marquee font-display text-[0.85rem] tracking-[0.18em]">
        {Array.from({ length: 2 }).map((_, i) => (
          <React.Fragment key={i}>
            <span>★ ENVÍO GRATIS DESDE $200,000</span>
            <span>★ DEVOLUCIONES EN 30 DÍAS</span>
            <span>★ HECHO PARA DURAR</span>
            <span>★ ESTÉTICA BRUTAL</span>
            <span>★ FUNCIONALIDAD MÁXIMA</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
