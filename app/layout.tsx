import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CarrinhoProvider } from "./context/carrinho-context";
import { Navbar } from "./components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LIKEWORK | Equipamentos e Vestuário Premium",
  description: "Explore nossa linha exclusiva de vestuário e equipamentos de alta performance. Conforto, estilo e durabilidade para a sua rotina.",
  keywords: ["likework", "vestuário", "jaqueta náutica", "moda masculina", "equipamentos"],
  authors: [{ name: "Likework Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full scroll-smooth">
      <body className={`${inter.className} bg-[#f5f4f0] antialiased min-h-full flex flex-col text-zinc-900`}>
        <CarrinhoProvider>
          <Navbar />
          <main className="flex-1 w-full flex flex-col">
            {children}
          </main>
        </CarrinhoProvider>
      </body>
    </html>
  );
}