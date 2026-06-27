export interface Produto {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  preco: number;
  precoOriginal: number;
  imagem: string;
  categoria: string;
  tag?:string;  
  opcoes?: {
    nome: string; // Ex: "Tamanho", "Cor", "Material"
    valores: string[]; // Ex: ["P", "M"], ["Madeira", "Aço"]
  };
}

export interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
  opcaoSelecionada?: string;
}