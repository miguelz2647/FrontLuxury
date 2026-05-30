import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = [
  {
    q: '¿Cuánto tarda el envío?',
    a: 'Los envíos estándar tardan entre 3 y 5 días hábiles a cualquier ciudad de Colombia. Para Bogotá, Medellín y Cali el tiempo promedio es de 2 días hábiles.',
  },
  {
    q: '¿Puedo devolver un producto si no me queda?',
    a: 'Sí. Tienes 30 días calendario desde la fecha de entrega para solicitar un cambio o devolución. El producto debe estar en perfectas condiciones, sin uso y con su empaque original.',
  },
  {
    q: '¿Cómo sé qué talla elegir?',
    a: 'En cada producto encontrarás una guía de tallas con medidas en centímetros. Si estás entre dos tallas, te recomendamos elegir la más grande para mayor comodidad.',
  },
  {
    q: '¿Los productos tienen garantía?',
    a: 'Todos nuestros productos tienen garantía de 6 meses contra defectos de fabricación. Si el producto presenta algún problema por manufactura, lo reemplazamos sin costo adicional.',
  },
  {
    q: '¿Puedo rastrear mi pedido?',
    a: 'Sí. Una vez despachado tu pedido recibirás un número de guía al correo registrado. Con ese número puedes rastrear tu envío directamente en la página de la transportadora.',
  },
];

function FaqItem({ item, idx }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-2 border-black">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#f4f4f4] transition-colors text-left gap-4"
      >
        <span className="font-display text-[0.95rem] uppercase tracking-tight">
          <span className="text-[var(--accent)] mr-3 font-mono text-[0.75rem]">
            {String(idx + 1).padStart(2, '0')}
          </span>
          {item.q}
        </span>
        {open ? <ChevronUp size={16} className="shrink-0" /> : <ChevronDown size={16} className="shrink-0" />}
      </button>
      {open && (
        <div className="border-t-2 border-black px-6 py-4 bg-[#f9f9f9]">
          <p className="text-[0.92rem] leading-relaxed text-[var(--ink-soft)]">{item.a}</p>
        </div>
      )}
    </div>
  );
}

export default function Nosotros() {
  return (
    <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-16">

      {/* Header */}
      <div className="border-b-2 border-black pb-10 mb-14 grid lg:grid-cols-2 gap-10 items-end">
        <div>
          <div className="label-tiny mb-3">2026 — BRUTAL SHOES</div>
          <h1 className="font-display text-[clamp(3rem,6vw,5rem)] uppercase leading-none">
            QUIÉNES<br />
            <span className="text-[var(--accent)]">SOMOS</span>
          </h1>
        </div>
        <p className="text-[1rem] leading-relaxed text-[var(--ink-soft)] max-w-lg">
          Somos una marca colombiana nacida de la convicción de que el calzado no tiene que elegir entre estética y funcionalidad. Diseñamos para quienes se niegan a comprometer.
        </p>
      </div>

      {/* Misión + Visión */}
      <div className="grid md:grid-cols-2 gap-0 border-2 border-black mb-14">
        <div className="p-10 border-b-2 md:border-b-0 md:border-r-2 border-black">
          <div className="label-tiny mb-4 text-[var(--accent)]">01 — MISIÓN</div>
          <h2 className="font-display text-[1.8rem] uppercase leading-none mb-5">Nuestra misión</h2>
          <p className="text-[0.95rem] leading-relaxed text-[var(--ink-soft)]">
            Crear calzado con carácter propio que refleje la personalidad de quien lo usa. Cada par sale de nuestras manos con un propósito: acompañarte sin limitarte, con materiales que duran y un diseño que no pasa de moda porque nunca siguió modas.
          </p>
        </div>
        <div className="p-10">
          <div className="label-tiny mb-4 text-[var(--accent)]">02 — VISIÓN</div>
          <h2 className="font-display text-[1.8rem] uppercase leading-none mb-5">Nuestra visión</h2>
          <p className="text-[0.95rem] leading-relaxed text-[var(--ink-soft)]">
            Ser la marca de calzado más reconocida de Latinoamérica por su honestidad: sin intermediarios innecesarios, sin tendencias vacías, sin materiales baratos. Para 2030 queremos que cada colombiano que valore la autenticidad conozca BRUTAL.
          </p>
        </div>
      </div>

      {/* Valores */}
      <div className="mb-14">
        <h2 className="section-title mb-8">Lo que nos mueve</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { n: '01', t: 'HONESTIDAD', d: 'Precios justos, materiales reales, sin letra pequeña. Lo que ves es lo que recibes.' },
            { n: '02', t: 'DURABILIDAD', d: 'No fabricamos para el descarte. Cada par está construido para sobrevivir años de uso real.' },
            { n: '03', t: 'DISEÑO BRUTAL', d: 'Sin adornos innecesarios. La forma sigue la función, y la función es impecable.' },
          ].map((v) => (
            <div key={v.n} className="border-2 border-black p-8 group hover:bg-black hover:text-white transition-colors duration-300">
              <div className="font-mono text-[0.65rem] tracking-[0.2em] mb-4 text-[var(--accent)]">{v.n}</div>
              <h3 className="font-display text-[1.3rem] uppercase mb-3">{v.t}</h3>
              <p className="text-[0.88rem] leading-relaxed opacity-70">{v.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stat strip */}
      <div className="border-2 border-black grid grid-cols-2 md:grid-cols-4 mb-14">
        {[
          { k: '2019', v: 'AÑO DE FUNDACIÓN' },
          { k: '+10K', v: 'PARES VENDIDOS' },
          { k: '100%', v: 'HECHO EN COLOMBIA' },
          { k: '4.8★', v: 'CALIFICACIÓN PROMEDIO' },
        ].map((s, i) => (
          <div key={s.k} className={`p-8 text-center ${i < 3 ? 'border-b-2 md:border-b-0 md:border-r-2 border-black' : ''}`}>
            <div className="font-display text-[2.2rem] leading-none">{s.k}</div>
            <div className="label-tiny mt-2">{s.v}</div>
          </div>
        ))}
      </div>

      {/* Preguntas frecuentes */}
      <div>
        <h2 className="section-title mb-8">Preguntas frecuentes</h2>
        <div className="grid gap-3">
          {FAQ.map((item, idx) => (
            <FaqItem key={idx} item={item} idx={idx} />
          ))}
        </div>
      </div>

    </div>
  );
}
