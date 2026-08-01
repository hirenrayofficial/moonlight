import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import '@fontsource-variable/unbounded/wght.css';
import '@fontsource/gugi';
import '@fontsource/kalam';
import '@fontsource/sniglet';
import '@fontsource/dm-serif-text';
import Queryprovider from "@/services/provider/Queryprovider";

import Script from 'next/script';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
// const mono = Geist_Mono({
//   variable: "--font-geist-monoa",
//   subsets: ["latin"],
// });



export const metadata = {
  title: "Areca Leaf & Disposable Plates Manufacturer in India | Moonlight Machinery",
  description: "Leading manufacturer of eco-friendly areca leaf plates & disposable paper plates in India. 100% biodegradable, bulk orders, PAN-India & export shipping. Get a quote today.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}  h-full antialiased`}
    >
      <header>
        <meta name="google-site-verification" content="dIX2GPKVpfk8ZfH7slDv4gi69yJSFUftjATSqnlFGxU" />
        <Script
          id="google-tag-manager"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-5ZKB7HST');
            `,
          }}
        />
      </header>

      <body className="min-h-full bg-[#faf9f5] flex flex-col ">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5ZKB7HST"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript><Queryprovider>  {children}</Queryprovider>
      </body>

    </html>
  );
}
