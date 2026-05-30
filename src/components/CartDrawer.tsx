'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './CartDrawer.module.css';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  priceStr: string;
  image: string;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setIsCheckingOut(true);
    
    // Simulate checkout API call
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutSuccess(true);
      onClearCart();
    }, 2000);
  };

  const handleClose = () => {
    onClose();
    // Reset checkout success screen if drawer closed
    if (checkoutSuccess) {
      setTimeout(() => {
        setCheckoutSuccess(false);
      }, 300);
    }
  };

  return (
    <>
      {/* Background Overlay */}
      <div 
        className={`${styles.overlay} ${isOpen ? styles.overlayActive : ''}`} 
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className={`${styles.drawer} ${isOpen ? styles.drawerActive : ''}`}>
        {checkoutSuccess ? (
          /* Checkout Success Screen */
          <div className={styles.successState}>
            <svg 
              className={styles.successIcon}
              xmlns="http://www.w3.org/2000/svg" 
              width="64" 
              height="64" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <h3 className={styles.successTitle}>Order Placed!</h3>
            <p className={styles.successText}>
              Thank you for purchasing from Audira. We've sent a receipt and order confirmation to your email.
            </p>
            <button 
              className="btn-primary" 
              style={{ marginTop: '30px' }}
              onClick={handleClose}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          /* Cart Standard Screen */
          <>
            <div className={styles.header}>
              <h3 className={styles.title}>Your Cart ({cartItems.length})</h3>
              <button className={styles.closeBtn} onClick={handleClose} aria-label="Close cart">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className={styles.body}>
              {cartItems.length === 0 ? (
                <div className={styles.emptyState}>
                  <svg 
                    className={styles.emptyIcon}
                    xmlns="http://www.w3.org/2000/svg" 
                    width="48" 
                    height="48" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  <div className={styles.emptyText}>Your cart is empty</div>
                  <button className="btn-secondary" onClick={handleClose}>Start Exploring</button>
                </div>
              ) : (
                <div className={styles.itemsList}>
                  {cartItems.map((item) => (
                    <div key={item.id} className={styles.item}>
                      <div className={styles.itemImageWrapper}>
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill 
                          sizes="70px" 
                          className={styles.itemImage}
                        />
                      </div>
                      
                      <div className={styles.itemDetails}>
                        <h4 className={styles.itemName}>{item.name}</h4>
                        <div className={styles.itemPrice}>{item.priceStr}</div>
                        
                        <div className={styles.quantityControls}>
                          <button 
                            className={styles.qtyBtn} 
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className={styles.qtyVal}>{item.quantity}</span>
                          <button 
                            className={styles.qtyBtn} 
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button 
                        className={styles.removeBtn} 
                        onClick={() => onRemoveItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Subtotal</span>
                  <span className={styles.summaryVal}>${subtotal.toFixed(2)}</span>
                </div>
                <button 
                  className={`btn-primary ${styles.checkoutBtn}`}
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? (
                    <span>Processing Checkout...</span>
                  ) : (
                    <>
                      <span>Secure Checkout</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
