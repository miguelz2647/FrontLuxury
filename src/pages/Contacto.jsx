import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, MessageCircle } from 'lucide-react';

export default function Contacto() {
  const [form, setForm]     = useState({ nombre: '', email: '', asunto: '', mensaje: '' });
  const [sent, setSent]     = useState(false);
  const [loading, setLoad]  = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    setLoad(true);
    setTimeout(() => { setSent(true); setLoad(false); }, 800);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-16">

      {/* Header */}
      <div className="border-b-2 border-black pb-10 mb-14">
        <div className="label-tiny mb-3">ESTAMOS PARA AYUDARTE</div>
        <h1 className="font-display text-[clamp(3rem,6vw,5rem)] uppercase leading-none">
          CONTÁCT<span className="text-[var(--accent)]">ANOS</span>
        </h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-0 border-2 border-black mb-14">

        {/* Info de contacto */}
        <div className="p-10 border-b-2 lg:border-b-0 lg:border-r-2 border-black">
          <h2 className="font-display text-[1.4rem] uppercase mb-8">Información de contacto</h2>

          <div className="grid gap-6">
            {[
              { Icon: MapPin,  t: 'DIRECCIÓN',  v: 'Cra 7 #123-45, Bogotá, Colombia' },
              { Icon: Phone,   t: 'TELÉFONO',   v: '+57 (601) 234 5678' },
              { Icon: Mail,    t: 'EMAIL',       v: 'hola@brutalshoes.co' },
              { Icon: Clock,   t: 'HORARIO',     v: 'Lun — Vie: 8am – 6pm · Sáb: 9am – 2pm' },
            ].map(({ Icon, t, v }) => (
              <div key={t} className="flex items-start gap-4">
                <div className="w-10 h-10 border-2 border-black flex items-center justify-center shrink-0">
                  <Icon size={16} />
                </div>
                <div>
                  <div className="label-tiny mb-0.5">{t}</div>
                  <div className="text-[0.92rem]">{v}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Redes */}
          <div className="mt-10 pt-8 border-t-2 border-black">
            <div className="label-tiny mb-4">SÍGUENOS</div>
            <div className="flex gap-3">
              {[
                { Icon: Instagram,      label: '@brutal.shoes' },
                { Icon: Facebook,       label: 'Brutal Shoes' },
                { Icon: MessageCircle,  label: 'WhatsApp' },
              ].map(({ Icon, label }) => (
                <button key={label}
                  className="flex items-center gap-2 border-2 border-black px-4 py-2 font-mono text-[0.68rem] tracking-[0.08em] hover:bg-black hover:text-white transition-colors">
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="p-10">
          <h2 className="font-display text-[1.4rem] uppercase mb-8">Envíanos un mensaje</h2>

          {sent ? (
            <div className="border-2 border-black p-8 text-center">
              <div className="font-display text-[2rem] uppercase mb-3">¡Recibido!</div>
              <p className="text-[0.92rem] text-[var(--ink-soft)]">
                Gracias por escribirnos. Te respondemos en menos de 24 horas hábiles.
              </p>
              <button onClick={() => { setSent(false); setForm({ nombre: '', email: '', asunto: '', mensaje: '' }); }}
                className="brutal-btn brutal-btn--ghost mt-6">
                ENVIAR OTRO
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-tiny block mb-2">NOMBRE *</label>
                  <input required className="brutal-input" value={form.nombre} onChange={set('nombre')} placeholder="Juan García" />
                </div>
                <div>
                  <label className="label-tiny block mb-2">EMAIL *</label>
                  <input required type="email" className="brutal-input" value={form.email} onChange={set('email')} placeholder="juan@ejemplo.com" />
                </div>
              </div>
              <div>
                <label className="label-tiny block mb-2">ASUNTO *</label>
                <input required className="brutal-input" value={form.asunto} onChange={set('asunto')} placeholder="¿En qué te podemos ayudar?" />
              </div>
              <div>
                <label className="label-tiny block mb-2">MENSAJE *</label>
                <textarea required className="brutal-input resize-none" rows={5}
                  value={form.mensaje} onChange={set('mensaje')}
                  placeholder="Cuéntanos tu consulta con el mayor detalle posible..." />
              </div>
              <button disabled={loading} className="brutal-btn brutal-btn--accent mt-2">
                {loading ? 'ENVIANDO...' : 'ENVIAR MENSAJE →'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Mapa placeholder */}
      <div className="border-2 border-black h-64 flex items-center justify-center bg-[#f4f4f4]">
        <div className="text-center">
          <MapPin size={28} className="mx-auto mb-2 opacity-40" />
          <div className="font-display uppercase text-[0.9rem]">Cra 7 #123-45, Bogotá</div>
          <div className="label-tiny mt-1">Ver en Google Maps →</div>
        </div>
      </div>

    </div>
  );
}
