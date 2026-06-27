"use client";
import { useState } from "react";
import { PRODUTOS_MOCK } from "./data/produtos-mock";
import { CardProduto } from "./components/card-produto";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

export default function Home() {
  const [ordenacao, setOrdenacao] = useState<string>("DESTAQUES");

  return (
    <div className="w-full bg-[#f5f4f0] pb-24">
      <div className="w-full relative">
        <img
          src="/banner.png"
          alt="Campanha Liqui"
          className="w-full h-[340px] sm:h-auto object-cover object-center"
        />

        <div className="absolute inset-0 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-11 flex justify-end items-start">
          <h1
            className="text-right text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white uppercase leading-[0.95] max-w-[150px] sm:max-w-xl"
            style={{ fontFamily: "sans-serif" }}
          >
            Vista o <br />
            trabalho <br />
            duro. <br />
            <span className="italic">Enfrente</span> <br />
            qualquer <br />
            cenário.
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-100 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <button className="cursor-pointer flex items-center justify-center gap-2 bg-[#2D3A44] text-white px-4 py-2 rounded-sm font-semibold text-[12px] tracking-widest hover:bg-[#2D3A44]/95 transition-colors">
              <SlidersHorizontal className="h-4 w-4 stroke-[2.5]" />
              Filtros
            </button>
            <span className="text-sm font-light text-zinc-400">
              {PRODUTOS_MOCK.length} produtos encontrados
            </span>
          </div>

          <div className="flex items-center justify-start sm:justify-end">
            <div className="relative inline-block text-left w-full sm:w-auto">
              <div className="flex items-center justify-between gap-1 bg-[#f5f4f0] px-4 py-2.5 rounded-sm text-sm text-zinc-600 w-full sm:w-auto">
                <span>Ordenar por:</span>
                <button className="cursor-pointer flex items-center tracking-wider gap-1 font-semibold text-zinc-900">
                  {ordenacao}
                  <ChevronDown className="h-4 w-4 text-zinc-500" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-10 lg:grid-cols-4 xl:gap-x-1">
          {PRODUTOS_MOCK.map((produto) => (
            <CardProduto key={produto.id} produto={produto} />
          ))}
        </div>
      </div>
    </div>
  );
}