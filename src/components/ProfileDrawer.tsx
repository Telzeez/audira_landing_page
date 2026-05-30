'use client';

import { useState } from 'react';
import styles from './ProfileDrawer.module.css';

export interface RegisteredDevice {
  name: string;
  serial: string;
}

interface UserProfile {
  name: string;
  email: string;
  points: number;
}

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  registeredDevices: RegisteredDevice[];
  onLoginSuccess: (user: UserProfile, devices: RegisteredDevice[]) => void;
  onLogoutSuccess: () => void;
  onRegisterDeviceSuccess: (devices: RegisteredDevice[], points: number) => void;
}

export default function ProfileDrawer({
  isOpen,
  onClose,
  user,
  registeredDevices,
  onLoginSuccess,
  onLogoutSuccess,
  onRegisterDeviceSuccess,
}: ProfileDrawerProps) {
  // Tab selector: 'signin' | 'signup'
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  // Input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('Audira Aurum');
  const [serialCode, setSerialCode] = useState('');

  // Form feedbacks
  const [authStatus, setAuthStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [authMessage, setAuthMessage] = useState('');
  const [regStatus, setRegStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [regMessage, setRegMessage] = useState('');

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthStatus('loading');
    setAuthMessage('');

    const endpoint = activeTab === 'signin' ? '/api/auth/login' : '/api/auth/signup';
    const payload = activeTab === 'signin' 
      ? { email, password } 
      : { name, email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setAuthStatus('error');
        setAuthMessage(data.error || 'Authentication failed. Please check inputs.');
        return;
      }

      setAuthStatus('success');
      setAuthMessage(activeTab === 'signin' ? 'Successfully logged in.' : 'Account created!');
      
      // Clear inputs
      setName('');
      setEmail('');
      setPassword('');

      // Trigger callback
      setTimeout(() => {
        onLoginSuccess(data.user, data.user.registeredDevices);
        setAuthStatus('idle');
        setAuthMessage('');
      }, 1000);
    } catch (err) {
      setAuthStatus('error');
      setAuthMessage('A network error occurred. Please try again.');
    }
  };

  const handleRegisterDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serialCode.trim()) {
      setRegStatus('error');
      setRegMessage('Please enter a serial number.');
      return;
    }

    setRegStatus('loading');
    setRegMessage('');

    try {
      const response = await fetch('/api/auth/register-device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceName: selectedProduct,
          serial: serialCode.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setRegStatus('error');
        setRegMessage(data.error || 'Failed to register device.');
        return;
      }

      setRegStatus('success');
      setRegMessage('Success! Registered. +50 Club Points!');
      setSerialCode('');

      // Trigger callback
      onRegisterDeviceSuccess(data.registeredDevices, data.points);

      setTimeout(() => {
        setRegStatus('idle');
        setRegMessage('');
      }, 4000);
    } catch (err) {
      setRegStatus('error');
      setRegMessage('A network error occurred.');
    }
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        onLogoutSuccess();
        onClose();
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
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
          {!user ? (
            /* Logged Out: Sign In / Sign Up Forms */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', gap: '20px' }}>
                <button 
                  onClick={() => { setActiveTab('signin'); setAuthMessage(''); }} 
                  style={{
                    background: 'none',
                    border: 'none',
                    color: activeTab === 'signin' ? '#ffffff' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-outfit)',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    position: 'relative',
                    paddingBottom: '8px'
                  }}
                >
                  Sign In
                  {activeTab === 'signin' && (
                    <span style={{ position: 'absolute', bottom: '-11px', left: 0, width: '100%', height: '2px', background: 'var(--accent-color)' }} />
                  )}
                </button>
                <button 
                  onClick={() => { setActiveTab('signup'); setAuthMessage(''); }} 
                  style={{
                    background: 'none',
                    border: 'none',
                    color: activeTab === 'signup' ? '#ffffff' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-outfit)',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    position: 'relative',
                    paddingBottom: '8px'
                  }}
                >
                  Join Club
                  {activeTab === 'signup' && (
                    <span style={{ position: 'absolute', bottom: '-11px', left: 0, width: '100%', height: '2px', background: 'var(--accent-color)' }} />
                  )}
                </button>
              </div>

              <form className={styles.form} onSubmit={handleAuthSubmit}>
                {activeTab === 'signup' && (
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="name-input">Full Name</label>
                    <input 
                      id="name-input"
                      type="text" 
                      className={styles.input} 
                      placeholder="e.g. Alexander Croft"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                )}
                
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel} htmlFor="email-input">Email Address</label>
                  <input 
                    id="email-input"
                    type="email" 
                    className={styles.input} 
                    placeholder="e.g. croft@audira.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel} htmlFor="password-input">Password</label>
                  <input 
                    id="password-input"
                    type="password" 
                    className={styles.input} 
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className={`btn-primary ${styles.submitBtn}`}
                  disabled={authStatus === 'loading'}
                  style={{ marginTop: '10px' }}
                >
                  {authStatus === 'loading' ? 'Processing...' : activeTab === 'signin' ? 'Sign In' : 'Create Account'}
                </button>

                {authStatus !== 'idle' && authStatus !== 'loading' && (
                  <div className={`${styles.formMessage} ${authStatus === 'success' ? styles.messageSuccess : styles.messageError}`}>
                    {authMessage}
                  </div>
                )}
              </form>
            </div>
          ) : (
            /* Logged In Member details */
            <>
              {/* Profile user details */}
              <div className={styles.userCard}>
                <div className={styles.avatar}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{user.name}</span>
                  <span className={styles.userTier}>
                    {user.points >= 200 ? 'Platinum Member Tier' : 'Gold Member Tier'}
                  </span>
                </div>
              </div>

              {/* Stats Box */}
              <div className={styles.statsRow}>
                <div className={styles.statBox}>
                  <div className={styles.statVal}>{user.points}</div>
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
                <form className={styles.form} onSubmit={handleRegisterDevice}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="product-select-drawer">Select Model</label>
                    <select 
                      id="product-select-drawer"
                      className={styles.input} 
                      style={{ background: '#0e0e0e', color: '#ffffff' }}
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                      <option value="Audira Aurum">Audira Aurum</option>
                      <option value="Audira Zenith">Audira Zenith</option>
                      <option value="Audira Vela">Audira Vela</option>
                      <option value="Audira Solace">Audira Solace</option>
                      <option value="Audira Q20">Audira Q20</option>
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="serial-input-drawer">Serial Code</label>
                    <input 
                      id="serial-input-drawer"
                      type="text" 
                      className={styles.input} 
                      placeholder="e.g. (01)01234567890123"
                      value={serialCode}
                      onChange={(e) => setSerialCode(e.target.value)}
                    />
                  </div>
                  <button 
                    type="submit" 
                    className={`btn-primary ${styles.submitBtn}`}
                    disabled={regStatus === 'loading'}
                  >
                    {regStatus === 'loading' ? 'Registering...' : 'Verify & Register'}
                  </button>
                  {regStatus !== 'idle' && regStatus !== 'loading' && (
                    <div className={`${styles.formMessage} ${regStatus === 'success' ? styles.messageSuccess : styles.messageError}`}>
                      {regMessage}
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
          {user ? (
            <button className="btn-secondary" style={{ width: '100%', borderRadius: '30px' }} onClick={handleSignOut}>
              Sign Out
            </button>
          ) : (
            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', textAlign: 'center' }}>
              Audira Club Membership. Louder Than Luxury.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
