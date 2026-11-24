const { isDeepStrictEqual } = require("node:util");
const ventas = require("./datos");
const { generarVentasNo } = require("./generador");
const {
  totalVendido,
  totalVendidoM,
  unidadesVendidas,
  unidadesVendidasM,
  ventaMayor,
  ventasPorCiudad,
  ventasPorCiudadM,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor,
  ticketPromedio,
  ventasDelDia,
  clientesRecurrentes,
  totalCiudadUnaPasada
} = require("./analitica");
const { totalCiudadCadena } = require("./espacio");

const ventasOriginales = [...ventas];
let huboDiferencias = false;

function mostrarResultado(nombre, resultado) {
  const estado = resultado ? "OK" : "DIFERENTE";
  console.log(`${estado}: ${nombre}`);
  if (!resultado) {
    huboDiferencias = true;
  }
}

mostrarResultado(
  "totalVendido / totalVendidoM",
  isDeepStrictEqual(totalVendido(ventas), totalVendidoM(ventas))
);

const ventasGeneradas = generarVentasNo(300);
const productosYPrecios = new Map([
  ["Origen Huila 500 g", 42000],
  ["Origen Nariño 250 g", 26000],
  ["Prensa francesa", 95000],
  ["Origen Sierra 500 g", 45000],
  ["Molino manual", 120000]
]);
const ciudadesValidas = new Set(["Medellín", "Bogotá", "Cali", "Pereira"]);
mostrarResultado(
  "generarVentasNo: cantidad, estructura y valores válidos",
  ventasGeneradas.length === 300 &&
    ventasGeneradas.every((venta, indice) =>
      venta.id === indice + 1 &&
      venta.fecha.startsWith("2026-09-") &&
      /^C\d{2,}$/.test(venta.cliente) &&
      Number(venta.cliente.slice(1)) <= 100 &&
      productosYPrecios.get(venta.producto) === venta.precio &&
      ciudadesValidas.has(venta.ciudad) &&
      Number.isInteger(venta.cantidad) &&
      venta.cantidad >= 1 &&
      venta.cantidad <= 5
    )
);

const contadorTotal = { operaciones: 0 };
totalVendido(ventas, contadorTotal);
const contadorMayor = { operaciones: 0 };
ventaMayor(ventas, contadorMayor);
const contadorCiudades = { operaciones: 0 };
totalPorCiudad(ventas, contadorCiudades);
mostrarResultado(
  "contadores: visitas, comparaciones y agrupaciones",
  contadorTotal.operaciones === ventas.length &&
    contadorMayor.operaciones === 2 * ventas.length &&
    contadorCiudades.operaciones === 2 * ventas.length + 4
);
mostrarResultado(
  "unidadesVendidas / unidadesVendidasM",
  isDeepStrictEqual(unidadesVendidas(ventas), unidadesVendidasM(ventas))
);
mostrarResultado(
  "ventasPorCiudad / ventasPorCiudadM",
  isDeepStrictEqual(
    ventasPorCiudad(ventas, " Medellín "),
    ventasPorCiudadM(ventas, " Medellín ")
  )
);

const ciudadesEsperadas = {
  Medellín: 356000,
  Bogotá: 276000,
  Cali: 185000,
  Pereira: 168000
};
mostrarResultado(
  "totalPorCiudad: cuatro ciudades y nombres normalizados",
  isDeepStrictEqual(
    totalPorCiudad(ventas.map((venta) => (
      venta.id === 2 ? { ...venta, ciudad: "Bogotá " } : venta
    ))),
    ciudadesEsperadas
  )
);

const ciudadesConVariantes = totalPorCiudad([
  { ciudad: "Bogotá", cantidad: 1, precio: 100 },
  { ciudad: "BOGOTÁ ", cantidad: 2, precio: 100 },
  { ciudad: "bogotá", cantidad: 1, precio: 100 }
]);
mostrarResultado(
  "regresión: variantes de Bogotá forman un solo grupo",
  isDeepStrictEqual(ciudadesConVariantes, { Bogotá: 400 })
);

const ventasDelDiaConVentas = ventasDelDia(ventas, "2026-09-01");
mostrarResultado(
  "ventasDelDia: fecha con ventas",
  ventasDelDiaConVentas.length === 2 &&
    totalVendido(ventasDelDiaConVentas) === 110000 &&
    unidadesVendidas(ventasDelDiaConVentas) === 3 &&
    ticketPromedio(ventasDelDiaConVentas) === 55000
);

const ventasDelDiaVacio = ventasDelDia(ventas, "2026-09-07");
mostrarResultado(
  "regresión: día sin ventas retorna resumen cero sin NaN",
  ventasDelDiaVacio.length === 0 &&
    totalVendido(ventasDelDiaVacio) === 0 &&
    unidadesVendidas(ventasDelDiaVacio) === 0 &&
    ticketPromedio(ventasDelDiaVacio) === 0 &&
    !Number.isNaN(ticketPromedio(ventasDelDiaVacio))
);

const unidadesEsperadas = {
  "Origen Huila 500 g": 7,
  "Origen Nariño 250 g": 6,
  "Prensa francesa": 2,
  "Origen Sierra 500 g": 5,
  "Molino manual": 1
};
mostrarResultado(
  "unidadesPorProducto",
  isDeepStrictEqual(unidadesPorProducto(ventas), unidadesEsperadas)
);

const topEsperado = [
  { producto: "Origen Huila 500 g", valorGenerado: 294000 },
  { producto: "Origen Sierra 500 g", valorGenerado: 225000 },
  { producto: "Prensa francesa", valorGenerado: 190000 }
];
mostrarResultado(
  "topProductosPorValor: tres primeros",
  isDeepStrictEqual(topProductosPorValor(ventas, 3), topEsperado)
);

mostrarResultado(
  "clientesRecurrentes: C01, C02 y C03 con los datos del Día 1",
  isDeepStrictEqual(clientesRecurrentes(ventas), ["C01", "C02", "C03"])
);

mostrarResultado(
  "clientesRecurrentes: vacío, un registro y sin repetidos devuelven []",
  isDeepStrictEqual(clientesRecurrentes([]), []) &&
    isDeepStrictEqual(clientesRecurrentes([ventas[0]]), []) &&
    isDeepStrictEqual(clientesRecurrentes(ventas.slice(0, 3)), [])
);

const ventasDiezMil = generarVentasNo(10000);
mostrarResultado(
  "totalCiudadCadena / totalCiudadUnaPasada: mismo valor con 10.000 ventas",
  ["Medellín", " BOGOTÁ ", "cali", "Pereira", "Tunja"].every((ciudad) =>
    totalCiudadCadena(ventasDiezMil, ciudad) === totalCiudadUnaPasada(ventasDiezMil, ciudad)
  )
);

mostrarResultado(
  "totalCiudadUnaPasada: Medellín 356.000 con datos del Día 1 y 0 con arreglo vacío",
  totalCiudadUnaPasada(ventas, " Medellín ") === 356000 &&
    totalCiudadCadena(ventas, " Medellín ") === 356000 &&
    totalCiudadUnaPasada([], "Medellín") === 0 &&
    totalCiudadCadena([], "Medellín") === 0
);

mostrarResultado(
  "las funciones conservan el orden original de ventas",
  isDeepStrictEqual(ventas, ventasOriginales)
);

if (huboDiferencias) {
  process.exitCode = 1;
}
