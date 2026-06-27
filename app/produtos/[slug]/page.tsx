"use client";
import { useState, use } from "react";
import { PRODUTOS_MOCK } from "../../data/produtos-mock";
import { useCarrinho } from "../../context/carrinho-context";
import { notFound } from "next/navigation";

interface PaginaProdutoProps {
  params: Promise<{ slug: string }>;
}

export default function PaginaProduto({ params }: PaginaProdutoProps) {
  const { slug } = use(params);
  const produto = PRODUTOS_MOCK.find((p) => p.slug === slug);
  const { adicionarAoCarrinho } = useCarrinho();

  if (!produto) notFound();

  const [opcaoSelecionada, setOpcaoSelecionada] = useState(
    produto.opcoes?.valores[0] || ""
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="lg:grid grid-cols-2 lg:items-start lg:gap-x-8">
        
        {/* Imagem do Produto ajustada com o caminho correto do card */}
        <div className="aspect-square w-full overflow-hidden rounded-sm bg-zinc-100">
          <img 
            src={`/${produto.imagem}`} 
            alt={produto.nome} 
            className="h-full w-full object-cover object-center" 
          />
        </div>

        {/* Detalhes do Produto */}
        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
          <h1 className="text-3xl font-black italic tracking-tighter text-zinc-900 uppercase">
            {produto.nome}
          </h1>
          
          {/* Container de Preços */}
          <div className="mt-3 flex items-baseline gap-3">
            {produto.precoOriginal && (
              <span className="text-xl font-normal line-through text-[#9E4733]">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(produto.precoOriginal)}
              </span>
            )}
            <p className="text-3xl tracking-tight text-zinc-950 font-bold">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(produto.preco)}
            </p>
          </div>

          <p className="mt-6 text-base text-zinc-600 leading-relaxed">{produto.descricao}</p>

          {/* Opções Dinâmicas (Tamanho / Grade) - Sem o roxo/azul antigo */}
          {produto.opcoes && (
            <div className="mt-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                {produto.opcoes.nome}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {produto.opcoes.valores.map((val) => (
                  <button
                    key={val}
                    onClick={() => setOpcaoSelecionada(val)}
                    className={`cursor-pointer rounded-sm px-5 py-2.5 text-xs font-bold uppercase tracking-wider border transition-all ${
                      opcaoSelecionada === val
                        ? "border-[#C88A36] bg-[#C88A36]/5 text-[#C88A36]"
                        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Botão de Compra - Agora no tom industrial robusto */}
          <button
            onClick={() => adicionarAoCarrinho(produto, opcaoSelecionada)}
            className="cursor-pointer mt-8 flex w-full items-center justify-center rounded-sm bg-[#2D3A44] px-8 py-4 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#2D3A44]/95 transition-colors"
          >
            Adicionar ao Carrinho
          </button>
        </div>

      </div>
    </div>
  );
}