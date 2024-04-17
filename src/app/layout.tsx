import DesignProvider from "../common/providers/design_provider";
import { Inter } from "next/font/google";
import Head from "next/head";
import "./globals.css";
import Header from "./Header";
import Footer from "./Footer";
import "../../global.css";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Read Scale",
  description: "積み上げた知識の高さを共有しよう",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/icon.ico" />
      </Head>
      <body>
        <Header />
        <DesignProvider>{children}</DesignProvider>
        <Footer />
      </body>
    </html>
  );
}
