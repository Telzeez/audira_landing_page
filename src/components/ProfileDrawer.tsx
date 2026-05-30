'use client';

import { useState } from 'react';
import styles from './ProfileDrawer.module.css';

export interface RegisteredDevice {
  name: string;
  serial: string;
}

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  registeredDevices: RegisteredDevice[];
  onRegisterDevice: (name: string, serial: string) => void;
}

export default function ProfileDrawer({
  isOpen,
  onClose,
  registeredDevices,
  onRegisterDevice,
}: ProfileDrawerProps) {
  // Guest state simulation
  const [isGuest, setIsGuest] = useState(false);
  const [userPoints, setUserPoints] = useState(120);

  // Form states
  const [selectedProduct, setSelectedProduct] = useState('Audira Aurum');
  const [serialCode, setSerialCode] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formMessage, setFormMessage] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!serialCode.trim()) {
      setFormStatus('error');
      setFormMessage('Please enter a serial number.');
      return;
    }

    // Validate: Serial must be a barcode-like formatting starting with (01) or standard AUD- serial code
    const isValid = serialCode.startsWith('(01)') || serialCode.toUpperCase().startsWith('AUD-') || serialCode.length >= 8;
    if (!isValid) {
      setFormStatus('error');
      setFormMessage('Format invalid. Use barcode serial (01)... or AUD-... (min 8 chars).');
      return;
    }

    // Check if already registered
    const isAlreadyRegistered = registeredDevices.some(
      (d) => d.serial.toLowerCase() === serialCode.trim().toLowerCase()
    );
    if (isAlreadyRegistered) {
      setFormStatus('error');
      setFormMessage('This device has already been registered.');
      return;
    }

    // Register success
    onRegisterDevice(selectedProduct, serialCode.trim());
    setUserPoints((prev) => prev + 50); // Reward 50 points
    setFormStatus('success');
    setFormMessage(`Success! Registered. +50 Club Points!`);
    setSerialCode('');

    setTimeout(() => {
      setFormStatus('idle');
      setFormMessage('');
    }, 4000);
  };

  const handleSignOutToggle = () => {
    setIsGuest(!isGuest);
  };

  return (
    <>
      {/* Background Overlay */}
      <div 
        className={`${styles.overlay} ${isOpen ? styles.overlayActive : ''}`} 
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className={`${styles.drawer} ${isOpen ? styles.drawerActive : ''}`}>
        <div className={styles.header}>
          <h3 className={styles.title}>Audira Account</h3>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close profile">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          {isGuest ? (
            /* Guest Panel State */
            <div className={styles.guestMessage}>
              <svg 
                style={{ color: 'var(--text-tertiary)', marginBottom: '20px' }}
                xmlns="http://www.w3.org/2000/svg" 
                width="64" 
                height="64" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <h4 style={{ color: '#ffffff', marginBottom: '10px', fontFamily: 'var(--font-outfit)' }}>Welcome, Guest</h4>
              <p>Sign in to register devices, activate your luxury warranties, and claim reward club points.</p>
              <button 
                className="btn-primary" 
                style={{ marginTop: '30px', width: '100%' }}
                onClick={handleSignOutToggle}
              >
                Sign In / Join Club
              </button>
            </div>
          ) : (
            /* Member Panel State */
            <>
              {/* Profile details */}
              <div className={styles.userCard}>
                <div className={styles.avatar}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>Alexander Croft</span>
                  <span className={styles.userTier}>Gold Member Tier</span>
                </div>
              </div>

              {/* Stats Box */}
              <div className={styles.statsRow}>
                <div className={styles.statBox}>
                  <div className={styles.statVal}>{userPoints}</div>
                  <div className={styles.statLabel}>Club Points</div>
                </div>
                <div className={styles.statBox}>
                  <div className={styles.statVal}>{registeredDevices.length}</div>
                  <div className={styles.statLabel}>Devices</div>
                </div>
              </div>

              {/* Product registration form */}
              <div>
                <h4 className={styles.sectionTitle}>Register a Device</h4>
                <form className={styles.form} onSubmit={handleRegister}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="product-select">Select Model</label>
                    <select 
                      id="product-select"
                      className={styles.input} 
                      style={{ background: '#0e0e0e', color: '#ffffff' }}
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                      <option value="Audira Aurum">Audira Aurum</option>
                      <option value="Audira Zenith">Audira Zenith</option>
                      <option value="Audira Vankyo">Audira Vankyo</option>
                      <option value="Audira Beoplay">Audira Beoplay</option>
                      <option value="Audira Q20">Audira Q20</option>
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="serial-input">Serial Code</label>
                    <input 
                      id="serial-input"
                      type="text" 
                      className={styles.input} 
                      placeholder="e.g. (01)01234567890123"
                      value={serialCode}
                      onChange={(e) => setSerialCode(e.target.value)}
                    />
                  </div>
                  <button type="submit" className={`btn-primary ${styles.submitBtn}`}>
                    Verify & Register
                  </button>
                  {formStatus !== 'idle' && (
                    <div className={`${styles.formMessage} ${formStatus === 'success' ? styles.messageSuccess : styles.messageError}`}>
                      {formMessage}
                    </div>
                  )}
                </form>
              </div>

              {/* Registered Devices List */}
              <div>
                <h4 className={styles.sectionTitle}>Registered Warranties</h4>
                <div className={styles.deviceList}>
                  {registeredDevices.length === 0 ? (
                    <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', textAlign: 'center', padding: '15px' }}>
                      No warranties activated yet.
                    </div>
                  ) : (
                    registeredDevices.map((d, index) => (
                      <div key={index} className={styles.deviceItem}>
                        <span className={styles.deviceIcon}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                            <line x1="2" y1="10" x2="22" y2="10" />
                            <line x1="12" y1="17" x2="12" y2="21" />
                            <line x1="8" y1="21" x2="16" y2="21" />
                          </svg>
                        </span>
                        <div className={styles.deviceDetails}>
                          <span className={styles.deviceName}>{d.name}</span>
                          <span className={styles.deviceSerial}>{d.serial}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom Drawer Options */}
        <div className={styles.footer}>
          <button className="btn-secondary" style={{ width: '100%', borderRadius: '30px' }} onClick={handleSignOutToggle}>
            {isGuest ? 'Log In as Croft' : 'Sign Out'}
          </button>
        </div>
      </div>
    </>
  );
}
