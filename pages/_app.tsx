import type { AppProps } from 'next/app'
import '../globals.css'  // Adjust the path if necessary

function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />
}

export default MyApp