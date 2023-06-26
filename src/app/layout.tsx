import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import '../style/dist/output.css';
import '../style/index.scss';
import { Noto_Sans_KR } from 'next/font/google';

const notosans = Noto_Sans_KR({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin'],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <title>Dev Event Client</title>
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <link
          href="https://fengyuanchen.github.io/cropper/css/cropper.css"
          rel="stylesheet"
        />
      </head>
      <body className={notosans.className}>{children}</body>
    </html>
  );
}
