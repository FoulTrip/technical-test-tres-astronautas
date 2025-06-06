import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/ui/NavBar";
import { DarkModeProvider } from "@/context/DarkModeContext";

export const metadata: Metadata = {
  title: "Planets",
  description: "Developement by FoulTrip",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <DarkModeProvider>
          <NavBar />
          {children}
        </DarkModeProvider>
      </body>
    </html>
  );
}
