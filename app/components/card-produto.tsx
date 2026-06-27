"use client";
import Link from "next/link";
import { useState } from "react";
import { Produto } from "../types/ecom";
import { useCarrinho } from "../context/carrinho-context";
import { useCarrinhoUI } from "../context/carrinho-ui-context";
import { ShoppingBag, Plus } from "lucide-react";

export function CardProduto({ produto }: { produto: Produto }) {
  const { adicionarAoCarrinho } = useCarrinho();
  const { dispararAnimacaoIcone } = useCarrinhoUI();
  const [isOverButton, setIsOverButton] = useState(false);

  const handleComprar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    adicionarAoCarrinho(produto, produto.opcoes?.valores[0] || "");
    dispararAnimacaoIcone();
  };

  return (
    <Link
      href={`/produtos/${produto.slug}`}
      className="group flex flex-col w-full bg-[#f5f4f0] text-left rounded-none"
    >
      <div className="aspect-[3/4] w-full bg-[#fcfcfc] overflow-hidden relative">
        <img
          src={produto.imagem}
          alt={produto.nome}
          className={`h-full w-full object-cover object-center transition-transform duration-500 ${
            isOverButton ? "scale-100" : "group-hover:scale-[1.01]"
          }`}
        />
      </div>

      <div className="mt-1.5 flex flex-col space-y-0.5 px-0.5">
        <h3 className="text-[12px] sm:text-[13px] font-normal text-zinc-600 tracking-wide line-clamp-1">
          {produto.nome}
        </h3>

        <div className="flex items-baseline gap-1.5 flex-wrap">
          {produto.precoOriginal && (
            <span className="text-[10px] sm:text-[12px] font-normal line-through text-[#9E4733]">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(produto.precoOriginal)}
            </span>
          )}

          <p className="text-[12px] sm:text-[14px] font-bold text-zinc-900">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(produto.preco)}
          </p>
        </div>
      </div>

      <div className="mt-1.5 w-full flex justify-center relative z-10 px-0.5">
        <button
          onClick={handleComprar}
          onMouseEnter={() => setIsOverButton(true)}
          onMouseLeave={() => setIsOverButton(false)}
          className="cursor-pointer w-full flex items-center justify-center gap-1 bg-[#2D3A44] text-white py-1.5 px-2.5 sm:py-2 sm:px-4 rounded-sm hover:bg-[#2D3A44]/95 transition-colors"
          title="Adicionar ao carrinho"
        >
          <div className="relative flex items-center justify-center">
            <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[1.5]" />
            <Plus className="h-1.5 w-1.5 sm:h-2 sm:w-2 stroke-[2.5] absolute -bottom-0.5 -right-0.5 bg-[#C88A36] rounded-full" />
          </div>
          <span className="text-[8px] sm:text-[12px] font-medium tracking-wide pl-0.5 whitespace-nowrap">
            Adicionar ao Carrinho
          </span>
        </button>
      </div>
    </Link>
  );
}