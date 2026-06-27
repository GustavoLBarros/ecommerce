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

  // Estados do Frete
  const [cep, setCep] = useState("");
  const [carregandoFrete, setCarregandoFrete] = useState(false);
  const [opcoesFrete, setOpcoesFrete] = useState<OpcaoFrete[] | null>(null);
  const [freteSelecionado, setFreteSelecionado] = useState<OpcaoFrete | null>(null);

  const valorTotalItens = itens.reduce((acc, item) => acc + item.produto.preco * item.quantidade, 0);
  
  // Regra de Frete Grátis
  const limiteFreteGratis = 300;
  const elegivelFreteGratis = valorTotalItens >= limiteFreteGratis;
  const quantoFaltaFreteGratis = limiteFreteGratis - valorTotalItens;
  const porcentagemProgresso = Math.min((valorTotalItens / limiteFreteGratis) * 100, 100);

  const valorTotalPedido = valorTotalItens + (freteSelecionado ? freteSelecionado.valor : 0);

  const atualizarValoresFrete = (subtotalAtual: number) => {
    if (!opcoesFrete) return;

    const atingeGratis = subtotalAtual >= limiteFreteGratis;
    const pacValor = atingeGratis ? 0 : 22.90;
    const sedexValor = atingeGratis ? 15.00 : 38.50;

    const resultado: OpcaoFrete[] = [
      { tipo: "PAC", valor: pacValor, prazo: "5-8 dias úteis" },
      { tipo: "SEDEX", valor: sedexValor, prazo: "1-3 dias úteis" }
    ];

    setOpcoesFrete(resultado);
    
    if (freteSelecionado) {
      const novaOpcaoAtiva = resultado.find(o => o.tipo === freteSelecionado.tipo);
      if (novaOpcaoAtiva) setFreteSelecionado(novaOpcaoAtiva);
    }
  };

  useEffect(() => {
    if (opcoesFrete) {
      atualizarValoresFrete(valorTotalItens);
    }
  }, [valorTotalItens]);

  const confirmarRemocao = () => {
    if (itemConfirmando) {
      removerDoCarrinho(itemConfirmando.id, itemConfirmando.opcao);
      setItemConfirmando(null);
    }
  };

  const lidarComMudancaCep = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, "");
    if (valor.length > 8) valor = valor.slice(0, 8);
    if (valor.length > 5) {
      valor = `${valor.slice(0, 5)}-${valor.slice(5)}`;
    }
    setCep(valor);
  };

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

  const menorPrecoFrete = opcoesFrete ? Math.min(...opcoesFrete.map(o => o.valor)) : 0;

  if (itens.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-zinc-300 stroke-[1.5]" />
        <h1 className="mt-6 text-2xl font-black italic tracking-tighter text-zinc-900 uppercase">
          Seu carrinho está vazio
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Você não adicionou nenhum equipamento ou vestuário ainda.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex cursor-pointer items-center gap-2 rounded-sm bg-[#2D3A44] px-6 py-3 text-xs font-medium tracking-widest text-white hover:bg-[#2D3A44]/95 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para a vitrine
          </Link>
        </div>
      </div>
    );
  }

  return (
    /* h-[calc(100vh-80px)] limita o tamanho da área do carrinho descontando o espaço do topo */
    <div className="mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8 h-[calc(100vh-90px)] flex flex-col justify-start">
      <h1 className="text-3xl font-black italic tracking-tighter text-zinc-900 uppercase border-b border-zinc-200 pb-4 flex-shrink-0">
        Seu Carrinho
      </h1>

      {/* Grid principal configurado para ocupar o restante do espaço vertical sem vazar */}
      <div className="mt-6 lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16 flex-1 min-h-0 items-start">
        
        {/* COLUNA DA ESQUERDA: Apenas os produtos recebem a rolagem se passarem do limite */}
        <div className="lg:col-span-7 max-h-full overflow-y-auto pr-2 scrollbar-thin">
          <ul className="divide-y divide-zinc-200 border-b border-zinc-200">
            {itens.map((item) => (
              <li key={`${item.produto.id}-${item.opcaoSelecionada}`} className="flex py-6">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-sm bg-zinc-100 sm:h-32 sm:w-32">
                  <img
                    src={`/${item.produto.imagem}`}
                    alt={item.produto.nome}
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                  <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div>
                      <h3 className="text-sm font-bold uppercase text-zinc-900">
                        <Link href={`/produto/${item.produto.slug}`} className="hover:opacity-80">
                          {item.produto.nome}
                        </Link>
                      </h3>
                      
                      {item.opcaoSelecionada && (
                        <p className="mt-1 text-xs font-bold text-[#C88A36] uppercase tracking-wider">
                          Tam: {item.opcaoSelecionada}
                        </p>
                      )}

                      <p className="mt-2 text-sm font-black text-zinc-950">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.produto.preco)}
                      </p>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:pr-9 flex items-center justify-between sm:justify-end gap-4">
                      <div className="flex items-center border border-zinc-200 rounded-sm bg-white">
                        <button
                          onClick={() => atualizarQuantidade(item.produto.id, item.opcaoSelecionada, item.quantidade - 1)}
                          className="cursor-pointer px-3 py-1 text-zinc-600 hover:bg-zinc-100 font-bold"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-bold text-zinc-900">{item.quantidade}</span>
                        <button
                          onClick={() => atualizarQuantidade(item.produto.id, item.opcaoSelecionada, item.quantidade + 1)}
                          className="cursor-pointer px-3 py-1 text-zinc-600 hover:bg-zinc-100 font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => setItemConfirmando({ id: item.produto.id, opcao: item.opcaoSelecionada, nome: item.produto.nome })}
                        className="cursor-pointer text-zinc-400 hover:text-[#9E4733] transition-colors"
                        aria-label="Remover item"
                      >
                        <Trash2 className="h-5 w-5 stroke-[1.5]" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* COLUNA DA DIREITA: O Resumo se adapta e permanece totalmente visível */}
        <div className="mt-8 lg:mt-0 lg:col-span-5 rounded-sm bg-zinc-50 px-4 py-6 sm:p-6 lg:p-8 w-full flex-shrink-0">
          <h2 className="text-xs font-medium uppercase tracking-widest text-zinc-900">
            Resumo do Pedido
          </h2>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-600">Subtotal</p>
              <p className="text-sm font-bold text-zinc-950">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valorTotalItens)}
              </p>
            </div>

            <div className="border-t border-zinc-200 pt-4 space-y-3">
              <div className="space-y-1.5 bg-white/40 border border-zinc-200/50 p-2.5 rounded-sm">
                {elegivelFreteGratis ? (
                  <p className="text-[10px] text-center font-bold uppercase tracking-wider text-[#4B5340]">
                    Frete Grátis Liberado para você
                  </p>
                ) : (
                  <>
                    <p className="text-[10px] text-zinc-500 font-medium tracking-tight">
                      Falta só <span className="font-bold text-zinc-900">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(quantoFaltaFreteGratis)}</span> para ganhar <span className="font-bold text-[#4B5340] underline">Frete Grátis</span>
                    </p>
                    <div className="h-1 w-full bg-zinc-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#4B5340] transition-all duration-300" 
                        style={{ width: `${porcentagemProgresso}%` }}
                      />
                    </div>
                  </>
                )}
              </div>

              <form onSubmit={calcularFrete} className="flex gap-2">
                <input
                  type="text"
                  placeholder="00000-000"
                  value={cep}
                  onChange={lidarComMudancaCep}
                  className="w-full rounded-sm border border-zinc-200 bg-white px-3 py-1.5 text-xs placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  disabled={carregandoFrete || cep.replace(/\D/g, "").length !== 8}
                  className="cursor-pointer rounded-sm border border-[#2D3A44] bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#2D3A44] hover:bg-zinc-50 disabled:opacity-50 transition-colors whitespace-nowrap"
                >
                  {carregandoFrete ? "..." : "Calcular"}
                </button>
              </form>

              {opcoesFrete && (
                <div className="space-y-1.5 pt-1 animate-in fade-in duration-150">
                  {opcoesFrete.map((opcao) => {
                    const ehOMenorPreco = opcao.valor === menorPrecoFrete;
                    return (
                      <label
                        key={opcao.tipo}
                        className={`flex cursor-pointer items-center justify-between rounded-sm border p-2 text-[11px] transition-all duration-200 ${
                          freteSelecionado?.tipo === opcao.tipo
                            ? "border-zinc-400 bg-white shadow-xs"
                            : "border-zinc-200/60 bg-white/50 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="resumo-frete"
                            checked={freteSelecionado?.tipo === opcao.tipo}
                            onChange={() => setFreteSelecionado(opcao)}
                            className="accent-zinc-900"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-zinc-900">{opcao.tipo}</span>
                              {ehOMenorPreco && (
                                <span className="text-[9px] px-1 font-black tracking-wider text-white uppercase bg-[#4B5340] scale-[0.9] origin-left">
                                  {opcao.valor === 0 ? "Elegível" : "Melhor Custo"}
                                </span>
                              )}
                            </div>
                            <span className="text-zinc-400">({opcao.prazo})</span>
                          </div>
                        </div>
                        <span className="font-black text-zinc-950">
                          {opcao.valor === 0 ? "Grátis" : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(opcao.valor)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
              <p className="text-base font-bold text-zinc-900 uppercase tracking-tight">Total</p>
              <p className="text-xl font-black text-zinc-950">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valorTotalPedido)}
              </p>
            </div>
          </div>

          <button
            className="cursor-pointer mt-6 flex w-full items-center justify-center rounded-sm bg-[#2D3A44] px-8 py-4 text-xs font-medium tracking-widest text-white hover:bg-[#2D3A44]/95 transition-colors"
          >
            Fechar Pedido
          </button>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium tracking-wider text-zinc-500 hover:text-zinc-800 transition-colors"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>

      </div>

      <ModalConfirmacao
        isOpen={itemConfirmando !== null}
        onClose={() => setItemConfirmando(null)}
        onConfirm={confirmarRemocao}
        titulo="Confirmar Remoção"
        mensagem={`Tem certeza que deseja remover "${itemConfirmando?.nome}" do seu carrinho?`}
      />
    </div>
  );
}