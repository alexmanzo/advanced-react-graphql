/**
 * @file withData
 *
 * Boilerplate code. Without custom config, would likely opt to use
 * apollo-boost package since it has zero config.
 *
 * This would generally always be code that would be copied/pasted
 * from an example.
 */

import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/link-error';
import { getDataFromTree } from '@apollo/client/react/ssr';
import { createUploadLink } from 'apollo-upload-client';
import withApollo from 'next-with-apollo';
import { endpoint, prodEndpoint } from '../config';

function createClient({ headers, initialState }) {
  return new ApolloClient({
    link: ApolloLink.from([
      // Handles errors, and differentiates between GraphQL and network errors.
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );
        if (networkError)
          console.log(
            `[Network error]: ${networkError}. Backend is unreachable. Is it running?`
          );
      }),
      // This uses apollo-link-http under the hood, so all the options here come from that package.
      createUploadLink({
        uri: process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint,
        fetchOptions: {
          // We need to see if users are logged in.
          credentials: 'include',
        },
        // Necessary for server-side rendering a logged-in state.
        headers,
      }),
    ]),
    // How are we storying cache?
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            // TODO: We will add this together!
            // allProducts: paginationField(),
          },
        },
      },
    }).restore(initialState || {}), // Basically 'hydrates' client side with data.
  });
}

// Crawl all of our pages for queries, will wait for that data fetch before rendering from server.
export default withApollo(createClient, { getDataFromTree });
