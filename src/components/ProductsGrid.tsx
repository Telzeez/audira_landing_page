'use client';

import Image from 'next/image';
import styles from './ProductsGrid.module.css';

interface Product {
  id: string;
  name: string;
  price: string;
  priceNum: number;
  rating: number;
  image: string;
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
  },
  {
    id: 'vankyo',
    name: 'Audira Vankyo',
    price: '$109.00',
    priceNum: 109.00,
    rating: 4,
    image: '/images/product_aurum_charcoal.png',
  },
  {
    id: 'beoplay',
    name: 'Audira Beoplay',
    price: '$249.00',
    priceNum: 249.00,
    rating: 5,
    image: '/images/product_aurum_silver.png',
  },
];

export default function ProductsGrid({ onAddToCart }: ProductsGridProps) {
  return (
    <section id="products-catalog" className={styles.section}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <span className={styles.sub}>Exclusive Collection</span>
          <h2 className={styles.title}>Intelligent Sound, Refined Design</h2>
        </div>
        <button className={styles.viewAll}>
          <span>View All</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

      <div className={styles.grid}>
        {products.map((product) => (
          <div key={product.id} className={styles.card}>
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
