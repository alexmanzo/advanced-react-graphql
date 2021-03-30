/**
 * @file App
 *
 * Custom App in Next.js: https://nextjs.org/docs/advanced-features/custom-document
 *
 * Using customizations we're able to:
 * - persist layout between pages (see Page component)
 * - add global styles (see Page component)
 * - wrap our entire app in Apollo Provider
 *
 * Note: apollo-boost is the fastest, zero config way to
 * get up and running with Apollo. We aren't using it here
 * since we need to implement a third-party solution for
 * image uploads.
 */

import { ApolloProvider } from '@apollo/client';
import NProgress from 'nprogress';
import Router from 'next/router';
import Page from '../components/Page';
import '../components/styles/nprogress.css';
import withData from '../lib/withData';

/**
 * Simple JS library to visualize route changes with a progress bar.
 *
 * https://ricostacruz.com/nprogress/
 */
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

// The withData function will add these props.
function MyApp({ Component, pageProps, apollo }) {
  return (
    <ApolloProvider client={apollo}>
      <Page>
        <Component {...pageProps} />
      </Page>
    </ApolloProvider>
  );
}

// If pages have getInitialProps, tell Next.js to wait while we fetch it.
MyApp.getInitialProps = async function ({ Component, ctx }) {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  pageProps.query = ctx.query;
  return pageProps;
};

export default withData(MyApp);
