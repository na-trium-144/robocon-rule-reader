// import '@/styles/globals.css'
import { Inter } from "@next/font/google";
import AppBar from "components/appbar";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }) {
  return (
    <div className={inter.className}>
      <AppBar />
      <Component {...pageProps} />
    </div>
  );
}
