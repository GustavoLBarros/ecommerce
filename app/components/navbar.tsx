"use client";
import Link from "next/link";
import { useCarrinho } from "../context/carrinho-context";
import { useCarrinhoUI } from "../context/carrinho-ui-context";
import { useContaUI } from "../context/conta-ui-context";
import { Menu, Search, User, ShoppingBag } from "lucide-react";

export function Navbar() {
  const { totalItens } = useCarrinho();
  const { abrirCarrinho } = useCarrinhoUI();
  const { abrirConta } = useContaUI();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-[#f5f4f0]/95">
      <div className="relative mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        <div className="flex items-center">
          <button
            className="flex items-center gap-2 text-zinc-800 hover:opacity-70 transition-opacity"
            aria-label="Abrir menu"
          >
            <Menu className="h-6 w-6 stroke-[1.5]" />
            <span className="hidden sm:block text-sm font-light tracking-wide">
              Menu
            </span>
          </button>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link href="/" aria-label="LIKEWORK">
            <img
              src="/logo.svg"
              alt="LIKEWORK"
              className="h-6 sm:h-7 w-auto"
            />
          </Link>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 text-zinc-900">
          <button aria-label="Buscar">
            <Search className="cursor-pointer h-5 w-5 sm:h-6 sm:w-6 stroke-[1.5]" />
          </button>

          <button onClick={abrirConta} className="cursor-pointer" aria-label="Minha conta">
            <User className="h-5 w-5 sm:h-6 sm:w-6 stroke-[1.5]" />
          </button>

          <button onClick={abrirCarrinho} className="relative cursor-pointer" aria-label="Carrinho">
            <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 stroke-[1.5]" />
            {totalItens > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C88A36] text-[10px] font-bold text-white">
                {totalItens}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}