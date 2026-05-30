'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './Showcase.module.css';

interface ShowcaseProps {
  onAddToBasket: (item: { id: string; name: string; price: number; priceStr: string; image: string }) => void;
}

interface ColorOption {
  id: string;
  name: string;
  value: string;
  hex: string;
  image: string;
  glowColor: string;
}

const colorOptions: ColorOption[] = [
  {
    id: 'copper',
    name: 'Aurum Copper',
    value: 'Copper',
    hex: '#e27a3f',
    image: '/images/product_aurum_copper.png',
    glowColor: 'rgba(226, 122, 63, 0.35)',
  },
  {
    id: 'blue',
    name: 'Nordic Blue',
    value: 'Blue',
    hex: '#2b5a8f',
    image: '/images/product_aurum_blue.png',
    glowColor: 'rgba(43, 90, 143, 0.35)',
  },
  {
    id: 'charcoal',
    name: 'Matte Charcoal',
    value: 'Charcoal',
    hex: '#232323',
    image: '/images/product_aurum_charcoal.png',
    glowColor: 'rgba(255, 255, 255, 0.1)',
  },
  {
    id: 'silver',
    name: 'Platinum Silver',
    value: 'Silver',
    hex: '#d1d1d1',
    image: '/images/product_aurum_silver.png',
    glowColor: 'rgba(209, 209, 209, 0.3)',
  },
];

export default function Showcase({ onAddToBasket }: ShowcaseProps) {
  const [activeColor, setActiveColor] = useState<ColorOption>(colorOptions[0]);
  const [imageOpacity, setImageOpacity] = useState(1);

  const handleColorChange = (option: ColorOption) => {
    if (option.id === activeColor.id) return;
    
    // Quick fade animation
    setImageOpacity(0);
    setTimeout(() => {
      setActiveColor(option);
      setImageOpacity(1);
    }, 200);
  };

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {/* Left Side: Dynamic Image */}
        <div className={styles.imageArea}>
          <div
            className={styles.glowBg}
            style={{
              backgroundColor: activeColor.hex,
              boxShadow: `0 0 100px ${activeColor.glowColor}`,
            }}
          />
          <div className={styles.imageWrapper}>
            <Image
              src={activeColor.image}
              alt={`Audira Aurum - ${activeColor.name}`}
              fill
              sizes="(max-width: 968px) 100vw, 460px"
              priority
              className={styles.showcaseImage}
              style={{ opacity: imageOpacity }}
            />
          </div>
        </div>

        {/* Right Side: Specifications and details */}
        <div className={styles.details}>
          <span className={styles.badge}>Signature Edition</span>
          <h2 className={styles.title}>Audira Aurum</h2>

          <div className={styles.priceRow}>
            <span className={styles.currentPrice}>$95.00</span>
            <span className={styles.originalPrice}>$150.00</span>
            <span className={styles.priceSeparator}>—</span>
            <span className={styles.discount}>36% OFF</span>
          </div>

          <p className={styles.desc}>
            The pinnacle of acoustic design. The Audira Aurum delivers ultra-precise transients, studio-grade sound stages, and hybrid noise cancelling in a gorgeous copper-trimmed frame.
          </p>

          <div className={styles.colorSection}>
            <span className={styles.colorLabel}>
              Select Finish: <span>{activeColor.name}</span>
            </span>
            <div className={styles.colorPicker}>
              {colorOptions.map((option) => (
                <button
                  key={option.id}
                  className={`${styles.colorDot} ${activeColor.id === option.id ? styles.colorDotActive : ''}`}
                  style={{
                    backgroundColor: option.hex,
                    color: option.hex,
                    borderColor: activeColor.id === option.id ? '#ffffff' : 'rgba(255,255,255,0.1)',
                  }}
                  onClick={() => handleColorChange(option)}
                  aria-label={`Select ${option.name} color`}
                />
              ))}
            </div>
          </div>

          <button 
            className={`btn-primary ${styles.basketBtn}`} 
            onClick={() => onAddToBasket({ 
              id: 'aurum-' + activeColor.id, 
              name: 'Audira Aurum (' + activeColor.value + ')', 
              price: 95.00, 
              priceStr: '$95.00', 
              image: activeColor.image 
            })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            Add To Basket
          </button>

          <div className={styles.specsGrid}>
            <div className={styles.specCard}>
              <span className={styles.specIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="16" height="10" rx="2" ry="2" />
                  <line x1="22" y1="11" x2="22" y2="13" />
                  <line x1="6" y1="11" x2="10" y2="11" />
                  <line x1="6" y1="13" x2="12" y2="13" />
                </svg>
              </span>
              <div>
                <h4 className={styles.specTitle}>Battery Life</h4>
                <p className={styles.specVal}>40 Hours continuous playback</p>
              </div>
            </div>

            <div className={styles.specCard}>
              <span className={styles.specIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                  <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                </svg>
              </span>
              <div>
                <h4 className={styles.specTitle}>Hybrid ANC</h4>
                <p className={styles.specVal}>Advanced 35dB noise blocking</p>
              </div>
            </div>

            <div className={styles.specCard}>
              <span className={styles.specIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </span>
              <div>
                <h4 className={styles.specTitle}>Accessories</h4>
                <p className={styles.specVal}>USB-C & Premium Leather Case</p>
              </div>
            </div>

            <div className={styles.specCard}>
              <span className={styles.specIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </span>
              <div>
                <h4 className={styles.specTitle}>Warranty</h4>
                <p className={styles.specVal}>2 Years international warranty</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
