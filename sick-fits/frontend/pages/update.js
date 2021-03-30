/**
 * @file Update route
 *
 * Entry for /update.
 */

import UpdateProduct from '../components/UpdateProduct';

export default function UpdatePage({ query }) {
  return (
    <div>
      <UpdateProduct productId={query.id} />
    </div>
  );
}
