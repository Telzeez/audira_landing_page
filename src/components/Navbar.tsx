'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

// The supported locales from your i18n config (keep in sync with src/i18n/routing.ts)
const SUPPORTED_LOCALES = ['en', 'fr', 'de']; // 'jp' is not in routing, will show toast

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenProfile: () => void;
}

export default function Navbar({ cartCount, onOpenCart, onOpenProfile }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname(); // e.g., "/en/products" or "/fr"
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Derive current locale from pathname
  const currentLocale = pathname.split('/')[1] || 'en'; // fallback to 'en'
  const displayLang = currentLocale.toUpperCase();
useEffect(() => {
  console.log('isLangOpen changed to:', isLangOpen);
}, [isLangOpen]);
  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper to change language
    // Helper to change language
  const switchToLocale = (locale: string) => {
    // Check if the locale is actually supported in your routing
    if (!SUPPORTED_LOCALES.includes(locale)) {
      // Show coming soon toast for unsupported locales (like JP)
      const fullNames: Record<string, string> = { fr: 'French', de: 'German', jp: 'Japanese' };
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      setToastMessage(`Coming Soon: ${fullNames[locale] || locale.toUpperCase()} translation is under development.`);
      toastTimerRef.current = setTimeout(() => setToastMessage(null), 4000);
      setIsLangOpen(false);
      return;
    }

    // If locale is supported, set cookie and redirect
    // 1. Set cookie with max-age 1 year
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    
    // 2. Build new path: replace the first segment of the pathname with the new locale
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0 && SUPPORTED_LOCALES.includes(segments[0])) {
      segments[0] = locale;
    } else {
      segments.unshift(locale);
    }
    const newPath = '/' + segments.join('/');
    router.push(newPath);
    setIsLangOpen(false);
  };
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleLang = () => setIsLangOpen(!isLangOpen);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        const offsetPosition = element.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.logo} onClick={() => scrollToSection('home')} style={{ cursor: 'pointer' }}>
        Audira<span className={styles.logoDot}>.</span>
      </div>

      <ul className={`${styles.navLinks} ${isMenuOpen ? styles.navLinksActive : ''}`}>
        <li className={styles.navLink} onClick={() => scrollToSection('home')}>Home</li>
        <li className={styles.navLink} onClick={() => scrollToSection('products-catalog')}>Products</li>
        <li className={styles.navLink} onClick={() => scrollToSection('technology-spatial')}>Technology</li>
        <li className={styles.navLink} onClick={() => scrollToSection('support-footer')}>Support</li>
      </ul>

      <div className={styles.actions}>
        <div className={styles.langSelector} onClick={toggleLang}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span>{displayLang}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: isLangOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>

          <div className={`${styles.langDropdown} ${isLangOpen ? styles.langDropdownActive : ''}`}>
            <div className={styles.langOption} onClick={() => switchToLocale('en')}>EN</div>
            <div className={styles.langOption} onClick={() => switchToLocale('fr')}>FR</div>
            <div className={styles.langOption} onClick={() => switchToLocale('de')}>DE</div>
            <div className={styles.langOption} onClick={() => switchToLocale('jp')}>JP</div>
          </div>
        </div>

        <button className={styles.cartBtn} onClick={onOpenCart} aria-label="Cart">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
        </button>

        <div className={styles.avatar} onClick={onOpenProfile} aria-label="Profile">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>

        <button
          className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerActive : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {toastMessage && (
        <div className={styles.toast}>
          <svg className={styles.toastIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}
    </nav>
  );
}
