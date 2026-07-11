import { Link } from 'react-router-dom';
import styles from './Home.module.scss';

export default function Home() {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.hero__content}>
            <h1 className="animate-fade-in-up">
              Delicious Food, <br />
              <span className={styles.hero__highlight}>Delivered Fast</span>
            </h1>
            <p className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              Order your favorite meals from the best restaurants in town.
            </p>
            <div className={styles.hero__actions}>
              <Link to="/restaurants" className="btn btn--primary animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                Order Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className="container">
          <h2>Why Choose Us?</h2>
          <div className={styles.features__grid}>
            <div className={styles.feature}>
              <div className={styles.feature__icon}>[Fast]</div>
              <h3>Fast Delivery</h3>
              <p>Get your food hot and fresh in under 30 minutes.</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.feature__icon}>[Quality]</div>
              <h3>Best Restaurants</h3>
              <p>We partner with the top-rated restaurants in your area.</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.feature__icon}>[Secure]</div>
              <h3>Easy Payment</h3>
              <p>Pay securely with multiple payment options.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
