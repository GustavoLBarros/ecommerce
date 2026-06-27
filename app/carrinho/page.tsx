"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCarrinho } from "../context/carrinho-context";
import { Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import ModalConfirmacao from "../components/modal-confirmacao";

interface ItemParaRemover {
  id: string;
  opcao?: string;
  nome: string;
}

interface OpcaoFrete {
  tipo: string;
  valor: number;
  prazo: string;
}

export default function PaginaCarrinho() {
  const { itens, removerDoCarrinho, atualizarQuantidade } = useCarrinho();
  const [itemConfirmando, setItemConfirmando] = useState<ItemParaRemover | null>(null);

  const [cep, setCep] = useState("");
  const [carregandoFrete, setCarregandoFrete] = useState(false);
  const [opcoesFrete, setOpcoesFrete] = useState<OpcaoFrete[] | null>(null);
  const [freteSelecionado, setFreteSelecionado] = useState<OpcaoFrete | null>(null);

  const valorTotalItens = itens.reduce((acc, item) => acc + item.produto.preco * item.quantidade, 0);
  
  const limiteFreteGratis = 300;
  const elegivelFreteGratis = valorTotalItens >= limiteFreteGratis;
  const quantoFaltaFreteGratis = limiteFreteGratis - valorTotalItens;
  const porcentagemProgresso = Math.min((valorTotalItens / limiteFreteGratis) * 100, 100);

  const valorTotalPedido = valorTotalItens + (freteSelecionado ? freteSelecionado.valor : 0);

  const calcularFrete = (e: React.FormEvent) => {
    e.preventDefault();
    const limpo = cep.replace(/\D/g, "");
    if (limpo.length !== 8) return;

    setCarregandoFrete(true);
    setFreteSelecionado(null);

    setTimeout(() => {
      const pacValor = elegivelFreteGratis ? 0 : 22.90;
      const sedexValor = elegivelFreteGratis ? 15.00 : 38.50;
      const resultado: OpcaoFrete[] = [
        { tipo: "PAC", valor: pacValor, prazo: "5-8 dias úteis" },
        { tipo: "SEDEX", valor: sedexValor, prazo: "1-3 dias úteis" }
      ];
      setOpcoesFrete(resultado);
      setFreteSelecionado(resultado[0]);
      setCarregandoFrete(false);
    }, 500);
  };

  const lidarComMudancaCep = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, "");
    if (valor.length > 8) valor = valor.slice(0, 8);
    if (valor.length > 5) valor = `${valor.slice(0, 5)}-${valor.slice(5)}`;
    setCep(valor);
  };

  const menorPrecoFrete = opcoesFrete ? Math.min(...opcoesFrete.map(o => o.valor)) : 0;

  if (itens.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-zinc-300" />
        <h1 className="mt-6 text-2xl font-black italic tracking-tighter text-zinc-900 uppercase">Seu carrinho está vazio</h1>
        <div className="mt-8">
          <Link href="/" className="inline-flex items-center gap-2 bg-[#2D3A44] px-6 py-3 text-white hover:bg-opacity-90">
            <ArrowLeft className="h-4 w-4" /> Voltar para a vitrine
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl w-full px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-black italic tracking-tighter text-zinc-900 uppercase border-b border-zinc-200 pb-4">
        Seu Carrinho
      </h1>

      <div className="mt-6 lg:grid lg:grid-cols-12 lg:gap-12">
        {/* Lista de Produtos */}
        <div className="lg:col-span-7">
          <ul className="divide-y divide-zinc-200">
            {itens.map((item) => (
              <li key={`${item.produto.id}-${item.opcaoSelecionada}`} className="flex py-6">
                <div className="h-24 w-24 sm:h-32 sm:w-32 bg-zinc-100 rounded-sm overflow-hidden">
                  <img src={`/${item.produto.imagem}`} alt={item.produto.nome} className="h-full w-full object-cover" />
                </div>
                <div className="ml-4 flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold uppercase">{item.produto.nome}</h3>
                    {item.opcaoSelecionada && <p className="text-xs text-[#C88A36] font-bold">Tam: {item.opcaoSelecionada}</p>}
                    <p className="text-sm font-black">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.produto.preco)}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-zinc-300 rounded-sm">
                      <button onClick={() => atualizarQuantidade(item.produto.id, item.opcaoSelecionada, item.quantidade - 1)} className="px-3 py-1 font-bold">-</button>
                      <span className="px-3 text-sm">{item.quantidade}</span>
                      <button onClick={() => atualizarQuantidade(item.produto.id, item.opcaoSelecionada, item.quantidade + 1)} className="px-3 py-1 font-bold">+</button>
                    </div>
                    <button onClick={() => setItemConfirmando({ id: item.produto.id, opcao: item.opcaoSelecionada, nome: item.produto.nome })} className="text-zinc-400 hover:text-red-700">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Resumo e Checkout - Sticky no Desktop */}
        <div className="mt-8 lg:mt-0 lg:col-span-5">
          <div className="lg:sticky lg:top-8 bg-zinc-50 p-6 rounded-sm border border-zinc-100">
            <h2 className="text-xs font-bold uppercase tracking-widest">Resumo do Pedido</h2>
            
            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-bold">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valorTotalItens)}</span>
              </div>

              {!elegivelFreteGratis && (
                <div className="bg-white p-3 border border-zinc-200 rounded-sm">
                  <p className="text-[10px] text-zinc-500 mb-2">Faltam {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(quantoFaltaFreteGratis)} para Frete Grátis</p>
                  <div className="h-1.5 w-full bg-zinc-100 rounded-full"><div className="h-full bg-[#4B5340]" style={{ width: `${porcentagemProgresso}%` }} /></div>
                </div>
              )}

              <form onSubmit={calcularFrete} className="flex gap-2">
                <input type="text" placeholder="CEP" value={cep} onChange={lidarComMudancaCep} className="w-full border p-2 text-sm rounded-sm" />
                <button type="submit" disabled={carregandoFrete} className="bg-[#2D3A44] text-white px-4 text-xs font-bold uppercase">Calcular</button>
              </form>

              {opcoesFrete && (
                <div className="space-y-2">
                  {opcoesFrete.map((opcao) => (
                    <label key={opcao.tipo} className="flex justify-between p-3 border rounded-sm cursor-pointer hover:border-zinc-400">
                      <div className="flex items-center gap-2">
                        <input type="radio" name="frete" checked={freteSelecionado?.tipo === opcao.tipo} onChange={() => setFreteSelecionado(opcao)} />
                        <span className="text-xs font-bold">{opcao.tipo} ({opcao.prazo})</span>
                      </div>
                      <span className="text-xs font-bold">{opcao.valor === 0 ? "Grátis" : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(opcao.valor)}</span>
                    </label>
                  ))}
                </div>
              )}

              <div className="flex justify-between pt-4 border-t border-zinc-200">
                <span className="font-bold uppercase">Total</span>
                <span className="text-xl font-black">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valorTotalPedido)}</span>
              </div>
            </div>

            <button className="w-full mt-6 bg-[#2D3A44] text-white py-4 font-bold uppercase tracking-widest text-xs hover:bg-black transition-colors">
              Fechar Pedido
            </button>
          </div>
        </div>
      </div>

      <ModalConfirmacao
        isOpen={!!itemConfirmando}
        onClose={() => setItemConfirmando(null)}
        onConfirm={() => { if(itemConfirmando) { removerDoCarrinho(itemConfirmando.id, itemConfirmando.opcao); setItemConfirmando(null); } }}
        titulo="Confirmar Remoção"
        mensagem={`Remover ${itemConfirmando?.nome}?`}
      />
    </div>
  );
}