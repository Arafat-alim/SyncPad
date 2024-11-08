import type { Metadata } from "next";
import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Provider from "./Provider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Sync Pad - Bringing Teams Together, One Idea at a Time",
  description:
    "A seamless online collaboration platform that brings your team together to create, edit, and share documents in real-time. Experience effortless teamwork, anytime, anywhere.",
  openGraph: {
    title: "Sync Pad - Bringing Teams Together, One Idea at a Time",
    description:
      "A seamless online collaboration platform that brings your team together to create, edit, and share documents in real-time. Experience effortless teamwork, anytime, anywhere.",
    url: "https://yourwebsite.com",
    siteName: "Sync Pad",
    images: [
      {
        url: "https://res.cloudinary.com/cocoder/image/upload/w_430/v1731081371/Projects/SyncPad/logo_babb36.png", // Replace with your actual logo URL
        width: 1200,
        height: 630,
        alt: "Sync Pad Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sync Pad - Bringing Teams Together, One Idea at a Time",
    description:
      "A seamless online collaboration platform that brings your team together to create, edit, and share documents in real-time.",
    images: [
      "https://res.cloudinary.com/cocoder/image/upload/w_430/v1731081371/Projects/SyncPad/logo_babb36.png",
    ], // Replace with your actual logo URL
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#3372FF",
          fontSize: "26",
        },
      }}
    >
      <html lang="en">
        <body className={`${fontSans.className} min-h-screen antialiased`}>
          <Provider>{children}</Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
