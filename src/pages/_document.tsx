import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <title>Dev Event Client</title>
        <link
          href="https://fengyuanchen.github.io/cropper/css/cropper.css"
          rel="stylesheet"
        />
        <script src="https://fengyuanchen.github.io/cropper/js/cropper.js" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
