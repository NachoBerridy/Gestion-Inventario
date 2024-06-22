import "@/assets/styles/globals.css";
import Navbar from "@/components/Navbar";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ToastContainer />
      <div className="w-screen h-screen flex justify-start">
        <Navbar />
        <Component {...pageProps} />
      </div>
    </>
  );
}
