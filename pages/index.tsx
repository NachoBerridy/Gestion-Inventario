import { Inter } from "next/font/google";
import LandingPage from "./LandingPage";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main style={{ width: "100vw", height: "100vh", display: "flex" }}>
      <LandingPage />
    </main>
  );
}
