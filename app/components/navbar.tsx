"use client";
import Link from "next/link";
import { useCarrinho } from "../context/carrinho-context";
import { Menu, Search, User, ShoppingBag } from "lucide-react";

export function Navbar() {
  const { totalItens } = useCarrinho();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/95">
      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

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

        <div className="flex items-center justify-center">
          <Link
            href="/"
            className="text-xl sm:text-2xl font-black italic tracking-tighter text-black uppercase"
            style={{ fontFamily: "sans-serif" }}
          >
            LIKEWORK
          </Link>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 text-zinc-900">
          <button aria-label="Buscar">
            <Search className="h-5 w-5 sm:h-6 sm:w-6 stroke-[1.5]" />
          </button>

          <Link href="/conta" aria-label="Minha conta">
            <User className="h-5 w-5 sm:h-6 sm:w-6 stroke-[1.5]" />
          </Link>

          <Link href="/carrinho" className="relative" aria-label="Carrinho">
            <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 stroke-[1.5]" />
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