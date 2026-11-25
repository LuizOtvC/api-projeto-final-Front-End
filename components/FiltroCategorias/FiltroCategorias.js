import styles from "./FiltroCategorias.module.css";

// Não guarda o filtro: quem guarda é a página. O filtro só mostra e avisa.
// selecionada: o id escolhido (0 = todas). aoMudar: função da página.
export default function FiltroCategorias({ categorias, selecionada, aoMudar }) {
  return (
    <div className={styles.filtro}>
      <button
        type="button"
        className={selecionada === 0 ? styles.ativo : styles.opcao}
        onClick={() => aoMudar(0)}
      >
        Todas
      </button>
      {categorias.map((categoria) => (
        <button
          key={categoria.id}
          type="button"
          className={selecionada === categoria.id ? styles.ativo : styles.opcao}
          onClick={() => aoMudar(categoria.id)}
        >
          {categoria.nome}
        </button>
      ))}
    </div>
  );
}
