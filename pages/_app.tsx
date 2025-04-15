import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <Head>
      <title>App de Metas</title>
    </Head>
    <Component {...pageProps} />
    </>
  );
}
