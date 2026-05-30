'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './ProductsGrid.module.css';

interface Product {
  id: string;
  name: string;
  price: string;
  priceNum: number;
  rating: number;
  image: string;
  category: 'Over-Ear' | 'In-Ear' | 'Special Edition';
}

interface ProductsGridProps {
  onAddToCart: (item: { id: string; name: string; price: number; priceStr: string; image: string }) => void;
}

const products: Product[] = [
  {
    id: 'zenith',
    name: 'Audira Zenith',
    price: '$129.00',
    priceNum: 129.00,
    rating: 5,
    image: '/images/product_aurum_blue.png',
    category: 'Over-Ear',
  },
  {
    id: 'vankyo',
    name: 'Audira Vankyo',
    price: '$109.00',
    priceNum: 109.00,
    rating: 4,
    image: '/images/product_aurum_charcoal.png',
    category: 'In-Ear',
  },
  {
    id: 'beoplay',
    name: 'Audira Beoplay',
    price: '$249.00',
    priceNum: 249.00,
    rating: 5,
    image: '/images/product_aurum_silver.png',
    category: 'Special Edition',
  },
  {
    id: 'studio',
    name: 'Audira Studio',
    price: '$189.00',
    priceNum: 189.00,
    rating: 4,
    image: '/images/product_aurum_charcoal.png',
    category: 'Over-Ear',
  },
  {
    id: 'aurum-spec',
    name: 'Audira Aurum Gold',
    price: '$299.00',
    priceNum: 299.00,
    rating: 5,
    image: '/images/product_aurum_copper.png',
    category: 'Special Edition',
  },
];

const categories = ['All', 'Over-Ear', 'In-Ear', 'Special Edition'] as const;

export default function ProductsGrid({ onAddToCart }: ProductsGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[number]>('All');
  const [showAll, setShowAll] = useState(false);

  const handleCategoryChange = (cat: typeof categories[number]) => {
    setSelectedCategory(cat);
    setShowAll(false); // Reset list size toggle on category changes
  };

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const canExpand = filteredProducts.length > 3;
  const visibleProducts = showAll ? filteredProducts : filteredProducts.slice(0, 3);

  return (
    <section id="products-catalog" className={styles.section}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <span className={styles.sub}>Exclusive Collection</span>
          <h2 className={styles.title}>Intelligent Sound, Refined Design</h2>
        </div>
        {canExpand && (
          <button className={styles.viewAll} onClick={() => setShowAll(!showAll)}>
            <span>{showAll ? 'Show Less' : 'View All'}</span>
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
              style={{ transform: showAll ? 'rotate(-90deg)' : 'none', transition: 'transform 0.3s' }}
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        )}
      </div>

      {/* Category Tabs Filter Bar */}
      <div className={styles.filterBar}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`${styles.filterTab} ${selectedCategory === cat ? styles.filterTabActive : ''}`}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className={styles.grid}>
        {visibleProducts.map((product) => (
          /* key includes selectedCategory to force remount & animation triggers on filter changes */
          <div key={`${selectedCategory}-${product.id}`} className={`${styles.card} ${styles.animateCard}`}>
            <div className={styles.imageWrapper}>
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={styles.cardImage}
              />
            </div>

            <div className={styles.info}>
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill={i < product.rating ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <h3 className={styles.modelName}>{product.name}</h3>
              <div className={styles.priceRow}>
                <span className={styles.price}>{product.price}</span>
                <button
                  className={styles.addBtn}
                  onClick={() => onAddToCart({ id: product.id, name: product.name, price: product.priceNum, priceStr: product.price, image: product.image })}
                  aria-label={`Add ${product.name} to cart`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
