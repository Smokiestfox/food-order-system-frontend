import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../../stores/cart.store';
import { orderService } from '../../services/order.service';
import styles from './Cart.module.scss';

export default function Cart() {
  const navigate = useNavigate();
  const { items, restaurantId, restaurantName, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();
  
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (!deliveryAddress) {
      setError('Please enter a delivery address');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      await orderService.create({
        restaurant_id: restaurantId!,
        delivery_address: deliveryAddress,
        note,
        payment_method: 'cash',
        items: items.map(item => ({
          menu_item_id: item.menuItem.id,
          quantity: item.quantity,
        })),
      });

      clearCart();
      navigate('/orders');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Your cart is empty</h2>
        <p style={{ marginBottom: '2rem' }}>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/restaurants" className="btn btn--primary">Browse Restaurants</Link>
      </div>
    );
  }

  const subtotal = getTotal();
  const deliveryFee = 15000;
  const total = subtotal + deliveryFee;

  return (
    <div className={styles.cartPage}>
      <div className="container">
        <h1>Your Cart</h1>
        <p className={styles.restaurantName}>Ordering from: <strong>{restaurantName}</strong></p>

        <div className={styles.layout}>
          <div className={styles.itemsSection}>
            {items.map((item) => (
              <div key={item.menuItem.id} className={styles.cartItem}>
                <div className={styles.itemInfo}>
                  <h3>{item.menuItem.name}</h3>
                  <span className={styles.price}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.menuItem.price)}
                  </span>
                </div>
                
                <div className={styles.quantityControls}>
                  <button onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}>+</button>
                </div>
                
                <button className={styles.removeBtn} onClick={() => removeItem(item.menuItem.id)}>
                  ✕
                </button>
              </div>
            ))}
            <button className={styles.clearBtn} onClick={clearCart}>Clear Cart</button>
          </div>

          <div className={styles.checkoutSection}>
            <h2>Checkout</h2>
            
            {error && <div className={styles.errorAlert}>{error}</div>}

            <div className={styles.formGroup}>
              <label htmlFor="address">Delivery Address *</label>
              <textarea 
                id="address" 
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter your full address"
                rows={3}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="note">Order Note (Optional)</label>
              <textarea 
                id="note" 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Any special requests?"
                rows={2}
              />
            </div>

            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Delivery Fee</span>
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(deliveryFee)}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total</span>
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</span>
              </div>
            </div>

            <button 
              className={`btn btn--primary ${styles.checkoutBtn}`} 
              onClick={handleCheckout}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
