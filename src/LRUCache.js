import { useState, useCallback } from "react";

function useLRUCache(limit) {
  const [cache, setCache] = useState(new Map());
  const [fetchedKeys, setFetchedKeys] = useState(new Set());

  // Set a value in the cache
  const set = useCallback(
    (key, value) => {
      setCache((prevCache) => {
        const updatedCache = new Map(prevCache);

        if (updatedCache.has(key)) {
          updatedCache.delete(key);
        } else if (updatedCache.size === limit) {
          updatedCache.delete(updatedCache.keys().next().value); // Remove the LRU item
        }

        updatedCache.set(key, value);
        return updatedCache;
      });
    },
    [limit]
  );

  // Get the cached value
  const get = useCallback(
    (key, fetchData) => {
      if (!cache.has(key)) {
        // Check if we've fetched this key before
        if (!fetchedKeys.has(key) && typeof fetchData === "function") {
          // Fetch data if it's the first time we're accessing this key
          const value = fetchData(key);
          set(key, value); // Cache it
          setFetchedKeys(
            (prevFetchedKeys) => new Set([...prevFetchedKeys, key])
          );
          return value;
        }
        return null;
      }

      const value = cache.get(key);

      // Move the accessed item to the end to mark it as most recently used
      setCache((prevCache) => {
        const updatedCache = new Map(prevCache);
        updatedCache.delete(key);
        updatedCache.set(key, value);
        return updatedCache;
      });

      return value;
    },
    [cache, fetchedKeys, set]
  );

  // Clear the cache
  const reset = useCallback(() => {
    setCache(new Map());
    setFetchedKeys(new Set());
  }, []);

  return { get, set, reset };
}

export default useLRUCache;
