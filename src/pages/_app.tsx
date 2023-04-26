import { Provider } from 'jotai';
import '../style/dist/output.css';
import '../style/index.scss';
import 'react-datepicker/dist/react-datepicker.css';
import type { AppProps } from 'next/app';

function App({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <Component {...pageProps} />
    </Provider>
  );
}

export default App;
