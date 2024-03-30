import DesignProvider from "../common/providers/design_provider";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <DesignProvider>{children}</DesignProvider>
      </body>
    </html>
  );
}
