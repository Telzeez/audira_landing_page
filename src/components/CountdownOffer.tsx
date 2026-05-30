'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './CountdownOffer.module.css';

export default function CountdownOffer() {
  // Set initial countdown target: 10 days from now
  const [timeLeft, setTimeLeft] = useState({
    days: '10',
    hours: '09',
    minutes: '33',
    seconds: '45',
  });

  useEffect(() => {
    // We compute the target time as current time + 10 days, 9 hours, 33 minutes, 45 seconds
    const duration =
      10 * 24 * 60 * 60 * 1000 +
      9 * 60 * 60 * 1000 +
      33 * 60 * 1000 +
      45 * 1000;
    const targetTime = Date.now() + duration;

    const interval = setInterval(() => {
      const difference = targetTime - Date.now();

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({
        days: days.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {/* Left Side: Countdown Text & Timer */}
        <div className={styles.offerText}>
          <span className={styles.badge}>Limited Time Promotion</span>
          <h2 className={styles.title}>
            Hurry up!<br />
            Our Flash Sale <span>Ends Soon</span>
          </h2>
          <p className={styles.desc}>
            Get the legendary Audira luxury headphones at an unmatched value. Experience studio-grade acoustic performance, active hybrid noise blocking, and unparalleled comfort.
          </p>

          <div className={styles.timer}>
            <div className={styles.timeBox}>
              <div className={styles.timeNum}>{timeLeft.days}</div>
              <span className={styles.timeLabel}>Days</span>
            </div>
            <div className={styles.separator}>:</div>
            <div className={styles.timeBox}>
              <div className={styles.timeNum}>{timeLeft.hours}</div>
              <span className={styles.timeLabel}>Hours</span>
            </div>
            <div className={styles.separator}>:</div>
            <div className={styles.timeBox}>
              <div className={styles.timeNum}>{timeLeft.minutes}</div>
              <span className={styles.timeLabel}>Min</span>
            </div>
            <div className={styles.separator}>:</div>
            <div className={styles.timeBox}>
              <div className={styles.timeNum}>{timeLeft.seconds}</div>
              <span className={styles.timeLabel}>Sec</span>
            </div>
          </div>

          <button className={`btn-primary ${styles.ctaBtn}`}>
            Get The Offer
          </button>
        </div>

        {/* Right Side: Image with floating badge */}
        <div className={styles.imageArea}>
          <div className={styles.bestOfferBadge}>Best Offers</div>
          <Image
            src="/images/countdown_model.png"
            alt="Audira Exclusive Offer Model"
            fill
            sizes="(max-width: 968px) 100vw, 420px"
            className={styles.offerImage}
          />
        </div>
      </div>
    </section>
  );
}
