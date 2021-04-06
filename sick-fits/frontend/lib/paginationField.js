/**
 * @file Pagination Field.
 *
 * Caching strategy for all products. By default, Apollo tries to
 * cache everything in initial page groups, but we want the products
 * to be cached as one list, so we write our own strategy.
 */

import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells apollo we will take care of everything
    read(existing = [], { args, cache }) {
      const { skip, first } = args;

      // Read the number of items on the page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // Check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);
      // If there are items, there aren't enough to fill page, and it's last page...
      if (items.length && items.length !== first && page === pages) {
        return items;
      }

      if (items.length !== first) {
        // We don't have any items, get them from the network.
        return false;
      }

      // If there are items, just reutrn them from the cache.
      if (items.length) {
        return items;
      }

      return false; // fallback to network
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      // This runs when the Apollo client comes back from the network with our product.
      const merged = existing ? existing.slice(0) : [];

      // We want our products to appear in order, so this will basically insert "empty" products if they haven't yet been fetched from the network.
      for (let i = skip; i < skip + incoming.length; i += 1) {
        merged[i] = incoming[i - skip];
      }

      // Finally we return the merged items from the cache,
      return merged;
    },
  };
}
