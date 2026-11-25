import { pegarToken } from "@/lib/sessao";

// O endereço da API fica no .env.local: NEXT_PUBLIC_API_URL=http://localhost:3001
const URL_API = process.env.NEXT_PUBLIC_API_URL;

// chamarApi("/receitas")                                   → GET
// chamarApi("/receitas", { method: "POST", body: dados })  → POST com o token
export async function chamarApi(caminho, opcoes = {}) {
  const token = pegarToken();
  const resposta = await fetch(URL_API + caminho, {
    method: opcoes.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: opcoes.body ? JSON.stringify(opcoes.body) : undefined,
  });

  if (resposta.status === 204) return null; // excluiu: não tem corpo

  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    // 400, 401, 404, 409...: vira um erro com a mensagem da API
    throw new Error(dados.mensagem || "Algo deu errado. Tente de novo.");
  }
  return dados;
}
