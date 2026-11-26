"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Campo from "@/components/Campo/Campo";
import Botao from "@/components/Botao/Botao";
import Mensagem from "@/components/Mensagem/Mensagem";
import { entrar } from "@/lib/sessao";
import { fazerLogin } from "@/lib/banco"; 
import styles from "./login.module.css";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const enviar = async (event) => {
    event.preventDefault();
    setErro("");

    if (email.trim() === "" || senha === "") {
      setErro("Preencha e-mail e senha.");
      return;
    }

    try {
      setCarregando(true);
      const { token, nome } = await fazerLogin({ email, senha });

      entrar(token, nome);
      router.replace("/");
    } catch (err) {
      setErro(err.message || "Erro ao fazer login.");
    } finally {
      setCarregando(false);
    }
  };

  

  return (
    <form className={styles.login} onSubmit={enviar} noValidate>
      <h1>Entrar</h1>
      {erro && <Mensagem tipo="erro">{erro}</Mensagem>}
      <Campo
        rotulo="E-mail"
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Campo
        rotulo="Senha"
        id="senha"
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <Botao type="submit" disabled={carregando}>
        {carregando ? "Entrando..." : "Entrar"}
      </Botao>
      <p className={styles.linkCadastro}>
  Não possui conta? <Link href="/cadastro">Cadastre-se</Link>
</p>
    </form>
  );
}
