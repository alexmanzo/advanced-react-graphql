/**
 * @file Product route
 *
 * Entry for /product/:id
 *
 * @param id|string ID of the product.
 */

import SingleProduct from '../../components/SingleProduct';

export default function SingleProductPage({ query }) {
  return <SingleProduct productId={query.id} />;
}
