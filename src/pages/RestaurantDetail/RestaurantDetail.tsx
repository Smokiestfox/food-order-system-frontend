import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { restaurantService } from '../../services/restaurant.service';
import { useCartStore } from '../../stores/cart.store';
import { useAuthStore } from '../../stores/auth.store';
import { UserRole } from '../../types';
import styles from './RestaurantDetail.module.scss';

export default function RestaurantDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const { addItem } = useCartStore();

  const { data: restaurant, isLoading: loadingRest } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => restaurantService.getById(id!),
    enabled: !!id,
  });

  const { data: menu, isLoading: loadingMenu } = useQuery({
    queryKey: ['menu', id],
    queryFn: () => restaurantService.getMenu(id!),
    enabled: !!id,
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => restaurantService.getReviews(id!),
    enabled: !!id,
  });

  if (loadingRest || loadingMenu) {
    return <div className="container" style={{ padding: '2rem 0' }}>Loading details...</div>;
  }

  if (!restaurant) return <div className="container">Restaurant not found</div>;

  return (
    <div className={styles.detailPage}>
      <div className={styles.header}>
        <div className="container">
          <div className={styles.headerContent}>
            <h1>{restaurant.name}</h1>
            <p className={styles.category}>{restaurant.category} • ⭐ {restaurant.rating.toFixed(1)}</p>
            <p className={styles.address}>📍 {restaurant.address}</p>
            {restaurant.description && <p className={styles.description}>{restaurant.description}</p>}
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.mainContent}>
          <div className={styles.menuSection}>
            <h2>Menu</h2>
            <div className={styles.menuGrid}>
              {menu?.map((item) => (
                <div key={item.id} className={styles.menuItem}>
                  <div className={styles.itemInfo}>
                    <h3>{item.name}</h3>
                    {item.description && <p>{item.description}</p>}
                    <span className={styles.price}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</span>
                  </div>
                  {user?.role === UserRole.CUSTOMER && (
                    <button 
                      className="btn btn--primary" 
                      onClick={() => addItem(item, restaurant.id, restaurant.name)}
                      disabled={!item.is_available}
                    >
                      {item.is_available ? 'Add to Cart' : 'Sold Out'}
                    </button>
                  )}
                </div>
              ))}
              {menu?.length === 0 && <p>This restaurant has no menu items yet.</p>}
            </div>
          </div>

          <div className={styles.reviewSection}>
            <h2>Reviews</h2>
            <div className={styles.reviewList}>
              {reviews?.map((review) => (
                <div key={review.id} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <strong>{review.user?.name || 'Anonymous'}</strong>
                    <span>⭐ {review.rating}</span>
                  </div>
                  {review.comment && <p>{review.comment}</p>}
                  <small>{new Date(review.created_at).toLocaleDateString()}</small>
                </div>
              ))}
              {reviews?.length === 0 && <p>No reviews yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
