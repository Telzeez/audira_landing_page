'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductsGrid from '@/components/ProductsGrid';
import Showcase from '@/components/Showcase';
import CountdownOffer from '@/components/CountdownOffer';
import SpatialAudio from '@/components/SpatialAudio';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import CartDrawer, { CartItem } from '@/components/CartDrawer';
import ProfileDrawer, { RegisteredDevice } from '@/components/ProfileDrawer';

export default function Home() {
  // Cart state management
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Profile and Warranties state management
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [registeredDevices, setRegisteredDevices] = useState<RegisteredDevice[]>([
    { name: 'Audira Q20', serial: '(01)01234567890123' } // Pre-registered device
  ]);

  const handleAddToCart = (newItem: { id: string; name: string; price: number; priceStr: string; image: string }) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === newItem.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...newItem, quantity: 1 }];
    });
    // Auto open cart drawer when adding item
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Register device handler
  const handleRegisterDevice = (name: string, serial: string) => {
    setRegisteredDevices((prev) => [...prev, { name, serial }]);
  };

  // Sum of quantities for cart indicator
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <Navbar 
        cartCount={cartCount} 
        onOpenCart={() => setIsCartOpen(true)} 
        onOpenProfile={() => setIsProfileOpen(true)}
      />
      
      <main style={{ marginTop: '80px' }}>
        <Hero />
        <ProductsGrid onAddToCart={handleAddToCart} />
        <Showcase onAddToBasket={handleAddToCart} />
        <SpatialAudio />
        <CountdownOffer />
        <Testimonials />
      </main>

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        registeredDevices={registeredDevices}
        onRegisterDevice={handleRegisterDevice}
      />
    </>
  );
}
