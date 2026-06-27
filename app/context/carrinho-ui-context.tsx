"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface CarrinhoUIContextType {
  aberto: boolean;
  abrirCarrinho: () => void;
  fecharCarrinho: () => void;
}

const CarrinhoUIContext = createContext<CarrinhoUIContextType | undefined>(undefined);

export function CarrinhoUIProvider({ children }: { children: ReactNode }) {
  const [aberto, setAberto] = useState(false);

  return (
    <CarrinhoUIContext.Provider
      value={{
        aberto,
        abrirCarrinho: () => setAberto(true),
        fecharCarrinho: () => setAberto(false),
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