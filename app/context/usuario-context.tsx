"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export interface Usuario {
  nome: string;
  email: string;
}

interface UsuarioContextType {
  usuario: Usuario | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  criarConta: (nome: string, email: string, senha: string) => Promise<void>;
  entrarComGoogle: () => Promise<void>;
  sair: () => void;
}

const UsuarioContext = createContext<UsuarioContextType | undefined>(undefined);

export function UsuarioProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(false);

  const simularAutenticacao = (dadosUsuario: Usuario) => {
    return new Promise<void>((resolve) => {
      setCarregando(true);
      setTimeout(() => {
        setUsuario(dadosUsuario);
        setCarregando(false);
        resolve();
      }, 700);
    });
  };

  const entrar = (email: string, _senha: string) => {
    const nomeBase = email.split("@")[0] || "Usuário";
    const nome = nomeBase.charAt(0).toUpperCase() + nomeBase.slice(1);
    return simularAutenticacao({ nome, email });
  };

  const criarConta = (nome: string, email: string, _senha: string) => {
    return simularAutenticacao({ nome, email });
  };

  const entrarComGoogle = () => {
    return simularAutenticacao({ nome: "Usuário Google", email: "usuario@gmail.com" });
  };

  const sair = () => setUsuario(null);

  return (
    <UsuarioContext.Provider value={{ usuario, carregando, entrar, criarConta, entrarComGoogle, sair }}>
      {children}
    </UsuarioContext.Provider>
  );
}

export function useUsuario() {
  const context = useContext(UsuarioContext);
  if (!context) throw new Error("useUsuario deve ser usado dentro de um UsuarioProvider");
  return context;
}