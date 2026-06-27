"use client";
import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface CarrinhoUIContextType {
  aberto: boolean;
  abrirCarrinho: () => void;
  fecharCarrinho: () => void;
  chaveAnimacao: number;
  dispararAnimacaoIcone: () => void;
}

const CarrinhoUIContext = createContext<CarrinhoUIContextType | undefined>(undefined);

export function CarrinhoUIProvider({ children }: { children: ReactNode }) {
  const [aberto, setAberto] = useState(false);
  const [chaveAnimacao, setChaveAnimacao] = useState(0);

  const dispararAnimacaoIcone = useCallback(() => {
    setChaveAnimacao((prev) => prev + 1);
  }, []);

  return (
    <CarrinhoUIContext.Provider
      value={{
        aberto,
        abrirCarrinho: () => setAberto(true),
        fecharCarrinho: () => setAberto(false),
        chaveAnimacao,
        dispararAnimacaoIcone,
      }}
    >
      {children}
    </CarrinhoUIContext.Provider>
  );
}

export function useCarrinhoUI() {
  const context = useContext(CarrinhoUIContext);
  if (!context) {
    throw new Error("useCarrinhoUI deve ser usado dentro de um CarrinhoUIProvider");
  }
  return context;
}