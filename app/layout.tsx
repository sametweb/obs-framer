import { GOOGLE_FONTS } from "@/lib/fonts";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OBS Framer",
  description: "OBS Framer App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This forces the layout to be dynamic
  headers();

  return (
    <html lang="en">
      <head>
        <link
          href={`https://fonts.googleapis.com/css2?${GOOGLE_FONTS.map(
            (font) =>
              `family=${font.replace(
                " ",
                "+"
              )}:wght@400;500;600;700&display=swap`
          ).join("&")}`}
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
