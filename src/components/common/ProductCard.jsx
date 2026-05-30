import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const formatCOP = (n) => typeof n === 'number' ? '$' + n.toLocaleString('es-CO') : '$0';

export default function ProductCard({ product: p, variant = 'default' }) {
  // Soporta tanto la API real (campos con mayúscula) como datos locales
  const id       = p.Id    ?? p.id;
  const nombre   = p.Nombre ?? p.name;
  const marca    = p.NombreMarca ?? p.brand;
  const precio   = p.Precio ?? p.price;
  const precioAnt = p.PrecioAnterior ?? p.oldPrice;
  const rating   = p.CalificacionPromedio ?? p.rating ?? 0;
  const reviews  = p.TotalOpiniones ?? p.reviews ?? 0;
  const tags     = typeof p.Tags === 'string'
    ? p.Tags.split(',').map((t) => t.trim())
    : (p.tags || []);
  const imagen   = p.Imagenes?.find((i) => i.Principal)?.Url_Imagen
    || p.Imagenes?.[0]?.Url_Imagen
    || p.image || '';

  const discount = precioAnt
    ? Math.round(((precioAnt - precio) / precioAnt) * 100)
    : null;

  return (
    <Link to={`/producto/${id}`} className="brutal-card flex flex-col group">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#ececf1]">
        {imagen && (
          <img src={imagen} alt={nombre} loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        )}
        {tags.includes('new') && variant !== 'sale' && (
          <span className="absolute top-3 right-3 bg-[var(--accent)] text-white font-mono text-[0.65rem] tracking-[0.12em] px-2 py-1 border-2 border-black">
            NUEVO
          </span>
        )}
        {discount && variant === 'sale' && (
          <span className="absolute top-3 left-3 bg-black text-white font-mono text-[0.7rem] font-bold px-2 py-1">
            -{discount}%
          </span>
        )}
      </div>
      <div className="p-4 border-t-2 border-black flex-1 flex flex-col">
        <h3 className="font-display text-[0.92rem] tracking-tight">{nombre}</h3>
        <div className="label-tiny mt-1">{marca}</div>
        {variant !== 'sale' && rating > 0 && (
          <div className="flex items-center gap-1.5 mt-2">
            <Star size={12} fill="currentColor" />
            <span className="font-mono text-[0.78rem]">{Number(rating).toFixed(1)}</span>
            <span className="font-mono text-[0.7rem] text-[var(--muted)]">({reviews})</span>
          </div>
        )}
        <div className="mt-auto pt-3 flex items-baseline gap-2">
          {precioAnt && (
            <span className="font-mono text-[0.78rem] text-[var(--muted)] line-through">{formatCOP(precioAnt)}</span>
          )}
          <span className="font-display text-[1.05rem]">{formatCOP(precio)}</span>
        </div>
      </div>
    </Link>
  );
}
