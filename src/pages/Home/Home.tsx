import { Link } from 'react-router-dom';
import { FiShoppingBag, FiSearch, FiClipboard } from 'react-icons/fi';
import styles from './Home.module.scss';

export default function Home() {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.hero__content}>
            <h1 className="animate-fade-in-up">
              Your Next Meal, <br />
              <span className={styles.hero__highlight}>One Simple Order</span>
            </h1>
            <p className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              Browse restaurants, choose your favorites, and track your order.
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
          <h2>From Menu to Order</h2>
          <div className={styles.features__grid}>
            <div className={styles.feature}>
              <div className={styles.feature__icon}><FiSearch aria-hidden="true" /></div>
              <h3>Explore Restaurants</h3>
              <p>Browse restaurants and discover the dishes on their menus.</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.feature__icon}><FiShoppingBag aria-hidden="true" /></div>
              <h3>Build Your Cart</h3>
              <p>Choose your dishes, set quantities, and review your total.</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.feature__icon}><FiClipboard aria-hidden="true" /></div>
              <h3>Follow Your Order</h3>
              <p>See order updates as the restaurant changes its status.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
