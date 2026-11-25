# Caderno de Receitas (exemplo do professor)

Exemplo usado nos slides "Navegação entre páginas no Next" e na apostila
"Componentes e organização do projeto final". Não é nenhum dos seis temas:
serve para mostrar o caminho, que cada aluno adapta ao seu.

## Como rodar

    npm install
    npm run dev

Abra http://localhost:3000. O login aceita qualquer e-mail e senha (token de teste).

## Rotas

- `/` lista com filtro por categoria
- `/receitas/[id]` detalhe (Editar e Excluir só com login)
- `/receitas/novo` e `/receitas/[id]/editar` formulário (protegidas)
- `/login` entrar

Os dados vêm de `dados/exemplo.js`. `lib/api.js` já está pronto para a etapa da API
(`NEXT_PUBLIC_API_URL` no `.env.local`).
