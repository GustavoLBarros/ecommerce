"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface ContaUIContextType {
  aberto: boolean;
  abrirConta: () => void;
  fecharConta: () => void;
}

const ContaUIContext = createContext<ContaUIContextType | undefined>(undefined);

export function ContaUIProvider({ children }: { children: ReactNode }) {
  const [aberto, setAberto] = useState(false);

  return (
    <ContaUIContext.Provider
      value={{
        aberto,
        abrirConta: () => setAberto(true),
        fecharConta: () => setAberto(false),
      }}
    >
      {children}
    </ContaUIContext.Provider>
  );
}

export function useContaUI() {
  const context = useContext(ContaUIContext);
  if (!context) {
    throw new Error("useContaUI deve ser usado dentro de um ContaUIProvider");
  }
  return context;
}