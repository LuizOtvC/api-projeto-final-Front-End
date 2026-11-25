import Link from "next/link";
import styles from "./CardChamado.module.css";

// O card não guarda nada: recebe o chamado por props e mostra.
// O card inteiro é um Link para a página de detalhe.
export default function CardChamado({ chamado }) {
  return (
    <li>
      <Link href={`/chamados/${chamado.id}`} className={styles.card}>
        <span className={styles.categoria}>{chamado.categoria}</span>
        <h2 className={styles.titulo}>{chamado.titulo}</h2>
        <p className={styles.info}>
          Status: {chamado.status} · Prioridade: {chamado.prioridade}
        </p>
      </Link>
    </li>
  );
}