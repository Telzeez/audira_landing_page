'use client';

import { useState, FormEvent } from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();

    if (!email) {
      setStatus('error');
      setMessage('Please enter your email.');
      return;
    }

    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    // Mock subscription call success
    setStatus('success');
    setMessage('Thank you for subscribing to Audira.');
    setEmail('');

    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 4000);
  };

  return (
    <footer id="support-footer" className={styles.footer}>
      <div className={styles.grid}>
        {/* Brand details */}
        <div className={styles.brandInfo}>
          <div className={styles.logo}>
            Audira<span className={styles.logoDot}>.</span>
          </div>
          <p className={styles.tagline}>
            Crafting premium acoustic devices for true audio connoisseurs. Louder than luxury.
          </p>
          <div className={styles.socials}>
            <a className={styles.socialLink} aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4.002 4.002 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a className={styles.socialLink} aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a className={styles.socialLink} aria-label="X (formerly Twitter)">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
              </svg>
            </a>
            <a className={styles.socialLink} aria-label="YouTube">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className={styles.colTitle}>Explore</h4>
          <ul className={styles.linksList}>
            <li className={styles.linkItem}>Home</li>
            <li className={styles.linkItem}>Products Catalog</li>
            <li className={styles.linkItem}>Acoustic Science</li>
            <li className={styles.linkItem}>Our Story</li>
            <li className={styles.linkItem}>Store Locator</li>
          </ul>
        </div>

        {/* Column 3: Support Links */}
        <div>
          <h4 className={styles.colTitle}>Support</h4>
          <ul className={styles.linksList}>
            <li className={styles.linkItem}>Help Center</li>
            <li className={styles.linkItem}>Device Registration</li>
            <li className={styles.linkItem}>Warranty & Repair</li>
            <li className={styles.linkItem}>Returns & Exchanges</li>
            <li className={styles.linkItem}>Contact Sales</li>
          </ul>
        </div>

        {/* Column 4: Newsletter sign-up */}
        <div className={styles.newsletter}>
          <h4 className={styles.colTitle}>Newsletter</h4>
          <p className={styles.newsletterText}>
            Subscribe to receive product drops, exclusive offers, and audio content directly.
          </p>
          <form className={styles.form} onSubmit={handleSubscribe} noValidate>
            <div className={styles.inputGroup}>
              <input
                type="email"
                className={styles.input}
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address for newsletter"
              />
              <button type="submit" className={`btn-primary ${styles.submitBtn}`}>
                Subscribe
              </button>
            </div>
            {status !== 'idle' && (
              <div
                className={`${styles.message} ${
                  status === 'success' ? styles.messageSuccess : styles.messageError
                }`}
              >
                {message}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Footer bottom */}
      <div className={styles.bottom}>
        <div className={styles.copyright}>
          © {new Date().getFullYear()} Audira Inc. All rights reserved.
        </div>
        <div className={styles.legalLinks}>
          <span className={styles.legalLink}>Privacy Policy</span>
          <span className={styles.legalLink}>Terms of Service</span>
          <span className={styles.legalLink}>Legal Notice</span>
        </div>
      </div>
    </footer>
  );
}
