import React from 'react';

const formatCOP = (n) => typeof n === 'number' ? '$' + n.toLocaleString('es-CO') : '$0';

export default function OrderSummary({ items, subtotal, shippingCost, total }) {
  return (
    <div className="border-2 border-black p-5 sticky top-[88px]">
      <div className="label-tiny mb-4">RESUMEN DE PEDIDO</div>
      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={item.key} className="flex gap-3 items-center">
            <div className="w-12 h-12 border border-black overflow-hidden bg-[#ececf1] shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display text-[0.78rem] truncate">{item.name}</div>
              <div className="font-mono text-[0.68rem] text-[var(--muted)]">T{item.size} × {item.qty}</div>
            </div>
            <div className="font-mono text-[0.8rem] shrink-0">{formatCOP(item.price * item.qty)}</div>
          </div>
        ))}
      </div>
      <div className="border-t-2 border-black pt-3 space-y-2 text-[0.88rem]">
        <div className="flex justify-between">
          <span className="text-[var(--muted)]">Subtotal</span>
          <span className="font-mono">{formatCOP(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--muted)]">Envío</span>
          <span className="font-mono">{shippingCost === 0 ? 'GRATIS' : formatCOP(shippingCost)}</span>
        </div>
        <div className="flex justify-between border-t border-black/20 pt-2 mt-1">
          <span className="font-display uppercase text-[0.85rem]">Total</span>
          <span className="font-display text-[1.1rem]">{formatCOP(total)}</span>
        </div>
      </div>
    </div>
  );
}
