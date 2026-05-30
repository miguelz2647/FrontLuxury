import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t-2 border-black">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="font-display text-[1.2rem] mb-4">
            BRUTAL<span className="text-[var(--accent)]">.</span>
          </div>
          <p className="text-white/50 text-[0.85rem] leading-relaxed">
            Diseño brutalista. Calidad sin compromisos.
          </p>
        </div>
        <div>
          <div className="label-tiny mb-4" style={{ color: '#fff', opacity: 0.5 }}>CATEGORÍAS</div>
          <ul className="space-y-2">
            {['Hombre', 'Mujer', 'Niños', 'Deportivos', 'Casual'].map((c) => (
              <li key={c}>
                <Link to={`/categoria/${c.toLowerCase()}`} className="text-white/70 hover:text-white text-[0.85rem] transition-colors">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="label-tiny mb-4" style={{ color: '#fff', opacity: 0.5 }}>AYUDA</div>
          <ul className="space-y-2 text-white/70 text-[0.85rem]">
            <li><Link to="/cuenta" className="hover:text-white transition-colors">Mi cuenta</Link></li>
            <li><span>Devoluciones</span></li>
            <li><span>Guía de tallas</span></li>
            <li><span>Contacto</span></li>
          </ul>
        </div>
        <div>
          <div className="label-tiny mb-4" style={{ color: '#fff', opacity: 0.5 }}>CONTACTO</div>
          <ul className="space-y-2 text-white/70 text-[0.85rem]">
            <li>hola@brutalshoes.com</li>
            <li>+57 300 123 4567</li>
            <li>Bogotá, Colombia</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center font-mono text-[0.7rem] text-white/30 tracking-[0.15em]">
        © 2026 BRUTALSHOES — TODOS LOS DERECHOS RESERVADOS
      </div>
    </footer>
  );
}
