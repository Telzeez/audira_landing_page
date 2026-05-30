'use client';

import { useState, useEffect } from 'react';
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
  user?: { name: string; email: string } | null;
}

// Validator helpers
const validateLuhn = (cardNumber: string): boolean => {
  const digits = cardNumber.replace(/\s+/g, '').split('').map(Number);
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits[i];
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

const validateExpiry = (expiry: string): boolean => {
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
  const [monthStr, yearStr] = expiry.split('/');
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);
  if (month < 1 || month > 12) return false;
  
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear() % 100; // last two digits of current year
  
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  
  return true;
};

const validateCvc = (cvc: string): boolean => {
  return /^\d{3,4}$/.test(cvc);
};

const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  user,
}: CartDrawerProps) {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'form' | 'success'>('cart');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Pre-fill form when user logs in or step changes
  useEffect(() => {
    if (user && checkoutStep === 'form') {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user, checkoutStep]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = value
      .substring(0, 16)
      .match(/.{1,4}/g)
      ?.join(' ') || value.substring(0, 16);
    
    setFormData((prev) => ({ ...prev, cardNumber: formattedValue }));
    if (formErrors.cardNumber) {
      setFormErrors((prev) => ({ ...prev, cardNumber: '' }));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.substring(0, 4);
    
    let formattedValue = value;
    if (value.length > 2) {
      formattedValue = `${value.substring(0, 2)}/${value.substring(2)}`;
    }
    
    setFormData((prev) => ({ ...prev, expiryDate: formattedValue }));
    if (formErrors.expiryDate) {
      setFormErrors((prev) => ({ ...prev, expiryDate: '' }));
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 4);
    setFormData((prev) => ({ ...prev, cvc: value }));
    if (formErrors.cvc) {
      setFormErrors((prev) => ({ ...prev, cvc: '' }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleCheckoutClick = () => {
    if (cartItems.length === 0) return;
    setCheckoutStep('form');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.address.trim()) errors.address = 'Shipping address is required';
    
    if (!formData.cardNumber.trim()) {
      errors.cardNumber = 'Card number is required';
    } else if (!validateLuhn(formData.cardNumber)) {
      errors.cardNumber = 'Invalid card (Use Luhn-valid card)';
    }
    
    if (!formData.expiryDate.trim()) {
      errors.expiryDate = 'Expiry date is required';
    } else if (!validateExpiry(formData.expiryDate)) {
      errors.expiryDate = 'Invalid expiry (MM/YY)';
    }
    
    if (!formData.cvc.trim()) {
      errors.cvc = 'CVC is required';
    } else if (!validateCvc(formData.cvc)) {
      errors.cvc = 'Must be 3-4 digits';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsCheckingOut(true);
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          address: formData.address,
          items: cartItems.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          subtotal,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrderRef(data.orderRef);
        setCheckoutStep('success');
        onClearCart();
        setFormData({
          name: '',
          email: '',
          address: '',
          cardNumber: '',
          expiryDate: '',
          cvc: '',
        });
      } else {
        const data = await response.json();
        setFormErrors({ general: data.error || 'Failed to place order.' });
      }
    } catch (err) {
      setFormErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Wait for the slide-out animation to finish, then reset step
    setTimeout(() => {
      setCheckoutStep('cart');
      setOrderRef('');
      setFormErrors({});
    }, 400);
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
        {checkoutStep === 'success' ? (
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
              Thank you for purchasing from Audira. We've recorded your purchase.
            </p>
            
            <div className={styles.successOrderRefContainer}>
              <div className={styles.successOrderLabel}>Your Order Reference</div>
              <div className={styles.successOrderRef}>{orderRef}</div>
            </div>
            
            <button 
              className="btn-primary" 
              style={{ marginTop: '20px' }}
              onClick={handleClose}
            >
              Continue Shopping
            </button>
          </div>
        ) : checkoutStep === 'form' ? (
          /* Checkout Form Screen */
          <>
            <div className={styles.header}>
              <button className={styles.backBtn} onClick={() => setCheckoutStep('cart')} aria-label="Go back to cart">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Back</span>
              </button>
              <h3 className={styles.title}>Checkout</h3>
              <button className={styles.closeBtn} onClick={handleClose} aria-label="Close cart">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className={styles.body}>
              {/* Compact Order Summary Box */}
              <div className={styles.orderSummaryBox}>
                <div className={styles.orderSummaryTitle}>Order Summary</div>
                <div className={styles.orderSummaryItems}>
                  {cartItems.map((item) => (
                    <div key={item.id} className={styles.orderSummaryItem}>
                      <span className={styles.orderSummaryName}>
                        {item.name} <span style={{ opacity: 0.6 }}>x{item.quantity}</span>
                      </span>
                      <span className={styles.orderSummaryPrice}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className={styles.orderSummaryTotals}>
                  <div className={styles.orderSummaryRow}>
                    <span>Shipping</span>
                    <span style={{ color: '#52c41a', fontWeight: 600 }}>FREE</span>
                  </div>
                  <div className={styles.orderSummaryTotalRow}>
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Billing / Shipping Details Form */}
              <form onSubmit={handleFormSubmit} className={styles.checkoutForm}>
                {formErrors.general && (
                  <div className={styles.errorMessage} style={{ fontSize: '0.85rem', marginBottom: '8px' }}>
                    {formErrors.general}
                  </div>
                )}
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Full Name</label>
                  <input
                    type="text"
                    className={`${styles.input} ${formErrors.name ? styles.inputError : ''}`}
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                  {formErrors.name && <span className={styles.errorMessage}>{formErrors.name}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Email Address</label>
                  <input
                    type="email"
                    className={`${styles.input} ${formErrors.email ? styles.inputError : ''}`}
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                  {formErrors.email && <span className={styles.errorMessage}>{formErrors.email}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Shipping Address</label>
                  <input
                    type="text"
                    className={`${styles.input} ${formErrors.address ? styles.inputError : ''}`}
                    placeholder="Street, City, State, ZIP"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                  {formErrors.address && <span className={styles.errorMessage}>{formErrors.address}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Card Number</label>
                  <input
                    type="text"
                    className={`${styles.input} ${formErrors.cardNumber ? styles.inputError : ''}`}
                    placeholder="4111 1111 1111 1111 (Mock)"
                    value={formData.cardNumber}
                    onChange={handleCardNumberChange}
                  />
                  {formErrors.cardNumber && <span className={styles.errorMessage}>{formErrors.cardNumber}</span>}
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Expiry (MM/YY)</label>
                    <input
                      type="text"
                      className={`${styles.input} ${formErrors.expiryDate ? styles.inputError : ''}`}
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleExpiryChange}
                    />
                    {formErrors.expiryDate && <span className={styles.errorMessage}>{formErrors.expiryDate}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>CVC</label>
                    <input
                      type="password"
                      className={`${styles.input} ${formErrors.cvc ? styles.inputError : ''}`}
                      placeholder="123"
                      value={formData.cvc}
                      onChange={handleCvcChange}
                    />
                    {formErrors.cvc && <span className={styles.errorMessage}>{formErrors.cvc}</span>}
                  </div>
                </div>

                <button 
                  type="submit" 
                  className={`btn-primary ${styles.checkoutBtn}`}
                  style={{ marginTop: '10px' }}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? (
                    <span>Placing Order...</span>
                  ) : (
                    <>
                      <span>Pay ${subtotal.toFixed(2)}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </>
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
                  onClick={handleCheckoutClick}
                >
                  <>
                    <span>Secure Checkout</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
