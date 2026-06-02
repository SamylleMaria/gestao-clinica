export function analisarHemograma(dados) {
  const alertas = [];
  let estadoCritico = false;

  if (dados.hemoglobina < 12) {
    alertas.push("Indicativo de Anemia.");
    if (dados.hemoglobina < 9) {
      estadoCritico = true;
    }
  } else if (dados.hemoglobina > 17.5) {
    alertas.push("Indicativo de Policitemia.");
  }

  if (dados.leucocitos > 11000) {
    alertas.push("Presença de Leucocitose (Possível infeção ativa).");
    estadoCritico = true;
  } else if (dados.leucocitos < 4000) {
    alertas.push("Presença de Leucopenia (Imunidade baixa).");
  }

  const diagnostico =
    alertas.length > 0
      ? alertas.join(" ")
      : "Resultados dentro dos padrões normais";
  return { diagnostico, estadoCritico };
}
