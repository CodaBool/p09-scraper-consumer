import Head from 'next/head'
import Navigation from '../components/Navigation'
// import Footer from '../components/Footer'
import Container from 'react-bootstrap/Container'
import Script from 'next/script'
import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function App({ Component, pageProps }) {
  return (
    <div className="site">
      <Head>
        <title>Web Scrapper</title>
        <meta charSet="UTF-8" />
        <meta name="description" content="Web Scrapper" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" type="image/png" sizes="32x32" href="/image/favicon-32x32.gif" />
        <link rel="icon" type="image/png" sizes="16x16" href="/image/favicon-16x16.gif" />
        <link rel="apple-touch-icon" href="/image/favicon-32x32.gif" />
        <Script src="https://cpwebassets.codepen.io/assets/embed/ei.js" />
      </Head>
      <Navigation />
      <main className="site-content">
        <Container fluid={'md'} className="p-0">
          <Component {...pageProps} />
        </Container>
      </main>
      {/* <Footer /> */}
    </div>
  )
}