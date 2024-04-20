import DesignProvider from "../common/providers/design_provider";
import { notoSansJP } from "@/app/fonts";
import Head from "next/head";
import "./globals.css";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";
import "../../global.css";
import type { Metadata } from "next";

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
      <body
        className={`${notoSansJP.className} antialiased flex flex-col min-h-screen`}
      >
        <Header />
        <main className="flex-1">
          <DesignProvider>{children}</DesignProvider>
        </main>
        <Footer />
      </body>
    </html>
  );
}
