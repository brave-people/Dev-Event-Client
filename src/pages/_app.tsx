import React from 'react';
import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import '../style/dist/output.css';
import '../style/index.scss';

function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  );
}

export default App;
