import { Suspense } from "react";
import Cabecalho from "@/components/Cabecalho/Cabecalho";
import Carregando from "@/components/Carregando/Carregando";
import "./globals.css";

export const metadata = {
  title: "Caderno de Receitas",
  description: "Exemplo de navegação entre páginas no Next",
};

// O layout envolve TODAS as páginas: o Cabecalho aparece uma vez só
// e children é a página da rota atual.
// Suspense: o Next precisa dele porque as páginas leem a URL (useParams, usePathname).
// Enquanto a URL não chega, ele mostra o fallback.
export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Suspense fallback={<Carregando />}>
          <Cabecalho />
          <main className="conteudo">{children}</main>
        </Suspense>
      </body>
    </html>
  );
}
