import DesignProvider from "../common/providers/design_provider";
import { Inter } from "next/font/google";
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
      <body>
        <Header />
        <DesignProvider>{children}</DesignProvider>
        <Footer />
      </body>
    </html>
  );
}
