"use client";

import { useParams, useRouter } from "next/navigation";
import Formchamado from "@/components/FormChamado/FormChamado";
import RotaProtegida from "@/components/RotaProtegida/RotaProtegida";
import Mensagem from "@/components/Mensagem/Mensagem";
import { chamados, categorias } from "@/dados/exemplo";

// Rota "/chamados/[id]/editar": o MESMO formulário, agora começando preenchido.
export default function Editarchamado() {
  const { id } = useParams();
  const router = useRouter();
  const chamado = chamados.find((r) => r.id === Number(id));

  const salvar = async (dados) => {
    console.log("Atualizar:", id, dados); // etapa 3: aqui entra o PUT na API
    router.push(`/chamados/${id}`); // volta para o detalhe
  };

  return (
    <RotaProtegida>
      <h1>Editar chamado</h1>
      {chamado ? (
        <Formchamado
          categorias={categorias}
          chamadoInicial={chamado}
          aoSalvar={salvar}
        />
      ) : (
        <Mensagem tipo="erro">chamado não encontrada.</Mensagem>
      )}
    </RotaProtegida>
  );
}
