"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSessao } from "@/lib/sessao";
import Carregando from "@/components/Carregando/Carregando";

// Envolve as páginas que só quem está logado pode ver.
// Sem login: manda para /login. Com login: mostra o conteúdo (children).
export default function RotaProtegida({ children }) {
  const { carregando, usuario } = useSessao();
  const router = useRouter();

  useEffect(() => {
    if (!carregando && !usuario) {
      router.replace("/login");
    }
  }, [carregando, usuario, router]);

  if (carregando || !usuario) return <Carregando texto="Verificando login..." />;
  return children;
}
