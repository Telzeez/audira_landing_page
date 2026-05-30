'use client';

import { useRef } from 'react';
import Image from 'next/image';
import styles from './Testimonials.module.css';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    role: 'Acoustic Analyst',
    quote: 'The active noise cancellation is a total game changer. It completely isolates aircraft hum while retaining the full clarity and depth of my acoustic mixes. Pure brilliance.',
    image: '/images/user_profile_1.png',
  },
  {
    id: '2',
    name: 'Marcus Thorne',
    role: 'Music Producer',
    quote: 'Unbelievable battery life. I only charge it once a week, despite using it for long mixing sessions. The spatial audio tracking makes me feel like I am in the center of the recording studio.',
    image: '/images/user_profile_2.png',
  },
  {
    id: '3',
    name: 'Elena Rostova',
    role: 'UX Designer',
    quote: 'The space-black finish with copper accents is simply gorgeous. They look like a piece of high-end jewelry and feel incredibly light on the head, even after hours of continuous wear.',
    image: '/images/user_profile_1.png',
  },
];

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.5 
        : scrollLeft + clientWidth * 0.5;
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.ratingSummary}>
          <div className={styles.stars}>
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          <span className={styles.ratingText}>
            <span>4.9/5</span> | 1.8k Reviews
          </span>
        </div>

        <h2 className={styles.title}>
          What Our <span>Customers Say</span>
        </h2>
      </div>

      {/* Testimonials horizontal scrolling view */}
      <div className={styles.scrollContainer} ref={scrollRef}>
        {testimonials.map((t) => (
          <div key={t.id} className={styles.card}>
            <div className={styles.quoteIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.192 15.757c0-.907-.188-1.754-.565-2.54-.374-.78-.986-1.387-1.833-1.82-.475-.24-.9-.367-1.275-.367-.202 0-.376.047-.52.14-.145.092-.217.22-.217.382 0 .115.04.223.116.32.17.215.424.376.764.484.34.106.608.272.803.496.195.224.293.51.293.86 0 .528-.196.966-.588 1.316-.392.35-.966.524-1.72.524-.714 0-1.32-.23-1.817-.692-.497-.46-.745-1.054-.745-1.782 0-.908.293-1.77.877-2.585.584-.813 1.4-1.487 2.45-2.02.825-.42 1.56-.63 2.208-.63.26 0 .48.06.662.18.182.12.272.28.272.48 0 .153-.082.3-.245.442-.162.143-.377.294-.645.453-.787.462-1.393.98-1.82 1.554-.426.574-.648 1.135-.667 1.685.25-.067.545-.1.884-.1.864 0 1.61.3 2.24.9 0 0 .002.002.002.003.63.602.944 1.36.944 2.274 0 .914-.302 1.67-.905 2.268-.604.6-1.366.9-2.287.9-.92 0-1.685-.3-2.296-.9-.612-.6-.917-1.36-.917-2.277 0-.918.307-1.68.92-2.284.614-.604 1.378-.906 2.293-.906.915 0 1.678.3 2.29.905.61.603.916 1.365.916 2.283 0 .918-.306 1.68-.916 2.283-.61.6-1.373.9-2.29.9-.916 0-1.677-.3-2.29-.903-.61-.603-.915-1.366-.915-2.285zm8 0c0-.907-.188-1.754-.565-2.54-.374-.78-.986-1.387-1.833-1.82-.475-.24-.9-.367-1.275-.367-.202 0-.376.047-.52.14-.145.092-.217.22-.217.382 0 .115.04.223.116.32.17.215.424.376.764.484.34.106.608.272.803.496.195.224.293.51.293.86 0 .528-.196.966-.588 1.316-.392.35-.966.524-1.72.524-.714 0-1.32-.23-1.817-.692-.497-.46-.745-1.054-.745-1.782 0-.908.293-1.77.877-2.585.584-.813 1.4-1.487 2.45-2.02.825-.42 1.56-.63 2.208-.63.26 0 .48.06.662.18.182.12.272.28.272.48 0 .153-.082.3-.245.442-.162.143-.377.294-.645.453-.787.462-1.393.98-1.82 1.554-.426.574-.648 1.135-.667 1.685.25-.067.545-.1.884-.1.864 0 1.61.3 2.24.9 0 0 .002.002.002.003.63.602.944 1.36.944 2.274 0 .914-.302 1.67-.905 2.268-.604.6-1.366.9-2.287.9-.92 0-1.685-.3-2.296-.9-.612-.6-.917-1.36-.917-2.277 0-.918.307-1.68.92-2.284.614-.604 1.378-.906 2.293-.906.915 0 1.678.3 2.29.905.61.603.916 1.365.916 2.283 0 .918-.306 1.68-.916 2.283-.61.6-1.373.9-2.29.9-.916 0-1.677-.3-2.29-.903-.61-.603-.915-1.366-.915-2.285z" />
              </svg>
            </div>
            <p className={styles.quoteText}>"{t.quote}"</p>
            <div className={styles.userProfile}>
              <div className={styles.avatar}>
                <Image
                  src={t.image}
                  alt={t.name}
                  fill
                  sizes="48px"
                  className={styles.avatarImage}
                />
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{t.name}</span>
                <span className={styles.userTitle}>{t.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slider nav arrows */}
      <div className={styles.sliderControls}>
        <button className={styles.navBtn} onClick={() => scroll('left')} aria-label="Previous testimonial">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button className={styles.navBtn} onClick={() => scroll('right')} aria-label="Next testimonial">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
