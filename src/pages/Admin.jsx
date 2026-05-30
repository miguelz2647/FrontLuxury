import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, LogOut, X, Users, BarChart2, Tag, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';
import AdminDashboard  from '../components/admin/AdminDashboard';
import AdminProducts   from '../components/admin/AdminProducts';
import AdminCatalogos  from '../components/admin/AdminCatalogos';

const SECTIONS = [
  { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
  { id: 'products',  label: 'PRODUCTOS', icon: Package },
  { id: 'catalogos', label: 'CATÁLOGOS', icon: Tag },
  { id: 'ordenes',   label: 'ÓRDENES',   icon: ShoppingBag },
  { id: 'usuarios',  label: 'USUARIOS',  icon: Users },
  { id: 'graficas',  label: 'GRÁFICAS',  icon: BarChart2 },
];

export default function Admin() {
  const { user, isAdmin, logout } = useAuth();
  const { products, loading }     = useProducts();
  const navigate                  = useNavigate();
  const [section,  setSection]    = useState('dashboard');
  const [sideOpen, setSideOpen]   = useState(true);

  if (!user || !isAdmin) return <Navigate to="/login" replace />;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex">
      <aside
        className={`${sideOpen ? 'w-56' : 'w-14'} shrink-0 bg-black text-white flex flex-col border-r-2 border-black transition-all duration-200 overflow-hidden`}
        style={{ minHeight: '100vh' }}
      >
        <div className="px-4 py-5 border-b border-white/10 flex items-center justify-between">
          {sideOpen && (
            <span className="font-display text-[1rem] tracking-tight">
              BRUTAL<span className="text-[var(--accent)]">.</span>ADMIN
            </span>
          )}
          <button
            onClick={() => setSideOpen((v) => !v)}
            className="w-7 h-7 border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
          >
            {sideOpen ? <X size={12} /> : <LayoutDashboard size={12} />}
          </button>
        </div>

        <nav className="flex-1 py-4">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setSection(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 font-mono text-[0.7rem] tracking-[0.12em] transition-colors ${
                section === id ? 'bg-[var(--accent)] text-white' : 'hover:bg-white/10'
              }`}>
              <Icon size={15} className="shrink-0" />
              {sideOpen && label}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/10 py-4">
          {sideOpen && (
            <div className="px-4 mb-3">
              <div className="font-mono text-[0.65rem] text-white/40 tracking-[0.1em]">SESIÓN</div>
              <div className="font-display text-[0.82rem] mt-1 truncate">{user.Email}</div>
            </div>
          )}
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 font-mono text-[0.7rem] tracking-[0.12em] text-[var(--accent)] hover:bg-white/10 transition-colors">
            <LogOut size={15} className="shrink-0" />
            {sideOpen && 'CERRAR SESIÓN'}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="bg-white border-b-2 border-black px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="label-tiny">{SECTIONS.find((s) => s.id === section)?.label}</div>
          <a href="/" target="_blank" rel="noreferrer"
            className="label-tiny hover:text-[var(--accent)] transition-colors">
            VER TIENDA →
          </a>
        </div>
        <div className="p-6 lg:p-8">
          {section === 'dashboard' && <AdminDashboard products={products} loading={loading} section="dashboard" />}
          {section === 'ordenes'   && <AdminDashboard products={[]} loading={false} section="ordenes" />}
          {section === 'products'  && <AdminProducts />}
          {section === 'catalogos' && <AdminCatalogos />}
          {section === 'usuarios'  && <AdminDashboard products={[]} loading={false} section="usuarios" />}
          {section === 'graficas'  && <AdminDashboard products={[]} loading={false} section="graficas" />}
        </div>
      </main>
    </div>
  );
}
