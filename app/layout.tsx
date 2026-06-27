import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CarrinhoProvider } from "./context/carrinho-context";
import { Navbar } from "./components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LIKEWORK | Equipamentos e Vestuário Premium",
  description:
    "Explore nossa linha exclusiva de vestuário e equipamentos de alta performance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className="h-full"
      style={{
        colorScheme: "light",
        backgroundColor: "#ffffff",
      }}
    >
      <body
        className={`${inter.className} w-full min-h-screen bg-[#f5f4f0] text-zinc-900 antialiased`}
      >
        <CarrinhoProvider>
          <Navbar />
          <main className="min-h-screen w-full bg-[#f5f4f0]">
            {children}
          </main>
        </CarrinhoProvider>
      </body>
    </html>
  );
}