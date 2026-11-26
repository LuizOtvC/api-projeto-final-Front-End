// "Back-end de mentira": guarda os dados no localStorage do navegador.
// As funções têm os mesmos nomes das rotas da API e devolvem Promises,
// para a troca pela API de verdade mudar só este arquivo.
import {
    categorias as categorias,
    chamados as chamadosIniciais,
  } from "@/dados/exemplo";
  import { pegarToken } from "@/lib/sessao";
  
  // ---------- Passo 1: ler e gravar com segurança
  const CHAVES = {
    categorias: "banco-categorias",
    chamados: "banco-chamados",
    usuarios: "banco-usuarios",
  };
  
  function ler(chave, inicial) {
    try {
      const texto = localStorage.getItem(chave);
      return texto ? JSON.parse(texto) : inicial;
    } catch {
      return inicial; // JSON estragado: começa de novo
    }
  }
  
  function gravar(chave, dados) {
    localStorage.setItem(chave, JSON.stringify(dados));
  }
  
  // ---------- Passo 2: erros com status, como a API
  function erro(status, mensagem) {
    const e = new Error(mensagem);
    e.status = status;
    return e;
  }
  
  // espera um pouco, como se fosse a rede (assim o "Carregando" aparece)
  const esperar = (ms = 300) => new Promise((resolver) => setTimeout(resolver, ms));
  
  // quem é o usuário dono do token salvo na sessão? (a API faz isso com o JWT)
  function usuarioLogado() {
    const token = pegarToken();
    const usuario = ler(CHAVES.usuarios, []).find((u) => u.token && u.token === token);
    if (!usuario) throw erro(401, "Faça login para continuar.");
    return usuario;
  }
  
  // ---------- Passo 3: categorias
  export async function listarCategorias() {
    await esperar();
    return ler(CHAVES.categorias, categorias);
  }
  
  export async function criarCategoria({ nome }) {
    await esperar();
    usuarioLogado();
    if (!nome || nome.trim() === "")
      throw erro(400, "O nome da categoria é obrigatório.");
    const categorias = ler(CHAVES.categorias, categorias);
    const nova = { id: Date.now(), nome: nome.trim() };
    gravar(CHAVES.categorias, [...categorias, nova]);
    return nova;
  }
  
  // ---------- Passo 4: receitas (a entidade principal)
  export async function listarChamados() {
    await esperar();
    return ler(CHAVES.chamados, chamadosIniciais);
  }
  
  export async function buscarChamado(id) {
    await esperar();
    const chamado = ler(CHAVES.chamados, chamadosIniciais).find(
      (r) => r.id === Number(id),
    );
    if (!chamado) throw erro(404, "Chamado não encontrada.");
    return chamado;
  }
  
  // valida e monta a receita do jeito que o banco guarda (números como número)
  function montarChamado(dados) {
    if (!dados.titulo || dados.titulo.trim() === "")
      throw erro(400, "O título é obrigatório.");
    if (!dados.categoria_id) throw erro(400, "A categoria é obrigatória.");
    const categoria = ler(CHAVES.categorias, categorias).find(
      (c) => c.id === Number(dados.categoria_id),
    );
    if (!categoria) throw erro(400, "Categoria inválida.");
    return {
        titulo: dados.titulo.trim(),
        descricao: dados.descricao.trim(),
        prioridade: dados.prioridade,
        status: dados.status,
        categoria_id: Number(dados.categoria_id),
        categoria: categoria ? categoria.nome : "",
    };
  }
  
  export async function criarChamado(dados) {
    await esperar();
    const usuario = usuarioLogado(); // sem login: 401
    const nova = { id: Date.now(), ...montarChamado(dados), usuario_id: usuario.id };
    const chamados = ler(CHAVES.chamados, chamadosIniciais);
    gravar(CHAVES.chamados, [...chamados, nova]);
    return nova;
  }
  
  export async function atualizarChamado(id, dados) {
    await esperar();
    usuarioLogado();
    const chamados = ler(CHAVES.chamados, chamadosIniciais);
    const posicao = chamados.findIndex((r) => r.id === Number(id));
    if (posicao === -1) throw erro(404, "Chamado não encontrada.");
    const atualizada = { ...chamados[posicao], ...montarChamado(dados) };
    // não muda o array antigo: cria um novo trocando só a receita da posição
    gravar(
      CHAVES.chamados,
      chamados.map((r, i) => (i === posicao ? atualizada : r)),
    );
    return atualizada;
  }
  
  export async function excluirChamado(id) {
    await esperar();
    usuarioLogado();
    const chamados = ler(CHAVES.chamados, chamadosIniciais);
    if (!chamados.some((r) => r.id === Number(id)))
      throw erro(404, "Chamado não encontrado.");
    gravar(
      CHAVES.chamados,
      chamados.filter((r) => r.id !== Number(id)),
    );
  }
  
  // ---------- Passo 5: usuários, cadastro e login
  export async function cadastrarUsuario({ nome, email, senha }) {
    await esperar();
    if (!nome || !email || !senha) throw erro(400, "Preencha nome, e-mail e senha.");
    const usuarios = ler(CHAVES.usuarios, []);
    const emailLimpo = email.trim().toLowerCase();
    if (usuarios.some((u) => u.email === emailLimpo)) {
      throw erro(409, "Este e-mail já está cadastrado.");
    }
    // ATENÇÃO: senha em texto puro só porque é uma simulação no navegador.
    // Na API de verdade, a senha vira hash com bcrypt.
    const novo = {
      id: Date.now(),
      nome: nome.trim(),
      email: emailLimpo,
      senha,
      token: null,
    };
    gravar(CHAVES.usuarios, [...usuarios, novo]);
    return { id: novo.id, nome: novo.nome, email: novo.email }; // nunca devolve a senha
  }
  
  export async function fazerLogin({ email, senha }) {
    await esperar();
    if (!email || !senha) throw erro(400, "Preencha e-mail e senha.");
    const usuarios = ler(CHAVES.usuarios, []);
    const usuario = usuarios.find((u) => u.email === email.trim().toLowerCase());
    if (!usuario || usuario.senha !== senha)
      throw erro(401, "E-mail ou senha incorretos.");
    const token = `token-${usuario.id}-${Date.now()}`; // o "JWT" de mentira
    gravar(
      CHAVES.usuarios,
      usuarios.map((u) => (u.id === usuario.id ? { ...u, token } : u)),
    );
    return { token, nome: usuario.nome };
  }