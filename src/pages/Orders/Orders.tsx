import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../../services/order.service';
import { OrderStatus } from '../../types';
import styles from './Orders.module.scss';

const statusColors = {
  [OrderStatus.PENDING]: 'orange',
  [OrderStatus.CONFIRMED]: 'blue',
  [OrderStatus.PREPARING]: 'purple',
  [OrderStatus.DELIVERING]: 'teal',
  [OrderStatus.DELIVERED]: 'green',
  [OrderStatus.CANCELLED]: 'red',
};

export default function Orders() {
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getAll(),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => orderService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  if (isLoading) return <div className="container" style={{ padding: '2rem 0' }}>Loading orders...</div>;

  return (
    <div className={styles.ordersPage}>
      <div className="container">
        <h1 className={styles.title}>My Orders</h1>

        <div className={styles.orderList}>
          {orders?.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div>
                  <h3>Order #{order.id.slice(0, 8)}</h3>
                  <p className={styles.restaurantName}>{order.restaurant?.name}</p>
                </div>
                <div className={styles.statusBadge} style={{ backgroundColor: statusColors[order.status] || 'gray' }}>
                  {order.status.toUpperCase()}
                </div>
              </div>

              <div className={styles.orderDetails}>
                <div className={styles.itemsList}>
                  {order.items?.map((item) => (
                    <div key={item.id} className={styles.itemRow}>
                      <span>{item.quantity}x {item.name}</span>
                      <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(item.price) * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.summary}>
                  <div className={styles.summaryRow}>
                    <span>Subtotal</span>
                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(order.subtotal))}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Delivery Fee</span>
                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(order.delivery_fee))}</span>
                  </div>
                  <div className={`${styles.summaryRow} ${styles.total}`}>
                    <span>Total</span>
                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(order.total))}</span>
                  </div>
                </div>
              </div>

              <div className={styles.orderFooter}>
                <span className={styles.date}>{new Date(order.created_at).toLocaleString()}</span>
                {order.status === OrderStatus.PENDING && (
                  <button 
                    className={styles.cancelBtn}
                    onClick={() => {
                      if(window.confirm('Are you sure you want to cancel this order?')) {
                        cancelMutation.mutate(order.id);
                      }
                    }}
                    disabled={cancelMutation.isPending}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}

          {orders?.length === 0 && (
            <div className={styles.emptyState}>
              <p>You haven't placed any orders yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
