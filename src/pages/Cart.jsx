import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import StepIndicator  from '../components/cart/StepIndicator';
import CartItem       from '../components/cart/CartItem';
import OrderSummary   from '../components/cart/OrderSummary';
import ShippingForm   from '../components/cart/ShippingForm';
import PaymentForm    from '../components/cart/PaymentForm';
import OrderConfirmed from '../components/cart/OrderConfirmed';

const formatCOP = (n) => typeof n === 'number' ? '$' + n.toLocaleString('es-CO') : '$0';

export default function Cart() {
  const { items, subtotal, setQty, removeItem, clear } = useCart();
  const [step,         setStep]         = useState(0);
  const [shippingData, setShippingData] = useState(null);
  const [ordenId,      setOrdenId]      = useState(null);
  const [confirmed,    setConfirmed]    = useState(false);

  const shippingCost = subtotal >= 200000 ? 0 : 15000;
  const total        = subtotal + shippingCost;

  const handleConfirm = (id) => {
    clear();
    setOrdenId(id);
    setConfirmed(true);
  };

  // Carrito vacío
  if (items.length === 0 && !confirmed) {
    return (
      <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-24 text-center">
        <div className="inline-flex w-16 h-16 border-2 border-black items-center justify-center mb-5">
          <ShoppingBag size={24} />
        </div>
        <h1 className="font-display text-[2rem] uppercase">Tu carrito está vacío</h1>
        <p className="text-[var(--muted)] mt-2">Agrega productos para comenzar tu compra</p>
        <Link to="/" className="brutal-btn brutal-btn--accent mt-8 inline-flex">CONTINUAR COMPRANDO</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-12">
      {!confirmed && <StepIndicator current={step} />}
      {confirmed  && <OrderConfirmed ordenId={ordenId} />}

      {/* Paso 0 — Carrito */}
      {!confirmed && step === 0 && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-end justify-between mb-2">
              <h1 className="font-display text-[clamp(2rem,4vw,3rem)] uppercase leading-none">CARRITO</h1>
              <button onClick={clear} className="label-tiny hover:text-[var(--accent)] flex items-center gap-1">
                <Trash2 size={12} /> VACIAR
              </button>
            </div>
            {items.map((item) => (
              <CartItem key={item.key} item={item} onSetQty={setQty} onRemove={removeItem} />
            ))}
          </div>
          <aside>
            <div className="border-2 border-black p-6 sticky top-[88px]">
              <h2 className="font-display text-[1.05rem] tracking-[0.05em] uppercase mb-5 pb-3 border-b-2 border-black">
                Resumen
              </h2>
              <div className="space-y-3 text-[0.92rem]">
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Subtotal</span>
                  <span className="font-mono">{formatCOP(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Envío</span>
                  <span className="font-mono">{shippingCost === 0 ? 'GRATIS' : formatCOP(shippingCost)}</span>
                </div>
              </div>
              <div className="border-t-2 border-black mt-5 pt-5 flex justify-between items-baseline">
                <span className="font-display uppercase tracking-[0.05em]">Total</span>
                <span className="font-display text-[1.6rem]">{formatCOP(total)}</span>
              </div>
              <button onClick={() => setStep(1)} className="brutal-btn brutal-btn--accent w-full mt-6">
                CONTINUAR →
              </button>
              <Link to="/" className="brutal-btn brutal-btn--ghost w-full mt-3">SEGUIR COMPRANDO</Link>
            </div>
          </aside>
        </div>
      )}

      {/* Paso 1 — Datos de envío */}
      {!confirmed && step === 1 && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ShippingForm onNext={(data) => { setShippingData(data); setStep(2); }} />
          </div>
          <aside>
            <OrderSummary items={items} subtotal={subtotal} shippingCost={shippingCost} total={total} />
          </aside>
        </div>
      )}

      {/* Paso 2 — Pago */}
      {!confirmed && step === 2 && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PaymentForm
              total={total}
              shippingCost={shippingCost}
              items={items}
              shippingData={shippingData}
              onBack={() => setStep(1)}
              onConfirm={handleConfirm}
            />
          </div>
          <aside>
            <OrderSummary items={items} subtotal={subtotal} shippingCost={shippingCost} total={total} />
          </aside>
        </div>
      )}
    </div>
  );
}
