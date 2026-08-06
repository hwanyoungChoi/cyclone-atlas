import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "전 세계 태풍 경로 지도 | Cyclone Atlas",
  description: "태풍·허리케인·사이클론의 과거 경로를 연도별로 탐색하는 글로벌 태풍 지도입니다.",
  openGraph: {
    title: "전 세계 태풍 경로 지도 | Cyclone Atlas",
    description: "태풍·허리케인·사이클론의 모든 경로를 지도에서 탐색하세요.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "전 세계 태풍 경로 지도 | Cyclone Atlas",
    description: "태풍·허리케인·사이클론의 모든 경로를 지도에서 탐색하세요.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
