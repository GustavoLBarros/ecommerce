"use client";
import { X } from "lucide-react";

interface ModalConfirmacaoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  titulo?: string;
  mensagem: string;
}

export default function ModalConfirmacao({
  isOpen,
  onClose,
  onConfirm,
  titulo = "Confirmar Ação",
  mensagem,
}: ModalConfirmacaoProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop escurecido */}
      <div 
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />
      
      {/* Caixa do Modal */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-sm bg-white p-6 text-left shadow-xl transition-all border border-zinc-200 z-10">
        <div className="flex items-start justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            {titulo}
          </h3>
          <button 
            onClick={onClose}
            className="cursor-pointer text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-zinc-900">
            {mensagem}
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-sm border border-zinc-200 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="cursor-pointer rounded-sm bg-[#9E4733] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#9E4733]/90 transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}