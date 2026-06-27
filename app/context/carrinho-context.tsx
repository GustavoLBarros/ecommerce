"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { ItemCarrinho, Produto } from "../types/ecom";

interface CarrinhoContextType {
  itens: ItemCarrinho[];
  adicionarAoCarrinho: (produto: Produto, opcao?: string) => void;
  removerDoCarrinho: (id: string, opcao?: string) => void;
  atualizarQuantidade: (id: string, opcao: string | undefined, novaQuantidade: number) => void;
  limparCarrinho: () => void;
  totalItens: number;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);

  const adicionarAoCarrinho = (produto: Produto, opcao?: string) => {
    setItens((prev) => {
      const existe = prev.find((i) => i.produto.id === produto.id && i.opcaoSelecionada === opcao);
      if (existe) {
        return prev.map((i) =>
          i.produto.id === produto.id && i.opcaoSelecionada === opcao
            ? { ...i, quantidade: i.quantidade + 1 }
            : i
        );
      }
      return [...prev, { produto, quantidade: 1, opcaoSelecionada: opcao }];
    });
  };

  const removerDoCarrinho = (id: string, opcao?: string) => {
    setItens((prev) => prev.filter((i) => !(i.produto.id === id && i.opcaoSelecionada === opcao)));
  };

  const atualizarQuantidade = (id: string, opcao: string | undefined, novaQuantidade: number) => {
    if (novaQuantidade < 1) {
      removerDoCarrinho(id, opcao);
      return;
    }
    setItens((prev) =>
      prev.map((i) =>
        i.produto.id === id && i.opcaoSelecionada === opcao
          ? { ...i, quantidade: novaQuantidade }
          : i
      )
    );
  };

  const limparCarrinho = () => setItens([]);
  const totalItens = itens.reduce((acc, curr) => acc + curr.quantidade, 0);

  return (
    <CarrinhoContext.Provider
      value={{ itens, adicionarAoCarrinho, removerDoCarrinho, atualizarQuantidade, limparCarrinho, totalItens }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export const useCarrinho = () => {
  const context = useContext(CarrinhoContext);
  if (!context) throw new Error("useCarrinho deve ser usado com CarrinhoProvider");
  return context;
};