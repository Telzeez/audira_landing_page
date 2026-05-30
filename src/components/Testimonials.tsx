'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './Testimonials.module.css';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  image: string;
  date?: string;
  userId?: string;
}

interface TestimonialsProps {
  user?: { name: string; email: string } | null;
  onOpenProfile?: () => void;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    role: 'Acoustic Analyst',
    quote: 'The active noise cancellation is a total game changer. It completely isolates aircraft hum while retaining the full clarity and depth of my acoustic mixes. Pure brilliance.',
    rating: 5,
    image: '/images/user_profile_1.png',
  },
  {
    id: '2',
    name: 'Marcus Thorne',
    role: 'Music Producer',
    quote: 'Unbelievable battery life. I only charge it once a week, despite using it for long mixing sessions. The spatial audio tracking makes me feel like I am in the center of the recording studio.',
    rating: 5,
    image: '/images/user_profile_2.png',
  },
  {
    id: '3',
    name: 'Elena Rostova',
    role: 'UX Designer',
    quote: 'The space-black finish with copper accents is simply gorgeous. They look like a piece of high-end jewelry and feel incredibly light on the head, even after hours of continuous wear.',
    rating: 5,
    image: '/images/user_profile_1.png',
  },
];

export default function Testimonials({ user, onOpenProfile }: TestimonialsProps) {
  const [reviews, setReviews] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [canScroll, setCanScroll] = useState(false);

  // Form states
  const [rating, setRating] = useState(5);
  const [role, setRole] = useState('');
  const [quote, setQuote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTargetRef = useRef(0);
  const isProgrammaticScrollRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      if (response.ok) {
        const data = await response.json();
        if (data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews);
        }
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Check if scrolling is needed
  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const { scrollWidth, clientWidth } = scrollRef.current;
        setCanScroll(scrollWidth > clientWidth);
      }
    };
    checkScroll();
    
    // Add small delay to ensure DOM is fully rendered
    const timeout = setTimeout(checkScroll, 200);

    window.addEventListener('resize', checkScroll);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', checkScroll);
    };
  }, [reviews]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Scroll handler to sync dots
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      
      const firstCard = scrollRef.current.firstElementChild as HTMLElement;
      const cardWidth = firstCard ? firstCard.offsetWidth + 30 : 430;
      
      // Sync dot indicator index
      const index = Math.round(scrollLeft / cardWidth);
      if (index >= 0 && index < reviews.length) {
        setActiveIndex(index);
      }

      // If scroll was triggered manually by user, sync our scroll target ref
      if (!isProgrammaticScrollRef.current) {
        scrollTargetRef.current = scrollLeft;
      }
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const firstCard = container.firstElementChild as HTMLElement;
      const step = firstCard ? firstCard.offsetWidth + 30 : 430; // card width + gap
      
      const { clientWidth, scrollWidth } = container;
      const maxScroll = scrollWidth - clientWidth;
      
      if (maxScroll <= 0) return;

      let newTarget = direction === 'left' 
        ? scrollTargetRef.current - step 
        : scrollTargetRef.current + step;
      
      // Wrapping check with 15px threshold tolerance
      if (direction === 'right' && scrollTargetRef.current >= maxScroll - 15) {
        newTarget = 0;
      } else if (direction === 'left' && scrollTargetRef.current <= 15) {
        newTarget = maxScroll;
      } else {
        // Clamp target
        newTarget = Math.max(0, Math.min(newTarget, maxScroll));
      }
      
      scrollTargetRef.current = newTarget;
      
      // Trigger programmatic scroll
      isProgrammaticScrollRef.current = true;
      container.scrollTo({ left: newTarget, behavior: 'smooth' });

      // Reset the flag after smooth animation is completed
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 600);
    }
  };

  const scrollToCard = (index: number) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const firstCard = container.firstElementChild as HTMLElement;
      const step = firstCard ? firstCard.offsetWidth + 30 : 430;
      
      const targetScroll = index * step;
      scrollTargetRef.current = targetScroll;
      
      isProgrammaticScrollRef.current = true;
      container.scrollTo({ left: targetScroll, behavior: 'smooth' });
      setActiveIndex(index);

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 600);
    }
  };

  // Autoplay functionality
  useEffect(() => {
    if (isPaused || showForm || reviews.length <= 1 || !canScroll) return;

    const interval = setInterval(() => {
      scroll('right');
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused, showForm, reviews, canScroll]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!role.trim()) {
      setFormError('Profession or role is required.');
      return;
    }
    if (!quote.trim()) {
      setFormError('Review quote is required.');
      return;
    }
    if (quote.trim().length < 10) {
      setFormError('Review quote must be at least 10 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          role: role.trim(),
          quote: quote.trim(),
        }),
      });

      if (response.ok) {
        setFormSuccess('Thank you! Your review has been added successfully.');
        setRole('');
        setQuote('');
        setRating(5);
        await fetchReviews();
        // Hide form after delay
        setTimeout(() => {
          setShowForm(false);
          setFormSuccess('');
        }, 3000);
      } else {
        const data = await response.json();
        setFormError(data.error || 'Failed to submit review.');
      }
    } catch (err) {
      setFormError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
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
            <span>4.9/5</span> | {reviews.length + 1800} Reviews
          </span>
        </div>

        <h2 className={styles.title}>
          What Our <span>Customers Say</span>
        </h2>
      </div>

      {/* Review Form Area */}
      {showForm && (
        <div className={styles.reviewFormContainer}>
          <div className={styles.formTitle}>
            Share Your <span>Audira Experience</span>
          </div>

          {formSuccess ? (
            <div className={styles.successMessage}>{formSuccess}</div>
          ) : !user ? (
            <div className={styles.authPromptCard}>
              <p className={styles.authPromptText}>
                You must be logged in to submit a review for your registered devices.
              </p>
              <button 
                className="btn-secondary" 
                onClick={onOpenProfile}
              >
                Sign In / Join Now
              </button>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className={styles.reviewForm}>
              {formError && <div className={styles.errorMessage}>{formError}</div>}
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Your Rating</label>
                <div className={styles.starSelector}>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      className={`${styles.starBtn} ${num <= rating ? styles.starActive : styles.starInactive}`}
                      onClick={() => setRating(num)}
                      aria-label={`Rate ${num} star${num > 1 ? 's' : ''}`}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Your Profession / Role</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Audiophile, Sound Engineer, Studio Producer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  maxLength={50}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Your Feedback</label>
                <textarea
                  className={`${styles.input} ${styles.textarea}`}
                  placeholder="Describe your sound experience with Audira products..."
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  maxLength={500}
                  required
                />
              </div>

              <button 
                type="submit" 
                className={`btn-primary ${styles.submitBtn}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Publishing...' : 'Submit Review'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Testimonials horizontal scrolling view */}
      <div 
        className={styles.scrollContainer} 
        ref={scrollRef}
        onScroll={handleScroll}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {reviews.map((t) => (
          <div key={t.id} className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div className={styles.quoteIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.192 15.757c0-.907-.188-1.754-.565-2.54-.374-.78-.986-1.387-1.833-1.82-.475-.24-.9-.367-1.275-.367-.202 0-.376.047-.52.14-.145.092-.217.22-.217.382 0 .115.04.223.116.32.17.215.424.376.764.484.34.106.608.272.803.496.195.224.293.51.293.86 0 .528-.196.966-.588 1.316-.392.35-.966.524-1.72.524-.714 0-1.32-.23-1.817-.692-.497-.46-.745-1.054-.745-1.782 0-.908.293-1.77.877-2.585.584-.813 1.4-1.487 2.45-2.02.825-.42 1.56-.63 2.208-.63.26 0 .48.06.662.18.182.12.272.28.272.48 0 .153-.082.3-.245.442-.162.143-.377.294-.645.453-.787.462-1.393.98-1.82 1.554-.426.574-.648 1.135-.667 1.685.25-.067.545-.1.884-.1.864 0 1.61.3 2.24.9 0 0 .002.002.002.003.63.602.944 1.36.944 2.274 0 .914-.302 1.67-.905 2.268-.604.6-1.366.9-2.287.9-.92 0-1.685-.3-2.296-.9-.612-.6-.917-1.36-.917-2.277 0-.918.307-1.68.92-2.284.614-.604 1.378-.906 2.293-.906.915 0 1.678.3 2.29.905.61.603.916 1.365.916 2.283 0 .918-.306 1.68-.916 2.283-.61.6-1.373.9-2.29.9-.916 0-1.677-.3-2.29-.903-.61-.603-.915-1.366-.915-2.285zm8 0c0-.907-.188-1.754-.565-2.54-.374-.78-.986-1.387-1.833-1.82-.475-.24-.9-.367-1.275-.367-.202 0-.376.047-.52.14-.145.092-.217.22-.217.382 0 .115.04.223.116.32.17.215.424.376.764.484.34.106.608.272.803.496.195.224.293.51.293.86 0 .528-.196.966-.588 1.316-.392.35-.966.524-1.72.524-.714 0-1.32-.23-1.817-.692-.497-.46-.745-1.054-.745-1.782 0-.908.293-1.77.877-2.585.584-.813 1.4-1.487 2.45-2.02.825-.42 1.56-.63 2.208-.63.26 0 .48.06.662.18.182.12.272.28.272.48 0 .153-.082.3-.245.442-.162.143-.377.294-.645.453-.787.462-1.393.98-1.82 1.554-.426.574-.648 1.135-.667 1.685.25-.067.545-.1.884-.1.864 0 1.61.3 2.24.9 0 0 .002.002.002.003.63.602.944 1.36.944 2.274 0 .914-.302 1.67-.905 2.268-.604.6-1.366.9-2.287.9-.92 0-1.685-.3-2.296-.9-.612-.6-.917-1.36-.917-2.277 0-.918.307-1.68.92-2.284.614-.604 1.378-.906 2.293-.906.915 0 1.678.3 2.29.905.61.603.916 1.365.916 2.283 0 .918-.306 1.68-.916 2.283-.61.6-1.373.9-2.29.9-.916 0-1.677-.3-2.29-.903-.61-.603-.915-1.366-.915-2.285z" />
                </svg>
              </div>
              <div style={{ display: 'flex', gap: '3px', color: '#ffd700' }}>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < (t.rating || 5) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
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

      {/* Slider controls & Pagination dots container */}
      <div className={styles.controlsContainer}>
        {/* Pagination Dots */}
        {canScroll && (
          <div className={styles.paginationDots}>
            {reviews.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ''}`}
                onClick={() => scrollToCard(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Action button & Slide Nav arrows */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '1200px', padding: '0 40px' }}>
          <button 
            className={styles.writeReviewBtn}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Close Form' : 'Write a Review'}
          </button>

          {canScroll && (
            <div style={{ display: 'flex', gap: '16px' }}>
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
          )}
        </div>
      </div>
    </section>
  );
}
