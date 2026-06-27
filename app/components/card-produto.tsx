"use client";
import Link from "next/link";
import { useState } from "react";
import { Produto } from "../types/ecom";
import { useCarrinho } from "../context/carrinho-context";
import { ShoppingBag, Plus } from "lucide-react";

export function CardProduto({ produto }: { produto: Produto }) {
  const { adicionarAoCarrinho } = useCarrinho();
  // Estado para controlar se o mouse está em cima do botão de comprar
  const [isOverButton, setIsOverButton] = useState(false);

  const handleComprar = (e: React.MouseEvent) => {
    e.preventDefault(); // Bloqueia o redirecionamento do Link pai
    e.stopPropagation(); // Isola completamente o evento de clique
    adicionarAoCarrinho(produto, produto.opcoes?.valores[0] || "");
  };

  return (
    <Link
      href={`/produtos/${produto.slug}`}
      className="group flex flex-col w-full bg-[#f5f4f0] text-left rounded-none"
    >
      {/* 1. CONTAINER DA IMAGEM */}
      {/* O zoom só acontece se o mouse NÃO estiver em cima do botão de comprar */}
      <div className="aspect-[3/4] w-full bg-[#fcfcfc] overflow-hidden relative">
        <img
          src={produto.imagem}
          alt={produto.nome}
          className={`h-full w-full object-cover object-center transition-transform duration-500 ${isOverButton ? "scale-100" : "group-hover:scale-[1.01]"
            }`}
        />
      </div>

      {/* 2. TEXTOS (Nome e Preços) */}
      <div className="mt-1.5 flex flex-col space-y-0.5 px-0.5">
        <h3 className="text-[13px] font-normal text-zinc-600 tracking-wide line-clamp-1">
          {produto.nome}
        </h3>

        {/* Container dos preços alinhados lado a lado */}
        <div className="flex items-baseline gap-2">
          {produto.precoOriginal && (
            <span className="text-[12px] font-normal line-through text-[#9E4733]">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(produto.precoOriginal)}
            </span>
          )}

          <p className="text-[14px] font-bold text-zinc-900">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(produto.preco)}
          </p>
        </div>
      </div>

      <div className="mt-2 w-full flex justify-center relative z-10 px-0.5">
        <button
          onClick={handleComprar}
          onMouseEnter={() => setIsOverButton(true)}  // Bloqueia o zoom do card
          onMouseLeave={() => setIsOverButton(false)} // Libera o zoom do card
          className="cursor-pointer flex items-center justify-center gap-1.5 bg-[#2D3A44] text-white py-2 px-4 rounded-sm hover:bg-[#2D3A44]/95 transition-colors"
          title="Adicionar ao carrinho"
        >
          <div className="relative flex items-center justify-center">
            <ShoppingBag className="h-4 w-4 stroke-[1.5]" />
            <Plus className="h-2 w-2 stroke-[2.5] absolute -bottom-0.5 -right-0.5 bg-[#C88A36] rounded-full" />
          </div>
          <span className="text-[12px] font-medium tracking-wider pl-1 whitespace-nowrap">
            Adicionar ao Carrinho
          </span>
        </button>
      </div>
    </Link>
  );
}