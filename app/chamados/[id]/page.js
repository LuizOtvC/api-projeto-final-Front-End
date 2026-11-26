
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Botao from "@/components/Botao/Botao";
import Mensagem from "@/components/Mensagem/Mensagem";
import ModalConfirmacao from "@/components/ModalConfirmacao/ModalConfirmacao";
import { useSessao } from "@/lib/sessao";
import { listarChamados, excluirChamado } from "@/lib/banco";
import styles from "./detalhe.module.css";

export default function DetalheChamado() {
  const { id } = useParams();
  const router = useRouter();
  const { usuario } = useSessao();

  const [lista, setLista] = useState([]);
  const [confirmando, setConfirmando] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await listarChamados();
        setLista(dados);
      } catch (error) {
        console.error(error);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, []);

  const chamado = lista.find(
    (c) => Number(c.id) === Number(id)
  );

  const excluir = async () => {
    try {
      await excluirChamado(chamado.id);
      setConfirmando(false);
      router.push("/");
    } catch (error) {
      console.error("Erro ao excluir:", error);
    }
  };

  if (carregando) {
    return <p>Carregando chamado...</p>;
  }

  if (!chamado) {
    return (
      <>
        <Mensagem tipo="erro">
          Chamado não encontrado.
        </Mensagem>
        <Link href="/">Voltar para a lista</Link>
      </>
    );
  }

  return (
    <article className={styles.detalhe}>
      <span className={styles.categoria}>
        {chamado.categoria}
      </span>

      <h1>{chamado.titulo}</h1>

      <div className={styles.info}>
  <span>Status: {chamado.status}</span>
  <span>Prioridade: {chamado.prioridade}</span>
</div>

<div className={styles.descricao}>
  {chamado.descricao}
</div>

      <div className={styles.acoes}>
        <Botao
          variante="secundario"
          type="button"
          onClick={() => router.back()}
        >
          ← Voltar
        </Botao>

        {usuario ? (
          <>
            <Link
              href={`/chamados/${chamado.id}/editar`}
              className={styles.editar}
            >
              Editar
            </Link>

            <Botao
              variante="perigo"
              type="button"
              onClick={() => setConfirmando(true)}
            >
              Excluir
            </Botao>
          </>
        ) : (
          <Link href="/login" className={styles.editar}>
            Fazer Login
          </Link>
        )}
      </div>

      <ModalConfirmacao
        aberto={confirmando}
        titulo="Excluir chamado?"
        aoConfirmar={excluir}
        aoCancelar={() => setConfirmando(false)}
      >
        <p>
          "{chamado.titulo}" vai ser apagado. Não dá para desfazer.
        </p>
      </ModalConfirmacao>
    </article>
  );
}
