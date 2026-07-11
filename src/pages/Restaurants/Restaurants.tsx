import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { restaurantService } from '../../services/restaurant.service';
import styles from './Restaurants.module.scss';

export default function Restaurants() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['restaurants'],
    queryFn: () => restaurantService.getAll(),
  });

  if (isLoading) return <div className="container" style={{ padding: '2rem 0' }}>Loading restaurants...</div>;
  if (error) return <div className="container" style={{ padding: '2rem 0', color: 'red' }}>Error loading restaurants</div>;

  return (
    <div className={styles.restaurantsPage}>
      <div className="container">
        <h1 className={styles.title}>All Restaurants</h1>
        
        <div className={styles.grid}>
          {data?.data.map((restaurant) => (
            <Link to={`/restaurants/${restaurant.id}`} key={restaurant.id} className={styles.card}>
              <div className={styles.cardImage}>
                {restaurant.image_url ? (
                  <img src={restaurant.image_url} alt={restaurant.name} />
                ) : (
                  <div className={styles.placeholderImage}>🍽️</div>
                )}
              </div>
              <div className={styles.cardContent}>
                <h3>{restaurant.name}</h3>
                <p className={styles.category}>{restaurant.category}</p>
                <div className={styles.meta}>
                  <span className={styles.rating}>⭐ {restaurant.rating.toFixed(1)}</span>
                  <span className={styles.address}>{restaurant.address}</span>
                </div>
              </div>
            </Link>
          ))}
          {data?.data.length === 0 && <p>No restaurants found.</p>}
        </div>
      </div>
    </div>
  );
}
