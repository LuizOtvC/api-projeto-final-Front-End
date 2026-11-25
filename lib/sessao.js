"use client";

import { useSyncExternalStore } from "react";

// Arquivo pronto: guarda quem está logado no localStorage e avisa a tela quando muda.
const CHAVE = "sessao";
const EVENTO = "sessao-mudou";

export function entrar(token, nome) {
  localStorage.setItem(CHAVE, JSON.stringify({ token, nome }));
  window.dispatchEvent(new Event(EVENTO));
}

export function sair() {
  localStorage.removeItem(CHAVE);
  window.dispatchEvent(new Event(EVENTO));
}

export function pegarToken() {
  const texto = localStorage.getItem(CHAVE);
  return texto ? JSON.parse(texto).token : null;
}

// avisa o React quando alguém entrar ou sair (nesta aba ou em outra)
function assinar(avisar) {
  window.addEventListener(EVENTO, avisar);
  window.addEventListener("storage", avisar);
  return () => {
    window.removeEventListener(EVENTO, avisar);
    window.removeEventListener("storage", avisar);
  };
}

// useSessao(): { carregando, usuario }. usuario é null quando ninguém está logado.
export function useSessao() {
  const texto = useSyncExternalStore(
    assinar,
    () => localStorage.getItem(CHAVE), // no navegador: lê o localStorage
    () => undefined, // no servidor não existe localStorage: "ainda não sei"
  );
  if (texto === undefined) return { carregando: true, usuario: null };
  return { carregando: false, usuario: texto ? JSON.parse(texto) : null };
}
