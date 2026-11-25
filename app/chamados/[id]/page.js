"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Botao from "@/components/Botao/Botao";
import Mensagem from "@/components/Mensagem/Mensagem";
import ModalConfirmacao from "@/components/ModalConfirmacao/ModalConfirmacao";
import { useSessao } from "@/lib/sessao";
import { chamados as chamadosIniciais } from "@/dados/exemplo";
import styles from "./detalhe.module.css";

export default function DetalheChamado() {
  const { id } = useParams();
  const router = useRouter();
  const { usuario } = useSessao();
  const [lista, setLista] = useState(chamadosIniciais);
  const [confirmando, setConfirmando] = useState(false);

  useEffect(() => {
    const salvo = localStorage.getItem("chamados");
    if (salvo) {
      setLista(JSON.parse(salvo));
    }
  }, []);

  const chamado = lista.find((c) => Number(c.id) === Number(id));

  if (!chamado) {
    return (
      <>
        <Mensagem tipo="erro">Chamado não encontrado.</Mensagem>
        <Link href="/">Voltar para a lista</Link>
      </>
    );
  }

  const excluir = () => {
    const novaLista = lista.filter((c) => Number(c.id) !== Number(chamado.id));
    localStorage.setItem("chamados", JSON.stringify(novaLista));
    setConfirmando(false);
    router.push("/");
  };

  return (
    <article className={styles.detalhe}>
      <span className={styles.categoria}>{chamado.categoria}</span>
      <h1>{chamado.titulo}</h1>
      <p className={styles.info}>
        Status: {chamado.status} · Prioridade: {chamado.prioridade}
      </p>
      <p>{chamado.descricao}</p>

      <div className={styles.acoes}>
        <Botao variante="secundario" type="button" onClick={() => router.back()}>
          ← Voltar
        </Botao>

        {usuario && (
          <>
            <Link href={`/chamados/${chamado.id}/editar`} className={styles.editar}>
              Editar
            </Link>
            <Botao variante="perigo" type="button" onClick={() => setConfirmando(true)}>
              Excluir
            </Botao>
          </>
        )}
      </div>

      <ModalConfirmacao
        aberto={confirmando}
        titulo="Excluir chamado?"
        aoConfirmar={excluir}
        aoCancelar={() => setConfirmando(false)}
      >
        <p>&quot;{chamado.titulo}&quot; vai ser apagado. Não dá para desfazer.</p>
      </ModalConfirmacao>
    </article>
  );
}