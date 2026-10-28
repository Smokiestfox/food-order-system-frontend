const numericFields = new Set(['price', 'rating', 'subtotal', 'total', 'delivery_fee']);

function mapPayload(value: unknown, direction: 'request' | 'response'): unknown {
  if (Array.isArray(value)) return value.map((item) => mapPayload(item, direction));
  if (value === null || typeof value !== 'object' || Object.getPrototypeOf(value) !== Object.prototype) return value;
  return Object.fromEntries(Object.entries(value).map(([key, field]) => {
    const mappedKey = direction === 'request'
      ? key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase())
      : key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    const mappedValue = mapPayload(field, direction);
    // PostgreSQL decimal columns arrive as strings; the UI formats them as numbers.
    if (direction === 'response' && numericFields.has(mappedKey) && typeof mappedValue === 'string' && mappedValue.trim() !== '' && Number.isFinite(Number(mappedValue))) {
      return [mappedKey, Number(mappedValue)];
    }
    return [mappedKey, mappedValue];
  }));
}

export const toApiPayload = (value: unknown): unknown => mapPayload(value, 'request');
export const fromApiPayload = (value: unknown): unknown => mapPayload(value, 'response');
