
"use client";

import { useRouter } from "next/navigation";
import FormChamado from "@/components/FormChamado/FormChamado";
import RotaProtegida from "@/components/RotaProtegida/RotaProtegida";
import { categorias } from "@/dados/exemplo";
import { criarChamado } from "@/lib/banco";

export default function NovoChamado() {
  const router = useRouter();

  const salvar = async (dados) => {
    try {
      await criarChamado(dados);
      router.push("/");
    } catch (error) {
      console.error("Erro ao criar chamado:", error);
    }
  };

  return (
    <RotaProtegida>
      <h1>Novo Chamado</h1>
      <FormChamado
        categorias={categorias}
        aoSalvar={salvar}
      />
    </RotaProtegida>
  );
}
