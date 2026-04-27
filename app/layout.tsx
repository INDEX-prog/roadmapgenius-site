import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "RoadmapGenius - Create stunning product roadmaps that inspire and delight!",
  description: "Un SaaS pour créer des roadmaps produit qui ne seront jamais respectées, en beauté. Destiné aux entrepreneurs et chefs de produit.",
  keywords: ["roadmap", "product management", "SaaS", "planning", "roadmap tool"],
  authors: [{ name: "RoadmapGenius" }],
  openGraph: {
    title: "RoadmapGenius - Create stunning product roadmaps that inspire and delight!",
    description: "Un SaaS pour créer des roadmaps produit qui ne seront jamais respectées, en beauté.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="fr">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <AnalyticsProvider>
            {children}
          </AnalyticsProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
