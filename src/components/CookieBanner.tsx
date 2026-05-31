"use client";

import { useState, useEffect } from "react";
import styles from "./CookieBanner.module.css";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already made a choice
    const consent = localStorage.getItem("audira_cookie_consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("audira_cookie_consent", "true");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("audira_cookie_consent", "false");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <p className={styles.text}>
          We use cookies to improve your experience on our site, personalize
          content, and analyze our traffic. By clicking &quot;Accept&quot;, you
          consent to our use of cookies.
        </p>
        <div className={styles.actions}>
          <button onClick={handleDecline} className={styles.declineBtn}>
            Decline
          </button>
          <button onClick={handleAccept} className={styles.acceptBtn}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
