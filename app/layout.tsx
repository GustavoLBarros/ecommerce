import type { Metadata } from "next";
import "./globals.css";
import { CarrinhoProvider } from "./context/carrinho-context";
import { CarrinhoUIProvider } from "./context/carrinho-ui-context";
import { Navbar } from "./components/navbar";
import CarrinhoModal from "./components/carrinho-modal";

export const metadata: Metadata = {
  title: "LIKEWORK",
  description: "Vista o trabalho duro.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <CarrinhoProvider>
          <CarrinhoUIProvider>
            <Navbar />
            {children}
            <CarrinhoModal />
          </CarrinhoUIProvider>
        </CarrinhoProvider>
      </body>
    </html>
  );
}