'use client';

import { useState, useEffect } from 'react';
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

interface UserProfile {
  name: string;
  email: string;
  points: number;
}

export default function Home() {
  // Cart state management
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Authenticated Profile state management
  const [user, setUser] = useState<UserProfile | null>(null);
  const [registeredDevices, setRegisteredDevices] = useState<RegisteredDevice[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  // Restore user session on mount
  useEffect(() => {
    async function restoreSession() {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser({
              name: data.user.name,
              email: data.user.email,
              points: data.user.points,
            });
            setRegisteredDevices(data.user.registeredDevices || []);
          }
        }
      } catch (err) {
        console.error('Failed to restore auth session:', err);
      } finally {
        setIsLoadingSession(false);
      }
    }
    restoreSession();
  }, []);

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

  // Auth Callbacks
  const handleLoginSuccess = (loggedInUser: UserProfile, devices: RegisteredDevice[]) => {
    setUser(loggedInUser);
    setRegisteredDevices(devices || []);
  };

  const handleLogoutSuccess = () => {
    setUser(null);
    setRegisteredDevices([]);
  };

  const handleRegisterDeviceSuccess = (devices: RegisteredDevice[], points: number) => {
    setRegisteredDevices(devices);
    if (user) {
      setUser({
        ...user,
        points: points,
      });
    }
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
        <CountdownOffer onGetOffer={handleAddToCart} />
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
        user={user}
      />

      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        registeredDevices={registeredDevices}
        onLoginSuccess={handleLoginSuccess}
        onLogoutSuccess={handleLogoutSuccess}
        onRegisterDeviceSuccess={handleRegisterDeviceSuccess}
      />
    </>
  );
}
