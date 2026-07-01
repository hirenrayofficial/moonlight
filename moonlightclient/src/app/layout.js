import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/component/home/fixed/Header";
import localFont from 'next/font/local'
import '@fontsource-variable/unbounded/wght.css';
import '@fontsource/gugi';
import '@fontsource/kalam';
import '@fontsource/sniglet';
import '@fontsource/dm-serif-text';
import Footer from "@/component/home/fixed/Footer";
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

const myfont = localFont({
  src: [
    { path: "./geist-mono-latin-300-normal.ttf", weight: '400', style: "normal" },
  ],
  variable: "--font-myfont",
});

export const metadata = {
  title: "MoonLight — Product Launch Studio",
  description: "A premium responsive landing page for product launches, built with Next.js, Tailwind, and motion design.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${myfont.variable} h-full antialiased`}
    >
      <header>
        <Header />
      </header>
      <body className="min-h-full bg-[#faf9f5] flex flex-col ">{children}</body>
      <footer>
        <Footer />
      </footer>
    </html>
  );
}
