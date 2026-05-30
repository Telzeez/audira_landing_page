'use client';

import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenProfile: () => void;
}

export default function Navbar({ cartCount, onOpenCart, onOpenProfile }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleLang = () => setIsLangOpen(!isLangOpen);
  const selectLang = (lang: string) => {
    setSelectedLang(lang);
    setIsLangOpen(false);
  };

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - 80; // offset navbar height
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
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
          <span>{selectedLang}</span>
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

          <div className={`${styles.langDropdown} ${isLangOpen ? styles.langDropdownActive : ''} ${isLangOpen ? styles.active : ''}`}>
            <div className={styles.langOption} onClick={() => selectLang('EN')}>EN</div>
            <div className={styles.langOption} onClick={() => selectLang('FR')}>FR</div>
            <div className={styles.langOption} onClick={() => selectLang('DE')}>DE</div>
            <div className={styles.langOption} onClick={() => selectLang('JP')}>JP</div>
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
    </nav>
  );
}
