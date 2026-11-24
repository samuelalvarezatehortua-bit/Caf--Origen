const { generarVentasNo } = require("./generador");

function clientesRecurrentesContado(ventas) {
  const recurrentes = [];
  const conteo = { comparaciones: 0, llamadasIncludes: 0, visitasIncludes: 0 };

  for (let i = 0; i < ventas.length; i++) {
    for (let j = i + 1; j < ventas.length; j++) {
      conteo.comparaciones += 1;
      if (ventas[i].cliente === ventas[j].cliente) {
        conteo.llamadasIncludes += 1;
        const posicion = recurrentes.indexOf(ventas[i].cliente);
        conteo.visitasIncludes += posicion === -1 ? recurrentes.length : posicion + 1;
        if (posicion === -1) {
          recurrentes.push(ventas[i].cliente);
        }
      }
    }
  }

  return { recurrentes, conteo };
}

function generarPeorCaso(n) {
  const ventas = [];
  for (let i = 0; i < n / 2; i++) {
    ventas.push({ cliente: `P${Math.floor(i / 2)}` });
  }
  for (let i = n / 2; i < n; i++) {
    ventas.push({ cliente: "GRANDE" });
  }
  return ventas;
}

function filas(generar) {
  return [500, 1000, 2000, 4000].map((n) => {
    const { conteo } = clientesRecurrentesContado(generar(n));
    return {
      n,
      comparaciones: conteo.comparaciones,
      "llamadas a includes": conteo.llamadasIncludes,
      "elementos recorridos por includes": conteo.visitasIncludes,
      total: conteo.comparaciones + conteo.visitasIncludes
    };
  });
}

console.log("Datos del generador (MiniReto 5, ~n/3 clientes):");
console.table(filas(generarVentasNo));

console.log("Peor caso construido para includes:");
console.table(filas(generarPeorCaso));

module.exports = { clientesRecurrentesContado, generarPeorCaso };
