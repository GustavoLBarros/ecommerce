import type { Metadata } from "next";
import "./globals.css";
import { CarrinhoProvider } from "./context/carrinho-context";
import { CarrinhoUIProvider } from "./context/carrinho-ui-context";
import { UsuarioProvider } from "./context/usuario-context";
import { ContaUIProvider } from "./context/conta-ui-context";
import { Navbar } from "./components/navbar";
import CarrinhoModal from "./components/carrinho-modal";
import ContaModal from "./components/conta-modal";

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
          <UsuarioProvider>
            <CarrinhoUIProvider>
              <ContaUIProvider>
                <Navbar />
                {children}
                <CarrinhoModal />
                <ContaModal />
              </ContaUIProvider>
            </CarrinhoUIProvider>
          </UsuarioProvider>
        </CarrinhoProvider>
      </body>
    </html>
  );
}