"use client";

import { useRouter } from "next/navigation";
import FormChamado from "@/components/FormChamado/FormChamado";
import RotaProtegida from "@/components/RotaProtegida/RotaProtegida";
import { categorias, chamados as iniciais } from "@/dados/exemplo";

export default function NovoChamado() {
  const router = useRouter();

  const salvar = (dados) => {
    const salvo = localStorage.getItem("chamados");
    const lista = salvo ? JSON.parse(salvo) : iniciais;
    const cat = categorias.find((c) => Number(c.id) === Number(dados.categoria_id));

    lista.push({
      id: lista.length > 0 ? lista[lista.length - 1].id + 1 : 1,
      titulo: dados.titulo.trim(),
      descricao: dados.descricao.trim(),
      prioridade: dados.prioridade,
      status: dados.status,
      categoria_id: Number(dados.categoria_id),
      categoria: cat ? cat.nome : "",
    });

    localStorage.setItem("chamados", JSON.stringify(lista));
    router.push("/");
  };

  return (
    <RotaProtegida>
      <h1>Novo Chamado</h1>
      <FormChamado categorias={categorias} aoSalvar={salvar} />
    </RotaProtegida>
  );
}