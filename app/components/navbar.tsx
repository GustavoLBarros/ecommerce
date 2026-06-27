"use client";
import Link from "next/link";
import { useCarrinho } from "../context/carrinho-context";
// Importando ícones modernos e leves
import { Menu, Search, User, ShoppingBag } from "lucide-react";

export function Navbar() {
  const { totalItens } = useCarrinho();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/95">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* 1. LADO ESQUERDO: Botão de Menu */}
        <div className="flex flex-1 items-center justify-start">
          <button 
            className="cursor-pointer flex items-center gap-2 text-zinc-800 hover:opacity-70 transition-opacity"
            aria-label="Abrir menu"
          >
            <Menu className="h-6 w-6 stroke-[1.5]" />
            <span className="hidden text-sm font-light tracking-wide sm:block">
              Menu
            </span>
          </button>
        </div>

        {/* 2. CENTRO: Nome da Loja (Logo) */}
        <div className="flex items-center justify-center">
          <Link 
            href="/" 
            className="text-2xl font-black italic tracking-tighter text-black uppercase"
            style={{ fontFamily: "sans-serif" }} // Estilo robusto similar à imagem
          >
            LIKEWORK
          </Link>
        </div>

        {/* 3. LADO DIREITO: Ícones de Ação */}
        <div className="flex flex-1 items-center justify-end gap-6 text-zinc-900">
          {/* Busca */}
          <button className="hover:opacity-60 transition-opacity" aria-label="Buscar">
            <Search className="cursor-pointer h-6 w-6 stroke-[1.5]" />
          </button>
          
          {/* Perfil/Conta */}
          <Link href="/conta" className="hover:opacity-60 transition-opacity" aria-label="Minha conta">
            <User className="h-6 w-6 stroke-[1.5]" />
          </Link>
          
          {/* Carrinho com contador flutuante discreto */}
          <Link href="/carrinho" className="relative hover:opacity-60 transition-opacity" aria-label="Carrinho">
            <ShoppingBag className="h-6 w-6 stroke-[1.5]" />
            {totalItens > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C88A36] text-[10px] font-bold text-white">
                {totalItens}
              </span>
            )}
          </Link>
        </div>

      </div>
    </header>
  );
}