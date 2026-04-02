import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

function getCart() {
  try { return JSON.parse(localStorage.getItem('ss_cart')) || { shopId:null, shopName:'', items:[] }; }
  catch { return { shopId:null, shopName:'', items:[] }; }
}
function saveCart(cart) { localStorage.setItem('ss_cart', JSON.stringify(cart)); }

export default function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(getCart);
  const [form, setForm] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    address: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Keep form in sync if user loads late
  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        email: f.email || user.email || '',
        phone: f.phone || user.phone || ''
      }));
    }
  }, [user]);

  const updateQty = (idx, delta) => {
    const c = { ...cart, items: [...cart.items] };
    c.items[idx] = { ...c.items[idx], quantity: Math.max(1, c.items[idx].quantity + delta) };
    setCart(c); saveCart(c);
  };

  const removeItem = (idx) => {
    const c = { ...cart, items: cart.items.filter((_, i) => i !== idx) };
    if (c.items.length === 0) { c.shopId = null; c.shopName = ''; }
    setCart(c); saveCart(c);
  };

  const clearCart = () => {
    const c = { shopId:null, shopName:'', items:[] };
    setCart(c); saveCart(c);
  };

  const total = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (cart.items.length === 0) return;
    setSubmitting(true);
    try {
      await axios.post('/api/orders', {
        shopId: cart.shopId,
        items: cart.items.map(i => ({
          medicine: i.medicineId,
          name: i.name,
          price: i.price,
          quantity: i.quantity
        })),
        customerEmail: form.email,
        customerPhone: form.phone,
        customerAddress: form.address
      });
      clearCart();
      setSuccess(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit order');
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="cart-page">
        <div className="container cart-body">
          <div className="cart-success">
            <div className="cart-success-icon">🎉</div>
            <h2>Order Placed Successfully!</h2>
            <p>Your order has been submitted. The shop will process it shortly.</p>
            <div style={{display:'flex',gap:12,justifyContent:'center',marginTop:20,flexWrap:'wrap'}}>
              <Link to="/shops" className="btn btn-teal">Continue Shopping</Link>
              <Link to="/patient/dashboard" className="btn btn-outline">My Dashboard</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* Hero */}
      <div className="cart-hero">
        <div className="container">
          <h1>🛒 Shopping Cart</h1>
          <p>
            {cart.items.length > 0
              ? `${cart.items.length} item${cart.items.length > 1 ? 's' : ''} from ${cart.shopName || 'a shop'}`
              : 'Your cart is empty'}
          </p>
        </div>
      </div>

      <div className="container cart-body">
        {cart.items.length === 0 ? (
          <div className="cart-empty">
            <div style={{fontSize:64,marginBottom:16}}>🛒</div>
            <h3>Your cart is empty</h3>
            <p>Browse medical shops and add medicines to your cart.</p>
            <Link to="/shops" className="btn btn-teal" style={{marginTop:16}}>Browse Shops</Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Cart Items */}
            <div className="cart-items">
              <div className="cart-items-header">
                <h3>Cart Items</h3>
                <button className="cart-clear-btn" onClick={clearCart}>🗑️ Clear All</button>
              </div>

              {cart.items.map((item, idx) => (
                <div key={idx} className="cart-item">
                  <div className="cart-item-img">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <span>💊</span>
                    )}
                  </div>
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <div className="cart-item-price">₹{item.price} each</div>
                  </div>
                  <div className="cart-item-qty">
                    <button onClick={() => updateQty(idx, -1)} className="qty-btn">−</button>
                    <span className="qty-val">{item.quantity}</span>
                    <button onClick={() => updateQty(idx, 1)} className="qty-btn">+</button>
                  </div>
                  <div className="cart-item-total">₹{(item.price * item.quantity).toFixed(2)}</div>
                  <button className="cart-item-remove" onClick={() => removeItem(idx)} title="Remove">✕</button>
                </div>
              ))}

              <div className="cart-subtotal">
                <span>Subtotal ({cart.items.reduce((s,i) => s + i.quantity, 0)} items)</span>
                <strong>₹{total.toFixed(2)}</strong>
              </div>
            </div>

            {/* Order Form */}
            <div className="cart-sidebar">
              <div className="card" style={{padding:24}}>
                <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:18,marginBottom:16,paddingBottom:12,borderBottom:'1px solid var(--border)'}}>
                  📦 Delivery Details
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="cart-form-group">
                    <label>Email *</label>
                    <input className="form-input" type="email" required value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="your@email.com" />
                  </div>
                  <div className="cart-form-group">
                    <label>Phone *</label>
                    <input className="form-input" type="tel" required value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} placeholder="9876543210" />
                  </div>
                  <div className="cart-form-group">
                    <label>Delivery Address *</label>
                    <textarea className="form-input" rows={3} required value={form.address} onChange={e => setForm({...form, address:e.target.value})} placeholder="Full address with landmark, city, pin" />
                  </div>

                  <div className="cart-total-box">
                    <div className="cart-total-row">
                      <span>Items</span>
                      <span>{cart.items.reduce((s,i) => s + i.quantity, 0)}</span>
                    </div>
                    <div className="cart-total-row">
                      <span>Shop</span>
                      <span>{cart.shopName}</span>
                    </div>
                    <div className="cart-total-row total">
                      <span>Total</span>
                      <strong>₹{total.toFixed(2)}</strong>
                    </div>
                  </div>

                  {!user && (
                    <div className="alert alert-warning" style={{marginBottom:14,fontSize:13}}>
                      ⚠️ Please <Link to="/login" style={{color:'var(--teal)',fontWeight:600}}>login</Link> to place your order.
                    </div>
                  )}

                  <button type="submit" className="btn btn-teal" style={{width:'100%',justifyContent:'center',padding:'14px',fontSize:15}} disabled={submitting || !user}>
                    {submitting ? '⏳ Placing Order…' : '✅ Place Order'}
                  </button>

                  <p style={{fontSize:11,color:'var(--muted)',textAlign:'center',marginTop:10}}>
                    💳 Cash on Delivery · Your order will be confirmed by the shop
                  </p>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
