// Simple in-memory cache utility for API responses
class SimpleCache<T = unknown> {
  private cache: Map<string, { data: T; timestamp: number }> = new Map();
  private ttl: number; // Time to live in milliseconds

  constructor(ttl: number = 5 * 60 * 1000) { // Default 5 minutes
    this.ttl = ttl;
  }

  // Get cached data if it exists and hasn't expired
  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if item has expired
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  // Set data in cache
  set(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Delete data from cache
  delete(key: string): void {
    this.cache.delete(key);
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
  }

  // Get cache size
  size(): number {
    return this.cache.size;
  }
}

// Create a singleton instance
const cache = new SimpleCache();
export default cache;