import React from 'react';
import '../style/dist/output.css';
import '../style/index.scss';

export default async function RootLayout({
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
