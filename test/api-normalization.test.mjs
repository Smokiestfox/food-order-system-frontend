import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fromApiPayload, toApiPayload } from '../src/services/normalize.ts';

test('nested order payload matches NestJS camelCase DTOs without mutating the cart', () => {
  const cart = { restaurant_id: 'restaurant-id', delivery_address: 'Demo address', items: [{ menu_item_id: 'item-id', quantity: 2 }] };
  assert.deepEqual(toApiPayload(cart), { restaurantId: 'restaurant-id', deliveryAddress: 'Demo address', items: [{ menuItemId: 'item-id', quantity: 2 }] });
  assert.equal(cart.items[0].menu_item_id, 'item-id');
});

test('PostgreSQL decimals and nested entities match the frontend contract', () => {
  assert.deepEqual(fromApiPayload({ access_token: 'token', user: { avatarUrl: null, createdAt: 'date' }, data: [{ imageUrl: '/food.png', rating: '4.50', menuItems: [{ price: '55000.00', isAvailable: true }] }] }), {
    access_token: 'token', user: { avatar_url: null, created_at: 'date' }, data: [{ image_url: '/food.png', rating: 4.5, menu_items: [{ price: 55000, is_available: true }] }],
  });
  assert.deepEqual(fromApiPayload({ price: 'unknown', note: '123', deliveryFee: '0.00' }), { price: 'unknown', note: '123', delivery_fee: 0 });
});
