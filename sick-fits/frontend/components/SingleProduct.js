/**
 * @file Single Product component.
 *
 * Single product component, for /product/:id.
 */

import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import styled from 'styled-components';
import DisplayError from './ErrorMessage';
import formatMoney from '../lib/formatMoney';

const ProductStyles = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  max-width: var(--maxWidth);
  align-items: top;
  gap: 2rem;
  img {
    width: 100%;
    object-fit: contain;
  }
`;

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      name
      price
      description
      id
      photo {
        altText
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

export default function SingleProduct({ productId }) {
  const { data, loading, error } = useQuery(SINGLE_ITEM_QUERY, {
    variables: { id: productId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;

  const { name, description, price, id, photo } = data.Product;

  return (
    <ProductStyles>
      <Head>
        <title>{name}</title>
      </Head>
      <img src={photo?.image?.publicUrlTransformed} alt={photo?.altText} />
      <div className="details">
        <h2>{name}</h2>
        <p>{description}</p>
        <p>{formatMoney(price)}</p>
      </div>
    </ProductStyles>
  );
}
