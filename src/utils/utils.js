export function validarGravidade(gravidade) {
  const opcoesValidas = ["BAIXA", "MEDIA", "ALTA"];
  return opcoesValidas.includes(gravidade.trim().toUpperCase());
}