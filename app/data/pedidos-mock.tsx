import { PRODUTOS_MOCK } from "./produtos-mock";
import type { Produto } from "../types/ecom";

export interface ItemPedido {
  produto: Produto;
  quantidade: number;
  opcaoSelecionada?: string;
}

export type StatusPedido = "Entregue" | "Em Transporte" | "Processando" | "Cancelado";

export interface Pedido {
  id: string;
  numero: string;
  data: string;
  status: StatusPedido;
  itens: ItemPedido[];
  total: number;
}

function montarItens(produtos: Produto[]): ItemPedido[] {
  return produtos.map((produto) => ({
    produto,
    quantidade: 1,
    opcaoSelecionada: produto.opcoes?.valores[0],
  }));
}

function calcularTotal(itens: ItemPedido[]): number {
  return itens.reduce((acc, item) => acc + item.produto.preco * item.quantidade, 0);
}

const pedido1Itens = montarItens(PRODUTOS_MOCK.slice(0, 1));
const pedido2Itens = montarItens(PRODUTOS_MOCK.slice(1, 3));
const pedido3Itens = montarItens(PRODUTOS_MOCK.slice(0, 2));

export const PEDIDOS_MOCK: Pedido[] = [
  {
    id: "1",
    numero: "#LK-10458",
    data: "18 Jun 2026",
    status: "Em Transporte",
    itens: pedido1Itens,
    total: calcularTotal(pedido1Itens),
  },
  {
    id: "2",
    numero: "#LK-10312",
    data: "02 Jun 2026",
    status: "Entregue",
    itens: pedido2Itens,
    total: calcularTotal(pedido2Itens),
  },
  {
    id: "3",
    numero: "#LK-09871",
    data: "21 Mai 2026",
    status: "Entregue",
    itens: pedido3Itens,
    total: calcularTotal(pedido3Itens),
  },
];