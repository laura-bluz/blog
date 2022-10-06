import { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Head>
        <title>Blog Space</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
