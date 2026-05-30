import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { User, Package, MapPin, Lock, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProfileForm  from '../components/account/ProfileForm';
import PasswordForm from '../components/account/PasswordForm';
import AddressesTab from '../components/account/AddressesTab';
import OrdersTab    from '../components/account/OrdersTab';

const TABS = [
  { id: 'profile',   label: 'PERFIL',      Icon: User },
  { id: 'orders',    label: 'MIS PEDIDOS', Icon: Package },
  { id: 'addresses', label: 'DIRECCIONES', Icon: MapPin },
  { id: 'password',  label: 'CONTRASEÑA',  Icon: Lock },
];

export default function Account() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const [tab, setTab]    = useState('profile');

  if (!user) return <Navigate to="/login" replace />;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-12">
      <h1 className="font-display text-[clamp(2rem,4vw,3rem)] uppercase leading-none mb-10">MI CUENTA</h1>
      <div className="grid lg:grid-cols-[280px_1fr] gap-6">

        {/* Sidebar */}
        <aside className="border-2 border-black p-3 self-start">
          {/* Info del usuario */}
          <div className="px-4 py-3 mb-2 border-b border-black/10">
            <div className="font-display text-[0.88rem]">
              {user.Nombres} {user.Apellidos}
            </div>
            <div className="font-mono text-[0.7rem] text-[var(--muted)] mt-0.5">{user.Email}</div>
          </div>
          <ul>
            {TABS.map(({ id, label, Icon }) => (
              <li key={id}>
                <button onClick={() => setTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 font-display text-[0.78rem] tracking-[0.12em] transition-colors ${
                    tab === id ? 'bg-black text-white' : 'hover:bg-black hover:text-white'
                  }`}>
                  <Icon size={14} /> {label}
                </button>
              </li>
            ))}
            <li>
              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 font-display text-[0.78rem] tracking-[0.12em] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-colors">
                <LogOut size={14} /> CERRAR SESIÓN
              </button>
            </li>
          </ul>
        </aside>

        {/* Contenido */}
        <section className="border-2 border-black p-6 lg:p-8">
          {tab === 'profile'   && <ProfileForm />}
          {tab === 'orders'    && <OrdersTab userId={user.Id} />}
          {tab === 'addresses' && <AddressesTab userId={user.Id} />}
          {tab === 'password'  && <PasswordForm />}
        </section>
      </div>
    </div>
  );
}
