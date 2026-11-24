const { totalVendido, ventaMayor, totalPorCiudad } = require("./analitica");
const { generarVentasNo } = require("./generador");

function primeraVenta(ventas, contador) {
  if (ventas.length > 0 && contador) {
    contador.operaciones += 1;
  }
  return ventas[0];
}

function medir(funcion, ventas) {
  const contador = { operaciones: 0 };
  funcion(ventas, contador);
  return contador.operaciones;
}

const tamanos = [100, 1000, 10000, 100000];
const resultados = tamanos.map((n) => {
  const ventas = generarVentasNo(n);

  return {
    n,
    totalVendido: medir(totalVendido, ventas),
    ventaMayor: medir(ventaMayor, ventas),
    totalPorCiudad: medir(totalPorCiudad, ventas),
    primeraVenta: medir(primeraVenta, ventas)
  };
});

console.table(resultados);

module.exports = { primeraVenta };
