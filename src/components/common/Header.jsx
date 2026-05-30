import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X, Settings, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useCategorias } from '../../context/CategoriaContext';
import { MarcaAPI } from '../../services/api';

export default function Header() {
  const { count }         = useCart();
  const { user, isAdmin } = useAuth();
  const { categorias }    = useCategorias();
  const nav               = useNavigate();

  const [q,        setQ]       = useState('');
  const [menuOpen, setMenu]    = useState(false);
  const [catOpen,  setCatOpen] = useState(false);
  const [marcaOpen,setMarcaOpen] = useState(false);
  const [marcas,   setMarcas]  = useState([]);

  const catRef   = useRef(null);
  const marcaRef = useRef(null);

  useEffect(() => {
    MarcaAPI.todos()
      .then((data) => setMarcas(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Cerrar dropdowns al click fuera
  useEffect(() => {
    const h = (e) => {
      if (catRef.current   && !catRef.current.contains(e.target))   setCatOpen(false);
      if (marcaRef.current && !marcaRef.current.contains(e.target)) setMarcaOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (q.trim()) { nav(`/buscar?q=${encodeURIComponent(q.trim())}`); setQ(''); setMenu(false); }
  };

  const Dropdown = ({ label, items, open, setOpen, refEl, onSelect, nameKey = 'nombre' }) => (
    <div className="relative" ref={refEl}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-4 h-10 border-2 border-black font-mono text-[0.68rem] tracking-[0.1em] hover:bg-black hover:text-white transition-colors whitespace-nowrap"
      >
        {label}
        <ChevronDown size={13} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border-2 border-black z-50 min-w-[180px] shadow-[4px_4px_0_0_black]">
          {items.length === 0 && (
            <div className="px-4 py-3 font-mono text-[0.75rem] text-[var(--muted)]">Sin registros</div>
          )}
          {items.map((item) => {
            const id     = item.id     ?? item.Id;
            const nombre = item[nameKey] ?? item.Nombre ?? item.nombre ?? '';
            return (
              <button
                key={id}
                onClick={() => { setOpen(false); onSelect(item); }}
                className="w-full text-left px-4 py-2.5 font-mono text-[0.72rem] tracking-[0.1em] uppercase hover:bg-black hover:text-white transition-colors border-b border-black/10 last:border-0"
              >
                {nombre}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-black">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-8 flex items-center h-16 gap-4">

        {/* Logo */}
        <Link to="/" className="font-display text-[1.4rem] tracking-[-0.03em] uppercase shrink-0">
          BRUTAL<span className="text-[var(--accent)]">.</span>
        </Link>

        {/* Nav central — centrado */}
        <nav className="hidden lg:flex items-center gap-3 flex-1 justify-center">
          <Dropdown
            label="CATEGORÍA"
            items={categorias}
            open={catOpen}
            setOpen={setCatOpen}
            refEl={catRef}
            onSelect={(c) => nav(`/categoria/${c.slug}`)}
          />
          <Dropdown
            label="MARCA"
            items={marcas}
            open={marcaOpen}
            setOpen={setMarcaOpen}
            refEl={marcaRef}
            onSelect={(m) => nav(`/marca/${encodeURIComponent(m.Nombre ?? m.nombre ?? '')}`)}
          />
          <Link to="/todos"
            className="px-4 h-10 flex items-center border-2 border-black font-mono text-[0.68rem] tracking-[0.1em] hover:bg-black hover:text-white transition-colors whitespace-nowrap">
            TODOS
          </Link>
          <Link to="/nosotros"
            className="px-4 h-10 flex items-center border-2 border-black font-mono text-[0.68rem] tracking-[0.1em] hover:bg-black hover:text-white transition-colors whitespace-nowrap">
            NOSOTROS
          </Link>
          <Link to="/contacto"
            className="px-4 h-10 flex items-center border-2 border-black font-mono text-[0.68rem] tracking-[0.1em] hover:bg-black hover:text-white transition-colors whitespace-nowrap">
            CONTACTO
          </Link>
        </nav>

        {/* Derecha */}
        <div className="flex items-center gap-2 shrink-0 ml-auto lg:ml-0">
          <form onSubmit={handleSearch} className="hidden md:flex items-center border-2 border-black">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="BUSCAR..."
              className="px-3 py-2 font-mono text-[0.75rem] tracking-[0.08em] outline-none w-36" />
            <button type="submit" className="w-10 h-10 flex items-center justify-center hover:bg-black hover:text-white transition-colors border-l-2 border-black">
              <Search size={15} />
            </button>
          </form>

          {isAdmin && (
            <Link to="/admin" className="hidden md:flex items-center gap-1.5 px-3 h-10 border-2 border-[var(--accent)] text-[var(--accent)] font-mono text-[0.65rem] tracking-[0.1em] hover:bg-[var(--accent)] hover:text-white transition-colors">
              <Settings size={13} /> ADMIN
            </Link>
          )}

          <Link to={user ? '/cuenta' : '/login'}
            className="w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
            aria-label="Cuenta">
            <User size={16} />
          </Link>

          <Link to="/carrito"
            className="w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors relative"
            aria-label="Carrito">
            <ShoppingBag size={16} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-[var(--accent)] text-white font-mono text-[0.6rem] w-5 h-5 flex items-center justify-center border-2 border-black">
                {count}
              </span>
            )}
          </Link>

          <button onClick={() => setMenu(!menuOpen)}
            className="lg:hidden w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
            aria-label="Menú">
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="lg:hidden border-t-2 border-black bg-white">
          <form onSubmit={handleSearch} className="flex items-center border-b-2 border-black">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="BUSCAR..."
              className="flex-1 px-5 py-3 font-mono text-[0.78rem] tracking-[0.08em] outline-none" />
            <button type="submit" className="px-4 py-3 border-l-2 border-black"><Search size={15} /></button>
          </form>
          {isAdmin && (
            <Link to="/admin" onClick={() => setMenu(false)}
              className="flex items-center gap-2 px-5 py-3 label-tiny border-b-2 border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-colors">
              <Settings size={12} /> PANEL ADMIN
            </Link>
          )}
          <Link to="/nosotros" onClick={() => setMenu(false)}
            className="block px-5 py-3 label-tiny border-b border-black/10 hover:bg-black hover:text-white transition-colors">
            NOSOTROS
          </Link>
          <Link to="/todos" onClick={() => setMenu(false)}
            className="block px-5 py-3 label-tiny border-b border-black/10 hover:bg-black hover:text-white transition-colors">
            TODOS LOS PRODUCTOS
          </Link>
          <Link to="/contacto" onClick={() => setMenu(false)}
            className="block px-5 py-3 label-tiny border-b border-black/10 hover:bg-black hover:text-white transition-colors">
            CONTACTO
          </Link>
          <div className="px-5 py-2 label-tiny text-[var(--muted)] border-b border-black/20">CATEGORÍAS</div>
          {categorias.map((c) => (
            <Link key={c.id} to={`/categoria/${c.slug}`} onClick={() => setMenu(false)}
              className="block px-5 py-3 label-tiny border-b border-black/10 hover:bg-black hover:text-white transition-colors">
              {c.nombre.toUpperCase()}
            </Link>
          ))}
          {marcas.length > 0 && (
            <>
              <div className="px-5 py-2 label-tiny text-[var(--muted)] border-b border-black/20 mt-1">MARCAS</div>
              {marcas.map((m) => (
                <div key={m.Id ?? m.id} className="block px-5 py-3 label-tiny border-b border-black/10">
                  {(m.Nombre ?? m.nombre ?? '').toUpperCase()}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </header>
  );
}
