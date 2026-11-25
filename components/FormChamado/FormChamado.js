"use client";

import { useState } from "react";
import Campo from "@/components/Campo/Campo";
import Botao from "@/components/Botao/Botao";
import Mensagem from "@/components/Mensagem/Mensagem";
import styles from "./FormChamado.module.css";

const VAZIO = {
  titulo: "",
  prioridade: "media",
  status: "aberto",
  categoria_id: "",
  descricao: "",
};

// Um formulário só para CADASTRAR e EDITAR:
// - cadastrar: não recebe chamadoInicial e começa vazio;
// - editar: recebe o chamado e começa preenchido.
// aoSalvar é da página: é ela que sabe para onde ir depois.
export default function FormChamado({
  categorias = [],
  chamadoInicial = VAZIO,
  aoSalvar,
}) {
  const [dados, setDados] = useState({ ...VAZIO, ...chamadoInicial });
  const [erros, setErros] = useState({});
  const [mensagem, setMensagem] = useState("");
  const [salvando, setSalvando] = useState(false);

  // um onChange para todos os campos: o name do campo diz qual chave mudar
  const mudar = (event) => {
    const { name, value } = event.target;
    setDados((anterior) => ({ ...anterior, [name]: value }));
  };

  // devolve um objeto com os erros. Objeto vazio = tudo certo.
  const validar = () => {
    const novos = {};
    if (dados.titulo.trim().length < 3) {
      novos.titulo = "O título precisa de pelo menos 3 letras.";
    }
    if (!dados.prioridade) {
      novos.prioridade = "Escolha uma prioridade.";
    }
    if (!dados.status) {
      novos.status = "Escolha um status.";
    }
    if (String(dados.categoria_id) === "") {
      novos.categoria_id = "Escolha uma categoria.";
    }
    if (dados.descricao.trim() === "") {
      novos.descricao = "Descreva o problema do chamado.";
    }
    return novos;
  };

  const enviar = async (event) => {
    event.preventDefault();
    const novos = validar();
    setErros(novos);
    if (Object.keys(novos).length > 0) return;

    setSalvando(true);
    setMensagem("");
    try {
      await aoSalvar({
        ...dados,
        categoria_id: Number(dados.categoria_id),
      });
      setSalvando(false);
    } catch (erro) {
      setMensagem(erro.message);
      setSalvando(false);
    }
  };

  return (
    <form className={styles.formulario} onSubmit={enviar} noValidate>
      <Mensagem tipo="erro">{mensagem}</Mensagem>

      <Campo
        rotulo="Título"
        id="titulo"
        name="titulo"
        value={dados.titulo}
        onChange={mudar}
        erro={erros.titulo}
      />

      <div className={styles.linha}>
        <Campo
          rotulo="Prioridade"
          id="prioridade"
          name="prioridade"
          value={dados.prioridade}
          onChange={mudar}
          erro={erros.prioridade}
        >
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </Campo>

        <Campo
          rotulo="Status"
          id="status"
          name="status"
          value={dados.status}
          onChange={mudar}
          erro={erros.status}
        >
          <option value="aberto">Aberto</option>
          <option value="em_andamento">Em andamento</option>
          <option value="fechado">Fechado</option>
        </Campo>
      </div>

      <Campo
        rotulo="Categoria"
        id="categoria_id"
        name="categoria_id"
        value={dados.categoria_id}
        onChange={mudar}
        erro={erros.categoria_id}
      >
        <option value="">Escolha...</option>
        {categorias.map((categoria) => (
          <option key={categoria.id} value={categoria.id}>
            {categoria.nome}
          </option>
        ))}
      </Campo>

      <Campo
        rotulo="Descrição"
        id="descricao"
        name="descricao"
        multilinha
        value={dados.descricao}
        onChange={mudar}
        erro={erros.descricao}
      />

      <Botao type="submit" disabled={salvando}>
        {salvando ? "Salvando..." : "Salvar"}
      </Botao>
    </form>
  );
}