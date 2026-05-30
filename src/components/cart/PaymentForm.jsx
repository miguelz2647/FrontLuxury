import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Landmark } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { EnvioAPI, OrdenAPI, OrdenDetalleAPI, PagoAPI, DireccionAPI } from '../../services/api';

const formatCOP = (n) => typeof n === 'number' ? '$' + n.toLocaleString('es-CO') : '$0';

// Helper: la API devuelve camelCase, por eso leemos id ?? Id
const gId = (o) => o?.id ?? o?.Id ?? 0;

export default function PaymentForm({ total, shippingCost, items, shippingData, onBack, onConfirm }) {
  const { user }              = useAuth();
  const [method,  setMethod]  = useState('card');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [card,    setCard]    = useState({ numero: '', nombre: '', expiry: '', cvv: '' });
  const setC = (k) => (e) => setCard((f) => ({ ...f, [k]: e.target.value }));

  const formatCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExp  = (v) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d; };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let idDireccion = shippingData.Id_Direccion ?? 0;

      // Si no tiene dirección guardada, crear una nueva y obtener su id
      if (!idDireccion && user?.Id) {
        try {
          const nuevaDireccion = await DireccionAPI.crear({
            Id_Usuario:   user.Id,
            Direccion:    shippingData.direccion   || 'Sin dirección',
            Ciudad:       shippingData.ciudad      || 'Sin ciudad',
            Departamento: shippingData.departamento|| 'Sin departamento',
            Pais:         'Colombia',
            CodigoPostal: Number(shippingData.codigoPostal) || 0,
            Referencia:   shippingData.referencia  || '',
          });
          idDireccion = gId(nuevaDireccion);
        } catch { idDireccion = 0; }
      }

      // Si aún no hay idDireccion válido, verificar que el usuario esté logueado.
      // Sin dirección la API rechaza el envío.
      if (!idDireccion) {
        throw new Error('No se encontró una dirección de envío válida. Por favor inicia sesión o agrega una dirección.');
      }

      // 1. Crear envío
      const fechaSalida  = new Date();
      const fechaEntrada = new Date();
      fechaEntrada.setDate(fechaEntrada.getDate() + 5);

      const envio = await EnvioAPI.crear({
        Id_Direccion:  idDireccion,
        Fecha_Salida:  fechaSalida.toISOString(),
        Fecha_Entrada: fechaEntrada.toISOString(),
        Costo_Envio:   shippingCost,
        Estado_Envio:  'pendiente',
      });

      const envioId = gId(envio);

      // 2. Crear orden
      const orden = await OrdenAPI.crear({
        Id_Usuario: user?.Id || 0,
        Id_Envio:   envioId,
        Valor_Neto: total,
      });

      const ordenId = gId(orden);

      // 3. Crear detalles de orden
      await Promise.all(
        items.map((item) =>
          OrdenDetalleAPI.crear({
            Id_Orden:              ordenId,
            Id_Producto:           item.id,
            Cantidad:              item.qty,
            PrecioUnitario:        item.price,
            Subtotal:              item.price * item.qty,
            Id_Producto_Variacion: item.variacionId || null,
          })
        )
      );

      // 4. Crear pago
      await PagoAPI.crear({
        Id_Orden:        ordenId,
        Metodo_Pago:     method === 'card' ? 'Tarjeta' : 'Transferencia',
        Estado:          'pendiente',
        Referencia_Pago: method === 'card'
          ? `****${card.numero.replace(/\s/g, '').slice(-4)}`
          : 'Transferencia bancaria',
      });

      onConfirm(ordenId);
    } catch (err) {
      setError(err.message || 'Error al procesar el pago. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-5">
      <h2 className="font-display text-[1.1rem] uppercase tracking-[0.05em] pb-3 border-b-2 border-black">
        Método de pago
      </h2>

      {/* Selector método */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { id: 'card',     label: 'TARJETA',       Icon: CreditCard },
          { id: 'transfer', label: 'TRANSFERENCIA', Icon: Landmark },
        ].map(({ id, label, Icon }) => (
          <button key={id} type="button" onClick={() => setMethod(id)}
            className={`flex items-center gap-3 border-2 px-4 py-3 font-mono text-[0.75rem] tracking-[0.1em] transition-all ${
              method === id ? 'bg-black border-black text-white' : 'border-black hover:bg-black hover:text-white'
            }`}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {/* Tarjeta */}
      {method === 'card' && (
        <div className="grid gap-4 border-2 border-black p-5">
          <div>
            <label className="label-tiny block mb-2">NÚMERO DE TARJETA *</label>
            <input required className="brutal-input font-mono tracking-widest" maxLength={19}
              value={card.numero}
              onChange={(e) => setC('numero')({ target: { value: formatCard(e.target.value) } })}
              placeholder="1234 5678 9012 3456" />
          </div>
          <div>
            <label className="label-tiny block mb-2">NOMBRE EN LA TARJETA *</label>
            <input required className="brutal-input" value={card.nombre} onChange={setC('nombre')} placeholder="JUAN GARCIA" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-tiny block mb-2">VENCIMIENTO *</label>
              <input required className="brutal-input font-mono" maxLength={5}
                value={card.expiry}
                onChange={(e) => setC('expiry')({ target: { value: formatExp(e.target.value) } })}
                placeholder="MM/AA" />
            </div>
            <div>
              <label className="label-tiny block mb-2">CVV *</label>
              <input required className="brutal-input font-mono" type="password" maxLength={4}
                value={card.cvv} onChange={setC('cvv')} placeholder="123" />
            </div>
          </div>
        </div>
      )}

      {/* Transferencia */}
      {method === 'transfer' && (
        <div className="border-2 border-black p-5 grid gap-3">
          <div className="label-tiny">DATOS BANCARIOS</div>
          <div className="font-mono text-[0.85rem] grid gap-1">
            <div><span className="text-[var(--muted)]">Banco:</span> Bancolombia</div>
            <div><span className="text-[var(--muted)]">Cuenta:</span> 123-456789-00</div>
            <div><span className="text-[var(--muted)]">Tipo:</span> Ahorros</div>
            <div><span className="text-[var(--muted)]">NIT:</span> 900.123.456-7</div>
          </div>
          <div className="text-[0.85rem] text-[var(--muted)] border-t border-black/20 pt-3">
            Envía el comprobante a <strong>pagos@brutalshoes.com</strong> con el número de pedido.
          </div>
        </div>
      )}

      {/* Resumen */}
      <div className="border-2 border-black p-4 grid gap-2 text-[0.9rem]">
        <div className="flex justify-between">
          <span className="text-[var(--muted)]">Envío</span>
          <span className="font-mono">{shippingCost === 0 ? 'GRATIS' : formatCOP(shippingCost)}</span>
        </div>
        <div className="flex justify-between border-t border-black/20 pt-2 mt-1">
          <span className="font-display uppercase">TOTAL A PAGAR</span>
          <span className="font-display text-[1.2rem]">{formatCOP(total)}</span>
        </div>
      </div>

      {error && (
        <div className="border-2 border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] px-4 py-3 font-mono text-[0.85rem]">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="brutal-btn brutal-btn--ghost flex items-center gap-2">
          <ArrowLeft size={14} /> VOLVER
        </button>
        <button type="submit" disabled={loading} className="brutal-btn brutal-btn--accent flex-1">
          {loading ? 'PROCESANDO...' : `PAGAR ${formatCOP(total)}`}
        </button>
      </div>
    </form>
  );
}
