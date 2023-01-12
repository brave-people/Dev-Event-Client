import React from 'react';
// import type { AppProps } from 'next/app';
// import { Provider } from 'jotai';
import '../style/dist/output.css';
import '../style/index.scss';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head />
      <body>{children}</body>
    </html>
  );
}
