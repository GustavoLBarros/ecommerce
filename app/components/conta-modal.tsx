"use client";
import { useState } from "react";
import { useUsuario } from "../context/usuario-context";
import { useContaUI } from "../context/conta-ui-context";
import { PEDIDOS_MOCK, type StatusPedido } from "../data/pedidos-mock";
import { X, User, LogOut, Package } from "lucide-react";

type ModoFormulario = "entrar" | "criar";

function corStatus(status: StatusPedido) {
  switch (status) {
    case "Entregue":
      return "bg-[#4B5340] text-white";
    case "Em Transporte":
      return "bg-[#C88A36] text-white";
    case "Processando":
      return "bg-zinc-400 text-white";
    case "Cancelado":
      return "bg-[#9E4733] text-white";
  }
}

function IconeGoogle() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 48 48">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

export default function ContaModal() {
  const { aberto, fecharConta } = useContaUI();
  const { usuario, carregando, entrar, criarConta, entrarComGoogle, sair } = useUsuario();

  const [modo, setModo] = useState<ModoFormulario>("criar");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const lidarComSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modo === "entrar") {
      await entrar(email, senha);
    } else {
      await criarConta(nome, email, senha);
    }
    setSenha("");
  };

  const alternarModo = () => {
    setModo((m) => (m === "entrar" ? "criar" : "entrar"));
  };

  const lidarComSair = () => {
    sair();
    setEmail("");
    setNome("");
    setModo("criar");
  };

  return (
    <>
      <div
        onClick={fecharConta}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          aberto ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        className={`fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          aberto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-5 sm:px-6 flex-shrink-0">
          <h1 className="text-2xl font-black italic tracking-tighter text-zinc-900 uppercase">
            {usuario ? "Minha Conta" : modo === "criar" ? "Criar Conta" : "Entrar"}
          </h1>
          <button
            onClick={fecharConta}
            className="cursor-pointer text-zinc-400 hover:text-[#9E4733] transition-colors"
          >
            <X className="h-6 w-6 stroke-[1.5]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 scrollbar-thin">
          {!usuario ? (
            <div className="mx-auto max-w-sm">
              <form onSubmit={lidarComSubmit} className="space-y-4">
                {modo === "criar" && (
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                      Nome
                    </label>
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                      className="mt-1.5 w-full rounded-sm border border-zinc-200 bg-white px-3 py-2.5 text-sm placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
                      placeholder="Seu nome completo"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1.5 w-full rounded-sm border border-zinc-200 bg-white px-3 py-2.5 text-sm placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                      Senha
                    </label>
                    {modo === "entrar" && (
                      <button
                        type="button"
                        className="cursor-pointer text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
                      >
                        Esqueci minha senha
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    minLength={6}
                    className="mt-1.5 w-full rounded-sm border border-zinc-200 bg-white px-3 py-2.5 text-sm placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={carregando}
                  className="cursor-pointer mt-2 flex w-full items-center justify-center rounded-sm bg-[#2D3A44] px-8 py-3.5 text-xs font-medium tracking-widest text-white hover:bg-[#2D3A44]/95 disabled:opacity-50 transition-colors"
                >
                  {carregando ? "Aguarde..." : modo === "entrar" ? "Entrar" : "Criar Conta"}
                </button>
              </form>

              <div className="mt-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-zinc-200" />
                <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">
                  ou continue com
                </span>
                <div className="h-px flex-1 bg-zinc-200" />
              </div>

              <button
                onClick={() => entrarComGoogle()}
                disabled={carregando}
                className="cursor-pointer mt-4 flex w-full items-center justify-center gap-3 rounded-sm border border-[#dadce0] bg-white px-8 py-3 text-sm font-medium text-[#3c4043] hover:bg-[#f8f8f8] hover:shadow-sm disabled:opacity-50 transition-all"
                style={{ fontFamily: "Roboto, Arial, sans-serif" }}
              >
                <IconeGoogle />
                Continuar com o Google
              </button>

              <p className="mt-6 text-center text-[11px] text-zinc-400">
                Ao continuar, você concorda com os{" "}
                <span className="font-medium text-zinc-600 underline cursor-pointer">Termos de Uso</span>{" "}
                e a{" "}
                <span className="font-medium text-zinc-600 underline cursor-pointer">
                  Política de Privacidade
                </span>
                .
              </p>

              <p className="mt-5 text-center text-xs text-zinc-500">
                {modo === "criar" ? "Já tem uma conta? " : "Ainda não tem uma conta? "}
                <button
                  type="button"
                  onClick={alternarModo}
                  className="cursor-pointer font-bold text-zinc-900 underline hover:text-[#2D3A44] transition-colors"
                >
                  {modo === "criar" ? "Entrar" : "Criar conta"}
                </button>
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-4 rounded-sm bg-zinc-50 p-4 sm:p-5">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#2D3A44]">
                  <User className="h-7 w-7 text-white stroke-[1.5]" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase text-zinc-900">{usuario.nome}</p>
                  <p className="text-xs text-zinc-500">{usuario.email}</p>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-zinc-900">
                  <Package className="h-4 w-4 stroke-[1.5]" />
                  Meus Pedidos
                </h2>

                {PEDIDOS_MOCK.length === 0 ? (
                  <p className="mt-4 text-sm text-zinc-500">Você ainda não fez nenhum pedido.</p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {PEDIDOS_MOCK.map((pedido) => (
                      <li key={pedido.id} className="rounded-sm border border-zinc-200 p-3.5 sm:p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-zinc-900">{pedido.numero}</p>
                            <p className="text-xs text-zinc-500">{pedido.data}</p>
                          </div>
                          <span
                            className={`rounded-sm px-2 py-1 text-[9px] font-black uppercase tracking-wider ${corStatus(
                              pedido.status
                            )}`}
                          >
                            {pedido.status}
                          </span>
                        </div>

                        <div className="mt-3 flex -space-x-2">
                          {pedido.itens.map((item, idx) => (
                            <div
                              key={`${pedido.id}-${idx}`}
                              className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-sm border-2 border-white bg-zinc-100"
                            >
                              <img
                                src={`/${item.produto.imagem}`}
                                alt={item.produto.nome}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                          ))}
                        </div>

                        <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3">
                          <span className="text-xs text-zinc-500">
                            {pedido.itens.length} {pedido.itens.length === 1 ? "item" : "itens"}
                          </span>
                          <span className="text-sm font-black text-zinc-950">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(pedido.total)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        {usuario && (
          <div className="flex-shrink-0 border-t border-zinc-200 px-4 py-5 sm:px-6">
            <button
              onClick={lidarComSair}
              className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-sm border border-[#9E4733] px-8 py-3 text-xs font-bold uppercase tracking-wider text-[#9E4733] hover:bg-[#9E4733]/5 transition-colors"
            >
              <LogOut className="h-4 w-4 stroke-[1.5]" />
              Sair
            </button>
          </div>
        )}
      </div>
    </>
  );
}