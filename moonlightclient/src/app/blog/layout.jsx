import React from "react";
import Header from "./component/fixed/Header";
import Footer from "./component/fixed/Footer";
import Queryprovider from "@/services/provider/Queryprovider";

export const metadata = {
  title:
    "Paper Plate Making Machine Price in India (2026) | Hydraulic & Automatic Models - Moonlight Machinery",
  description:
    "Looking to start a paper plate manufacturing business? Explore hydraulic, semi-automatic, and double-die paper plate making machines in India. Get specifications, pricing, and factory quotes from Moonlight Machinery.",
  keywords: [
    "paper plate making machine price in india",
    "hydraulic paper plate machine",
    "automatic paper plate making machine",
    "don Dona plate machine manufacturer",
    "biodegradable plate making machine",
    "Moonlight Machinery",
  ],
  openGraph: {
    title: "Paper Plate Making Machine Price & Guide | Moonlight Machinery",
    description:
      "Complete buyer's guide to paper plate and areca leaf plate making machines in India. Compare hydraulic, automatic, and double-die models.",
    url: "https://www.moonlightmachinery.com/blog", // Update with your actual domain path
    siteName: "Moonlight Machinery",
    type: "article",
  },
};

export default function BlogLayout({ children }) {
  return (
    <Queryprovider>
      <div>
        <header>
          <Header />
        </header>
        <main className="pt-[120px]">{children}</main>
        <footer>
          <Footer />
        </footer>
      </div>
    </Queryprovider>
  );
}
