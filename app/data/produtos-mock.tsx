import { Produto } from "../types/ecom";

export const PRODUTOS_MOCK: Produto[] = [
  {
    id: "1",
    nome: "Macacão Mecânico",
    slug: "macacao-mecanico-lona",
    descricao: "Confeccionado em lona pesada de algodão com costuras triplas reforçadas e bolsos utilitários para ferramentas.",
    precoOriginal: 319.90,
    preco: 249.90,
    imagem: 'model1.avif',
    categoria: "macacoes",
    opcoes: { nome: "Tamanho", valores: ["P", "M", "G", "GG"] }
  },
  {
    id: "2",
    nome: "Calça Jeans Reta",
    slug: "calca-jeans-reta-14oz",
    descricao: "Jeans rígido de 14oz construído para alta durabilidade, com rebites de cobre nos pontos de maior tensão.",
    precoOriginal: 349.90,
    preco: 249.90,
    imagem: 'model2.webp',
    categoria: "calcas",
    opcoes: { nome: "Tamanho", valores: ["38", "40", "42", "44", "46"] }
  },
  {
    id: "3",
    nome: "Jaqueta Náutica",
    slug: "jaqueta-nautica",
    descricao: "Jaqueta náutica de sarja com Forro de Lã.",
    precoOriginal: 299.00,
    preco: 249.00,
    imagem: 'model3.jpg',
    categoria: "jaquetas",
    opcoes: { nome: "Tamanho", valores: ["M", "G", "GG"] }
  },
  {
    id: "4",
    nome: "Camisa Sarja",
    slug: "camisa-sarja-pesada",
    descricao: "Algodão em sarja encorpada com toque macio e resistente. Dois bolsos frontais com botão de pressão.",
    precoOriginal: 399.00,
    preco: 299.00,
    imagem: 'model4.jfif',
    categoria: "camisas",
    opcoes: { nome: "Tamanho", valores: ["P", "M", "G", "GG"] }
  },
  {
    id: "5",
    nome: "Jaqueta de Lona (Botão)",
    slug: "jaqueta-lona-botao-reforcada",
    descricao: "Nossa jaqueta mais robusta. Lona de algodão puro, forro interno xadrez e botões de metal personalizados.",
    precoOriginal: 399.00,
    preco: 299.00,
    imagem: 'model5.webp',
    categoria: "jaquetas",
    opcoes: { nome: "Tamanho", valores: ["M", "G", "GG", "XG"] }
  },
  {
    id: "6",
    nome: "Jaqueta de Lona (Zíper)",
    slug: "jaqueta-lona-ziper-trabalho",
    descricao: "Corte clássico de trabalho com zíper tratorado de alta resistência, punhos ajustáveis e gola em veludo cotelê.",
    precoOriginal: 399.00,
    preco: 299.00,
    imagem: 'model6.jfif',
    categoria: "jaquetas",
    opcoes: { nome: "Tamanho", valores: ["M", "G", "GG", "XG"] }
  }
];