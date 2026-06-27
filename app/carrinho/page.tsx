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

  const valorTotalItens = itens.reduce(
    (acc, item) => acc + item.produto.preco * item.quantidade,
    0
  );

  const limiteFreteGratis = 300;
  const elegivelFreteGratis = valorTotalItens >= limiteFreteGratis;
  const quantoFaltaFreteGratis = limiteFreteGratis - valorTotalItens;
  const porcentagemProgresso = Math.min(
    (valorTotalItens / limiteFreteGratis) * 100,
    100
  );

  const valorTotalPedido =
    valorTotalItens + (freteSelecionado ? freteSelecionado.valor : 0);

  useEffect(() => {
    if (!opcoesFrete) return;

    const atingeGratis = valorTotalItens >= limiteFreteGratis;
    const resultado: OpcaoFrete[] = [
      { tipo: "PAC", valor: atingeGratis ? 0 : 22.9, prazo: "5-8 dias úteis" },
      { tipo: "SEDEX", valor: atingeGratis ? 15 : 38.5, prazo: "1-3 dias úteis" },
    ];

    setOpcoesFrete(resultado);

    if (freteSelecionado) {
      const nova = resultado.find(o => o.tipo === freteSelecionado.tipo);
      if (nova) setFreteSelecionado(nova);
    }
  }, [valorTotalItens]);

  if (itens.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-32 text-center bg-[#f5f4f0]">
        <ShoppingBag className="mx-auto h-12 w-12 text-zinc-300" />
        <h1 className="mt-6 text-2xl font-black italic uppercase">
          Seu carrinho está vazio
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Você não adicionou nenhum item ainda.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#2D3A44] px-6 py-3 text-xs tracking-widest text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para a vitrine
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8 h-[calc(100vh-90px)] flex flex-col bg-[#f5f4f0]">
      <h1 className="text-3xl font-black italic uppercase border-b border-zinc-200 pb-4">
        Seu Carrinho
      </h1>

      <div className="mt-6 lg:grid lg:grid-cols-12 lg:gap-x-12 flex-1 min-h-0">
        {/* COLUNA ESQUERDA */}
        <div className="lg:col-span-7 overflow-y-auto pr-2">
          {/* ... conteúdo inalterado ... */}
        </div>

        {/* COLUNA DIREITA */}
        <div className="mt-8 lg:mt-0 lg:col-span-5 rounded-sm bg-zinc-50 px-4 py-6">
          {/* ... conteúdo inalterado ... */}
        </div>
      </div>

      <ModalConfirmacao
        isOpen={itemConfirmando !== null}
        onClose={() => setItemConfirmando(null)}
        onConfirm={() => {
          if (itemConfirmando) {
            removerDoCarrinho(itemConfirmando.id, itemConfirmando.opcao);
            setItemConfirmando(null);
          }
        }}
        titulo="Confirmar Remoção"
        mensagem={`Tem certeza que deseja remover "${itemConfirmando?.nome}" do carrinho?`}
      />
    </div>
  );
}