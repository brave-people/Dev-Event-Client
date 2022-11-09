import React from 'react';
import type { AppProps } from 'next/app';
import { Provider } from 'jotai';
import '../style/dist/output.css';
import '../style/index.scss';

function App({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <Component {...pageProps} />
    </Provider>
  );
}

export default App;
