/**
 * @file Document
 *
 * Custom Document in Next.js: https://nextjs.org/docs/advanced-features/custom-document
 * Enables server side rendering for styled components: https://styled-components.com/docs/advanced#server-side-rendering
 */

import Document, { Head, Html, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet();
    const page = renderPage((App) => (props) =>
      sheet.collectStyles(<App {...props} />)
    );
    const styleTags = sheet.getStyleElement();
    return { ...page, styleTags };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
