"use client";

import { useEffect, useState } from "react";
import CardChamado from "@/components/CardChamado/CardChamado";
import FiltroCategorias from "@/components/FiltroCategorias/FiltroCategorias";
import Mensagem from "@/components/Mensagem/Mensagem";
import { chamados as chamadosIniciais, categorias } from "@/dados/exemplo";
import styles from "./page.module.css";

// Rota "/": a listagem. A página guarda o filtro e lê os chamados salvos.
export default function PaginaInicial() {
  const [lista, setLista] = useState(chamadosIniciais);
  const [categoria, setCategoria] = useState(0); // 0 = todas

  useEffect(() => {
    const salvo = localStorage.getItem("banco-chamados");
    if (salvo) {
      setLista(JSON.parse(salvo));
    } else {
      setLista(chamadosIniciais);
    }
  }, []);

  // derivar em vez de guardar: a lista filtrada é calculada a cada render
  const visiveis =
    categoria === 0
      ? lista
      : lista.filter((c) => Number(c.categoria_id) === Number(categoria));

  return (
    <>
      <h1>Chamados</h1>
      <FiltroCategorias
        categorias={categorias}
        selecionada={categoria}
        aoMudar={setCategoria}
      />
      {visiveis.length === 0 && (
        <Mensagem>Nenhum chamado nesta categoria.</Mensagem>
      )}
      <ul className={styles.grade}>
        {visiveis.map((chamado) => (
          <CardChamado key={chamado.id} chamado={chamado} />
        ))}
      </ul>
    </>
  );
}