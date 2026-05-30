import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';

const formatCOP = (n) => typeof n === 'number' ? '$' + n.toLocaleString('es-CO') : '$0';

export default function CartItem({ item, onSetQty, onRemove }) {
  return (
    <div className="border-2 border-black p-4 flex gap-4 items-center">
      <div className="w-24 h-24 border-2 border-black overflow-hidden bg-[#ececf1] shrink-0">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="label-tiny">{item.brand}</div>
        <Link to={`/producto/${item.id}`} className="font-display text-[0.95rem] hover:text-[var(--accent)] block truncate">
          {item.name}
        </Link>
        <div className="font-mono text-[0.78rem] text-[var(--muted)] mt-1">TALLA {item.size}</div>
      </div>
      <div className="flex items-center border-2 border-black">
        <button onClick={() => onSetQty(item.key, item.qty - 1)} className="w-9 h-9 flex items-center justify-center hover:bg-black hover:text-white transition-colors">
          <Minus size={14} />
        </button>
        <div className="w-10 text-center font-mono">{item.qty}</div>
        <button onClick={() => onSetQty(item.key, item.qty + 1)} className="w-9 h-9 flex items-center justify-center hover:bg-black hover:text-white transition-colors">
          <Plus size={14} />
        </button>
      </div>
      <div className="font-display text-[1rem] w-28 text-right">{formatCOP(item.price * item.qty)}</div>
      <button onClick={() => onRemove(item.key)}
        className="w-9 h-9 border-2 border-black flex items-center justify-center hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white transition-colors"
        aria-label="Eliminar">
        <Trash2 size={14} />
      </button>
    </div>
  );
}
