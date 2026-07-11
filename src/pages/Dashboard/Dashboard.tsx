import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/auth.store';
import { UserRole, OrderStatus } from '../../types';
import { restaurantService } from '../../services/restaurant.service';
import { orderService } from '../../services/order.service';
import styles from './Dashboard.module.scss';
import { Navigate } from 'react-router-dom';

const ALL_STATUSES = [
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
  OrderStatus.PREPARING,
  OrderStatus.DELIVERING,
  OrderStatus.DELIVERED,
  OrderStatus.CANCELLED,
];

export default function Dashboard() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: restaurants, isLoading: loadingRest } = useQuery({
    queryKey: ['my-restaurants'],
    queryFn: () => restaurantService.getAll(),
    // In a real app, this would be a specific endpoint like getMyRestaurants.
    // For now, we fetch all and filter client-side, or assume the backend filters if role is OWNER.
  });

  const { data: orders, isLoading: loadingOrders } = useQuery({
    queryKey: ['my-restaurant-orders'],
    queryFn: () => orderService.getAll(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: OrderStatus }) => orderService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-restaurant-orders'] });
    },
  });

  if (user?.role !== UserRole.RESTAURANT_OWNER) {
    return <Navigate to="/" replace />;
  }

  if (loadingRest || loadingOrders) return <div className="container">Loading dashboard...</div>;

  return (
    <div className={styles.dashboardPage}>
      <div className="container">
        <h1 className={styles.title}>Restaurant Dashboard</h1>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Total Orders</h3>
            <div className={styles.statValue}>{orders?.length || 0}</div>
          </div>
          <div className={styles.statCard}>
            <h3>Pending Orders</h3>
            <div className={styles.statValue}>{orders?.filter(o => o.status === OrderStatus.PENDING).length || 0}</div>
          </div>
          <div className={styles.statCard}>
            <h3>Revenue</h3>
            <div className={styles.statValue}>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                orders?.filter(o => o.status === OrderStatus.DELIVERED).reduce((acc, o) => acc + Number(o.total), 0) || 0
              )}
            </div>
          </div>
        </div>

        <div className={styles.ordersSection}>
          <h2>Recent Orders</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.ordersTable}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id.slice(0, 8)}</td>
                    <td>{new Date(order.created_at).toLocaleString()}</td>
                    <td>Customer</td>
                    <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(order.total))}</td>
                    <td>
                      <select 
                        value={order.status}
                        onChange={(e) => updateStatusMutation.mutate({ id: order.id, status: e.target.value as OrderStatus })}
                        disabled={updateStatusMutation.isPending || order.status === OrderStatus.CANCELLED || order.status === OrderStatus.DELIVERED}
                        className={styles.statusSelect}
                      >
                        {ALL_STATUSES.map(status => (
                          <option key={status} value={status}>{status.toUpperCase()}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button className="btn btn--secondary btn--small">View Details</button>
                    </td>
                  </tr>
                ))}
                {orders?.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center' }}>No orders yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
