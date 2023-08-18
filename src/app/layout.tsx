import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-color-palette/css';
import '../style/dist/output.css';
import '../style/index.scss';

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
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
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
      <body>{children}</body>
    </html>
  );
}
