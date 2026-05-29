export function validarDados(corpo) {
  if (!corpo.nome || !corpo.idade || !corpo.sintomas || !corpo.gravidade) {
    return false;
  }
  if (
    corpo.nome.trim() === "" ||
    typeof corpo.idade !== "number" ||
    corpo.sintomas.trim() === "" ||
    corpo.gravidade.trim() === ""
  ) {
    return false;
  }

  const opcoesValidas = ["BAIXA", "MEDIA", "ALTA"];
  if (!opcoesValidas.includes(corpo.gravidade.trim().toUpperCase())) {
    return false;
  }
  return true;
}

export function incrementarId(lista) {
  if (lista.length === 0) return 0;

  return Math.max(...lista.map((item) => item.id));
}
