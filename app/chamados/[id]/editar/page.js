
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import FormChamado from "@/components/FormChamado/FormChamado";
import RotaProtegida from "@/components/RotaProtegida/RotaProtegida";
import Mensagem from "@/components/Mensagem/Mensagem";
import { categorias } from "@/dados/exemplo";
import { buscarChamado, atualizarChamado } from "@/lib/banco";

export default function EditarChamado() {
  const { id } = useParams();
  const router = useRouter();

  const [chamado, setChamado] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarChamado() {
      try {
        const dados = await buscarChamado(id);
        setChamado(dados);
      } catch (error) {
        console.error("Erro ao buscar chamado:", error);
      } finally {
        setCarregando(false);
      }
    }

    carregarChamado();
  }, [id]);

  const salvar = async (dados) => {
    try {
      await atualizarChamado(id, dados);
      router.push(`/chamados/${id}`);
    } catch (error) {
      console.error("Erro ao atualizar chamado:", error);
    }
  };

  return (
    <RotaProtegida>
      <h1>Editar chamado</h1>

      {carregando ? (
        <p>Carregando chamado...</p>
      ) : chamado ? (
        <FormChamado
          categorias={categorias}
          chamadoInicial={chamado}
          aoSalvar={salvar}
        />
      ) : (
        <Mensagem tipo="erro">
          Chamado não encontrado.
        </Mensagem>
      )}
    </RotaProtegida>
  );
}
