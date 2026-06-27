"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCarrinho } from "../context/carrinho-context";
import { useCarrinhoUI } from "../context/carrinho-ui-context";
import { Trash2, ArrowLeft, ShoppingBag, X } from "lucide-react";
import ModalConfirmacao from "./modal-confirmacao";

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

export default function CarrinhoModal() {
  const { aberto, fecharCarrinho } = useCarrinhoUI();
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

  const atualizarValoresFrete = (subtotalAtual: number) => {
    if (!opcoesFrete) return;

    const atingeGratis = subtotalAtual >= limiteFreteGratis;
    const pacValor = atingeGratis ? 0 : 22.9;
    const sedexValor = atingeGratis ? 15.0 : 38.5;

    const resultado: OpcaoFrete[] = [
      { tipo: "PAC", valor: pacValor, prazo: "5-8 dias úteis" },
      { tipo: "SEDEX", valor: sedexValor, prazo: "1-3 dias úteis" },
    ];

    setOpcoesFrete(resultado);

    if (freteSelecionado) {
      const novaOpcaoAtiva = resultado.find((o) => o.tipo === freteSelecionado.tipo);
      if (novaOpcaoAtiva) setFreteSelecionado(novaOpcaoAtiva);
    }
  };

  useEffect(() => {
    if (opcoesFrete) atualizarValoresFrete(valorTotalItens);
  }, [valorTotalItens]);

  // Trava o scroll do fundo da página enquanto o carrinho está aberto
  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [aberto]);

  const confirmarRemocao = () => {
    if (itemConfirmando) {
      removerDoCarrinho(itemConfirmando.id, itemConfirmando.opcao);
      setItemConfirmando(null);
    }
  };

  const lidarComMudancaCep = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, "");
    if (valor.length > 8) valor = valor.slice(0, 8);
    if (valor.length > 5) valor = `${valor.slice(0, 5)}-${valor.slice(5)}`;
    setCep(valor);
  };

  const calcularFrete = (e: React.FormEvent) => {
    e.preventDefault();
    const limpo = cep.replace(/\D/g, "");
    if (limpo.length !== 8) return;

    setCarregandoFrete(true);
    setFreteSelecionado(null);

    setTimeout(() => {
      const pacValor = elegivelFreteGratis ? 0 : 22.9;
      const sedexValor = elegivelFreteGratis ? 15.0 : 38.5;

      const resultado: OpcaoFrete[] = [
        { tipo: "PAC", valor: pacValor, prazo: "5-8 dias úteis" },
        { tipo: "SEDEX", valor: sedexValor, prazo: "1-3 dias úteis" },
      ];

      setOpcoesFrete(resultado);
      setFreteSelecionado(resultado[0]);
      setCarregandoFrete(false);
    }, 500);
  };

  const menorPrecoFrete = opcoesFrete ? Math.min(...opcoesFrete.map((o) => o.valor)) : 0;

  return (
    <>
      {/* Overlay escuro */}
      <div
        onClick={fecharCarrinho}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          aberto ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Painel lateral */}
      <div
        role="dialog"
        aria-modal="true"
        className={`fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          aberto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Cabeçalho fixo */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-5 sm:px-6 flex-shrink-0">
          <h1 className="text-2xl font-black italic tracking-tighter text-zinc-900 uppercase">
            Seu Carrinho
          </h1>
          <button
            onClick={fecharCarrinho}
            className="cursor-pointer text-zinc-400 hover:text-[#9E4733] transition-colors"
          >
            <X className="h-6 w-6 stroke-[1.5]" />
          </button>
        </div>

        {itens.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-[#0b0b0b]/90 stroke-[1.5]" />
            <h2 className="mt-6 text-xl font-black italic tracking-tighter text-[#0b0b0b]/90 uppercase">
              Seu carrinho está vazio
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Você não adicionou nenhum equipamento ou vestuário ainda.
            </p>
            <div className="mt-8">
              <Link
                href="/"
                onClick={fecharCarrinho}
                className="inline-flex cursor-pointer items-center gap-2 rounded-sm bg-[#2D3A44] px-6 py-3 text-xs font-medium tracking-widest text-white hover:bg-[#2D3A44]/95 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar para a vitrine
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Conteúdo rolável */}
            <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 scrollbar-thin">
              <ul className="divide-y divide-zinc-200 border-b border-zinc-200">
                {itens.map((item) => (
                  <li key={`${item.produto.id}-${item.opcaoSelecionada}`} className="flex py-5">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-sm bg-zinc-100 sm:h-24 sm:w-24">
                      <img
                        src={`/${item.produto.imagem}`}
                        alt={item.produto.nome}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-bold uppercase text-zinc-900">
                            <Link
                              href={`/produto/${item.produto.slug}`}
                              onClick={fecharCarrinho}
                              className="hover:opacity-80"
                            >
                              {item.produto.nome}
                            </Link>
                          </h3>

                          {item.opcaoSelecionada && (
                            <p className="mt-1 text-xs font-bold text-[#C88A36] uppercase tracking-wider">
                              Tam: {item.opcaoSelecionada}
                            </p>
                          )}

                          <p className="mt-2 text-sm font-black text-zinc-950">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(item.produto.preco)}
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            setItemConfirmando({
                              id: item.produto.id,
                              opcao: item.opcaoSelecionada,
                              nome: item.produto.nome,
                            })
                          }
                          className="cursor-pointer flex-shrink-0 text-zinc-400 hover:text-[#9E4733] transition-colors"
                        >
                          <Trash2 className="h-5 w-5 stroke-[1.5]" />
                        </button>
                      </div>

                      <div className="mt-3 flex w-fit items-center rounded-sm border border-zinc-200 bg-white">
                        <button
                          onClick={() =>
                            atualizarQuantidade(item.produto.id, item.opcaoSelecionada, item.quantidade - 1)
                          }
                          className="cursor-pointer px-3 py-1 text-zinc-600 hover:bg-zinc-100 font-bold"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-bold text-zinc-900">{item.quantidade}</span>
                        <button
                          onClick={() =>
                            atualizarQuantidade(item.produto.id, item.opcaoSelecionada, item.quantidade + 1)
                          }
                          className="cursor-pointer px-3 py-1 text-zinc-600 hover:bg-zinc-100 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Resumo do Pedido */}
              <div className="mt-6 rounded-sm bg-zinc-50 p-4 sm:p-6">
                <h2 className="text-xs font-medium uppercase tracking-widest text-zinc-900">
                  Resumo do Pedido
                </h2>

                <div className="mt-5 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-zinc-600">Subtotal</p>
                    <p className="text-sm font-bold text-zinc-950">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                        valorTotalItens
                      )}
                    </p>
                  </div>

                  <div className="border-t border-zinc-200 pt-3.5 space-y-3">
                    <div className="space-y-1.5 rounded-sm border border-zinc-200/50 bg-white/40 p-2.5">
                      {elegivelFreteGratis ? (
                        <p className="text-[10px] text-center font-bold uppercase tracking-wider text-[#4B5340]">
                          Frete Grátis Liberado para você
                        </p>
                      ) : (
                        <>
                          <p className="text-[10px] text-zinc-500 font-medium tracking-tight">
                            Falta só{" "}
                            <span className="font-bold text-zinc-900">
                              {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(quantoFaltaFreteGratis)}
                            </span>{" "}
                            para ganhar{" "}
                            <span className="font-bold text-[#4B5340] underline">Frete Grátis</span>
                          </p>
                          <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-200">
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
                        className="cursor-pointer whitespace-nowrap rounded-sm border border-[#2D3A44] bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#2D3A44] transition-colors hover:bg-zinc-50 disabled:opacity-50"
                      >
                        {carregandoFrete ? "..." : "Calcular"}
                      </button>
                    </form>

                    {opcoesFrete && (
                      <div className="space-y-1.5 pt-0.5 animate-in fade-in duration-150">
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
                                      <span className="origin-left scale-[0.9] bg-[#4B5340] px-1 text-[9px] font-black uppercase tracking-wider text-white">
                                        {opcao.valor === 0 ? "Elegível" : "Melhor Custo"}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-zinc-400">({opcao.prazo})</span>
                                </div>
                              </div>
                              <span className="font-black text-zinc-950">
                                {opcao.valor === 0
                                  ? "Grátis"
                                  : new Intl.NumberFormat("pt-BR", {
                                      style: "currency",
                                      currency: "BRL",
                                    }).format(opcao.valor)}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-200 pt-3.5">
                    <p className="text-base font-bold text-zinc-900 uppercase tracking-tight">Total</p>
                    <p className="text-xl font-black text-zinc-950">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                        valorTotalPedido
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rodapé fixo */}
            <div className="flex-shrink-0 border-t border-zinc-200 px-4 py-5 sm:px-6">
              <button className="cursor-pointer flex w-full items-center justify-center rounded-sm bg-[#2D3A44] px-8 py-3.5 text-xs font-medium tracking-widest text-white transition-colors hover:bg-[#2D3A44]/95">
                Fechar Pedido
              </button>

              <div className="mt-3.5 text-center">
                <button
                  onClick={fecharCarrinho}
                  className="cursor-pointer inline-flex items-center gap-1 text-xs font-medium tracking-wider text-zinc-500 transition-colors hover:text-zinc-800"
                >
                  Continuar Comprando
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <ModalConfirmacao
        isOpen={itemConfirmando !== null}
        onClose={() => setItemConfirmando(null)}
        onConfirm={confirmarRemocao}
        titulo="Confirmar Remoção"
        mensagem={`Tem certeza que deseja remover "${itemConfirmando?.nome}" do seu carrinho?`}
      />
    </>
  );
}