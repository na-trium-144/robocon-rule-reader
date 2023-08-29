// import '@/styles/globals.css'
import { Inter } from "@next/font/google";
import AppBar from "components/appbar";
import { ApiProvider } from "components/apiprovider";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ["latin"] });

export default function App(props: { Component: any; pageProps: any }) {
  return (
    <div className={inter.className}>
      <ApiProvider>
        <AppBar />
        <props.Component {...props.pageProps} />
      </ApiProvider>
    </div>
  );
}
