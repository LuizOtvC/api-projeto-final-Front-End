// Dados de exemplo: os mesmos campos que a API vai devolver depois.
// Quando a API ficar pronta, só este arquivo sai de cena: as telas continuam iguais.
export const categorias = [
  { id: 1, nome: "Hardware" },
  { id: 2, nome: "Software" },
  { id: 3, nome: "Rede" },
];

export const chamados = [
  {
    id: 1,
    titulo: "Impressora do RH não imprime",
    descricao: "Aparece papel preso, mas não tem papel preso.",
    prioridade: "media",
    status: "aberto",
    categoria_id: 1,
    categoria: "Hardware",
    
  },{
    id: 2,
    titulo: "testes",
    descricao: "olha eu aqui",
    prioridade: "Baixa",
    status: "fechado",
    categoria_id: 2,
    categoria: "Software",
  }
];