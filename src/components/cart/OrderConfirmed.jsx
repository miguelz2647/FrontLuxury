import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

export default function OrderConfirmed({ ordenId }) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex w-16 h-16 border-2 border-[var(--ok)] bg-[var(--ok)]/10 items-center justify-center mb-5">
        <Check size={28} className="text-[var(--ok)]" />
      </div>
      <h2 className="font-display text-[2rem] uppercase mb-3">¡PEDIDO CONFIRMADO!</h2>
      {ordenId && (
        <div className="font-mono text-[0.85rem] text-[var(--muted)] mb-3">
          ORDEN #{ordenId}
        </div>
      )}
      <p className="text-[var(--muted)] mb-8 max-w-md mx-auto">
        Recibimos tu orden. En breve te enviaremos un correo con los detalles de tu compra.
      </p>
      <div className="flex gap-4 justify-center">
        <Link to="/cuenta" className="brutal-btn brutal-btn--ghost">VER MIS PEDIDOS</Link>
        <Link to="/" className="brutal-btn brutal-btn--accent">SEGUIR COMPRANDO</Link>
      </div>
    </div>
  );
}
