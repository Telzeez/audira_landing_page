'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Hero.module.css';

function SlotCounter({ numStr }: { numStr: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <span className={styles.slotContainer}>
      {numStr.split('').map((char, index) => {
        const isDigit = /\d/.test(char);
        if (!isDigit) {
          return <span key={index}>{char}</span>;
        }

        const targetDigit = parseInt(char, 10);
        const offset = mounted ? -targetDigit * 10 : 0; // percentage vertical offset (10% per digit height)

        return (
          <span key={index} className={styles.slotDigitWrapper}>
            <span
              className={styles.slotDigitList}
              style={{
                transform: `translateY(${offset}%)`,
                transition: `transform 2s cubic-bezier(0.16, 1, 0.3, 1)`,
                transitionDelay: `${index * 60}ms`,
              }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                <span key={digit} className={styles.slotDigit}>
                  {digit}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}

export default function Hero() {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products-catalog');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.hero}>
      {/* Left Column */}
      <div className={styles.leftCol}>
        <div>
          <h1 className={styles.modelNumber}>
            Q20
            <span>Premium Series</span>
          </h1>
          <p className={styles.desc}>
            Hybrid Active Noise Cancelling Headphones, Designed To Deliver Pure Audio And Deep Immersion Wherever You Are. Equipped With Advanced Hybrid ANC Technology.
          </p>
          <button className={`btn-primary ${styles.heroCta}`} onClick={scrollToProducts}>
            Explore Q20
          </button>
        </div>

        <div className={styles.barcodeWrapper}>
          {/* Custom SVG Barcode */}
          <svg className={styles.barcode} height="40" viewBox="0 0 160 40" fill="currentColor">
            <rect x="0" width="3" height="40" />
            <rect x="5" width="1" height="40" />
            <rect x="8" width="2" height="40" />
            <rect x="12" width="4" height="40" />
            <rect x="18" width="1" height="40" />
            <rect x="21" width="3" height="40" />
            <rect x="26" width="2" height="40" />
            <rect x="30" width="1" height="40" />
            <rect x="33" width="4" height="40" />
            <rect x="39" width="2" height="40" />
            <rect x="43" width="3" height="40" />
            <rect x="48" width="1" height="40" />
            <rect x="51" width="2" height="40" />
            <rect x="55" width="4" height="40" />
            <rect x="61" width="1" height="40" />
            <rect x="64" width="3" height="40" />
            <rect x="69" width="2" height="40" />
            <rect x="73" width="1" height="40" />
            <rect x="76" width="4" height="40" />
            <rect x="82" width="2" height="40" />
            <rect x="86" width="3" height="40" />
            <rect x="91" width="1" height="40" />
            <rect x="94" width="2" height="40" />
            <rect x="98" width="4" height="40" />
            <rect x="104" width="1" height="40" />
            <rect x="107" width="3" height="40" />
            <rect x="112" width="2" height="40" />
            <rect x="116" width="1" height="40" />
            <rect x="119" width="4" height="40" />
            <rect x="125" width="2" height="40" />
            <rect x="129" width="3" height="40" />
            <rect x="134" width="1" height="40" />
            <rect x="137" width="2" height="40" />
            <rect x="141" width="4" height="40" />
            <rect x="147" width="1" height="40" />
            <rect x="150" width="3" height="40" />
            <rect x="155" width="2" height="40" />
            <rect x="159" width="1" height="40" />
          </svg>
          <div className={styles.barcodeText}>(01)<SlotCounter numStr="01234567890123" /></div>
        </div>
      </div>

      {/* Center Column */}
      <div className={styles.centerCol}>
        <div className={styles.imageContainer}>
          <Image
            src="/images/hero_model_headphones.png"
            alt="Audira Q20 Headphones Model"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 420px"
            className={styles.heroImage}
          />
          <div className={styles.frameOverlay}>
            <div className={styles.frameText}>LOUDER THAN LUXURY.</div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className={styles.rightCol}>
        <div className={styles.ratingSection}>
          <div className={styles.stars}>
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          <div className={styles.ratingText}>
            <span className={styles.ratingVal}>4.5/5</span> Customer Ratings
          </div>
        </div>

        <div className={styles.quoteBlock}>
          <blockquote className={styles.quote}>
            "The Sound Quality Is Phenomenal — Every Beat, Every Lyric."
          </blockquote>
        </div>

        <div className={styles.specsList}>
          <div className={styles.specItem}>
            <span className={styles.specIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" width="20" height="24" rx="2" ry="2" />
                <path d="M12 2v20M17 5H7M17 19H7M17 12H7" />
              </svg>
            </span>
            <div className={styles.specText}>
              Bluetooth Support
              <span className={styles.specVal}>Version 5.0 Support</span>
            </div>
          </div>

          <div className={styles.specItem}>
            <span className={styles.specIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </span>
            <div className={styles.specText}>
              Fast Charging
              <span className={styles.specVal}>5V / 2A (10W) Fast Charge</span>
            </div>
          </div>
        </div>

        <div className={styles.ctaLink} onClick={scrollToProducts}>
          <span>See The Product</span>
          <svg className={styles.ctaArrow} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
      </div>
    </section>
  );
}
